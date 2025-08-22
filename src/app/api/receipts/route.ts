import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { 
  claims, sources, positions, aggregates, 
  knowledgePeople, knowledgeJargon, knowledgeModels, claimRelationships 
} from "@/db/schema";
import { ReceiptSchema } from "@/lib/rf1";
import { nanoid } from "nanoid";
import { apiLimiter, getClientIP } from "@/lib/rate-limit";
import { requirePermission, createAuditLog } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // Authentication and authorization
    const authResult = await requirePermission(req, 'create_claims');
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { user, context } = authResult;
    
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

    const [c] = await db.insert(claims).values({
      slug,
      textShort: data.claim_text,
      textLong: data.claim_long,
      topics: data.topics,
      createdBy: user.id,
    }).returning();

    // Audit log for claim creation
    await createAuditLog('CREATE', 'claims', c.id, context, null, {
      slug: c.slug,
      textShort: c.textShort,
      textLong: c.textLong,
      topics: c.topics,
      createdBy: c.createdBy,
    });

    if (data.sources.length) {
      await db.insert(sources).values(
        data.sources.map((s) => ({
          claimId: c.id, type: s.type, title: s.title, url: s.url, doi: s.doi, venue: s.venue
        }))
      );
    }

    const stanceRows = [
      ...data.supporters.map(n => ({ claimId: c.id, stance: "support" as const, quote: n })),
      ...data.opponents.map(n => ({ claimId: c.id, stance: "oppose" as const, quote: n })),
    ];
    if (stanceRows.length) await db.insert(positions).values(stanceRows);

    await db.insert(aggregates).values({ claimId: c.id, consensusScore: "0.5" });

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
        const peopleValues = artifacts.people.map((person) => ({
          claimId: c.id,
          name: person.name,
          bio: person.bio,
          expertise: person.expertise,
          credibilityScore: person.credibility_score?.toString(),
          sources: person.sources,
          createdBy: user.id,
        }));

        const insertedPeople = await db.insert(knowledgePeople).values(peopleValues).returning();
        
        // Audit log for knowledge people
        for (const person of insertedPeople) {
          await createAuditLog('CREATE', 'knowledge_people', person.id, context, null, person);
        }
      }
      
      // Insert jargon
      if (artifacts.jargon?.length > 0) {
        const jargonValues = artifacts.jargon.map((jargon) => ({
          claimId: c.id,
          term: jargon.term,
          definition: jargon.definition,
          domain: jargon.domain,
          relatedTerms: jargon.related_terms,
          examples: jargon.examples,
          createdBy: user.id,
        }));

        const insertedJargon = await db.insert(knowledgeJargon).values(jargonValues).returning();
        
        // Audit log for knowledge jargon
        for (const jargon of insertedJargon) {
          await createAuditLog('CREATE', 'knowledge_jargon', jargon.id, context, null, jargon);
        }
      }
      
      // Insert mental models
      if (artifacts.mental_models?.length > 0) {
        const modelValues = artifacts.mental_models.map((model) => ({
          claimId: c.id,
          name: model.name,
          description: model.description,
          domain: model.domain,
          keyConcepts: model.key_concepts,
          relationships: model.relationships,
          createdBy: user.id,
        }));

        const insertedModels = await db.insert(knowledgeModels).values(modelValues).returning();
        
        // Audit log for knowledge models
        for (const model of insertedModels) {
          await createAuditLog('CREATE', 'knowledge_models', model.id, context, null, model);
        }
      }
      
      // Note: claim_relationships will be processed after all claims are inserted
      // This is handled in a separate endpoint for batch relationship processing
    }

    return NextResponse.json({
      claim_id: c.id,
      url: `/claim/${slug}`,
      badge_url: `/api/badge/${slug}.svg`,
      created_by: user.email,
      authentication_method: user.isApiKey ? 'api_key' : 'session',
      api_key_name: user.apiKeyName,
      knowledge_artifacts_count: {
        people: data.knowledge_artifacts?.people?.length || 0,
        jargon: data.knowledge_artifacts?.jargon?.length || 0,
        mental_models: data.knowledge_artifacts?.mental_models?.length || 0
      }
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}