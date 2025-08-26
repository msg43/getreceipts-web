// CenterPane.tsx - Container for graph visualization

import React from 'react';
import { Graph2DWrapper } from './Graph2DWrapper';
import { Graph3DWrapper } from './Graph3DWrapper';
import { ModeToggle } from './ModeToggle';
import type { GraphData, GraphMode, Node } from '@/lib/types';

interface CenterPaneProps {
  data: GraphData;
  mode: GraphMode;
  onModeChange: (mode: GraphMode) => void;
  selectedNodeId: string | null;
  onNodeSelect: (nodeId: string | null, node: Node | null) => void;
  loading: boolean;
  error: string | null;
}

export function CenterPane({
  data,
  mode,
  onModeChange,
  selectedNodeId,
  onNodeSelect,
  loading,
  error,
}: CenterPaneProps) {
  return (
    <div className="h-full relative">
      {/* Mode Toggle */}
      <ModeToggle mode={mode} onModeChange={onModeChange} />

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 bg-slate-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-slate-600">Loading graph data...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="absolute inset-0 bg-slate-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-red-600">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">Error loading graph</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        </div>
      )}

      {/* Graph Visualization */}
      {!loading && !error && data && (
        <>
          {mode === '2D' ? (
            <Graph2DWrapper
              data={data}
              selectedNodeId={selectedNodeId}
              onNodeSelect={onNodeSelect}
            />
          ) : (
            <Graph3DWrapper
              data={data}
              selectedNodeId={selectedNodeId}
              onNodeSelect={onNodeSelect}
            />
          )}
        </>
      )}

      {/* Info Panel */}
      {!loading && !error && data && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 text-sm">
          <div className="flex items-center gap-4 text-slate-600">
            <span>{data.nodes.length} nodes</span>
            <span>•</span>
            <span>{data.edges.length} edges</span>
            <span>•</span>
            <span>{data.clusters.length} clusters</span>
          </div>
        </div>
      )}
    </div>
  );
}