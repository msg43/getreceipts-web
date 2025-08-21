/**
 * Seed script for GetReceipts.org MVP
 * Usage:
 *  1) Ensure DATABASE_URL is set in .env.local or environment
 *  2) Run: npx ts-node scripts/seed.ts  (or) npx tsx scripts/seed.ts
 */
import "dotenv/config";
import { db, sql } from "@/lib/db";
import { claims, sources, aggregates, positions } from "@/db/schema";
import { nanoid } from "nanoid";

async function main(){
  const slug = nanoid(10);
  const [c] = await db.insert(claims).values({
    slug,
    textShort: "Climate change is real.",
    textLong: "Long-form articulation that anthropogenic greenhouse gas emissions are driving statistically significant warming trends.",
    topics: ["climate","science"],
    createdBy: "seed-script"
  }).returning();

  await db.insert(sources).values([
    { claimId: c.id, type: "report", title: "IPCC AR6 Synthesis", url: "https://www.ipcc.ch/report/ar6/syr/" },
    { claimId: c.id, type: "org", title: "NASA Climate Evidence", url: "https://climate.nasa.gov/evidence/" }
  ]);

  await db.insert(positions).values([
    { claimId: c.id, stance: "support", quote: "97% of climatologists" }
  ]);

  await db.insert(aggregates).values({
    claimId: c.id, consensusScore: "0.97", supportCount: 2, disputeCount: 0
  });

  console.log("Seeded claim at /claim/" + slug);
}

main().then(()=> sql.end()).catch(async (e)=>{ console.error(e); await sql.end(); process.exit(1); });