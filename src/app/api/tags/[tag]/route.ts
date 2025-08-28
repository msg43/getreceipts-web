import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  
  try {
    // Decode the tag parameter
    const decodedTag = decodeURIComponent(tag);
    
    // Fetch claims that have this tag in their topics array
    const { data: claims, error: claimsError } = await supabase
      .from('claims')
      .select(`
        id,
        slug,
        text_short,
        text_long,
        topics,
        created_at,
        aggregates (
          consensus_score,
          support_count,
          dispute_count
        )
      `)
      .contains('topics', [decodedTag])
      .order('created_at', { ascending: false });

    if (claimsError) {
      console.error("Error fetching claims by tag:", claimsError);
      return NextResponse.json({ error: "Failed to fetch claims" }, { status: 500 });
    }

    // If no claims found, return empty array (not an error)
    if (!claims || claims.length === 0) {
      return NextResponse.json({
        success: true,
        claims: [],
        count: 0,
        tag: decodedTag
      });
    }

    // Transform the data to flatten aggregates
    const transformedClaims = claims.map(claim => ({
      ...claim,
      aggregates: claim.aggregates?.[0] || null
    }));

    return NextResponse.json({
      success: true,
      claims: transformedClaims,
      count: transformedClaims.length,
      tag: decodedTag
    });

  } catch (error) {
    console.error("Unexpected error fetching claims by tag:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Optional: Add metadata endpoint for tag statistics
export async function HEAD(_: Request, { params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  
  try {
    const decodedTag = decodeURIComponent(tag);
    
    // Just count the claims with this tag
    const { count, error } = await supabase
      .from('claims')
      .select('id', { count: 'exact', head: true })
      .contains('topics', [decodedTag]);

    if (error) {
      return new NextResponse(null, { status: 500 });
    }

    return new NextResponse(null, { 
      status: 200,
      headers: {
        'X-Claim-Count': String(count || 0),
        'X-Tag': decodedTag
      }
    });

  } catch (error) {
    console.error("Error in HEAD request for tag:", error);
    return new NextResponse(null, { status: 500 });
  }
}
