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

        // Call the RPC function
        const { data: result, error: rpcError } = await supabase.rpc('get_subgraph', {
          filters: filters
        });

        if (rpcError) {
          throw rpcError;
        }

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
  }, [filters]);

  return { data, loading, error, refetch: () => fetchSubgraph() };
}