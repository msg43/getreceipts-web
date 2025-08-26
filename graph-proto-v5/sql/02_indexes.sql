-- 02_indexes.sql: Performance indexes for graph queries

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