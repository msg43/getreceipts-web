import { db } from "@/lib/db";
import { claims, aggregates } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function EmbedCard({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [c] = await db.select().from(claims).where(eq(claims.slug, slug));
  if (!c) return <div style={{padding:16,fontFamily:"system-ui"}}>Not found</div>;
  const [agg] = await db.select().from(aggregates).where(eq(aggregates.claimId, c.id));
  const pct = Math.round(Number(agg?.consensusScore ?? 0.5)*100);

  return (
    <div style={{fontFamily:"system-ui", border:"1px solid #e5e7eb", borderRadius:12, padding:16, maxWidth:520}}>
      <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:8}}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="Badge" src={`/api/badge/${slug}`} style={{height:28}} />
        <div style={{marginLeft:"auto", fontSize:12, color:"#6b7280"}}>{pct}% consensus</div>
      </div>
      <div style={{fontSize:16, fontWeight:600, marginBottom:8}}>{c.textShort}</div>
      <a href={`https://getreceipts.org/claim/${c.slug}`} target="_blank" rel="noopener noreferrer" style={{fontSize:12, color:"#2563eb", textDecoration:"underline"}}>
        View full receipt
      </a>
    </div>
  );
}