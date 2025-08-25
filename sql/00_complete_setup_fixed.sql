-- Complete Graph Setup - Run this entire file at once in Supabase SQL Editor
-- FIXED VERSION: Properly handles UUID type conversions

-- ============================================
-- STEP 1: CREATE TABLES
-- ============================================

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

-- ============================================
-- STEP 2: CREATE INDEXES
-- ============================================

-- Claims indexes
CREATE INDEX IF NOT EXISTS idx_claims_slug ON claims(slug);
CREATE INDEX IF NOT EXISTS idx_claims_created_at ON claims(created_at);
CREATE INDEX IF NOT EXISTS idx_claims_community ON claims(community_id);
CREATE INDEX IF NOT EXISTS idx_claims_tags ON claims USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_claims_metadata ON claims USING GIN(metadata);

-- Full text search on claims
CREATE INDEX IF NOT EXISTS idx_claims_search ON claims 
  USING GIN(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '')));

-- Edge indexes
CREATE INDEX IF NOT EXISTS idx_edges_source ON claim_edges(source_id);
CREATE INDEX IF NOT EXISTS idx_edges_target ON claim_edges(target_id);
CREATE INDEX IF NOT EXISTS idx_edges_type ON claim_edges(edge_type);
CREATE INDEX IF NOT EXISTS idx_edges_created_at ON claim_edges(created_at);

-- Composite index for efficient graph traversal
CREATE INDEX IF NOT EXISTS idx_edges_traversal ON claim_edges(source_id, target_id, edge_type);

-- Cluster indexes
CREATE INDEX IF NOT EXISTS idx_clusters_name ON claim_clusters(name);

-- Bookmark indexes
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON user_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_claim ON user_bookmarks(claim_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_created ON user_bookmarks(user_id, created_at DESC);

-- Layout cache indexes
CREATE INDEX IF NOT EXISTS idx_layouts_claim_type ON claim_layouts(claim_id, layout_type);

-- ============================================
-- STEP 3: CREATE RPC FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION get_subgraph(filters jsonb DEFAULT '{}')
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  search_query text;
  tag_filters text[];
  time_start timestamptz;
  time_end timestamptz;
  community_ids integer[];
  edge_types text[];
  limit_nodes integer;
BEGIN
  -- Extract filters
  search_query := filters->>'search';
  tag_filters := CASE 
    WHEN filters->'tags' IS NOT NULL 
    THEN ARRAY(SELECT jsonb_array_elements_text(filters->'tags'))
    ELSE NULL
  END;
  time_start := (filters->>'timeStart')::timestamptz;
  time_end := (filters->>'timeEnd')::timestamptz;
  community_ids := CASE
    WHEN filters->'communities' IS NOT NULL
    THEN ARRAY(SELECT (jsonb_array_elements_text(filters->'communities'))::integer)
    ELSE NULL
  END;
  edge_types := CASE
    WHEN filters->'edgeTypes' IS NOT NULL
    THEN ARRAY(SELECT jsonb_array_elements_text(filters->'edgeTypes'))
    ELSE ARRAY['supports', 'refutes', 'related']
  END;
  limit_nodes := COALESCE((filters->>'limit')::integer, 1000);

  -- Build result with filtered nodes, edges, and clusters
  WITH filtered_nodes AS (
    SELECT 
      c.id,
      c.slug,
      c.title,
      c.content,
      c.x,
      c.y,
      c.node_size,
      c.node_color,
      c.community_id,
      c.tags,
      c.metadata,
      c.created_at
    FROM claims c
    WHERE 1=1
      -- Text search
      AND (search_query IS NULL OR search_query = '' OR 
           to_tsvector('english', coalesce(c.title, '') || ' ' || coalesce(c.content, '')) 
           @@ plainto_tsquery('english', search_query))
      -- Tag filters
      AND (tag_filters IS NULL OR c.tags && tag_filters)
      -- Time range
      AND (time_start IS NULL OR c.created_at >= time_start)
      AND (time_end IS NULL OR c.created_at <= time_end)
      -- Community filter
      AND (community_ids IS NULL OR c.community_id = ANY(community_ids))
    ORDER BY c.created_at DESC
    LIMIT limit_nodes
  ),
  node_ids AS (
    SELECT array_agg(id) as ids FROM filtered_nodes
  ),
  filtered_edges AS (
    SELECT 
      e.id,
      e.source_id,
      e.target_id,
      e.edge_type,
      e.weight
    FROM claim_edges e, node_ids n
    WHERE e.source_id = ANY(n.ids) 
      AND e.target_id = ANY(n.ids)
      AND e.edge_type = ANY(edge_types)
  ),
  used_clusters AS (
    SELECT DISTINCT community_id 
    FROM filtered_nodes 
    WHERE community_id IS NOT NULL
  )
  SELECT jsonb_build_object(
    'nodes', COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'id', id::text,
          'slug', slug,
          'label', title,
          'title', title,
          'content', content,
          'x', x,
          'y', y,
          'size', node_size,
          'color', node_color,
          'community', community_id,
          'tags', tags,
          'metadata', metadata,
          'createdAt', created_at
        ) ORDER BY created_at DESC
      ) FROM filtered_nodes),
      '[]'::jsonb
    ),
    'edges', COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'id', id::text,
          'source', source_id::text,
          'target', target_id::text,
          'type', edge_type,
          'weight', weight
        )
      ) FROM filtered_edges),
      '[]'::jsonb
    ),
    'clusters', COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'id', cl.id,
          'name', cl.name,
          'color', cl.color,
          'x', cl.x,
          'y', cl.y,
          'nodeCount', cl.node_count
        )
      ) 
      FROM claim_clusters cl
      JOIN used_clusters uc ON cl.id = uc.community_id),
      '[]'::jsonb
    )
  ) INTO result;

  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_subgraph(jsonb) TO authenticated;

-- Add comment
COMMENT ON FUNCTION get_subgraph(jsonb) IS 'Returns filtered graph data with nodes, edges, and clusters based on provided filters';

-- ============================================
-- STEP 4: ENABLE ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_layouts ENABLE ROW LEVEL SECURITY;

-- Claims policies
CREATE POLICY "Claims are viewable by everyone" 
  ON claims FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create claims" 
  ON claims FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own claims" 
  ON claims FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own claims" 
  ON claims FOR DELETE 
  USING (auth.uid() = created_by);

-- Edges policies
CREATE POLICY "Edges are viewable by everyone" 
  ON claim_edges FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create edges" 
  ON claim_edges FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own edges" 
  ON claim_edges FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own edges" 
  ON claim_edges FOR DELETE 
  USING (auth.uid() = created_by);

-- Clusters policies
CREATE POLICY "Clusters are viewable by everyone" 
  ON claim_clusters FOR SELECT 
  USING (true);

-- Bookmarks policies
CREATE POLICY "Users can view own bookmarks" 
  ON user_bookmarks FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookmarks" 
  ON user_bookmarks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks" 
  ON user_bookmarks FOR DELETE 
  USING (auth.uid() = user_id);

-- Layouts policies
CREATE POLICY "Layouts are viewable by everyone" 
  ON claim_layouts FOR SELECT 
  USING (true);

-- ============================================
-- STEP 5: INSERT SAMPLE DATA (FIXED)
-- ============================================

-- Insert sample clusters
INSERT INTO claim_clusters (id, name, color, x, y, node_count) VALUES
  (1, 'Technology', '#3B82F6', -100, -50, 0),
  (2, 'Science', '#10B981', 100, -50, 0),
  (3, 'Philosophy', '#8B5CF6', 0, 100, 0),
  (4, 'Politics', '#EF4444', -100, 100, 0),
  (5, 'Economics', '#F59E0B', 100, 100, 0)
ON CONFLICT (id) DO NOTHING;

-- Insert sample claims
INSERT INTO claims (slug, title, content, x, y, node_size, node_color, community_id, tags) VALUES
  -- Technology cluster
  ('ai-consciousness', 'AI systems will achieve consciousness by 2050', 'Advanced neural networks show emergent properties suggesting consciousness', -120, -70, 15, '#3B82F6', 1, ARRAY['AI', 'consciousness', 'future']),
  ('quantum-computing', 'Quantum computing will break current encryption', 'RSA and similar encryption methods vulnerable to quantum attacks', -80, -60, 12, '#3B82F6', 1, ARRAY['quantum', 'security']),
  ('brain-interface', 'Brain-computer interfaces will be mainstream', 'Direct neural connections enabling thought-based control', -110, -30, 10, '#3B82F6', 1, ARRAY['neurotechnology', 'BCI']),
  
  -- Science cluster
  ('climate-tipping', 'Climate has passed critical tipping points', 'Multiple earth systems showing irreversible changes', 120, -80, 18, '#10B981', 2, ARRAY['climate', 'environment']),
  ('fusion-energy', 'Fusion energy is finally viable', 'Recent breakthroughs show net energy gain', 90, -50, 14, '#10B981', 2, ARRAY['energy', 'fusion']),
  ('crispr-ethics', 'CRISPR use requires stricter ethics', 'Gene editing capabilities outpacing regulatory frameworks', 110, -20, 11, '#10B981', 2, ARRAY['genetics', 'ethics']),
  
  -- Philosophy cluster
  ('free-will-illusion', 'Free will is an illusion', 'Neuroscience suggests all decisions are predetermined', -20, 90, 16, '#8B5CF6', 3, ARRAY['philosophy', 'neuroscience']),
  ('simulation-hypothesis', 'We live in a simulation', 'Statistical arguments for simulated reality', 20, 110, 13, '#8B5CF6', 3, ARRAY['philosophy', 'reality']),
  ('consciousness-hard', 'The hard problem of consciousness is unsolvable', 'Subjective experience cannot be reduced to physical processes', 0, 130, 15, '#8B5CF6', 3, ARRAY['philosophy', 'consciousness']),
  
  -- Politics cluster
  ('democracy-decline', 'Democracy is in global decline', 'Authoritarian systems gaining ground worldwide', -120, 90, 17, '#EF4444', 4, ARRAY['politics', 'democracy']),
  ('ubi-necessary', 'Universal Basic Income is necessary', 'Automation making UBI economically essential', -80, 110, 14, '#EF4444', 4, ARRAY['politics', 'economics', 'UBI']),
  ('privacy-dead', 'Privacy is effectively dead', 'Surveillance capitalism and state monitoring eliminate privacy', -100, 130, 12, '#EF4444', 4, ARRAY['privacy', 'surveillance']),
  
  -- Economics cluster
  ('crypto-replace-fiat', 'Cryptocurrency will replace fiat currency', 'Decentralized finance disrupting traditional banking', 80, 90, 15, '#F59E0B', 5, ARRAY['crypto', 'finance']),
  ('automation-unemployment', 'Automation will cause mass unemployment', 'AI and robotics displacing human workers', 120, 110, 16, '#F59E0B', 5, ARRAY['automation', 'employment']),
  ('degrowth-necessary', 'Economic degrowth is necessary', 'Infinite growth impossible on finite planet', 100, 130, 13, '#F59E0B', 5, ARRAY['economics', 'sustainability'])
ON CONFLICT (slug) DO NOTHING;

-- Insert sample edges (FIXED: Using explicit type casting)
WITH edge_data AS (
  SELECT 
    s.id::uuid as source_id,
    t.id::uuid as target_id,
    e.edge_type::text,
    e.weight::float
  FROM (VALUES
    -- AI consciousness connections
    ('ai-consciousness', 'brain-interface', 'supports', 0.8),
    ('ai-consciousness', 'free-will-illusion', 'related', 0.6),
    ('ai-consciousness', 'consciousness-hard', 'refutes', 0.7),
    
    -- Quantum and crypto
    ('quantum-computing', 'crypto-replace-fiat', 'refutes', 0.9),
    
    -- Climate and economics
    ('climate-tipping', 'degrowth-necessary', 'supports', 0.9),
    ('climate-tipping', 'fusion-energy', 'related', 0.5),
    
    -- Philosophy connections
    ('simulation-hypothesis', 'free-will-illusion', 'supports', 0.7),
    ('consciousness-hard', 'brain-interface', 'refutes', 0.6),
    
    -- Politics and economics
    ('ubi-necessary', 'automation-unemployment', 'supports', 0.9),
    ('democracy-decline', 'privacy-dead', 'related', 0.8),
    ('ubi-necessary', 'degrowth-necessary', 'refutes', 0.5),
    
    -- Technology and society
    ('brain-interface', 'privacy-dead', 'supports', 0.7),
    ('automation-unemployment', 'democracy-decline', 'related', 0.6),
    
    -- Science and ethics
    ('crispr-ethics', 'free-will-illusion', 'related', 0.5),
    ('fusion-energy', 'crypto-replace-fiat', 'related', 0.4)
  ) AS e(source_slug, target_slug, edge_type, weight)
  JOIN claims s ON s.slug = e.source_slug
  JOIN claims t ON t.slug = e.target_slug
)
INSERT INTO claim_edges (source_id, target_id, edge_type, weight)
SELECT source_id, target_id, edge_type, weight FROM edge_data
ON CONFLICT (source_id, target_id, edge_type) DO NOTHING;

-- Update cluster node counts
UPDATE claim_clusters SET node_count = (
  SELECT COUNT(*) FROM claims WHERE community_id = claim_clusters.id
);

-- ============================================
-- VERIFICATION
-- ============================================

-- Test the function
SELECT * FROM get_subgraph('{"limit": 5}');
