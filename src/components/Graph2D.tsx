// Graph2D.tsx - 2D graph visualization using React-Sigma

import React, { useEffect, useMemo, useRef } from 'react';
import { SigmaContainer, useLoadGraph, useRegisterEvents, useSigma } from '@react-sigma/core';
import '@react-sigma/core/lib/style.css';
import Graph from 'graphology';
import forceAtlas2 from 'graphology-layout-forceatlas2';
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
  const draggedNode = useRef<string | null>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    registerEvents({
      clickNode: (event) => {
        try {
          // Only trigger click if we weren't dragging
          if (!isDragging.current) {
            const nodeId = event.node;
            const nodeData = graph.getNodeAttributes(nodeId);
            onNodeSelect(nodeId, nodeData as Node);
          }
        } catch (error) {
          console.error('Graph2D: Error handling node click', error);
        }
      },
      clickStage: () => {
        try {
          if (!isDragging.current) {
            onNodeSelect(null, null);
          }
        } catch (error) {
          console.error('Graph2D: Error handling stage click', error);
        }
      },
      downNode: (event) => {
        try {
          draggedNode.current = event.node;
          isDragging.current = false;
        } catch (error) {
          console.error('Graph2D: Error handling node down', error);
        }
      },
      mousemovebody: (event) => {
        try {
          if (!draggedNode.current) return;
          
          isDragging.current = true;
          
          // Get the drag position in graph coordinates
          const position = sigma.viewportToGraph(event);
          
          // Update node position
          graph.setNodeAttribute(draggedNode.current, 'x', position.x);
          graph.setNodeAttribute(draggedNode.current, 'y', position.y);
          
          // Prevent the default camera move
          event.preventSigmaDefault();
          event.original.preventDefault();
          event.original.stopPropagation();
        } catch (error) {
          console.error('Graph2D: Error handling drag', error);
        }
      },
      mouseup: () => {
        try {
          if (draggedNode.current) {
            // Small delay to prevent click event after drag
            setTimeout(() => {
              isDragging.current = false;
            }, 100);
            draggedNode.current = null;
          }
        } catch (error) {
          console.error('Graph2D: Error handling mouse up', error);
        }
      },
    });
  }, [registerEvents, graph, onNodeSelect, sigma]);

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
      
      // Create better initial positioning with more spread
      const spreadMultiplier = Math.sqrt(data.nodes.length) * 100; // Scale with number of nodes
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.random() * spreadMultiplier + 50;
      
      graph.addNode(node.id, {
        ...nodeWithoutType,
        x: node.x || Math.cos(angle) * radius,
        y: node.y || Math.sin(angle) * radius,
        size: node.size || 15, // Slightly larger default size
        color: node.color || '#666666',
        label: node.label,
        // Store semantic type under a different property name
        nodeType: semanticType,
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
          size: Math.max(1, (edge.weight || 0.5) * 3), // Make edges more visible
          color: edge.type === 'supports' ? '#10B981' : 
                 edge.type === 'refutes' ? '#EF4444' : 
                 edge.type === 'contradicts' ? '#EF4444' :
                 edge.type === 'extends' ? '#3B82F6' :
                 edge.type === 'contextualizes' ? '#F59E0B' : '#6B7280',
        });
      }
    });

    loadGraph(graph);
    
    // Apply force layout for better node positioning
    if (graph.order > 0) {
      try {
        // Apply ForceAtlas2 layout for physics simulation
        forceAtlas2.assign(graph, {
          iterations: 200, // More iterations for better positioning
          settings: {
            gravity: 0.5, // Lower gravity to allow more spread
            scalingRatio: 50, // Higher scaling for more spread
            strongGravityMode: false, // Allow more natural distribution
            barnesHutOptimize: true, // Enable optimization for performance
            barnesHutTheta: 1.2, // Optimize Barnes-Hut approximation
            edgeWeightInfluence: 1, // Use edge weights for positioning
            adjustSizes: false,
            outboundAttractionDistribution: false,
            linLogMode: false,
          }
        });
      } catch (error) {
        console.error('Graph2D: Error applying force layout', error);
      }
    }
    
    // Fit graph to viewport after loading
    setTimeout(() => {
      if (sigma) {
        try {
          if (!selectedNodeId) {
            // Calculate bounding box and fit graph properly
            const nodes = graph.nodes();
            if (nodes.length > 0) {
              let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
              
              nodes.forEach(nodeId => {
                const attrs = graph.getNodeAttributes(nodeId);
                minX = Math.min(minX, attrs.x);
                maxX = Math.max(maxX, attrs.x);
                minY = Math.min(minY, attrs.y);
                maxY = Math.max(maxY, attrs.y);
              });
              
              const centerX = (minX + maxX) / 2;
              const centerY = (minY + maxY) / 2;
              const width = maxX - minX;
              const height = maxY - minY;
              const padding = 100;
              const ratio = Math.max(width, height) / Math.min(sigma.getContainer().offsetWidth, sigma.getContainer().offsetHeight) + padding / 1000;
              
              sigma.getCamera().setState({ 
                x: centerX, 
                y: centerY, 
                ratio: Math.max(0.1, Math.min(2.0, ratio))
              });
            } else {
              sigma.getCamera().setState({ x: 0, y: 0, ratio: 1.0 });
            }
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
    }, 300); // Slightly longer delay to allow layout to settle

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
    renderEdgeLabels: false,
    // Allow invalid container to prevent initialization errors
    allowInvalidContainer: true,
    // Force layout settings for physics
    enableEdgeHoverEvent: true,
    enableEdgeClickEvent: true,
    nodeReducer: (node: string, data: { highlighted?: boolean; [key: string]: unknown }) => {
      return { ...data, zIndex: data.highlighted ? 2 : 1 };
    },
    edgeReducer: (edge: string, data: { color: string; hidden?: boolean; size?: number; [key: string]: unknown }) => {
      if (data.hidden) {
        return { ...data, color: 'transparent' };
      }
      // Make edges more visible
      return { 
        ...data, 
        color: data.color,
        size: Math.max(1, Number(data.size || 1)),
        zIndex: 1
      };
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