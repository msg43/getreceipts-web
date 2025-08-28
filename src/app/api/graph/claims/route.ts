import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function GET() {
  try {
    // Get all claims using Supabase
    const { data: claimsData, error: claimsError } = await supabase
      .from('claims')
      .select(`
        id,
        slug,
        text_short,
        text_long,
        topics,
        created_at
      `)
      .limit(100);
    
    if (claimsError) {
      console.error('Error fetching claims:', claimsError);
      throw claimsError;
    }
    
    // Get all relationships using Supabase
    const { data: relationshipsData, error: relationshipsError } = await supabase
      .from('claim_edges')
      .select(`
        source_id,
        target_id,
        edge_type,
        weight
      `);
    
    if (relationshipsError) {
      console.error('Error fetching relationships:', relationshipsError);
      throw relationshipsError;
    }
    
    // Format for D3.js visualization
    const nodes = (claimsData || []).map(claim => {
      return {
        id: claim.id,
        slug: claim.slug,
        label: claim.text_short || "",
        title: claim.text_short || "",
        content: claim.text_long || "",
        text: claim.text_short || "",
        topics: claim.topics || [],
        consensus: 0.5, // Default consensus score
        size: 30, // Default size
        people: [], // Will be populated from metadata if available
        episode: null,
        episodeSlug: null,
        type: 'claim',
        color: '#3B82F6', // Default color
        community: 1, // Default community
        tags: claim.topics || [],
        metadata: {},
        createdAt: claim.created_at || new Date().toISOString()
      };
    });
    
    const links = (relationshipsData || []).map(rel => ({
      source: rel.source_id,
      target: rel.target_id,
      type: rel.edge_type,
      strength: Number(rel.weight || 0.5)
    }));
    
    return NextResponse.json({
      nodes,
      edges: links,
      clusters: [], // TODO: Implement clusters from claim_clusters table
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
