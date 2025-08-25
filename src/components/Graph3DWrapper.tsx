// Graph3DWrapper.tsx - Client-only wrapper for Graph3D to prevent SSR issues

'use client';

import dynamic from 'next/dynamic';
import type { GraphData, Node } from '@/lib/types';

// Dynamically import Graph3D with SSR disabled
const Graph3D = dynamic(
  () => import('./Graph3D').then(mod => ({ default: mod.Graph3D })),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-slate-900 rounded-lg flex items-center justify-center">
        <div className="text-slate-400">Loading 3D graph...</div>
      </div>
    )
  }
);

interface Graph3DWrapperProps {
  data: GraphData;
  selectedNodeId: string | null;
  onNodeSelect: (nodeId: string | null, node: Node | null) => void;
}

export function Graph3DWrapper(props: Graph3DWrapperProps) {
  return <Graph3D {...props} />;
}
