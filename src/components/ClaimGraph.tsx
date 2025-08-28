'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { SimulationNodeDatum, SimulationLinkDatum } from 'd3';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GraphNode extends SimulationNodeDatum {
  id: string;
  slug: string;
  text: string;
  topics: string[];
  consensus: number;
  size: number;
}

interface GraphLink extends SimulationLinkDatum<GraphNode> {
  type: string;
  strength: number;
  evidence?: string;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
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
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  
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
      
      setData(graphData);
    } catch (error) {
      console.error('Error fetching graph data:', error);
      // Set empty data to prevent rendering issues
      setData({
        nodes: [],
        links: [],
        metadata: {
          total_claims: 0,
          total_relationships: 0,
          relationship_types: []
        }
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (!data || !svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content
    
    const width = 800;
    const containerHeight = height;
    
    // Create simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(data.links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, containerHeight / 2))
      .force("collision", d3.forceCollide<GraphNode>().radius(d => d.size + 5));
    
    // Create arrow markers for directed edges
    svg.append("defs").selectAll("marker")
      .data(["supports", "contradicts", "extends", "contextualizes"])
      .enter().append("marker")
      .attr("id", d => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", d => {
        const colors: Record<string, string> = {
          'supports': '#22c55e',
          'contradicts': '#ef4444',
          'extends': '#3b82f6',
          'contextualizes': '#f59e0b'
        };
        return colors[d] || '#6b7280';
      });
    
    // Create links
    const link = svg.append("g")
      .selectAll("line")
      .data(data.links)
      .enter().append("line")
      .attr("stroke", d => {
        const colors: Record<string, string> = {
          'supports': '#22c55e',
          'contradicts': '#ef4444',
          'extends': '#3b82f6',
          'contextualizes': '#f59e0b'
        };
        return colors[d.type] || '#6b7280';
      })
      .attr("stroke-width", d => Math.max(1, d.strength * 4))
      .attr("stroke-opacity", 0.6)
      .attr("marker-end", d => `url(#arrow-${d.type})`);
    
    // Create node groups
    const node = svg.append("g")
      .selectAll("g")
      .data(data.nodes)
      .enter().append("g")
      .attr("cursor", "pointer")
      .call(d3.drag<SVGGElement, GraphNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .on("click", (event, d) => {
        setSelectedNode(d);
      });
    
    // Add circles for nodes
    node.append("circle")
      .attr("r", d => d.size)
      .attr("fill", d => {
        if (claimId && d.id === claimId) return '#8b5cf6'; // Purple for current claim
        const score = d.consensus;
        if (score > 0.7) return '#22c55e'; // Green for high consensus
        if (score > 0.3) return '#f59e0b'; // Yellow for medium consensus
        return '#ef4444'; // Red for low consensus
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);
    
    // Add labels
    node.append("text")
      .text(d => d.text.substring(0, 30) + (d.text.length > 30 ? '...' : ''))
      .attr("dy", d => d.size + 15)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#374151");
    
    // Add consensus percentage
    node.append("text")
      .text(d => `${Math.round(d.consensus * 100)}%`)
      .attr("dy", 4)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .attr("fill", "white");
    
    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: GraphLink) => (d.source as GraphNode).x || 0)
        .attr("y1", (d: GraphLink) => (d.source as GraphNode).y || 0)
        .attr("x2", (d: GraphLink) => (d.target as GraphNode).x || 0)
        .attr("y2", (d: GraphLink) => (d.target as GraphNode).y || 0);
      
      node.attr("transform", (d: GraphNode) => `translate(${d.x || 0},${d.y || 0})`);
    });
    
    function dragstarted(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
  }, [data, height, claimId]);
  
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
          
          <div className="border rounded-lg overflow-hidden">
            <svg
              ref={svgRef}
              width="800"
              height={height}
              className="w-full"
            />
          </div>
          
          {selectedNode && (
            <div className="mt-4 p-4 border rounded-lg bg-slate-50">
              <h4 className="font-semibold mb-2">Selected Claim</h4>
              <p className="text-sm mb-2">{selectedNode.text}</p>
              <div className="flex gap-2">
                <Badge variant="outline">
                  Consensus: {Math.round(selectedNode.consensus * 100)}%
                </Badge>
                <a
                  href={`/claim/${selectedNode.slug}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Details →
                </a>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
