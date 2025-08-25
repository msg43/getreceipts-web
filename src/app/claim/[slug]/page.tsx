import { 
  getClaimBySlug, getAggregateByClaimId, getModelReviewsByClaimId, 
  getSourcesByClaimId, getPositionsByClaimId, getKnowledgePeopleByClaimId,
  getKnowledgeJargonByClaimId, getKnowledgeModelsByClaimId, 
  getClaimRelationshipsByClaimId, getVotesByClaimId, getCommentsByClaimId
} from "@/lib/supabase-db";
import Image from "next/image";
import { Metadata } from "next";
import ClaimActions from "@/components/ClaimActions";
import KnowledgeArtifacts from "@/components/KnowledgeArtifacts";
import ClaimGraph from "@/components/ClaimGraph";
import VotingWidget from "@/components/VotingWidget";
import CommentsSection from "@/components/CommentsSection";
import ErrorBoundary from "@/components/ErrorBoundary";

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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://getreceipts-web.vercel.app';
  const badgeUrl = `${baseUrl}/api/badge/${slug}`;
  const claimUrl = `${baseUrl}/claim/${slug}`;

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
  try {
    const { slug } = await params;
    const c = await getClaimBySlug(slug).catch(() => null);
    if (!c) return <div className="p-8">Not found</div>;
    
    // Fetch all data in parallel for better performance with error handling
    const [agg, reviews, srcs, pos, people, jargon, models, relationships, votes, comments] = await Promise.all([
      getAggregateByClaimId(c.id).catch(() => null),
      getModelReviewsByClaimId(c.id).catch(() => []),
      getSourcesByClaimId(c.id).catch(() => []),
      getPositionsByClaimId(c.id).catch(() => []),
      getKnowledgePeopleByClaimId(c.id).catch(() => []),
      getKnowledgeJargonByClaimId(c.id).catch(() => []),
      getKnowledgeModelsByClaimId(c.id).catch(() => []),
      getClaimRelationshipsByClaimId(c.id).catch(() => []),
      getVotesByClaimId(c.id).catch(() => ({ upvotes: 0, downvotes: 0, credible: 0, not_credible: 0 })),
      getCommentsByClaimId(c.id).catch(() => [])
    ]);

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
      <div className="mx-auto max-w-6xl p-6 space-y-8">
        {/* Main Claim Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
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
              {c.text_long && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-medium mb-2">Detailed Analysis</h3>
                  <p className="text-slate-700">{c.text_long}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Voting Widget */}
          <div className="lg:col-span-1">
            <ErrorBoundary>
              <VotingWidget 
                claimId={c.id} 
                initialVotes={votes}
                disabled={false}
              />
            </ErrorBoundary>
          </div>
        </div>

        {/* Knowledge Artifacts from Knowledge_Chipper */}
        {(people.length > 0 || jargon.length > 0 || models.length > 0) && (
          <KnowledgeArtifacts 
            people={people} 
            jargon={jargon} 
            models={models} 
          />
        )}

        {/* Evidence and Positions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 border rounded-lg">
            <h2 className="font-medium mb-3">Evidence</h2>
            <ul className="list-disc pl-5 space-y-1">
              {srcs.map((s: Source) => (
                <li key={s.id}>
                  <a className="underline" target="_blank" href={s.url ?? "#"} rel="noopener noreferrer">
                    {s.title ?? s.url}
                  </a>
                  {s.type && <span className="ml-2 text-xs text-slate-500">({s.type})</span>}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="font-medium mb-3">Positions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-green-600 font-medium">Support ({pos.filter((p: Position)=>p.stance==="support").length})</h3>
                {pos.filter((p: Position)=>p.stance==="support").map((p: Position)=> (
                  <div key={p.id} className="text-sm">• {p.quote ?? "Supporter"}</div>
                ))}
              </div>
              <div>
                <h3 className="mb-2 text-red-600 font-medium">Dispute ({pos.filter((p: Position)=>p.stance==="oppose").length})</h3>
                {pos.filter((p: Position)=>p.stance==="oppose").map((p: Position)=> (
                  <div key={p.id} className="text-sm">• {p.quote ?? "Opponent"}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Claims Network Graph */}
        <ErrorBoundary>
          <ClaimGraph claimId={c.id} height={500} />
        </ErrorBoundary>

        {/* Related Claims */}
        {relationships.length > 0 && (
          <div className="p-6 border rounded-lg">
            <h2 className="font-medium mb-3">Related Claims</h2>
            <div className="space-y-2">
              {relationships.map((rel: { id: string; relationship_type: string; to_claim?: { slug: string; text_short: string }; strength?: number }) => (
                <div key={rel.id} className="flex items-center gap-2 p-2 border rounded">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    rel.relationship_type === 'supports' ? 'bg-green-100 text-green-800' :
                    rel.relationship_type === 'contradicts' ? 'bg-red-100 text-red-800' :
                    rel.relationship_type === 'extends' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {rel.relationship_type}
                  </span>
                  <a href={`/claim/${rel.to_claim?.slug}`} className="text-blue-600 hover:underline flex-1">
                    {rel.to_claim?.text_short || 'Related claim'}
                  </a>
                  <span className="text-xs text-slate-500">
                    {Math.round(Number(rel.strength || 0.5) * 100)}% confidence
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <ErrorBoundary>
          <CommentsSection claimId={c.id} initialComments={comments} />
        </ErrorBoundary>
      </div>
    </>
  );
  } catch (error) {
    console.error('Error loading claim page:', error);
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-semibold text-red-600 mb-4">Error Loading Claim</h1>
        <p className="text-slate-600 mb-4">
          There was an error loading this claim page. This might be due to:
        </p>
        <ul className="text-left max-w-md mx-auto text-slate-600 mb-6">
          <li>• Database connection issues</li>
          <li>• Missing environment variables</li>
          <li>• Invalid claim ID</li>
        </ul>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }
}