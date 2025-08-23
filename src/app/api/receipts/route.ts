import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { ReceiptSchema } from "@/lib/rf1";
import { nanoid } from "nanoid";
import { apiLimiter, getClientIP } from "@/lib/rate-limit";
import { requirePermission } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // Authentication and authorization
    const authResult = await requirePermission(req, 'create_claims');
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { user } = authResult;
    
    // Rate limiting
    const ip = getClientIP(req);
    const rateLimitResult = apiLimiter.check(10, ip); // 10 requests per minute per IP
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests", retryAfter: Math.round((rateLimitResult.reset - Date.now()) / 1000) },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Limit": rateLimitResult.limit.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": rateLimitResult.reset.toString(),
          }
        }
      );
    }

    const body = await req.json();
    const parsed = ReceiptSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;
    const slug = nanoid(10);

    console.log("🚀 Creating claim with Supabase client...");

    // Insert claim using Supabase client
    const { data: claim, error: claimError } = await supabase
      .from('claims')
      .insert({
        slug,
        text_short: data.claim_text,
        text_long: data.claim_long,
        topics: data.topics,
        created_by: user.id,
      })
      .select('*')
      .single();

    if (claimError) {
      console.error("❌ Claim insert error:", claimError);
      return NextResponse.json({ 
        error: "Failed to create claim", 
        details: claimError.message 
      }, { status: 500 });
    }

    console.log("✅ Created claim:", claim.id);

    // Insert sources if provided
    if (data.sources.length > 0) {
      const { error: sourcesError } = await supabase
        .from('sources')
        .insert(
          data.sources.map((s) => ({
            claim_id: claim.id,
            type: s.type,
            title: s.title,
            url: s.url,
            doi: s.doi,
            venue: s.venue
          }))
        );
      
      if (sourcesError) {
        console.error("⚠️ Sources insert error:", sourcesError);
      }
    }

    // Insert positions (supporters/opponents)
    const stanceRows = [
      ...data.supporters.map(quote => ({ claim_id: claim.id, stance: "support", quote })),
      ...data.opponents.map(quote => ({ claim_id: claim.id, stance: "oppose", quote })),
    ];
    
    if (stanceRows.length > 0) {
      const { error: positionsError } = await supabase
        .from('positions')
        .insert(stanceRows);
        
      if (positionsError) {
        console.error("⚠️ Positions insert error:", positionsError);
      }
    }

    // Insert aggregates
    const { error: aggregatesError } = await supabase
      .from('aggregates')
      .insert({ claim_id: claim.id, consensus_score: "0.5" });
      
    if (aggregatesError) {
      console.error("⚠️ Aggregates insert error:", aggregatesError);
    }

    // Handle knowledge artifacts from Knowledge_Chipper
    if (data.knowledge_artifacts) {
      // Check knowledge permissions for external data
      if (!user.permissions.includes('add_knowledge')) {
        return NextResponse.json({ 
          error: "Insufficient permissions to add knowledge artifacts" 
        }, { status: 403 });
      }

      const artifacts = data.knowledge_artifacts;
      
      // Insert people
      if (artifacts.people?.length > 0) {
        const { error: peopleError } = await supabase
          .from('knowledge_people')
          .insert(
            artifacts.people.map((person) => ({
              claim_id: claim.id,
              name: person.name,
              bio: person.bio,
              expertise: person.expertise,
              credibility_score: person.credibility_score?.toString(),
              sources: person.sources,
              created_by: user.id,
            }))
          );
          
        if (peopleError) {
          console.error("⚠️ Knowledge people insert error:", peopleError);
        }
      }
      
      // Insert jargon
      if (artifacts.jargon?.length > 0) {
        const { error: jargonError } = await supabase
          .from('knowledge_jargon')
          .insert(
            artifacts.jargon.map((jargon) => ({
              claim_id: claim.id,
              term: jargon.term,
              definition: jargon.definition,
              domain: jargon.domain,
              related_terms: jargon.related_terms,
              examples: jargon.examples,
              created_by: user.id,
            }))
          );
          
        if (jargonError) {
          console.error("⚠️ Knowledge jargon insert error:", jargonError);
        }
      }
      
      // Insert mental models
      if (artifacts.mental_models?.length > 0) {
        const { error: modelsError } = await supabase
          .from('knowledge_models')
          .insert(
            artifacts.mental_models.map((model) => ({
              claim_id: claim.id,
              name: model.name,
              description: model.description,
              domain: model.domain,
              key_concepts: model.key_concepts,
              relationships: model.relationships,
              created_by: user.id,
            }))
          );
          
        if (modelsError) {
          console.error("⚠️ Knowledge models insert error:", modelsError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      claim_id: claim.id,
      url: `/claim/${slug}`,
      badge_url: `/api/badge/${slug}.svg`,
      created_by: user.email,
      authentication_method: user.isApiKey ? 'api_key' : 'session',
      api_key_name: user.apiKeyName,
      knowledge_artifacts_count: {
        people: data.knowledge_artifacts?.people?.length || 0,
        jargon: data.knowledge_artifacts?.jargon?.length || 0,
        mental_models: data.knowledge_artifacts?.mental_models?.length || 0
      },
      data: claim
    }, { status: 201 });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}