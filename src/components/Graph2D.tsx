// Graph2D.tsx - 2D graph visualization using React-Sigma

import React, { useEffect, useMemo } from 'react';
import { SigmaContainer, useLoadGraph, useRegisterEvents, useSigma } from '@react-sigma/core';
import '@react-sigma/core/lib/style.css';
import Graph from 'graphology';
import type { GraphData, Node } from '@/lib/types';

interface Graph2DProps {
  data: GraphData;
  selectedNodeId: string | null;
  onNodeSelect: (nodeId: string | null, node: Node | null) => void;
}

function GraphEvents({ onNodeSelect }: { onNodeSelect: (nodeId: string | null, node: Node | null) => void }) {
  const sigma = useSigma();
  const graph = sigma.getGraph();
  const registerEvents = useRegisterEvents();

  useEffect(() => {
    registerEvents({
      clickNode: (event) => {
        try {
          const nodeId = event.node;
          const nodeData = graph.getNodeAttributes(nodeId);
          onNodeSelect(nodeId, nodeData as Node);
        } catch (error) {
          console.error('Graph2D: Error handling node click', error);
        }
      },
      clickStage: () => {
        try {
          onNodeSelect(null, null);
        } catch (error) {
          console.error('Graph2D: Error handling stage click', error);
        }
      },
    });
  }, [registerEvents, graph, onNodeSelect]);

  return null;
}

function GraphLoader({ data, selectedNodeId }: { data: GraphData; selectedNodeId: string | null }) {
  const loadGraph = useLoadGraph();
  const sigma = useSigma();

  // Center camera on selected node
  useEffect(() => {
    if (selectedNodeId && sigma) {
      try {
        const nodePosition = sigma.getNodeDisplayData(selectedNodeId);
        if (nodePosition) {
          sigma.getCamera().animate(nodePosition, { duration: 500 });
        }
      } catch (error) {
        console.error('Graph2D: Error animating camera to node', error);
      }
    }
  }, [selectedNodeId, sigma]);

  useEffect(() => {
    // Defensive checks to prevent iterator errors
    if (!data || !Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
      console.warn('Graph2D: Invalid data structure', { data });
      return;
    }

    const graph = new Graph();

    // Add nodes
    data.nodes.forEach((node) => {
      if (!node || !node.id) {
        console.warn('Graph2D: Invalid node', node);
        return;
      }
      
      // Extract semantic type before spreading to avoid Sigma.js type conflicts
      const { type: semanticType, ...nodeWithoutType } = node;
      
      graph.addNode(node.id, {
        ...nodeWithoutType,
        x: node.x || Math.random() * 1000,
        y: node.y || Math.random() * 1000,
        size: node.size || 10,
        color: node.color || '#666666',
        label: node.label,
        // Store semantic type under a different property name
        nodeType: semanticType,
        // Explicitly set Sigma.js type to circle (default node renderer)
        type: 'circle',
      });
    });

    // Add edges
    data.edges.forEach((edge) => {
      if (!edge || !edge.id || !edge.source || !edge.target) {
        console.warn('Graph2D: Invalid edge', edge);
        return;
      }
      
      if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
        graph.addEdge(edge.source, edge.target, {
          id: edge.id,
          edgeType: edge.type, // Store our semantic type in a different attribute
          weight: edge.weight || 1,
          size: (edge.weight || 1) * 2,
          color: edge.type === 'supports' ? '#10B981' : 
                 edge.type === 'refutes' ? '#EF4444' : '#6B7280',
        });
      }
    });

    loadGraph(graph);
    
    // Fit graph to viewport after loading
    setTimeout(() => {
      if (sigma) {
        try {
          if (!selectedNodeId) {
            // Fit the whole graph in view
            sigma.getCamera().setState({ x: 0, y: 0, ratio: 0.8 });
          } else {
            // Center on selected node
            const nodePosition = sigma.getNodeDisplayData(selectedNodeId);
            if (nodePosition) {
              sigma.getCamera().animate(nodePosition, { duration: 500 });
            }
          }
        } catch (error) {
          console.error('Graph2D: Error setting camera position', error);
        }
      }
    }, 200);

    // Handle selection highlighting
    if (selectedNodeId && graph.hasNode(selectedNodeId)) {
      try {
        graph.forEachNode((node) => {
          const isSelected = node === selectedNodeId;
          const isNeighbor = graph.areNeighbors(selectedNodeId, node);
          graph.setNodeAttribute(node, 'highlighted', isSelected || isNeighbor);
          graph.setNodeAttribute(node, 'color', 
            isSelected ? '#FBBF24' : 
            isNeighbor ? graph.getNodeAttribute(node, 'color') : '#E5E7EB'
          );
        });

        graph.forEachEdge((edge) => {
          const isRelevant = graph.source(edge) === selectedNodeId || 
                            graph.target(edge) === selectedNodeId;
          graph.setEdgeAttribute(edge, 'hidden', !isRelevant);
        });
      } catch (error) {
        console.error('Graph2D: Error highlighting selection', error);
      }
    } else {
      // Reset colors when no selection
      try {
        graph.forEachNode((node) => {
          const originalNode = data.nodes?.find(n => n.id === node);
          if (originalNode) {
            graph.setNodeAttribute(node, 'color', originalNode.color || '#666666');
            graph.setNodeAttribute(node, 'highlighted', false);
          }
        });
        graph.forEachEdge((edge) => {
          graph.setEdgeAttribute(edge, 'hidden', false);
        });
      } catch (error) {
        console.error('Graph2D: Error resetting selection', error);
      }
    }

  }, [loadGraph, data, selectedNodeId, sigma]);

  return null;
}

export function Graph2D({ data, selectedNodeId, onNodeSelect }: Graph2DProps) {
  const sigmaStyle = useMemo(() => ({
    height: '100%',
    width: '100%',
  }), []);

  const sigmaSettings = useMemo(() => ({
    renderLabels: true,
    labelSize: 12,
    labelWeight: 'bold',
    labelColor: { color: '#374151' },
    defaultNodeType: 'circle',
    // Allow invalid container to prevent initialization errors
    allowInvalidContainer: true,
    // Removed defaultEdgeType as it was causing issues
    edgeReducer: (edge: string, data: { color: string; [key: string]: unknown }) => {
      // Reduce edge opacity for better visibility
      return { ...data, color: data.color + '80' };
    },
    zIndex: true,
    minCameraRatio: 0.1,
    maxCameraRatio: 10,
  }), []);

  return (
    <div className="h-full w-full bg-gray-50 rounded-lg overflow-hidden">
      <SigmaContainer style={sigmaStyle} settings={sigmaSettings}>
        <GraphLoader data={data} selectedNodeId={selectedNodeId} />
        <GraphEvents onNodeSelect={onNodeSelect} />
      </SigmaContainer>
    </div>
  );
}