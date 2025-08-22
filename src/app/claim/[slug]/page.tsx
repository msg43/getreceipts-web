import { getClaimBySlug, getAggregateByClaimId, getModelReviewsByClaimId, getSourcesByClaimId, getPositionsByClaimId } from "@/lib/supabase-db";
import Image from "next/image";
import { Metadata } from "next";
import ClaimActions from "@/components/ClaimActions";

// Force Node.js runtime for database operations
export const runtime = 'nodejs';

// Database types for Supabase (simplified for this component)

type ModelReview = {
  id: string;
  claim_id?: string;
  model: string;
  score: number;
  rationale?: string;
  version?: string;
  reviewed_at?: string;
};

type Source = {
  id: string;
  claim_id: string;
  type: string;
  title?: string;
  url?: string;
  doi?: string;
  venue?: string;
  date?: string;
  cred_score?: number;
  meta?: Record<string, unknown>;
};

type Position = {
  id: string;
  claim_id?: string;
  actor_id?: string;
  stance: string;
  quote?: string;
  link?: string;
};

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await getClaimBySlug(slug).catch(() => null);
  
  if (!c) {
    return {
      title: 'Claim Not Found - GetReceipts.org',
      description: 'The requested claim could not be found.',
    };
  }

  const agg = await getAggregateByClaimId(c.id).catch(() => null);
  const consensusPercentage = Math.round(Number(agg?.consensus_score ?? 0.5) * 100);
  const badgeUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/badge/${slug}`;
  const claimUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/claim/${slug}`;

  return {
    title: `${c.text_short} - GetReceipts.org`,
    description: `Claim with ${consensusPercentage}% consensus. View evidence, sources, and positions.`,
    openGraph: {
      title: c.text_short,
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
      title: c.text_short,
      description: `${consensusPercentage}% consensus • View evidence and sources`,
      images: [badgeUrl],
    },
    other: {
      'article:author': c.created_by || 'GetReceipts.org',
      'article:published_time': c.created_at ? new Date(c.created_at).toISOString() : new Date().toISOString(),
    },
  };
}



export default async function ClaimPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getClaimBySlug(slug).catch(() => null);
  if (!c) return <div className="p-8">Not found</div>;
  const agg = await getAggregateByClaimId(c.id).catch(() => null);
  const reviews = await getModelReviewsByClaimId(c.id);
  const srcs = await getSourcesByClaimId(c.id);
  const pos = await getPositionsByClaimId(c.id);

  // Generate JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ClaimReview",
    "url": `https://getreceipts.org/claim/${slug}`,
    "claimReviewed": c.text_short,
    "author": {
      "@type": "Organization",
      "name": "GetReceipts.org",
      "url": "https://getreceipts.org"
    },
    "datePublished": c.created_at ? new Date(c.created_at).toISOString() : new Date().toISOString(),
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": Number(agg?.consensus_score ?? 0.5),
      "bestRating": 1,
      "worstRating": 0,
      "ratingExplanation": `Consensus score based on ${srcs.length} sources and ${pos.length} positions`
    },
    "itemReviewed": {
      "@type": "Claim",
      "text": c.text_short,
      "author": {
        "@type": "Person",
        "name": c.created_by || "Unknown"
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
        <h1 className="text-2xl font-semibold">{c.text_short}</h1>
        <div className="flex items-center gap-4">
          <Image alt="Consensus badge" src={`/api/badge/${slug}`} width={420} height={42} className="h-8" />
          <select className="border rounded px-2 py-1">
            {reviews.length ? reviews.map((r: ModelReview) => (
              <option key={r.id}>{r.model} • {Math.round(Number(r.score)*100)}%</option>
            )) : <option>Waiting for reviews…</option>}
          </select>
          <ClaimActions claim={c} aggregate={agg} slug={slug} />
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