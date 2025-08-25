// page.tsx - Main page with three-pane layout

'use client';

import React, { useState, useEffect } from 'react';
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
  const [mode, setMode] = useState<GraphMode>('2D');
  const [selection, setSelection] = useState<SelectionState>({
    nodeId: null,
    node: null,
  });

  // Fetch graph data
  const { data, loading, error } = useSubgraph(filters);

  // Handle node selection
  const handleNodeSelect = (nodeId: string | null, node: Node | null) => {
    setSelection({ nodeId, node });
  };

  // Clear selection
  const clearSelection = () => {
    setSelection({ nodeId: null, node: null });
  };

  // Toggle between 2D and 3D
  const toggleMode = () => {
    setMode(prev => prev === '2D' ? '3D' : '2D');
  };

  // Navigate to next/previous node
  const navigateNodes = (direction: 'next' | 'prev') => {
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
  };

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
  }, [data.nodes, selection.nodeId]);

  return (
    <div className="h-screen bg-gray-100 p-4">
      <div className="h-full max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Claims Graph Explorer</h1>
          <p className="text-gray-600 mt-1">
            Explore relationships between claims • Use filters to focus • Click nodes for details
          </p>
        </div>

        {/* Three-pane layout */}
        <div className="h-[calc(100%-5rem)] flex gap-4">
          {/* Left Pane - Filters & Bookmarks */}
          <div className="w-80 flex-shrink-0">
            <LeftPane
              filters={filters}
              onFiltersChange={setFilters}
              selectedNodeId={selection.nodeId}
            />
          </div>

          {/* Center Pane - Graph */}
          <div className="flex-1">
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

          {/* Right Pane - Node Details */}
          <div className="w-96 flex-shrink-0">
            <RightPane
              selectedNode={selection.node}
              onClose={clearSelection}
            />
          </div>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 opacity-50 hover:opacity-100 transition-opacity">
          <span className="font-mono">j/k</span> navigate • 
          <span className="font-mono ml-2">m</span> toggle mode • 
          <span className="font-mono ml-2">/</span> search • 
          <span className="font-mono ml-2">esc</span> clear
        </div>
      </div>
    </div>
  );
}