import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { claims, claimRelationships, aggregates } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    // Get all claims with their consensus scores
    const claimsWithScores = await db.select({
      id: claims.id,
      slug: claims.slug,
      text: claims.textShort,
      topics: claims.topics,
      consensus: aggregates.consensusScore
    })
    .from(claims)
    .leftJoin(aggregates, eq(aggregates.claimId, claims.id))
    .limit(100); // Limit for performance
    
    // Get all relationships
    const relationships = await db.select({
      fromClaimId: claimRelationships.fromClaimId,
      toClaimId: claimRelationships.toClaimId,
      type: claimRelationships.relationshipType,
      strength: claimRelationships.strength,
      evidence: claimRelationships.evidence
    })
    .from(claimRelationships);
    
    // Format for D3.js visualization
    const nodes = claimsWithScores.map(claim => ({
      id: claim.id,
      slug: claim.slug,
      text: claim.text || "",
      topics: claim.topics || [],
      consensus: Number(claim.consensus || 0.5),
      size: 20 + (Number(claim.consensus || 0.5) * 20) // Size based on consensus
    }));
    
    const links = relationships.map(rel => ({
      source: rel.fromClaimId,
      target: rel.toClaimId,
      type: rel.type,
      strength: Number(rel.strength || 0.5),
      evidence: rel.evidence
    }));
    
    return NextResponse.json({
      nodes,
      links,
      metadata: {
        total_claims: nodes.length,
        total_relationships: links.length,
        relationship_types: [...new Set(links.map(l => l.type))]
      }
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
