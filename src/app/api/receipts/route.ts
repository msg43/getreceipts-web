import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { claims, sources, positions, aggregates } from "@/db/schema";
import { ReceiptSchema } from "@/lib/rf1";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
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
      createdBy: data.provenance?.producer_app ?? "factory",
    }).returning();

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

    return NextResponse.json({
      claim_id: c.id,
      url: `/claim/${slug}`,
      badge_url: `/api/badge/${slug}.svg`
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}