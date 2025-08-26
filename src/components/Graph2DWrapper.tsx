// Graph2DWrapper.tsx - Client-only wrapper for Graph2D to prevent SSR issues

'use client';

import dynamic from 'next/dynamic';
import type { GraphData, Node } from '@/lib/types';

// Dynamically import Graph2D with SSR disabled
const Graph2D = dynamic(
  () => import('./Graph2D').then(mod => ({ default: mod.Graph2D })),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-slate-50 rounded-lg flex items-center justify-center">
        <div className="text-slate-500">Loading 2D graph...</div>
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
  return <Graph2D {...props} />;
}
