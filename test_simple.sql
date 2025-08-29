-- Simple test to update existing claims with metadata
-- This should work without any constraint issues

-- Update a few existing claims to test the approach
UPDATE claims SET metadata = '{"people": ["Dr. Sarah Kim", "Prof. Alex Chen"], "episode": "Augmented Reality Revolution", "episodeSlug": "ar-revolution"}' WHERE slug = 'ar-reality';

UPDATE claims SET metadata = '{"people": ["Dr. Elena Martinez"], "episode": "Self-Driving Future", "episodeSlug": "self-driving-future"}' WHERE slug = 'autonomous-vehicles';

UPDATE claims SET metadata = '{"people": ["Prof. James Wilson", "Dr. Sarah Mitchell"], "episode": "Robot Workers Era", "episodeSlug": "robot-workers-era"}' WHERE slug = 'robot-workers';

UPDATE claims SET metadata = '{"people": ["Dr. Elena Vasquez", "Prof. Marcus Chen"], "episode": "Neural Network Intelligence", "episodeSlug": "neural-intelligence"}' WHERE slug = 'neural-networks';

UPDATE claims SET metadata = '{"people": ["Prof. Lisa Rodriguez"], "episode": "Biological Computing", "episodeSlug": "bio-computing"}' WHERE slug = 'biocomputing';

-- Verify it worked
SELECT slug, title, metadata FROM claims WHERE metadata != '{}' LIMIT 5;
