'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getOptimalTimeout } from '@/lib/mobile-utils';

interface Claim {
  id: string;
  slug: string;
  text_short: string;
  text_long?: string;
  topics?: string[];
  created_at: string;
}

interface Aggregate {
  consensus_score: string;
  support_count: number;
  dispute_count: number;
}

interface ClaimWithConsensus extends Claim {
  consensus?: Aggregate;
}

export default function LiveClaims() {
  const [claims, setClaims] = useState<ClaimWithConsensus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    
    async function fetchClaims() {
      try {
        // Fetch claims from the API with timeout
        const response = await fetch('/api/claims', {
          signal: controller.signal,
          // Add cache control for better performance
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setClaims(data.claims || []);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Error fetching claims:', err);
          setError('Unable to load claims. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    }

    // Add a timeout to prevent hanging on mobile
    const timeoutId = setTimeout(() => {
      controller.abort();
      setError('Request timed out. Please check your connection.');
      setLoading(false);
    }, getOptimalTimeout()); // Mobile-optimized timeout

    fetchClaims().catch(error => {
      console.error('Error in fetchClaims useEffect:', error);
    });

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Skeleton loader for better mobile UX */}
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                  <div className="flex gap-1">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-40"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-slate-600 dark:text-slate-400">
        <p>Unable to load claims at this time.</p>
        <p className="text-sm mt-2">
          Please check your database connection and try again.
        </p>
      </div>
    );
  }

  if (claims.length === 0) {
    return (
      <div className="text-center text-slate-600 dark:text-slate-400 mb-8">
        <p>No claims available yet.</p>
        <p className="text-sm mt-2">
          Claims will appear here as they are submitted via Knowledge Chipper integration.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {claims.slice(0, 3).map((claim) => {
        const consensusPercentage = claim.consensus 
          ? Math.round(Number(claim.consensus.consensus_score) * 100)
          : 50;
        
        const consensusColor = consensusPercentage >= 70 
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
          : consensusPercentage >= 40
          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';

        return (
          <Card key={claim.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg leading-tight">
                    <Link 
                      href={`/claim/${claim.slug}`}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {claim.text_short}
                    </Link>
                  </CardTitle>
                  {claim.topics && claim.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {claim.topics.slice(0, 3).map((topic) => (
                        <Badge key={topic} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <Badge className={consensusColor}>
                  {consensusPercentage}% consensus
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm">
                  {claim.consensus && (
                    <>
                      {claim.consensus.support_count} supporting • {claim.consensus.dispute_count} disputing
                    </>
                  )}
                </CardDescription>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/claim/${claim.slug}`}>
                    View Receipt
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      {claims.length > 3 && (
        <div className="text-center pt-4">
          <Button variant="outline" asChild>
            <Link href="/claims">View All Claims</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
