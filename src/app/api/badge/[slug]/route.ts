import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";

// DRIZZLE CODE (commented out but preserved for future fix)
// import { db } from "@/lib/db";
// import { claims, aggregates } from "@/db/schema";
// import { eq } from "drizzle-orm";

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  try {
    // SUPABASE VERSION (current active code)
    const { data: claim, error: claimError } = await supabase
      .from('claims')
      .select('*')
      .eq('slug', slug)
      .single();

    if (claimError || !claim) {
      return new NextResponse("Not found", { status: 404 });
    }

    const { data: aggregates } = await supabase
      .from('aggregates')
      .select('*')
      .eq('claim_id', claim.id)
      .single();

    const scoreNum = Number(aggregates?.consensus_score ?? 0.5);
    const pct = Math.max(0, Math.min(1, Number.isFinite(scoreNum) ? scoreNum : 0.5));

    // DRIZZLE VERSION (preserved for future fix)
    // const [c] = await db.select().from(claims).where(eq(claims.slug, slug));
    // if (!c) return new NextResponse("Not found", { status: 404 });
    // const [agg] = await db.select().from(aggregates).where(eq(aggregates.claimId, c.id));
    // const scoreNum = Number(agg?.consensusScore ?? 0.5);
    // const pct = Math.max(0, Math.min(1, Number.isFinite(scoreNum) ? scoreNum : 0.5));

    const width = 420, height = 42, pos = Math.round(pct * (width - 20)) + 10;
    const gradient = `
      <linearGradient id="rg" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#ef4444"/>
        <stop offset="50%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#22c55e"/>
      </linearGradient>`;
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" role="img" aria-label="Consensus ${Math.round(pct*100)}%">
      <defs>${gradient}</defs>
      <rect x="10" y="14" width="${width-20}" height="14" rx="7" fill="url(#rg)"/>
      <circle cx="${pos}" cy="21" r="8" fill="#0ea5e9" />
    </svg>`;
    return new NextResponse(svg, { 
      headers: { 
        "Content-Type": "image/svg+xml", 
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600" 
      }
    });

  } catch (error) {
    console.error('Error generating badge:', error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
