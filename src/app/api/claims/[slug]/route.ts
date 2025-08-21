import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { claims, aggregates, modelReviews, sources, positions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [c] = await db.select().from(claims).where(eq(claims.slug, slug));
  if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const [agg] = await db.select().from(aggregates).where(eq(aggregates.claimId, c.id));
  const revs = await db.select().from(modelReviews).where(eq(modelReviews.claimId, c.id));
  const srcs = await db.select().from(sources).where(eq(sources.claimId, c.id));
  const pos = await db.select().from(positions).where(eq(positions.claimId, c.id));

  return NextResponse.json({
    claim: c,
    aggregates: agg,
    model_reviews: revs,
    sources: srcs,
    positions: pos
  });
}