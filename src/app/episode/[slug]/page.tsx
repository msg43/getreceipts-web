'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { use } from 'react';
import { BookmarkButton } from '@/components/BookmarkButton';

interface Claim {
  id: string;
  slug: string;
  title: string;
  content: string;
  episode?: string;
  episodeSlug?: string;
  people?: string[];
  consensus?: number;
  tags: string[];
  createdAt: string;
}

interface EpisodePageProps {
  params: Promise<{ slug: string }>;
}

export default function EpisodePage({ params }: EpisodePageProps) {
  const { slug } = use(params);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [episodeTitle, setEpisodeTitle] = useState<string>('');

  useEffect(() => {
    async function fetchClaimsForEpisode() {
      try {
        setLoading(true);
        
        // Fetch all claims and filter by episode on the client side
        // In a real app, you'd want to do this filtering on the server
        const response = await fetch('/api/graph/mock');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Filter claims that belong to this episode
        const episodeClaims = data.nodes.filter((claim: Claim) => 
          claim.episodeSlug === slug
        );
        
        setClaims(episodeClaims);
        
        // Get episode title from the first claim
        if (episodeClaims.length > 0) {
          setEpisodeTitle(episodeClaims[0].episode || 'Unknown Episode');
        }
      } catch (err) {
        console.error('Error fetching claims:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch claims');
      } finally {
        setLoading(false);
      }
    }

    fetchClaimsForEpisode();
  }, [slug]);

  // Get unique people from all claims in this episode
  const uniquePeople = React.useMemo(() => {
    const people = new Set<string>();
    claims.forEach(claim => {
      if (claim.people) {
        claim.people.forEach(person => people.add(person));
      }
    });
    return Array.from(people);
  }, [claims]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-slate-600">Loading episode claims...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
            <Link href="/graph" className="text-red-800 underline mt-2 inline-block">
              ← Back to Graph
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/graph" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Graph
          </Link>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 12.464l-9.192 9.192M12 2.25L2.464 11.786M21.75 12L12.214 21.536" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{episodeTitle || 'Episode'}</h1>
                <p className="text-slate-600">All claims made in this episode</p>
              </div>
            </div>
            
            <BookmarkButton
              type="episode"
              slug={slug}
              title={episodeTitle || 'Episode'}
              url={`/episode/${encodeURIComponent(slug)}`}
              description={`All claims from episode: ${episodeTitle || 'Episode'}`}
              metadata={{ episodeTitle: episodeTitle || 'Episode' }}
              variant="full"
              size="md"
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">{claims.length}</div>
                  <div className="text-sm text-slate-600">Claims</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">
                    {claims.length > 0 ? Math.round((claims.reduce((sum, claim) => sum + (claim.consensus || 0.5), 0) / claims.length) * 100) : 0}%
                  </div>
                  <div className="text-sm text-slate-600">Avg Consensus</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">{uniquePeople.length}</div>
                  <div className="text-sm text-slate-600">People</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Episode Participants */}
        {uniquePeople.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Episode Participants</h2>
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex flex-wrap gap-2">
                {uniquePeople.map((person, index) => (
                  <Link
                    key={index}
                    href={`/people/${encodeURIComponent(person.toLowerCase().replace(/\s+/g, '-').replace(/\./g, ''))}`}
                    className="inline-flex items-center px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-sm transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {person}
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Claims List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">All Claims from Episode</h2>
          
          {claims.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No claims found</h3>
              <p className="text-slate-600">This episode doesn&apos;t have any claims yet.</p>
            </div>
          ) : (
            claims.map((claim) => (
              <div key={claim.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-slate-900 flex-1 pr-4">
                    <Link href={`/claim/${claim.slug}`} className="hover:text-blue-600 transition-colors">
                      {claim.title}
                    </Link>
                  </h3>
                  
                  {/* Consensus Score */}
                  <div className="flex items-center space-x-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      (claim.consensus || 0.5) > 0.7 
                        ? 'bg-green-100 text-green-800' 
                        : (claim.consensus || 0.5) > 0.4 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {Math.round((claim.consensus || 0.5) * 100)}% consensus
                    </div>
                  </div>
                </div>
                
                {claim.content && (
                  <p className="text-slate-600 mb-4 leading-relaxed">{claim.content}</p>
                )}
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  {/* People involved in this claim */}
                  {claim.people && claim.people.length > 0 && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <div className="flex flex-wrap gap-1">
                        {claim.people.slice(0, 3).map((person, index) => (
                          <Link
                            key={index}
                            href={`/people/${encodeURIComponent(person.toLowerCase().replace(/\s+/g, '-').replace(/\./g, ''))}`}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            {person}
                          </Link>
                        ))}
                        {claim.people.length > 3 && (
                          <span>+{claim.people.length - 3} others</span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Tags */}
                  {claim.tags && claim.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {claim.tags.slice(0, 3).map((tag, index) => (
                        <Link
                          key={index}
                          href={`/tags/${encodeURIComponent(tag)}`}
                          className="px-2 py-1 bg-gray-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 rounded text-xs transition-colors"
                        >
                          {tag}
                        </Link>
                      ))}
                      {claim.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-slate-600 rounded text-xs">
                          +{claim.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
