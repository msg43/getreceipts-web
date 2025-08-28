// useSubgraph.ts - Hook for fetching graph data

import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import type { GraphData, Filters } from './types';

export function useSubgraph(filters: Filters) {
  const [data, setData] = useState<GraphData>({
    nodes: [],
    edges: [],
    clusters: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubgraph() {
      try {
        setLoading(true);
        setError(null);

        // Check if Supabase is configured
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          throw new Error('Supabase credentials not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.');
        }

        // Only use server-side filter properties (not client-side display properties)
        const serverFilters = {
          search: filters.search,
          tags: filters.tags,
          timeStart: filters.timeStart,
          timeEnd: filters.timeEnd,
          communities: filters.communities,
          edgeTypes: filters.edgeTypes,
          limit: filters.limit
        };

        console.log('🔧 Calling get_subgraph with filters:', serverFilters);

        // TEMPORARY: Use mock endpoint for testing
        const response = await fetch('/api/graph/mock');
        if (!response.ok) {
          throw new Error('Failed to fetch mock data');
        }
        const result = await response.json();

        // OLD CODE: Call the RPC function
        // const { data: result, error: rpcError } = await supabase.rpc('get_subgraph', {
        //   filters: serverFilters
        // });

        // if (rpcError) {
        //   console.error('RPC Error:', rpcError);
        //   if (rpcError.code === '42883') {
        //     throw new Error('The get_subgraph function does not exist in your database. Please run the SQL setup scripts.');
        //   }
        //   throw new Error(`Database error: ${rpcError.message}`);
        // }

        if (result) {
          setData({
            nodes: result.nodes || [],
            edges: result.edges || [],
            clusters: result.clusters || []
          });
        }
      } catch (err) {
        console.error('Error fetching subgraph:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch graph data');
      } finally {
        setLoading(false);
      }
    }

    fetchSubgraph();
  }, [
    filters.search,
    filters.tags,
    filters.timeStart,
    filters.timeEnd,
    filters.communities,
    filters.edgeTypes,
    filters.limit
  ]);

  return { data, loading, error };
}