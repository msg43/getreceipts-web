// types.ts - Graph data types

export interface Node {
  id: string;
  slug: string;
  label: string;
  title: string;
  content?: string;
  x?: number;
  y?: number;
  size: number;
  color: string;
  community?: number;
  tags: string[];
  metadata: Record<string, any>;
  createdAt: string;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  type: 'supports' | 'refutes' | 'related';
  weight: number;
}

export interface Cluster {
  id: number;
  name: string;
  color: string;
  x?: number;
  y?: number;
  nodeCount: number;
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
  clusters: Cluster[];
}

export interface Filters {
  search?: string;
  tags?: string[];
  timeStart?: string;
  timeEnd?: string;
  communities?: number[];
  edgeTypes?: string[];
  limit?: number;
}

export interface Bookmark {
  id: string;
  slug: string;
  title: string;
  timestamp: number;
}

// For 3D graph positioning
export interface Node3D extends Node {
  fx?: number;
  fy?: number;
  fz?: number;
}

// Graph modes
export type GraphMode = '2D' | '3D';

// Selection state
export interface SelectionState {
  nodeId: string | null;
  node: Node | null;
}