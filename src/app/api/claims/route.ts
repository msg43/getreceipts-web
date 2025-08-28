import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function GET() {
  try {
    // Fetch claims without aggregates (table doesn't exist yet)
    const { data: claims, error: claimsError } = await supabase
      .from('claims')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (claimsError) {
      console.error("Error fetching claims:", claimsError);
      return NextResponse.json({ error: "Failed to fetch claims" }, { status: 500 });
    }

    // Transform the data to match our expected format
    const transformedClaims = claims?.map(claim => ({
      ...claim,
      consensus: null // No aggregates table yet
    })) || [];

    return NextResponse.json({
      success: true,
      claims: transformedClaims,
      count: transformedClaims.length
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
