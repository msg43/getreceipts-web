-- Update existing claims with people and episode metadata
-- Run this in your Supabase SQL Editor
-- These are the ACTUAL claim slugs in your database

UPDATE claims SET metadata = '{"people": ["Dr. Sarah Kim", "Prof. Alex Chen"], "episode": "Augmented Reality Revolution", "episodeSlug": "ar-revolution"}' WHERE slug = 'ar-reality';
UPDATE claims SET metadata = '{"people": ["Dr. Elena Martinez"], "episode": "Self-Driving Future", "episodeSlug": "self-driving-future"}' WHERE slug = 'autonomous-vehicles';
UPDATE claims SET metadata = '{"people": ["Prof. James Wilson", "Dr. Sarah Kim"], "episode": "Robot Workers Era", "episodeSlug": "robot-workers-era"}' WHERE slug = 'robot-workers';
UPDATE claims SET metadata = '{"people": ["Dr. Elena Martinez", "Prof. Alex Chen"], "episode": "Neural Network Intelligence", "episodeSlug": "neural-intelligence"}' WHERE slug = 'neural-networks';
UPDATE claims SET metadata = '{"people": ["Prof. Lisa Rodriguez"], "episode": "Biological Computing", "episodeSlug": "bio-computing"}' WHERE slug = 'biocomputing';
UPDATE claims SET metadata = '{"people": ["Dr. Marcus Thompson"], "episode": "Space Internet", "episodeSlug": "space-internet"}' WHERE slug = 'space-internet';
UPDATE claims SET metadata = '{"people": ["Dr. Sarah Kim"], "episode": "Holographic Displays", "episodeSlug": "holographic-displays"}' WHERE slug = 'holographic-displays';
UPDATE claims SET metadata = '{"people": ["Prof. Alex Chen", "Dr. Elena Martinez"], "episode": "Digital Immortality", "episodeSlug": "digital-immortality"}' WHERE slug = 'brain-uploading';
UPDATE claims SET metadata = '{"people": ["Prof. James Wilson"], "episode": "Metamaterials Science", "episodeSlug": "metamaterials-science"}' WHERE slug = 'metamaterials';
UPDATE claims SET metadata = '{"people": ["Dr. Lisa Rodriguez"], "episode": "6G Telepathy", "episodeSlug": "6g-telepathy"}' WHERE slug = '6g-telepathy';
UPDATE claims SET metadata = '{"people": ["Prof. Marcus Thompson"], "episode": "Dark Matter Mystery", "episodeSlug": "dark-matter-mystery"}' WHERE slug = 'dark-matter-solved';
UPDATE claims SET metadata = '{"people": ["Dr. Sarah Kim", "Prof. Alex Chen"], "episode": "Life on Mars", "episodeSlug": "life-on-mars"}' WHERE slug = 'life-on-mars';
UPDATE claims SET metadata = '{"people": ["Dr. Elena Martinez"], "episode": "Reversing Aging", "episodeSlug": "reversing-aging"}' WHERE slug = 'aging-reversed';
UPDATE claims SET metadata = '{"people": ["Prof. James Wilson"], "episode": "Superconductor Breakthrough", "episodeSlug": "superconductor-breakthrough"}' WHERE slug = 'room-temperature-superconductor';
UPDATE claims SET metadata = '{"people": ["Dr. Lisa Rodriguez", "Prof. Marcus Thompson"], "episode": "Carbon Tax Policy", "episodeSlug": "carbon-tax-policy"}' WHERE slug = 'carbon-tax';
UPDATE claims SET metadata = '{"people": ["Dr. Sarah Kim"], "episode": "Measuring Consciousness", "episodeSlug": "measuring-consciousness"}' WHERE slug = 'consciousness-measurement';
UPDATE claims SET metadata = '{"people": ["Prof. Alex Chen"], "episode": "Time Travel Physics", "episodeSlug": "time-travel-physics"}' WHERE slug = 'time-travel-possible';
UPDATE claims SET metadata = '{"people": ["Dr. Elena Martinez", "Prof. James Wilson"], "episode": "Parallel Universes", "episodeSlug": "parallel-universes"}' WHERE slug = 'parallel-universes';
UPDATE claims SET metadata = '{"people": ["Dr. Lisa Rodriguez"], "episode": "Synthetic Biology", "episodeSlug": "synthetic-biology"}' WHERE slug = 'synthetic-biology';
UPDATE claims SET metadata = '{"people": ["Prof. Marcus Thompson", "Dr. Sarah Kim"], "episode": "Quantum Consciousness", "episodeSlug": "quantum-consciousness"}' WHERE slug = 'quantum-consciousness';
