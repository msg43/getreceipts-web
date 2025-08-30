'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Graph2DWrapper } from './Graph2DWrapper';
import type { GraphData, Node } from '@/lib/types';

interface ClaimGraphData {
  nodes: Node[];
  edges: Array<{
    id: string;
    source: string;
    target: string;
    type: string;
    weight?: number;
    evidence?: string;
  }>;
  metadata: {
    total_claims: number;
    total_relationships: number;
    relationship_types: string[];
  };
}

interface ClaimGraphProps {
  claimId?: string;
  height?: number;
}

export default function ClaimGraph({ claimId, height = 600 }: ClaimGraphProps) {
  const [data, setData] = useState<ClaimGraphData | null>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  
  useEffect(() => {
    fetchGraphData().catch(error => {
      console.error('Error in fetchGraphData useEffect:', error);
    });
  }, [claimId]);
  
  const fetchGraphData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/graph/claims');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const graphData = await response.json();
      
      if (!graphData || !graphData.nodes) {
        throw new Error('Invalid graph data received');
      }
      
      // Store the raw API data
      const apiData = {
        nodes: graphData.nodes || [],
        edges: graphData.edges || [],
        metadata: graphData.metadata || {
          total_claims: 0,
          total_relationships: 0,
          relationship_types: []
        }
      };
      
      setData(apiData);
      
      // Transform to Graph2D format
      const graph2DData: GraphData = {
        nodes: (graphData.nodes || []).map((node: any) => ({
          ...node,
          label: node.text || node.title || node.label,
          size: 15,
          color: claimId && node.id === claimId ? '#8b5cf6' : '#3B82F6'
        })),
        edges: (graphData.edges || []).map((edge: any) => ({
          ...edge,
          color: edge.type === 'supports' ? '#22c55e' : 
                 edge.type === 'contradicts' ? '#ef4444' : 
                 edge.type === 'extends' ? '#3b82f6' : 
                 edge.type === 'contextualizes' ? '#f59e0b' : '#6b7280'
        })),
        clusters: []
      };
      
      setGraphData(graph2DData);
    } catch (error) {
      console.error('Error fetching graph data:', error);
      // Set empty data to prevent rendering issues
      setData({
        nodes: [],
        edges: [],
        metadata: {
          total_claims: 0,
          total_relationships: 0,
          relationship_types: []
        }
      });
      setGraphData({
        nodes: [],
        edges: [],
        clusters: []
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle node selection from the graph
  const handleNodeSelect = (nodeId: string | null, node: Node | null) => {
    setSelectedNode(node);
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>🕸️ Claims Network</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading graph...</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!data || data.nodes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>🕸️ Claims Network</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-center py-8">
            No claim relationships to display yet.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            🕸️ Claims Network
            <div className="flex gap-2">
              <Badge variant="secondary">
                {data.metadata.total_claims} claims
              </Badge>
              <Badge variant="secondary">
                {data.metadata.total_relationships} connections
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="text-sm font-medium">Legend:</span>
            <Badge style={{ backgroundColor: '#22c55e' }}>Supports</Badge>
            <Badge style={{ backgroundColor: '#ef4444' }}>Contradicts</Badge>
            <Badge style={{ backgroundColor: '#3b82f6' }}>Extends</Badge>
            <Badge style={{ backgroundColor: '#f59e0b' }}>Contextualizes</Badge>
          </div>
          
          <div className="border rounded-lg overflow-hidden" style={{ height: `${height}px` }}>
            {graphData && (
              <Graph2DWrapper
                data={graphData}
                selectedNodeId={claimId || null}
                onNodeSelect={handleNodeSelect}
              />
            )}
          </div>
          
          {selectedNode && (
            <div className="mt-4 p-4 border rounded-lg bg-slate-50">
              <h4 className="font-semibold mb-2">Selected Claim</h4>
              <p className="text-sm mb-2">{selectedNode.label || selectedNode.text || 'No description'}</p>
              <div className="flex gap-2">
                {selectedNode.consensus && (
                  <Badge variant="outline">
                    Consensus: {Math.round(Number(selectedNode.consensus) * 100)}%
                  </Badge>
                )}
                {selectedNode.slug && (
                  <a
                    href={`/claim/${selectedNode.slug}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Details →
                  </a>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
