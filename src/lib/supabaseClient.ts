// supabaseClient.ts - Supabase client setup

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a dummy client if credentials are missing to prevent import errors
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

// Type for the RPC function response
export interface SubgraphResponse {
  nodes: Array<{
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
    metadata: Record<string, string | number | boolean | null>;
    createdAt: string;
    type?: 'person' | 'source' | 'claim';
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    type: 'supports' | 'refutes' | 'related';
    weight: number;
  }>;
  clusters: Array<{
    id: number;
    name: string;
    color: string;
    x?: number;
    y?: number;
    nodeCount: number;
  }>;
}