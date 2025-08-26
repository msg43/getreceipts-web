// page.tsx - Main page with three-pane layout

'use client';

import React, { useState, useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { LeftPane } from '@/components/LeftPane';
import { CenterPane } from '@/components/CenterPane';
import { RightPane } from '@/components/RightPane';
import { useSubgraph } from '@/lib/useSubgraph';
import { setupKeyboardShortcuts } from '@/utils/keyboard';
import type { Filters, GraphMode, Node, SelectionState } from '@/lib/types';

export default function GraphPage() {
  // State
  const [filters, setFilters] = useState<Filters>({
    limit: 500,
  });
  const [mode, setMode] = useState<GraphMode>('3D');
  const [selection, setSelection] = useState<SelectionState>({
    nodeId: null,
    node: null,
  });
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Fetch graph data
  const { data: rawData, loading, error } = useSubgraph(filters);

  // Apply visibility filters to the data
  const data = React.useMemo(() => {
    if (!rawData) return { nodes: [], edges: [], clusters: [] };
    
    // Filter nodes based on visibility settings
    const visibleNodes = rawData.nodes.filter(node => {
      if (node.type === 'person' && filters.showPeople === false) return false;
      if (node.type === 'source' && filters.showSources === false) return false;
      if (node.type === 'claim' && filters.showClaims === false) return false;
      return true;
    });
    
    // Get visible node IDs
    const visibleNodeIds = new Set(visibleNodes.map(n => n.id));
    
    // Filter edges to only include those between visible nodes
    const visibleEdges = rawData.edges.filter(edge => 
      visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    );
    
    return {
      nodes: visibleNodes,
      edges: visibleEdges,
      clusters: rawData.clusters
    };
  }, [rawData, filters.showPeople, filters.showSources, filters.showClaims]);

  // Handle node selection
  const handleNodeSelect = React.useCallback((nodeId: string | null, node: Node | null) => {
    setSelection({ nodeId, node });
    setHasUserInteracted(true);
  }, []);

  // Select initial node when data loads
  useEffect(() => {
    // Only select initial node if we have data, no current selection, and user hasn't interacted
    if (data.nodes.length > 0 && !selection.nodeId && !hasUserInteracted) {
      // Count edges for each node to find the most connected one
      const edgeCounts = new Map<string, number>();
      data.edges.forEach(edge => {
        edgeCounts.set(edge.source, (edgeCounts.get(edge.source) || 0) + 1);
        edgeCounts.set(edge.target, (edgeCounts.get(edge.target) || 0) + 1);
      });
      
      // Find the node with the most connections
      let selectedNode = data.nodes[0];
      let maxEdges = 0;
      
      data.nodes.forEach(node => {
        const edgeCount = edgeCounts.get(node.id) || 0;
        if (edgeCount > maxEdges) {
          maxEdges = edgeCount;
          selectedNode = node;
        }
      });
      
      // If all nodes have 0 connections, pick a random one from the middle of the array
      if (maxEdges === 0 && data.nodes.length > 0) {
        selectedNode = data.nodes[Math.floor(data.nodes.length / 2)];
      }
      
      // Select the initial node without marking as user interaction
      setSelection({ nodeId: selectedNode.id, node: selectedNode });
    }
  }, [data.nodes, data.edges, selection.nodeId, hasUserInteracted]); // Dependencies for initial selection

  // Clear selection
  const clearSelection = () => {
    setSelection({ nodeId: null, node: null });
    setHasUserInteracted(true);
  };

  // Toggle between 2D and 3D
  const toggleMode = () => {
    setMode(prev => prev === '2D' ? '3D' : '2D');
  };

  // Navigate to next/previous node
  const navigateNodes = React.useCallback((direction: 'next' | 'prev') => {
    if (!data.nodes.length) return;
    
    const currentIndex = selection.nodeId 
      ? data.nodes.findIndex(n => n.id === selection.nodeId)
      : -1;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = currentIndex < data.nodes.length - 1 ? currentIndex + 1 : 0;
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : data.nodes.length - 1;
    }
    
    const newNode = data.nodes[newIndex];
    handleNodeSelect(newNode.id, newNode);
  }, [data.nodes, selection.nodeId, handleNodeSelect]);

  // Setup keyboard shortcuts
  useEffect(() => {
    const cleanup = setupKeyboardShortcuts({
      onNextNode: () => navigateNodes('next'),
      onPrevNode: () => navigateNodes('prev'),
      onClearSelection: clearSelection,
      onToggleMode: toggleMode,
      onSearch: () => {
        // Focus search input
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      },
    });

    return cleanup;
  }, [navigateNodes, clearSelection, toggleMode]);

  return (
    <div className="h-screen bg-slate-100 p-4">
      <div className="h-full">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-slate-900">Claims Graph Explorer</h1>
          <p className="text-slate-600 mt-1">
            Explore relationships between claims • Use filters to focus • Click nodes for details
          </p>
        </div>

        {/* Three-pane layout with resizable panels */}
        <div className="h-[calc(100%-5rem)]">
          <PanelGroup direction="horizontal" className="h-full">
            {/* Left Pane - Filters & Bookmarks */}
            <Panel defaultSize={20} minSize={15} maxSize={30}>
              <div className="h-full pr-2">
                <LeftPane
                  filters={filters}
                  onFiltersChange={setFilters}
                  selectedNodeId={selection.nodeId}
                  data={rawData}
                  onNodeSelect={handleNodeSelect}
                />
              </div>
            </Panel>

            {/* Left Resize Handle */}
            <PanelResizeHandle className="w-2 hover:bg-blue-300 transition-colors cursor-col-resize" />

            {/* Center Pane - Graph */}
            <Panel defaultSize={50} minSize={30}>
              <div className="h-full px-2">
                <CenterPane
                  data={data}
                  mode={mode}
                  onModeChange={setMode}
                  selectedNodeId={selection.nodeId}
                  onNodeSelect={handleNodeSelect}
                  loading={loading}
                  error={error}
                />
              </div>
            </Panel>

            {/* Right Resize Handle */}
            <PanelResizeHandle className="w-2 hover:bg-blue-300 transition-colors cursor-col-resize" />

            {/* Right Pane - Node Details */}
            <Panel defaultSize={30} minSize={20} maxSize={40}>
              <div className="h-full pl-2">
                <RightPane
                  selectedNode={selection.node}
                  onClose={clearSelection}
                />
              </div>
            </Panel>
          </PanelGroup>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="fixed bottom-4 right-4 bg-slate-800 text-white text-xs rounded-lg px-3 py-2 opacity-50 hover:opacity-100 transition-opacity">
          <span className="font-mono">j/k</span> navigate • 
          <span className="font-mono ml-2">m</span> toggle mode • 
          <span className="font-mono ml-2">/</span> search • 
          <span className="font-mono ml-2">esc</span> clear
        </div>
      </div>
    </div>
  );
}