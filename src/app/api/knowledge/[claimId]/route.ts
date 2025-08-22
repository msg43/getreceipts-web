import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { knowledgePeople, knowledgeJargon, knowledgeModels, claimRelationships, claims } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requirePermission, createAuditLog } from "@/lib/auth";

export async function GET(_: Request, { params }: { params: Promise<{ claimId: string }> }) {
  try {
    const { claimId } = await params;
    
    // Fetch all knowledge artifacts for this claim
    const [people, jargon, models, relationships] = await Promise.all([
      db.select().from(knowledgePeople).where(eq(knowledgePeople.claimId, claimId)),
      db.select().from(knowledgeJargon).where(eq(knowledgeJargon.claimId, claimId)),
      db.select().from(knowledgeModels).where(eq(knowledgeModels.claimId, claimId)),
      db.select({
        id: claimRelationships.id,
        fromClaimId: claimRelationships.fromClaimId,
        toClaimId: claimRelationships.toClaimId,
        relationshipType: claimRelationships.relationshipType,
        strength: claimRelationships.strength,
        evidence: claimRelationships.evidence,
        relatedClaimText: claims.textShort
      })
      .from(claimRelationships)
      .leftJoin(claims, eq(claimRelationships.toClaimId, claims.id))
      .where(eq(claimRelationships.fromClaimId, claimId))
    ]);
    
    return NextResponse.json({
      people,
      jargon,
      mental_models: models,
      relationships
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST endpoint for adding knowledge artifacts to an existing claim
export async function POST(req: NextRequest, { params }: { params: Promise<{ claimId: string }> }) {
  try {
    // Authentication and authorization
    const authResult = await requirePermission(req, 'add_knowledge');
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { user, context } = authResult;

    const { claimId } = await params;
    const body = await req.json();

    // Validate that claim exists
    const [claim] = await db.select().from(claims).where(eq(claims.id, claimId));
    if (!claim) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }

    const insertResults = {
      people: [],
      jargon: [],
      models: [],
    };

    // Add people
    if (body.people?.length > 0) {
      const peopleValues = body.people.map((person: any) => ({
        claimId,
        name: person.name,
        bio: person.bio,
        expertise: person.expertise,
        credibilityScore: person.credibility_score?.toString(),
        sources: person.sources,
        createdBy: user.id,
      }));

      const insertedPeople = await db.insert(knowledgePeople).values(peopleValues).returning();
      insertResults.people = insertedPeople;
      
      // Audit log for knowledge people
      for (const person of insertedPeople) {
        await createAuditLog('CREATE', 'knowledge_people', person.id, context, null, person);
      }
    }

    // Add jargon
    if (body.jargon?.length > 0) {
      const jargonValues = body.jargon.map((jargon: any) => ({
        claimId,
        term: jargon.term,
        definition: jargon.definition,
        domain: jargon.domain,
        relatedTerms: jargon.related_terms,
        examples: jargon.examples,
        createdBy: user.id,
      }));

      const insertedJargon = await db.insert(knowledgeJargon).values(jargonValues).returning();
      insertResults.jargon = insertedJargon;
      
      // Audit log for knowledge jargon
      for (const jargon of insertedJargon) {
        await createAuditLog('CREATE', 'knowledge_jargon', jargon.id, context, null, jargon);
      }
    }

    // Add mental models
    if (body.mental_models?.length > 0) {
      const modelValues = body.mental_models.map((model: any) => ({
        claimId,
        name: model.name,
        description: model.description,
        domain: model.domain,
        keyConcepts: model.key_concepts,
        relationships: model.relationships,
        createdBy: user.id,
      }));

      const insertedModels = await db.insert(knowledgeModels).values(modelValues).returning();
      insertResults.models = insertedModels;
      
      // Audit log for knowledge models
      for (const model of insertedModels) {
        await createAuditLog('CREATE', 'knowledge_models', model.id, context, null, model);
      }
    }

    return NextResponse.json({
      message: "Knowledge artifacts added successfully",
      claim_id: claimId,
      created_by: user.email,
      authentication_method: user.isApiKey ? 'api_key' : 'session',
      api_key_name: user.apiKeyName,
      inserted_count: {
        people: insertResults.people.length,
        jargon: insertResults.jargon.length,
        mental_models: insertResults.models.length,
      },
      artifacts: insertResults,
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
