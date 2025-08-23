import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";

// DRIZZLE CODE (commented out but preserved for future fix)
// import { db } from "@/lib/db";
// import { claims, aggregates, modelReviews, sources, positions } from "@/db/schema";
// import { eq } from "drizzle-orm";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  try {
    // SUPABASE VERSION (current active code)
    const { data: claim, error: claimError } = await supabase
      .from('claims')
      .select('*')
      .eq('slug', slug)
      .single();

    if (claimError || !claim) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Fetch related data in parallel
    const [
      { data: aggregates },
      { data: modelReviews },
      { data: sources },
      { data: positions }
    ] = await Promise.all([
      supabase.from('aggregates').select('*').eq('claim_id', claim.id),
      supabase.from('model_reviews').select('*').eq('claim_id', claim.id),
      supabase.from('sources').select('*').eq('claim_id', claim.id),
      supabase.from('positions').select('*').eq('claim_id', claim.id)
    ]);

    return NextResponse.json({
      claim,
      aggregates: aggregates?.[0] || null,
      model_reviews: modelReviews || [],
      sources: sources || [],
      positions: positions || []
    });

    // DRIZZLE VERSION (preserved for future fix)
    // const [c] = await db.select().from(claims).where(eq(claims.slug, slug));
    // if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
    // const [agg] = await db.select().from(aggregates).where(eq(aggregates.claimId, c.id));
    // const revs = await db.select().from(modelReviews).where(eq(modelReviews.claimId, c.id));
    // const srcs = await db.select().from(sources).where(eq(sources.claimId, c.id));
    // const pos = await db.select().from(positions).where(eq(positions.claimId, c.id));
    // return NextResponse.json({
    //   claim: c,
    //   aggregates: agg,
    //   model_reviews: revs,
    //   sources: srcs,
    //   positions: pos
    // });

  } catch (error) {
    console.error('Error fetching claim:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
