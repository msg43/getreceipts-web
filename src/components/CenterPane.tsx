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

      {/* Debug Info */}
      {!loading && !error && (
        <div className="absolute top-16 left-4 bg-blue-900 text-white p-2 rounded text-xs z-10">
          Data: {data ? `${data.nodes.length} nodes, ${data.edges.length} edges` : 'No data'}
        </div>
      )}

      {/* Graph Visualization */}
      {!loading && !error && data && data.nodes.length > 0 ? (
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
      ) : !loading && !error ? (
        <div className="absolute inset-0 bg-slate-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-slate-600">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="font-medium">No Graph Data</p>
            <p className="text-sm mt-2">No nodes or edges found with current filters</p>
            <p className="text-sm text-blue-600 mt-1">Try adjusting your search filters</p>
          </div>
        </div>
      ) : null}

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