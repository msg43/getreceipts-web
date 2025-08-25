// Graph3D.tsx - 3D graph visualization using react-force-graph-3d

import React, { useCallback, useRef, useMemo, useEffect } from 'react';
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
        const distance = 400;
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

  // Center camera on selected node when selection changes externally
  useEffect(() => {
    if (selectedNodeId && fgRef.current) {
      // Find the node in the graph data
      const selectedNode = graphData.nodes.find(n => n.id === selectedNodeId);
      if (selectedNode) {
        // Small delay to ensure the graph is ready
        setTimeout(() => {
          if (fgRef.current && selectedNode) {
            const distance = 400;
            const distRatio = 1 + distance / Math.hypot(selectedNode.x || 0, selectedNode.y || 0, selectedNode.z || 0);
            fgRef.current.cameraPosition(
              { 
                x: (selectedNode.x || 0) * distRatio, 
                y: (selectedNode.y || 0) * distRatio, 
                z: (selectedNode.z || 0) * distRatio 
              },
              selectedNode,
              1000
            );
          }
        }, 300);
      }
    }
  }, [selectedNodeId, graphData.nodes]);

  // Initial camera setup when graph loads
  useEffect(() => {
    if (fgRef.current && graphData.nodes.length > 0) {
      // Give the graph time to initialize and position nodes
      setTimeout(() => {
        if (fgRef.current) {
          // Zoom out to show the entire graph with padding
          fgRef.current.zoomToFit(1000, 200);
        }
      }, 1500);
    }
  }, [graphData.nodes.length]);

  return (
    <div className="h-full w-full bg-slate-900 rounded-lg overflow-hidden">
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
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        warmupTicks={100}
        cooldownTicks={0}
        d3Force="center"
        cameraPosition={{ x: 0, y: 0, z: 1000 }}
        onEngineStop={() => {
          // Once the force simulation has settled, adjust camera
          if (fgRef.current) {
            // If no node is selected, show the full graph
            if (!selectedNodeId) {
              fgRef.current.zoomToFit(1000, 200);
            } else {
              // If a node is selected, ensure we're centered on it
              const selectedNode = graphData.nodes.find(n => n.id === selectedNodeId);
              if (selectedNode && selectedNode.x !== undefined) {
                const distance = 400;
                const distRatio = 1 + distance / Math.hypot(selectedNode.x || 0, selectedNode.y || 0, selectedNode.z || 0);
                fgRef.current.cameraPosition(
                  { 
                    x: (selectedNode.x || 0) * distRatio, 
                    y: (selectedNode.y || 0) * distRatio, 
                    z: (selectedNode.z || 0) * distRatio 
                  },
                  selectedNode,
                  1000
                );
              }
            }
          }
        }}
      />
    </div>
  );
}