-- 01_schema.sql: Core tables for claims graph

-- Claims/nodes table
CREATE TABLE IF NOT EXISTS claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  
  -- Graph positioning (precomputed)
  x FLOAT,
  y FLOAT,
  
  -- Node metadata
  node_size FLOAT DEFAULT 10,
  node_color TEXT DEFAULT '#666666',
  community_id INTEGER,
  
  -- Additional metadata
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}'
);

-- Edges between claims
CREATE TABLE IF NOT EXISTS claim_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES claims(id) ON DELETE CASCADE,
  target_id UUID REFERENCES claims(id) ON DELETE CASCADE,
  edge_type TEXT DEFAULT 'supports', -- supports, refutes, related
  weight FLOAT DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  
  UNIQUE(source_id, target_id, edge_type)
);

-- Clusters/communities for visual grouping
CREATE TABLE IF NOT EXISTS claim_clusters (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#888888',
  x FLOAT, -- Cluster centroid
  y FLOAT,
  node_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'
);

-- User bookmarks (client-side, but can sync)
CREATE TABLE IF NOT EXISTS user_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, claim_id)
);

-- Optional: Layout cache for different algorithms
CREATE TABLE IF NOT EXISTS claim_layouts (
  claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
  layout_type TEXT NOT NULL, -- 'forceatlas2', 'umap', 'tsne'
  x FLOAT NOT NULL,
  y FLOAT NOT NULL,
  computed_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY(claim_id, layout_type)
);
