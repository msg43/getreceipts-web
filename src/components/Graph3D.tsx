// Graph3D.tsx - 3D graph visualization using react-force-graph-3d

import React, { useCallback, useRef, useMemo, useEffect, useState } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import type { GraphData, Node, Node3D } from '@/lib/types';

// Types for the force graph library
interface ForceNode extends Node3D {
  x?: number;
  y?: number;
  z?: number;
  vx?: number;
  vy?: number;
  vz?: number;
}

interface ForceLink {
  source: string | ForceNode;
  target: string | ForceNode;
  type: 'supports' | 'refutes' | 'related';
  weight: number;
  color: string;
  opacity: number;
  width: number;
}

interface Graph3DProps {
  data: GraphData;
  selectedNodeId: string | null;
  onNodeSelect: (nodeId: string | null, node: Node | null) => void;
}

export function Graph3D({ data, selectedNodeId, onNodeSelect }: Graph3DProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fgRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasFittedRef = useRef<boolean>(false);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

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
  const handleNodeClick = useCallback((node: ForceNode) => {
    if (node) {
      onNodeSelect(node.id, node as Node);
      // Center camera on clicked node
      if (fgRef.current && node.x !== undefined && node.y !== undefined && node.z !== undefined) {
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
  const nodeColor = useCallback((node: ForceNode) => {
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
  const linkVisibility = useCallback((link: ForceLink) => {
    if (!selectedNodeId) return true;
    const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
    const targetId = typeof link.target === 'string' ? link.target : link.target.id;
    return sourceId === selectedNodeId || targetId === selectedNodeId;
  }, [selectedNodeId]);

  // Center camera on selected node after the initial fit
  useEffect(() => {
    if (!hasFittedRef.current) return; // wait until the first fit completes
    if (!selectedNodeId || !fgRef.current) return;

    const selectedNode = graphData.nodes.find(n => n.id === selectedNodeId);
    if (!selectedNode) return;

    // Small delay to ensure the engine produced stable positions
    const timeout = setTimeout(() => {
      const distance = 200;
      const distRatio = 1 + distance / Math.hypot(
        (selectedNode.x || 0),
        (selectedNode.y || 0),
        (selectedNode.z || 0)
      );
      if (fgRef.current) {
        fgRef.current.cameraPosition(
          {
            x: (selectedNode.x || 0) * distRatio,
            y: (selectedNode.y || 0) * distRatio,
            z: (selectedNode.z || 0) * distRatio,
          },
          selectedNode,
          800
        );
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [selectedNodeId, graphData.nodes]);

  // Remove previous generic initial zoom effect; handled in onEngineStop + hasFittedRef

  // ResizeObserver to track container dimensions
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Only render the graph when we have valid dimensions
  const shouldRenderGraph = dimensions.width > 0 && dimensions.height > 0;

  return (
    <div ref={containerRef} className="h-full w-full bg-gray-900 rounded-lg overflow-hidden">
      {shouldRenderGraph && (
        <ForceGraph3D
          ref={fgRef}
          graphData={graphData}
          width={dimensions.width}
          height={dimensions.height}
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
          onEngineStop={() => {
          if (!fgRef.current) return;

          // First time the engine stops: fit the entire graph, once
          if (!hasFittedRef.current) {
            hasFittedRef.current = true;
            fgRef.current.zoomToFit(800, 100); // longer duration + padding to guarantee visibility

            // If a node is already selected (e.g., preselected), re-center after the fit
            if (selectedNodeId) {
              const selectedNode = graphData.nodes.find(n => n.id === selectedNodeId);
              if (selectedNode) {
                const distance = 200;
                const distRatio = 1 + distance / Math.hypot(
                  (selectedNode.x || 0),
                  (selectedNode.y || 0),
                  (selectedNode.z || 0)
                );
                setTimeout(() => {
                  if (!fgRef.current) return;
                  fgRef.current.cameraPosition(
                    {
                      x: (selectedNode.x || 0) * distRatio,
                      y: (selectedNode.y || 0) * distRatio,
                      z: (selectedNode.z || 0) * distRatio,
                    },
                    selectedNode,
                    800
                  );
                }, 150);
              }
            }
            return;
          }

          // Subsequent engine stops: keep selected node centered, otherwise keep current framing
          if (selectedNodeId) {
            const selectedNode = graphData.nodes.find(n => n.id === selectedNodeId);
            if (selectedNode) {
              const distance = 200;
              const distRatio = 1 + distance / Math.hypot(
                (selectedNode.x || 0),
                (selectedNode.y || 0),
                (selectedNode.z || 0)
              );
              fgRef.current.cameraPosition(
                {
                  x: (selectedNode.x || 0) * distRatio,
                  y: (selectedNode.y || 0) * distRatio,
                  z: (selectedNode.z || 0) * distRatio,
                },
                selectedNode,
                600
              );
            }
          }
        }}
        />
      )}
      
      {/* Loading state while waiting for dimensions */}
      {!shouldRenderGraph && (
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-gray-400">Loading 3D graph...</div>
        </div>
      )}
    </div>
  );
}