-- 05_sample_data.sql: Sample data for testing the graph visualization

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

-- Insert sample edges
INSERT INTO claim_edges (source_id, target_id, edge_type, weight) 
SELECT 
  s.id, t.id, e.edge_type, e.weight
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
ON CONFLICT (source_id, target_id, edge_type) DO NOTHING;

-- Update cluster node counts
UPDATE claim_clusters SET node_count = (
  SELECT COUNT(*) FROM claims WHERE community_id = claim_clusters.id
);

-- Add a sample bookmark (requires auth user - will fail if no user logged in)
-- INSERT INTO user_bookmarks (user_id, claim_id)
-- SELECT auth.uid(), id FROM claims WHERE slug = 'ai-consciousness'
-- WHERE auth.uid() IS NOT NULL
-- ON CONFLICT DO NOTHING;