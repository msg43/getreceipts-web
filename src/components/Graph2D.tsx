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
        const nodeId = event.node;
        const nodeData = graph.getNodeAttributes(nodeId);
        onNodeSelect(nodeId, nodeData as Node);
      },
      clickStage: () => {
        onNodeSelect(null, null);
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
      const nodePosition = sigma.getNodeDisplayData(selectedNodeId);
      if (nodePosition) {
        sigma.getCamera().animate(nodePosition, { duration: 500 });
      }
    }
  }, [selectedNodeId, sigma]);

  useEffect(() => {
    const graph = new Graph();

    // Add nodes
    data.nodes.forEach((node) => {
      graph.addNode(node.id, {
        ...node,
        x: node.x || Math.random() * 1000,
        y: node.y || Math.random() * 1000,
        size: node.size || 10,
        color: node.color || '#666666',
        label: node.label,
      });
    });

    // Add edges
    data.edges.forEach((edge) => {
      if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
        graph.addEdge(edge.source, edge.target, {
          id: edge.id,
          edgeType: edge.type, // Store our semantic type in a different attribute
          weight: edge.weight,
          size: edge.weight * 2,
          color: edge.type === 'supports' ? '#10B981' : 
                 edge.type === 'refutes' ? '#EF4444' : '#6B7280',
        });
      }
    });

    loadGraph(graph);
    
    // Fit graph to viewport after loading
    setTimeout(() => {
      if (sigma && !selectedNodeId) {
        sigma.getCamera().setState({ ratio: 1.2 });
      }
    }, 100);

    // Handle selection highlighting
    if (selectedNodeId && graph.hasNode(selectedNodeId)) {
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
    } else {
      // Reset colors when no selection
      graph.forEachNode((node) => {
        const originalNode = data.nodes.find(n => n.id === node);
        if (originalNode) {
          graph.setNodeAttribute(node, 'color', originalNode.color);
          graph.setNodeAttribute(node, 'highlighted', false);
        }
      });
      graph.forEachEdge((edge) => {
        graph.setEdgeAttribute(edge, 'hidden', false);
      });
    }

  }, [loadGraph, data, selectedNodeId]);

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
    // Removed defaultEdgeType as it was causing issues
    edgeReducer: (edge: string, data: any) => {
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