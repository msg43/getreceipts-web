import { NextPage } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookmarkButton } from '@/components/BookmarkButton';

interface Claim {
  id: string;
  slug: string;
  text_short: string;
  text_long?: string;
  topics?: string[];
  created_at: string;
  aggregates?: {
    consensus_score: number;
    support_count: number;
    dispute_count: number;
  };
}

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

// Fetch claims by tag from the API
async function getClaimsByTag(tag: string): Promise<Claim[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/tags/${encodeURIComponent(tag)}`, {
      cache: 'no-store' // Always fetch fresh data
    });

    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error(`Failed to fetch claims: ${response.status}`);
    }

    const data = await response.json();
    return data.claims || [];
  } catch (error) {
    console.error('Error fetching claims by tag:', error);
    return [];
  }
}

const TagPage: NextPage<TagPageProps> = async ({ params }) => {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  
  const claims = await getClaimsByTag(decodedTag);

  if (claims.length === 0) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900">
              Claims tagged with
            </h1>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {decodedTag}
            </Badge>
          </div>
          
          <BookmarkButton
            type="tag"
            slug={decodedTag}
            title={`Tag: ${decodedTag}`}
            url={`/tags/${encodeURIComponent(decodedTag)}`}
            description={`All claims tagged with "${decodedTag}"`}
            metadata={{ tagName: decodedTag }}
            variant="full"
            size="md"
          />
        </div>
        
        <p className="text-slate-600">
          Found {claims.length} claim{claims.length !== 1 ? 's' : ''} with this tag
        </p>
      </div>

      {/* Claims List */}
      <div className="space-y-6">
        {claims.map((claim) => (
          <Card key={claim.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Link 
                    href={`/claim/${claim.slug}`}
                    className="text-lg font-semibold text-slate-900 hover:text-blue-600 transition-colors block mb-2"
                  >
                    {claim.text_short}
                  </Link>
                  
                  {/* Tags */}
                  {claim.topics && claim.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {claim.topics.map((topic, index) => (
                        <Link 
                          key={index}
                          href={`/tags/${encodeURIComponent(topic)}`}
                          className={`px-2 py-1 rounded text-xs transition-colors ${
                            topic === decodedTag 
                              ? 'bg-blue-100 text-blue-800 font-medium' 
                              : 'bg-gray-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {topic}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Consensus Score */}
                {claim.aggregates && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="text-right">
                      <div className="font-medium text-slate-700">
                        {Math.round((claim.aggregates.consensus_score || 0.5) * 100)}%
                      </div>
                      <div className="text-slate-500 text-xs">consensus</div>
                    </div>
                    <div 
                      className="w-2 h-8 rounded-full"
                      style={{
                        backgroundColor: `hsl(${(claim.aggregates.consensus_score || 0.5) * 120}, 60%, 50%)`
                      }}
                    />
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <div className="flex items-center gap-4">
                  <span>
                    Created {new Date(claim.created_at).toLocaleDateString()}
                  </span>
                  {claim.aggregates && (
                    <span>
                      {claim.aggregates.support_count} support • {claim.aggregates.dispute_count} dispute
                    </span>
                  )}
                </div>
                
                <Link
                  href={`/claim/${claim.slug}`}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  View Details →
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Related Tags */}
      <div className="mt-12 p-6 bg-slate-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Explore More Tags</h2>
        <div className="flex flex-wrap gap-2">
          {/* Extract unique tags from all claims, excluding current tag */}
          {Array.from(new Set(
            claims.flatMap(claim => claim.topics || [])
          ))
            .filter(topic => topic !== decodedTag)
            .slice(0, 10) // Limit to 10 related tags
            .map(topic => (
              <Link
                key={topic}
                href={`/tags/${encodeURIComponent(topic)}`}
                className="px-3 py-1 bg-white text-slate-700 rounded-full text-sm hover:bg-gray-100 transition-colors border"
              >
                {topic}
              </Link>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default TagPage;

// Metadata for SEO
export async function generateMetadata({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  
  return {
    title: `Claims tagged "${decodedTag}" | GetReceipts`,
    description: `Browse all claims and evidence tagged with "${decodedTag}" on GetReceipts`,
    openGraph: {
      title: `Claims tagged "${decodedTag}"`,
      description: `Browse all claims and evidence tagged with "${decodedTag}" on GetReceipts`,
    },
  };
}
