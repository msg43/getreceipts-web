// Graph3D.tsx - 3D graph visualization using react-force-graph-3d

import React, { useCallback, useRef, useMemo } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import type { GraphData, Node, Node3D } from '@/lib/types';

interface Graph3DProps {
  data: GraphData;
  selectedNodeId: string | null;
  onNodeSelect: (nodeId: string | null, node: Node | null) => void;
}

export function Graph3D({ data, selectedNodeId, onNodeSelect }: Graph3DProps) {
  const fgRef = useRef<any>();

  // Convert data to format expected by ForceGraph3D
  const graphData = useMemo(() => {
    const nodes: Node3D[] = data.nodes.map(node => ({
      ...node,
      id: node.id,
      name: node.label,
      val: node.size / 5, // Scale down for 3D
    }));

    const links = data.edges.map(edge => ({
      ...edge,
      source: edge.source,
      target: edge.target,
      color: edge.type === 'supports' ? '#10B981' : 
             edge.type === 'refutes' ? '#EF4444' : '#6B7280',
      opacity: 0.6,
      width: edge.weight * 2,
    }));

    return { nodes, links };
  }, [data]);

  // Handle node clicks
  const handleNodeClick = useCallback((node: any) => {
    if (node) {
      onNodeSelect(node.id, node as Node);
      // Center camera on clicked node
      if (fgRef.current) {
        const distance = 200;
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
        fgRef.current.cameraPosition(
          { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
          node,
          1000
        );
      }
    }
  }, [onNodeSelect]);

  // Handle background clicks
  const handleBackgroundClick = useCallback(() => {
    onNodeSelect(null, null);
  }, [onNodeSelect]);

  // Node coloring based on selection
  const nodeColor = useCallback((node: any) => {
    if (selectedNodeId === node.id) return '#FBBF24';
    if (selectedNodeId) {
      // Check if neighbor
      const selectedEdges = data.edges.filter(
        e => e.source === selectedNodeId || e.target === selectedNodeId
      );
      const isNeighbor = selectedEdges.some(
        e => e.source === node.id || e.target === node.id
      );
      if (isNeighbor) return node.color;
      return '#E5E7EB'; // Dimmed non-neighbors
    }
    return node.color;
  }, [selectedNodeId, data.edges]);

  // Link visibility based on selection
  const linkVisibility = useCallback((link: any) => {
    if (!selectedNodeId) return true;
    return link.source.id === selectedNodeId || link.target.id === selectedNodeId;
  }, [selectedNodeId]);

  return (
    <div className="h-full w-full bg-gray-900 rounded-lg overflow-hidden">
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        nodeLabel="label"
        nodeAutoColorBy="community"
        nodeColor={nodeColor}
        nodeOpacity={0.9}
        nodeResolution={16}
        linkColor="color"
        linkOpacity={0.4}
        linkWidth="width"
        linkVisibility={linkVisibility}
        onNodeClick={handleNodeClick}
        onBackgroundClick={handleBackgroundClick}
        backgroundColor="#111827"
        showNavInfo={false}
        enableNodeDrag={true}
        enableNavigationControls={true}
        controlType="orbit"
      />
    </div>
  );
}