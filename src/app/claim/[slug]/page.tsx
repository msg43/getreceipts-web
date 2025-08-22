import { db } from "@/lib/db";
import { claims, aggregates, modelReviews, sources, positions } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

// Force Node.js runtime for database operations
export const runtime = 'nodejs';

type Claim = typeof claims.$inferSelect;
type Aggregate = typeof aggregates.$inferSelect;
type ModelReview = typeof modelReviews.$inferSelect;
type Source = typeof sources.$inferSelect;
type Position = typeof positions.$inferSelect;

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [c] = await db.select().from(claims).where(eq(claims.slug, slug));
  
  if (!c) {
    return {
      title: 'Claim Not Found - GetReceipts.org',
      description: 'The requested claim could not be found.',
    };
  }

  const [agg] = await db.select().from(aggregates).where(eq(aggregates.claimId, c.id));
  const consensusPercentage = Math.round(Number(agg?.consensusScore ?? 0.5) * 100);
  const badgeUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/badge/${slug}`;
  const claimUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/claim/${slug}`;

  return {
    title: `${c.textShort} - GetReceipts.org`,
    description: `Claim with ${consensusPercentage}% consensus. View evidence, sources, and positions.`,
    openGraph: {
      title: c.textShort,
      description: `${consensusPercentage}% consensus • View evidence and sources`,
      url: claimUrl,
      siteName: 'GetReceipts.org',
      images: [
        {
          url: badgeUrl,
          width: 420,
          height: 42,
          alt: `Consensus badge showing ${consensusPercentage}%`,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: c.textShort,
      description: `${consensusPercentage}% consensus • View evidence and sources`,
      images: [badgeUrl],
    },
    other: {
      'article:author': c.createdBy || 'GetReceipts.org',
      'article:published_time': c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
    },
  };
}

function buildSnippet(c: Claim, agg: Aggregate | undefined){
  const pct = Math.round(Number(agg?.consensusScore ?? 0.5)*100);
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/claim/${c.slug}`;
  return `🧾 ${c.textShort}\n🌡️ Consensus: ${pct}%\n🔗 ${url}`;
}

export default async function ClaimPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [c] = await db.select().from(claims).where(eq(claims.slug, slug));
  if (!c) return <div className="p-8">Not found</div>;
  const [agg] = await db.select().from(aggregates).where(eq(aggregates.claimId, c.id));
  const reviews = await db.select().from(modelReviews).where(eq(modelReviews.claimId, c.id));
  const srcs = await db.select().from(sources).where(eq(sources.claimId, c.id));
  const pos = await db.select().from(positions).where(eq(positions.claimId, c.id));

  // Generate JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ClaimReview",
    "url": `https://getreceipts.org/claim/${slug}`,
    "claimReviewed": c.textShort,
    "author": {
      "@type": "Organization",
      "name": "GetReceipts.org",
      "url": "https://getreceipts.org"
    },
    "datePublished": c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": Number(agg?.consensusScore ?? 0.5),
      "bestRating": 1,
      "worstRating": 0,
      "ratingExplanation": `Consensus score based on ${srcs.length} sources and ${pos.length} positions`
    },
    "itemReviewed": {
      "@type": "Claim",
      "text": c.textShort,
      "author": {
        "@type": "Person",
        "name": c.createdBy || "Unknown"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl p-6 space-y-6">
      <div className="p-6 border rounded-lg space-y-4">
        <h1 className="text-2xl font-semibold">{c.textShort}</h1>
        <div className="flex items-center gap-4">
          <Image alt="Consensus badge" src={`/api/badge/${slug}`} width={420} height={42} className="h-8" />
          <select className="border rounded px-2 py-1">
            {reviews.length ? reviews.map((r: ModelReview) => (
              <option key={r.id}>{r.model} • {Math.round(Number(r.score)*100)}%</option>
            )) : <option>Waiting for reviews…</option>}
          </select>
          <div className="ml-auto flex gap-3">
            <button className="underline" onClick={async () => {
              const text = buildSnippet(c, agg);
              await navigator.clipboard.writeText(text);
              alert("Snippet copied!");
            }}>Copy Snippet</button>
            <Link className="underline" href={`/embed/${slug}`} target="_blank">Open Embed</Link>
          </div>
        </div>
      </div>

      <div className="p-6 border rounded-lg">
        <h2 className="font-medium mb-3">Evidence</h2>
        <ul className="list-disc pl-5 space-y-1">
          {srcs.map((s: Source) => <li key={s.id}><a className="underline" target="_blank" href={s.url ?? "#"} rel="noopener noreferrer">{s.title ?? s.url}</a></li>)}
        </ul>
      </div>

      <div className="p-6 border rounded-lg">
        <h2 className="font-medium mb-3">Positions</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><h3 className="mb-2">Support</h3>{pos.filter((p: Position)=>p.stance==="support").map((p: Position)=> <div key={p.id}>• {p.quote ?? "Supporter"}</div>)}</div>
          <div><h3 className="mb-2">Dispute</h3>{pos.filter((p: Position)=>p.stance==="oppose").map((p: Position)=> <div key={p.id}>• {p.quote ?? "Opponent"}</div>)}</div>
        </div>
      </div>
    </div>
    </>
  );
}