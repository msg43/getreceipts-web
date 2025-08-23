import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function GET() {
  try {
    // Get all claims with their consensus scores using Supabase
    const { data: claimsData, error: claimsError } = await supabase
      .from('claims')
      .select(`
        id,
        slug,
        text_short,
        topics,
        aggregates(consensus_score)
      `)
      .limit(100);
    
    if (claimsError) {
      console.error('Error fetching claims:', claimsError);
      throw claimsError;
    }
    
    // Get all relationships using Supabase
    const { data: relationshipsData, error: relationshipsError } = await supabase
      .from('claim_relationships')
      .select(`
        from_claim_id,
        to_claim_id,
        relationship_type,
        strength,
        evidence
      `);
    
    if (relationshipsError) {
      console.error('Error fetching relationships:', relationshipsError);
      throw relationshipsError;
    }
    
    // Format for D3.js visualization
    const nodes = (claimsData || []).map(claim => ({
      id: claim.id,
      slug: claim.slug,
      text: claim.text_short || "",
      topics: claim.topics || [],
      consensus: Number(claim.aggregates?.[0]?.consensus_score || 0.5),
      size: 20 + (Number(claim.aggregates?.[0]?.consensus_score || 0.5) * 20) // Size based on consensus
    }));
    
    const links = (relationshipsData || []).map(rel => ({
      source: rel.from_claim_id,
      target: rel.to_claim_id,
      type: rel.relationship_type,
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
