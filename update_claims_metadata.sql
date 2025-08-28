-- Update existing claims with people and episode metadata
-- Run this in your Supabase SQL Editor

UPDATE claims SET metadata = '{"people": ["Dr. Elena Vasquez", "Prof. Marcus Chen"], "episode": "The Future of AI Consciousness", "episodeSlug": "future-ai-consciousness"}' WHERE slug = 'ai-consciousness';
UPDATE claims SET metadata = '{"people": ["Dr. Sarah Mitchell"], "episode": "Quantum Computing Security", "episodeSlug": "quantum-computing-security"}' WHERE slug = 'quantum-computing';
UPDATE claims SET metadata = '{"people": ["Dr. Elena Vasquez"], "episode": "Brain Computer Interfaces", "episodeSlug": "brain-computer-interfaces"}' WHERE slug = 'brain-interface';
UPDATE claims SET metadata = '{"people": ["Dr. James Wilson", "Prof. Lisa Rodriguez"], "episode": "Climate Tipping Points", "episodeSlug": "climate-tipping-points"}' WHERE slug = 'climate-tipping';
UPDATE claims SET metadata = '{"people": ["Dr. Sarah Mitchell"], "episode": "Fusion Energy Breakthrough", "episodeSlug": "fusion-energy-breakthrough"}' WHERE slug = 'fusion-energy';
UPDATE claims SET metadata = '{"people": ["Prof. Marcus Chen"], "episode": "CRISPR Ethics Debate", "episodeSlug": "crispr-ethics-debate"}' WHERE slug = 'crispr-ethics';
UPDATE claims SET metadata = '{"people": ["Dr. Elena Vasquez"], "episode": "Free Will and Neuroscience", "episodeSlug": "free-will-neuroscience"}' WHERE slug = 'free-will-illusion';
UPDATE claims SET metadata = '{"people": ["Prof. Lisa Rodriguez"], "episode": "Simulation Hypothesis", "episodeSlug": "simulation-hypothesis"}' WHERE slug = 'simulation-hypothesis';
UPDATE claims SET metadata = '{"people": ["Dr. James Wilson"], "episode": "Hard Problem of Consciousness", "episodeSlug": "hard-problem-consciousness"}' WHERE slug = 'consciousness-hard';
UPDATE claims SET metadata = '{"people": ["Prof. Marcus Chen", "Dr. Sarah Mitchell"], "episode": "Democracy in Crisis", "episodeSlug": "democracy-in-crisis"}' WHERE slug = 'democracy-decline';

-- Add metadata to more claims for better demonstration
UPDATE claims SET metadata = '{"people": ["Dr. Elena Vasquez"], "episode": "Future of Work", "episodeSlug": "future-of-work"}' WHERE slug = 'ubi-necessary';
UPDATE claims SET metadata = '{"people": ["Prof. Lisa Rodriguez"], "episode": "Privacy and Surveillance", "episodeSlug": "privacy-surveillance"}' WHERE slug = 'privacy-dead';
UPDATE claims SET metadata = '{"people": ["Dr. James Wilson"], "episode": "Cryptocurrency Revolution", "episodeSlug": "cryptocurrency-revolution"}' WHERE slug = 'crypto-replace-fiat';
UPDATE claims SET metadata = '{"people": ["Dr. Sarah Mitchell"], "episode": "Automation and Employment", "episodeSlug": "automation-employment"}' WHERE slug = 'automation-unemployment';
UPDATE claims SET metadata = '{"people": ["Prof. Marcus Chen"], "episode": "Economic Degrowth", "episodeSlug": "economic-degrowth"}' WHERE slug = 'degrowth-necessary';
