-- Add claim relationships after claims are inserted
-- Run this AFTER running safe_data_reset.sql

-- Wait a moment for the previous insertion to complete, then run this:

INSERT INTO claim_edges (source_id, target_id, edge_type, weight) VALUES
  -- AI consciousness and related tech connections
  ((SELECT id FROM claims WHERE slug = 'ai-consciousness'), (SELECT id FROM claims WHERE slug = 'brain-interface'), 'supports', 0.8),
  ((SELECT id FROM claims WHERE slug = 'neural-networks'), (SELECT id FROM claims WHERE slug = 'ai-consciousness'), 'supports', 0.9),
  ((SELECT id FROM claims WHERE slug = 'brain-uploading'), (SELECT id FROM claims WHERE slug = 'ai-consciousness'), 'supports', 0.7),
  ((SELECT id FROM claims WHERE slug = 'quantum-consciousness'), (SELECT id FROM claims WHERE slug = 'ai-consciousness'), 'related', 0.6),
  
  -- Automation and economic impacts
  ((SELECT id FROM claims WHERE slug = 'robot-workers'), (SELECT id FROM claims WHERE slug = 'automation-unemployment'), 'supports', 0.9),
  ((SELECT id FROM claims WHERE slug = 'ai-tutors'), (SELECT id FROM claims WHERE slug = 'automation-unemployment'), 'supports', 0.7),
  ((SELECT id FROM claims WHERE slug = 'autonomous-vehicles'), (SELECT id FROM claims WHERE slug = 'automation-unemployment'), 'supports', 0.8),
  ((SELECT id FROM claims WHERE slug = 'ubi-necessary'), (SELECT id FROM claims WHERE slug = 'automation-unemployment'), 'supports', 0.9),
  
  -- Climate and environment connections
  ((SELECT id FROM claims WHERE slug = 'climate-tipping'), (SELECT id FROM claims WHERE slug = 'geoengineering-necessary'), 'supports', 0.8),
  ((SELECT id FROM claims WHERE slug = 'biodiversity-collapse'), (SELECT id FROM claims WHERE slug = 'climate-tipping'), 'supports', 0.7),
  ((SELECT id FROM claims WHERE slug = 'carbon-capture'), (SELECT id FROM claims WHERE slug = 'climate-tipping'), 'refutes', 0.8),
  ((SELECT id FROM claims WHERE slug = 'renewable-transition'), (SELECT id FROM claims WHERE slug = 'fusion-energy'), 'related', 0.7),
  
  -- Consciousness and philosophy connections
  ((SELECT id FROM claims WHERE slug = 'free-will-illusion'), (SELECT id FROM claims WHERE slug = 'determinism-true'), 'supports', 0.9),
  ((SELECT id FROM claims WHERE slug = 'consciousness-measurement'), (SELECT id FROM claims WHERE slug = 'consciousness-hard'), 'refutes', 0.8),
  ((SELECT id FROM claims WHERE slug = 'panpsychism'), (SELECT id FROM claims WHERE slug = 'consciousness-hard'), 'refutes', 0.7),
  ((SELECT id FROM claims WHERE slug = 'simulation-hypothesis'), (SELECT id FROM claims WHERE slug = 'matrix-reality'), 'supports', 0.8),
  
  -- Medical and biological connections
  ((SELECT id FROM claims WHERE slug = 'gene-therapy'), (SELECT id FROM claims WHERE slug = 'aging-reversed'), 'supports', 0.8),
  ((SELECT id FROM claims WHERE slug = 'precision-medicine'), (SELECT id FROM claims WHERE slug = 'gene-therapy'), 'supports', 0.7),
  ((SELECT id FROM claims WHERE slug = 'crispr-ethics'), (SELECT id FROM claims WHERE slug = 'gene-therapy'), 'related', 0.6),
  ((SELECT id FROM claims WHERE slug = 'bioprinting-organs'), (SELECT id FROM claims WHERE slug = 'precision-medicine'), 'related', 0.7),
  
  -- Technology and society impacts
  ((SELECT id FROM claims WHERE slug = 'privacy-dead'), (SELECT id FROM claims WHERE slug = 'surveillance-state'), 'supports', 0.9),
  ((SELECT id FROM claims WHERE slug = 'social-media-harmful'), (SELECT id FROM claims WHERE slug = 'mental-health-epidemic'), 'supports', 0.8),
  ((SELECT id FROM claims WHERE slug = 'democracy-decline'), (SELECT id FROM claims WHERE slug = 'surveillance-state'), 'related', 0.6),
  
  -- Future space and technology
  ((SELECT id FROM claims WHERE slug = 'space-colonization'), (SELECT id FROM claims WHERE slug = 'asteroid-mining'), 'supports', 0.8),
  ((SELECT id FROM claims WHERE slug = 'fusion-energy'), (SELECT id FROM claims WHERE slug = 'space-colonization'), 'supports', 0.7),
  ((SELECT id FROM claims WHERE slug = 'interstellar-travel'), (SELECT id FROM claims WHERE slug = 'space-colonization'), 'related', 0.6),
  
  -- Economic system connections
  ((SELECT id FROM claims WHERE slug = 'crypto-replace-fiat'), (SELECT id FROM claims WHERE slug = 'wealth-inequality'), 'related', 0.5),
  ((SELECT id FROM claims WHERE slug = 'post-scarcity'), (SELECT id FROM claims WHERE slug = 'automation-unemployment'), 'refutes', 0.7),
  ((SELECT id FROM claims WHERE slug = 'degrowth-necessary'), (SELECT id FROM claims WHERE slug = 'post-scarcity'), 'refutes', 0.8),
  
  -- Speculative and wildcard connections
  ((SELECT id FROM claims WHERE slug = 'alien-contact'), (SELECT id FROM claims WHERE slug = 'life-on-mars'), 'related', 0.6),
  ((SELECT id FROM claims WHERE slug = 'dream-sharing'), (SELECT id FROM claims WHERE slug = 'brain-interface'), 'related', 0.7),
  ((SELECT id FROM claims WHERE slug = 'matrix-reality'), (SELECT id FROM claims WHERE slug = 'quantum-consciousness'), 'related', 0.6);

-- Verify the data was inserted correctly
SELECT 
  COUNT(*) as total_claims,
  COUNT(CASE WHEN metadata->>'people' IS NOT NULL AND metadata->>'people' != '[]' THEN 1 END) as claims_with_people,
  COUNT(CASE WHEN metadata->>'episode' IS NOT NULL THEN 1 END) as claims_with_episodes
FROM claims;

SELECT COUNT(*) as total_relationships FROM claim_edges;
