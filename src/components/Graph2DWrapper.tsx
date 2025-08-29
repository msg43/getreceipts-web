// Graph2DWrapper.tsx - Client-only wrapper for Graph2D to prevent SSR issues

'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import type { GraphData, Node } from '@/lib/types';

// Dynamically import Graph2D with SSR disabled
const Graph2D = dynamic(
  () => import('./Graph2D').then(mod => ({ default: mod.Graph2D })),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-slate-50 rounded-lg flex items-center justify-center">
        <div className="text-slate-500 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-500 mb-4"></div>
          <div>Loading 2D graph...</div>
        </div>
      </div>
    )
  }
);

interface Graph2DWrapperProps {
  data: GraphData;
  selectedNodeId: string | null;
  onNodeSelect: (nodeId: string | null, node: Node | null) => void;
}

export function Graph2DWrapper(props: Graph2DWrapperProps) {
  const [hasError, setHasError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Additional validation for the data prop
  const isValidData = props.data && 
    Array.isArray(props.data.nodes) && 
    Array.isArray(props.data.edges) &&
    props.data.nodes.length >= 0 && 
    props.data.edges.length >= 0;

  if (!isClient) {
    return (
      <div className="h-full w-full bg-slate-50 rounded-lg flex items-center justify-center">
        <div className="text-slate-500">Initializing...</div>
      </div>
    );
  }

  if (!isValidData) {
    console.warn('Graph2DWrapper: Invalid data provided', props.data);
    return (
      <div className="h-full w-full bg-slate-50 rounded-lg flex items-center justify-center">
        <div className="text-center text-slate-600">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-medium">No Graph Data</p>
          <p className="text-sm mt-2">Waiting for valid graph data...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="h-full w-full bg-slate-50 rounded-lg flex items-center justify-center">
        <div className="text-center text-slate-600">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-medium">2D Graph Error</p>
          <p className="text-sm mt-2">Failed to load 2D visualization</p>
        </div>
      </div>
    );
  }

  try {
    return (
      <div className="h-full w-full" style={{ minHeight: '400px', minWidth: '400px' }}>
        <Graph2D {...props} />
      </div>
    );
  } catch (error) {
    console.error('Graph2D rendering error:', error);
    setHasError(true);
    return (
      <div className="h-full w-full bg-slate-50 rounded-lg flex items-center justify-center">
        <div className="text-center text-slate-600">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-medium">Graph Rendering Error</p>
          <p className="text-sm mt-2">Failed to load 2D visualization</p>
        </div>
      </div>
    );
  }
}
