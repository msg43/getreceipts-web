-- Safe Graph Setup - Handles existing objects gracefully
-- Run this entire file at once in Supabase SQL Editor

-- ============================================
-- STEP 1: CREATE TABLES (IF NOT EXISTS)
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

-- Claim edges table
CREATE TABLE IF NOT EXISTS claim_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  edge_type TEXT NOT NULL CHECK (edge_type IN ('supports', 'refutes', 'related')),
  weight FLOAT DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}'
);

-- Claim clusters table
CREATE TABLE IF NOT EXISTS claim_clusters (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#666666',
  x FLOAT,
  y FLOAT,
  node_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User bookmarks table
CREATE TABLE IF NOT EXISTS user_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, claim_id)
);

-- Claim layouts table (for caching different layout computations)
CREATE TABLE IF NOT EXISTS claim_layouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  layout_type TEXT NOT NULL DEFAULT 'force',
  x FLOAT NOT NULL,
  y FLOAT NOT NULL,
  z FLOAT DEFAULT 0,
  computed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(claim_id, layout_type)
);

-- ============================================
-- STEP 2: CREATE INDEXES (IF NOT EXISTS)
-- ============================================

-- Text search index
CREATE INDEX IF NOT EXISTS claims_search_idx ON claims USING gin(to_tsvector('english', title || ' ' || coalesce(content, '')));

-- Tag search index
CREATE INDEX IF NOT EXISTS claims_tags_idx ON claims USING gin(tags);

-- Time-based queries
CREATE INDEX IF NOT EXISTS claims_created_at_idx ON claims(created_at);

-- Graph traversal indexes
CREATE INDEX IF NOT EXISTS claim_edges_source_idx ON claim_edges(source_id);
CREATE INDEX IF NOT EXISTS claim_edges_target_idx ON claim_edges(target_id);
CREATE INDEX IF NOT EXISTS claim_edges_type_idx ON claim_edges(edge_type);

-- Community/cluster index
CREATE INDEX IF NOT EXISTS claims_community_idx ON claims(community_id);

-- Metadata search
CREATE INDEX IF NOT EXISTS claims_metadata_idx ON claims USING gin(metadata);

-- User bookmarks
CREATE INDEX IF NOT EXISTS user_bookmarks_user_idx ON user_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS user_bookmarks_claim_idx ON user_bookmarks(claim_id);

-- Layout cache
CREATE INDEX IF NOT EXISTS claim_layouts_claim_type_idx ON claim_layouts(claim_id, layout_type);

-- ============================================
-- STEP 3: CREATE OR REPLACE RPC FUNCTION
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

-- ============================================
-- STEP 4: DROP AND RECREATE POLICIES
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Claims are viewable by everyone" ON claims;
DROP POLICY IF EXISTS "Users can create claims" ON claims;
DROP POLICY IF EXISTS "Users can update their own claims" ON claims;
DROP POLICY IF EXISTS "Edges are viewable by everyone" ON claim_edges;
DROP POLICY IF EXISTS "Users can create edges" ON claim_edges;
DROP POLICY IF EXISTS "Users can update their own edges" ON claim_edges;
DROP POLICY IF EXISTS "Clusters are viewable by everyone" ON claim_clusters;
DROP POLICY IF EXISTS "Admin can manage clusters" ON claim_clusters;
DROP POLICY IF EXISTS "Users can view their own bookmarks" ON user_bookmarks;
DROP POLICY IF EXISTS "Users can manage their own bookmarks" ON user_bookmarks;
DROP POLICY IF EXISTS "Layouts are viewable by everyone" ON claim_layouts;
DROP POLICY IF EXISTS "Users can create layouts" ON claim_layouts;

-- Enable RLS
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_layouts ENABLE ROW LEVEL SECURITY;

-- Claims policies
CREATE POLICY "Claims are viewable by everyone" ON claims FOR SELECT USING (true);
CREATE POLICY "Users can create claims" ON claims FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own claims" ON claims FOR UPDATE USING (auth.uid() = created_by);

-- Edges policies
CREATE POLICY "Edges are viewable by everyone" ON claim_edges FOR SELECT USING (true);
CREATE POLICY "Users can create edges" ON claim_edges FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own edges" ON claim_edges FOR UPDATE USING (auth.uid() = created_by);

-- Clusters policies
CREATE POLICY "Clusters are viewable by everyone" ON claim_clusters FOR SELECT USING (true);
CREATE POLICY "Admin can manage clusters" ON claim_clusters FOR ALL USING (true);

-- Bookmarks policies
CREATE POLICY "Users can view their own bookmarks" ON user_bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own bookmarks" ON user_bookmarks FOR ALL USING (auth.uid() = user_id);

-- Layouts policies
CREATE POLICY "Layouts are viewable by everyone" ON claim_layouts FOR SELECT USING (true);
CREATE POLICY "Users can create layouts" ON claim_layouts FOR INSERT WITH CHECK (true);

-- ============================================
-- STEP 5: GRANT PERMISSIONS
-- ============================================

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_subgraph(jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION get_subgraph(jsonb) TO anon;

-- Grant table permissions
GRANT SELECT ON claims TO anon;
GRANT SELECT ON claim_edges TO anon;
GRANT SELECT ON claim_clusters TO anon;
GRANT SELECT ON claim_layouts TO anon;

GRANT ALL ON claims TO authenticated;
GRANT ALL ON claim_edges TO authenticated;
GRANT ALL ON claim_clusters TO authenticated;
GRANT ALL ON user_bookmarks TO authenticated;
GRANT ALL ON claim_layouts TO authenticated;

-- ============================================
-- STEP 6: INSERT SAMPLE DATA (IF EMPTY)
-- ============================================

-- Only insert sample data if tables are empty
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM claims LIMIT 1) THEN
    -- Insert clusters first
    INSERT INTO claim_clusters (id, name, color, x, y, node_count) VALUES
    (1, 'Technology', '#3B82F6', 100, 100, 3),
    (2, 'Science', '#10B981', 300, 150, 3),
    (3, 'Philosophy', '#8B5CF6', 200, 300, 3),
    (4, 'Politics', '#EF4444', 400, 200, 3),
    (5, 'Economics', '#F59E0B', 350, 350, 3);

    -- Insert sample claims
    INSERT INTO claims (slug, title, content, x, y, node_size, node_color, community_id, tags) VALUES
    ('ai-consciousness', 'AI systems may develop consciousness', 'As AI systems become more sophisticated, they might develop forms of consciousness similar to humans.', 120, 80, 15, '#3B82F6', 1, '{"AI", "consciousness", "technology"}'),
    ('quantum-computing-breakthrough', 'Quantum computing will revolutionize cryptography', 'Quantum computers will break current encryption methods but also enable new forms of secure communication.', 80, 120, 12, '#3B82F6', 1, '{"quantum", "cryptography", "security"}'),
    ('blockchain-energy', 'Blockchain technology is environmentally unsustainable', 'The energy consumption of blockchain networks like Bitcoin poses serious environmental concerns.', 160, 140, 10, '#3B82F6', 1, '{"blockchain", "environment", "energy"}'),
    
    ('climate-tipping-point', 'Climate change has irreversible tipping points', 'Certain climate changes, once triggered, cannot be reversed and will lead to cascading effects.', 320, 130, 18, '#10B981', 2, '{"climate", "environment", "tipping points"}'),
    ('gene-editing-ethics', 'CRISPR gene editing raises ethical concerns', 'The ability to edit human genes raises questions about equality, consent, and unintended consequences.', 280, 170, 14, '#10B981', 2, '{"genetics", "ethics", "CRISPR"}'),
    ('dark-matter-theory', 'Dark matter explains galactic rotation curves', 'The existence of dark matter best explains why galaxies rotate faster than predicted by visible matter alone.', 340, 180, 11, '#10B981', 2, '{"physics", "dark matter", "galaxies"}'),
    
    ('free-will-illusion', 'Free will is an illusion created by consciousness', 'Neuroscience suggests that decisions are made unconsciously before we become aware of them.', 180, 280, 16, '#8B5CF6', 3, '{"philosophy", "free will", "consciousness"}'),
    ('meaning-of-life', 'Life has no inherent meaning beyond what we create', 'Existentialist philosophy argues that we must create our own meaning in an inherently meaningless universe.', 220, 320, 13, '#8B5CF6', 3, '{"philosophy", "existentialism", "meaning"}'),
    ('consciousness-emergence', 'Consciousness emerges from complex neural networks', 'Consciousness is not a fundamental property but emerges from the complex interactions of neurons.', 200, 240, 12, '#8B5CF6', 3, '{"consciousness", "neuroscience", "emergence"}'),
    
    ('democracy-crisis', 'Democratic institutions are failing worldwide', 'Rising authoritarianism and polarization threaten democratic governance globally.', 420, 180, 17, '#EF4444', 4, '{"democracy", "politics", "authoritarianism"}'),
    ('universal-basic-income', 'Universal Basic Income will reduce inequality', 'UBI could address job displacement from automation while reducing poverty and inequality.', 380, 220, 14, '#EF4444', 4, '{"UBI", "inequality", "automation"}'),
    ('social-media-democracy', 'Social media undermines democratic discourse', 'Algorithmic echo chambers and misinformation on social platforms weaken democratic debate.', 440, 240, 15, '#EF4444', 4, '{"social media", "democracy", "misinformation"}'),
    
    ('cryptocurrency-future', 'Cryptocurrencies will replace traditional banking', 'Decentralized finance will make traditional banking institutions obsolete.', 330, 330, 13, '#F59E0B', 5, '{"cryptocurrency", "banking", "DeFi"}'),
    ('automation-unemployment', 'Automation will cause mass unemployment', 'AI and robotics will eliminate more jobs than they create, requiring new economic models.', 370, 370, 16, '#F59E0B', 5, '{"automation", "unemployment", "economics"}'),
    ('wealth-inequality', 'Wealth inequality threatens social stability', 'Growing wealth gaps between rich and poor will lead to social unrest and political instability.', 390, 310, 15, '#F59E0B', 5, '{"inequality", "wealth", "social stability"}');

    -- Insert sample edges (relationships between claims)
    INSERT INTO claim_edges (source_id, target_id, edge_type, weight) 
    SELECT 
      s.id as source_id,
      t.id as target_id,
      edge_data.edge_type,
      edge_data.weight
    FROM claims s, claims t,
    (VALUES 
      ('ai-consciousness', 'consciousness-emergence', 'supports', 0.8),
      ('ai-consciousness', 'free-will-illusion', 'related', 0.6),
      ('quantum-computing-breakthrough', 'cryptocurrency-future', 'supports', 0.7),
      ('blockchain-energy', 'climate-tipping-point', 'supports', 0.9),
      ('gene-editing-ethics', 'free-will-illusion', 'related', 0.5),
      ('climate-tipping-point', 'wealth-inequality', 'supports', 0.6),
      ('democracy-crisis', 'social-media-democracy', 'supports', 0.8),
      ('universal-basic-income', 'automation-unemployment', 'supports', 0.9),
      ('automation-unemployment', 'wealth-inequality', 'supports', 0.7),
      ('cryptocurrency-future', 'universal-basic-income', 'related', 0.6),
      ('consciousness-emergence', 'meaning-of-life', 'related', 0.7),
      ('dark-matter-theory', 'meaning-of-life', 'refutes', 0.4)
    ) AS edge_data(source_slug, target_slug, edge_type, weight)
    WHERE s.slug = edge_data.source_slug AND t.slug = edge_data.target_slug;

    RAISE NOTICE 'Sample data inserted successfully';
  ELSE
    RAISE NOTICE 'Sample data already exists, skipping insertion';
  END IF;
END $$;

-- ============================================
-- VERIFICATION
-- ============================================

-- Test the function
DO $$
DECLARE
  test_result jsonb;
BEGIN
  SELECT get_subgraph('{}') INTO test_result;
  RAISE NOTICE 'Function test successful. Found % nodes', jsonb_array_length(test_result->'nodes');
END $$;
