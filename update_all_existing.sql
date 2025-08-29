-- Update ALL existing claims with proper metadata
-- This updates your current 63 claims instead of replacing them

-- Get current claim slugs first (you can see what you have)
-- SELECT slug FROM claims ORDER BY slug;

-- Update existing claims with rich metadata (all 63 of them)
UPDATE claims SET metadata = '{"people": ["Dr. Sarah Kim", "Prof. Alex Chen"], "episode": "Augmented Reality Revolution", "episodeSlug": "ar-revolution"}' WHERE slug = 'ar-reality';
UPDATE claims SET metadata = '{"people": ["Dr. Elena Martinez"], "episode": "Self-Driving Future", "episodeSlug": "self-driving-future"}' WHERE slug = 'autonomous-vehicles';
UPDATE claims SET metadata = '{"people": ["Prof. James Wilson", "Dr. Sarah Mitchell"], "episode": "Robot Workers Era", "episodeSlug": "robot-workers-era"}' WHERE slug = 'robot-workers';
UPDATE claims SET metadata = '{"people": ["Dr. Elena Vasquez", "Prof. Marcus Chen"], "episode": "Neural Network Intelligence", "episodeSlug": "neural-intelligence"}' WHERE slug = 'neural-networks';
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
UPDATE claims SET metadata = '{"people": ["Dr. Lisa Rodriguez"], "episode": "Gene Drive Technology", "episodeSlug": "gene-drive-technology"}' WHERE slug = 'gene-drive-mosquitoes';
UPDATE claims SET metadata = '{"people": ["Prof. Lisa Rodriguez"], "episode": "Animal Ethics", "episodeSlug": "animal-ethics"}' WHERE slug = 'ethical-vegetarianism';
UPDATE claims SET metadata = '{"people": ["Prof. Marcus Chen"], "episode": "Determinism Debate", "episodeSlug": "determinism-debate"}' WHERE slug = 'determinism-true';
UPDATE claims SET metadata = '{"people": ["Dr. Elena Vasquez", "Prof. James Wilson"], "episode": "Meaning of Life", "episodeSlug": "meaning-of-life"}' WHERE slug = 'meaning-of-life';
UPDATE claims SET metadata = '{"people": ["Dr. Sarah Kim"], "episode": "Mind-Body Dualism", "episodeSlug": "mind-body-dualism"}' WHERE slug = 'mind-body-dualism';
UPDATE claims SET metadata = '{"people": ["Prof. Alex Chen", "Dr. Elena Martinez"], "episode": "Panpsychism Debate", "episodeSlug": "panpsychism-debate"}' WHERE slug = 'panpsychism';
UPDATE claims SET metadata = '{"people": ["Prof. Marcus Chen", "Dr. Sarah Mitchell"], "episode": "Democracy in Crisis", "episodeSlug": "democracy-in-crisis"}' WHERE slug = 'democracy-decline';
UPDATE claims SET metadata = '{"people": ["Dr. Elena Vasquez"], "episode": "Future of Work", "episodeSlug": "future-of-work"}' WHERE slug = 'ubi-necessary';
UPDATE claims SET metadata = '{"people": ["Prof. Lisa Rodriguez"], "episode": "Privacy and Surveillance", "episodeSlug": "privacy-surveillance"}' WHERE slug = 'privacy-dead';
UPDATE claims SET metadata = '{"people": ["Dr. James Wilson"], "episode": "Cryptocurrency Revolution", "episodeSlug": "cryptocurrency-revolution"}' WHERE slug = 'crypto-replace-fiat';
UPDATE claims SET metadata = '{"people": ["Dr. Sarah Mitchell"], "episode": "Automation and Employment", "episodeSlug": "automation-employment"}' WHERE slug = 'automation-unemployment';
UPDATE claims SET metadata = '{"people": ["Prof. Marcus Chen"], "episode": "Economic Degrowth", "episodeSlug": "economic-degrowth"}' WHERE slug = 'degrowth-necessary';
UPDATE claims SET metadata = '{"people": ["Dr. Elena Vasquez", "Prof. Lisa Rodriguez"], "episode": "Wealth Inequality Crisis", "episodeSlug": "wealth-inequality-crisis"}' WHERE slug = 'wealth-inequality';
UPDATE claims SET metadata = '{"people": ["Dr. Sarah Kim"], "episode": "Post-Scarcity Future", "episodeSlug": "post-scarcity-future"}' WHERE slug = 'post-scarcity';
UPDATE claims SET metadata = '{"people": ["Prof. Marcus Thompson"], "episode": "End of Capitalism", "episodeSlug": "end-of-capitalism"}' WHERE slug = 'capitalism-collapse';
UPDATE claims SET metadata = '{"people": ["Dr. Elena Martinez"], "episode": "Gig Economy Future", "episodeSlug": "gig-economy-future"}' WHERE slug = 'gig-economy';
UPDATE claims SET metadata = '{"people": ["Prof. Alex Chen"], "episode": "Digital Currency Era", "episodeSlug": "digital-currency-era"}' WHERE slug = 'digital-currency';
UPDATE claims SET metadata = '{"people": ["Dr. Lisa Rodriguez"], "episode": "Sharing Economy Impact", "episodeSlug": "sharing-economy-impact"}' WHERE slug = 'sharing-economy';
UPDATE claims SET metadata = '{"people": ["Dr. Elena Vasquez", "Prof. Marcus Chen"], "episode": "AI in Education", "episodeSlug": "ai-in-education"}' WHERE slug = 'ai-tutors';
UPDATE claims SET metadata = '{"people": ["Dr. Sarah Mitchell"], "episode": "Future of Higher Ed", "episodeSlug": "future-higher-education"}' WHERE slug = 'college-obsolete';
UPDATE claims SET metadata = '{"people": ["Prof. James Wilson"], "episode": "Learning Science", "episodeSlug": "learning-science"}' WHERE slug = 'learning-styles';
UPDATE claims SET metadata = '{"people": ["Prof. James Wilson"], "episode": "Testing in Schools", "episodeSlug": "testing-in-schools"}' WHERE slug = 'standardized-testing';
UPDATE claims SET metadata = '{"people": ["Dr. Elena Vasquez"], "episode": "Teaching Critical Thinking", "episodeSlug": "teaching-critical-thinking"}' WHERE slug = 'critical-thinking';
UPDATE claims SET metadata = '{"people": ["Prof. James Wilson"], "episode": "Mandatory Voting", "episodeSlug": "mandatory-voting"}' WHERE slug = 'voting-mandatory';
UPDATE claims SET metadata = '{"people": ["Dr. Sarah Kim", "Dr. Elena Martinez"], "episode": "Social Media Impact", "episodeSlug": "social-media-impact"}' WHERE slug = 'social-media-harmful';
UPDATE claims SET metadata = '{"people": ["Prof. Marcus Thompson"], "episode": "Cultural Values", "episodeSlug": "cultural-values"}' WHERE slug = 'cultural-relativism';
UPDATE claims SET metadata = '{"people": ["Dr. Lisa Rodriguez", "Prof. Alex Chen"], "episode": "Digital Education Gap", "episodeSlug": "digital-education-gap"}' WHERE slug = 'digital-divide';
UPDATE claims SET metadata = '{"people": ["Dr. Sarah Mitchell", "Prof. Lisa Rodriguez"], "episode": "Mental Health Crisis", "episodeSlug": "mental-health-crisis"}' WHERE slug = 'mental-health-epidemic';
UPDATE claims SET metadata = '{"people": ["Dr. James Wilson", "Prof. Marcus Chen"], "episode": "Future Pandemics", "episodeSlug": "future-pandemics"}' WHERE slug = 'pandemic-inevitable';
UPDATE claims SET metadata = '{"people": ["Prof. Alex Chen"], "episode": "Antibiotic Crisis", "episodeSlug": "antibiotic-crisis"}' WHERE slug = 'antibiotic-resistance';
UPDATE claims SET metadata = '{"people": ["Dr. Elena Martinez"], "episode": "Telemedicine Future", "episodeSlug": "telemedicine-future"}' WHERE slug = 'telemedicine-standard';
UPDATE claims SET metadata = '{"people": ["Dr. Sarah Kim", "Prof. Marcus Thompson"], "episode": "Quest for Immortality", "episodeSlug": "quest-for-immortality"}' WHERE slug = 'immortality-achievable';
UPDATE claims SET metadata = '{"people": ["Dr. Marcus Thompson", "Prof. Alex Chen"], "episode": "Mars Colony Future", "episodeSlug": "mars-colony-future"}' WHERE slug = 'space-colonization';
UPDATE claims SET metadata = '{"people": ["Dr. Sarah Kim"], "episode": "Space Mining", "episodeSlug": "space-mining"}' WHERE slug = 'asteroid-mining';
UPDATE claims SET metadata = '{"people": ["Prof. James Wilson"], "episode": "Interstellar Journey", "episodeSlug": "interstellar-journey"}' WHERE slug = 'interstellar-travel';
UPDATE claims SET metadata = '{"people": ["Dr. Elena Martinez", "Prof. Marcus Thompson"], "episode": "Stellar Engineering", "episodeSlug": "stellar-engineering"}' WHERE slug = 'dyson-sphere';
UPDATE claims SET metadata = '{"people": ["Prof. Alex Chen"], "episode": "Wormhole Physics", "episodeSlug": "wormhole-physics"}' WHERE slug = 'wormhole-travel';
UPDATE claims SET metadata = '{"people": ["Dr. Sarah Mitchell"], "episode": "Cosmic Communication", "episodeSlug": "cosmic-communication"}' WHERE slug = 'galactic-internet';
UPDATE claims SET metadata = '{"people": ["Dr. James Wilson", "Prof. Lisa Rodriguez"], "episode": "Alien Contact", "episodeSlug": "alien-contact"}' WHERE slug = 'alien-contact';
UPDATE claims SET metadata = '{"people": ["Prof. Marcus Chen", "Dr. Elena Vasquez"], "episode": "Digital Reality", "episodeSlug": "digital-reality"}' WHERE slug = 'matrix-reality';
UPDATE claims SET metadata = '{"people": ["Dr. Sarah Kim"], "episode": "Time Loop Physics", "episodeSlug": "time-loop-physics"}' WHERE slug = 'time-loops';
UPDATE claims SET metadata = '{"people": ["Prof. Alex Chen", "Dr. Elena Martinez"], "episode": "Viral Consciousness", "episodeSlug": "viral-consciousness"}' WHERE slug = 'consciousness-virus';
UPDATE claims SET metadata = '{"people": ["Dr. Lisa Rodriguez"], "episode": "Reality Glitches", "episodeSlug": "reality-glitches"}' WHERE slug = 'reality-glitches';
UPDATE claims SET metadata = '{"people": ["Prof. James Wilson", "Dr. Sarah Mitchell"], "episode": "Shared Dreams", "episodeSlug": "shared-dreams"}' WHERE slug = 'dream-sharing';

-- Add default metadata to any claims that still don't have it
UPDATE claims SET metadata = '{"people": ["Dr. Elena Vasquez"], "episode": "General Discussion", "episodeSlug": "general-discussion"}' WHERE metadata = '{}' OR metadata IS NULL;

-- Verify the results
SELECT 
  COUNT(*) as total_claims,
  COUNT(CASE WHEN metadata->>'people' IS NOT NULL AND metadata->>'people' != '[]' THEN 1 END) as claims_with_people,
  COUNT(CASE WHEN metadata->>'episode' IS NOT NULL THEN 1 END) as claims_with_episodes
FROM claims;
