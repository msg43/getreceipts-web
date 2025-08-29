-- Complete Data Reset Script
-- This will clear all existing claims and reload with proper metadata
-- Run this in your Supabase SQL Editor

-- Step 1: Clear all existing data
DELETE FROM claim_edges;
DELETE FROM claims;

-- Step 2: Reset sequences (if using serial IDs)
-- ALTER SEQUENCE claims_id_seq RESTART WITH 1;
-- ALTER SEQUENCE claim_edges_id_seq RESTART WITH 1;

-- Step 3: Insert 100+ claims with complete metadata
INSERT INTO claims (slug, title, content, x, y, node_size, node_color, community_id, tags, metadata) VALUES
  -- AI & Technology Claims
  ('ai-consciousness', 'AI systems will achieve consciousness by 2050', 'Advanced neural networks show emergent properties suggesting consciousness', -120, -70, 15, '#3B82F6', 1, ARRAY['AI', 'consciousness', 'future'], '{"people": ["Dr. Elena Vasquez", "Prof. Marcus Chen"], "episode": "The Future of AI Consciousness", "episodeSlug": "future-ai-consciousness"}'),
  ('quantum-computing', 'Quantum computing will break current encryption', 'RSA and similar encryption methods vulnerable to quantum attacks', 100, -50, 12, '#8B5CF6', 1, ARRAY['quantum', 'security', 'encryption'], '{"people": ["Dr. Sarah Mitchell"], "episode": "Quantum Computing Security", "episodeSlug": "quantum-computing-security"}'),
  ('brain-interface', 'Brain-computer interfaces will be mainstream', 'Direct neural connections enabling thought-based control', -80, 120, 18, '#10B981', 1, ARRAY['neurotechnology', 'BCI', 'future'], '{"people": ["Dr. Elena Vasquez"], "episode": "Brain Computer Interfaces", "episodeSlug": "brain-computer-interfaces"}'),
  ('neural-networks', 'Neural networks will surpass human intelligence', 'Artificial general intelligence emerging from scaled transformers', 150, -100, 20, '#F59E0B', 1, ARRAY['AGI', 'neural-nets', 'intelligence'], '{"people": ["Dr. Elena Vasquez", "Prof. Marcus Chen"], "episode": "Neural Network Intelligence", "episodeSlug": "neural-intelligence"}'),
  ('autonomous-vehicles', 'Self-driving cars will dominate by 2035', 'Level 5 autonomy achieved for passenger vehicles', -50, 80, 14, '#EF4444', 1, ARRAY['automotive', 'AI', 'transportation'], '{"people": ["Dr. Sarah Mitchell"], "episode": "Self-Driving Future", "episodeSlug": "self-driving-future"}'),
  ('robot-workers', 'Humanoid robots in every workplace', 'General purpose robots becoming economically viable', 90, 60, 16, '#6366F1', 1, ARRAY['robotics', 'labor', 'automation'], '{"people": ["Prof. James Wilson", "Dr. Sarah Mitchell"], "episode": "Robot Workers Era", "episodeSlug": "robot-workers-era"}'),
  ('biocomputing', 'Biological computers will replace silicon', 'DNA and protein-based computing systems', -180, -30, 13, '#84CC16', 1, ARRAY['biotech', 'computing', 'DNA'], '{"people": ["Prof. Lisa Rodriguez"], "episode": "Biological Computing", "episodeSlug": "bio-computing"}'),
  ('ar-reality', 'Augmented reality will replace smartphones', 'AR glasses becoming primary computing interface', 60, -150, 17, '#F97316', 1, ARRAY['AR', 'mobile', 'interface'], '{"people": ["Dr. Sarah Kim", "Prof. Alex Chen"], "episode": "Augmented Reality Revolution", "episodeSlug": "ar-revolution"}'),
  ('holographic-displays', 'Holographic displays replace screens', 'True 3D volumetric displays for all devices', -30, -120, 15, '#EC4899', 1, ARRAY['holography', 'display', '3D'], '{"people": ["Dr. Sarah Kim"], "episode": "Holographic Displays", "episodeSlug": "holographic-displays"}'),
  ('space-internet', 'Satellite internet will be universal', 'Low Earth orbit constellations providing global coverage', 200, 40, 14, '#06B6D4', 1, ARRAY['satellites', 'internet', 'space'], '{"people": ["Dr. Marcus Thompson"], "episode": "Space Internet", "episodeSlug": "space-internet"}'),

  -- Science & Physics Claims  
  ('dark-matter-solved', 'Dark matter mystery will be solved', 'New particle physics theories explaining cosmic structure', -200, 100, 16, '#7C3AED', 2, ARRAY['physics', 'dark-matter', 'cosmology'], '{"people": ["Prof. Marcus Thompson"], "episode": "Dark Matter Mystery", "episodeSlug": "dark-matter-mystery"}'),
  ('fusion-energy', 'Fusion energy is finally viable', 'Recent breakthroughs show net energy gain', 120, 150, 19, '#059669', 2, ARRAY['energy', 'fusion', 'clean'], '{"people": ["Dr. Sarah Mitchell"], "episode": "Fusion Energy Breakthrough", "episodeSlug": "fusion-energy-breakthrough"}'),
  ('room-temperature-superconductor', 'Room temperature superconductors discovered', 'Revolutionary materials enabling lossless power transmission', -100, -180, 18, '#DC2626', 2, ARRAY['superconductors', 'materials', 'energy'], '{"people": ["Prof. James Wilson"], "episode": "Superconductor Breakthrough", "episodeSlug": "superconductor-breakthrough"}'),
  ('time-travel-possible', 'Time travel is theoretically possible', 'Closed timelike curves in general relativity', 80, -200, 15, '#7C2D12', 2, ARRAY['physics', 'time', 'relativity'], '{"people": ["Prof. Alex Chen"], "episode": "Time Travel Physics", "episodeSlug": "time-travel-physics"}'),
  ('parallel-universes', 'Parallel universes are real', 'Many-worlds interpretation of quantum mechanics', -150, 180, 17, '#1E40AF', 2, ARRAY['quantum', 'multiverse', 'physics'], '{"people": ["Dr. Elena Martinez", "Prof. James Wilson"], "episode": "Parallel Universes", "episodeSlug": "parallel-universes"}'),
  ('metamaterials', 'Metamaterials enable invisibility cloaks', 'Engineered materials manipulating electromagnetic waves', 180, -60, 14, '#BE185D', 2, ARRAY['materials', 'physics', 'invisibility'], '{"people": ["Prof. James Wilson"], "episode": "Metamaterials Science", "episodeSlug": "metamaterials-science"}'),
  ('6g-telepathy', '6G networks enable digital telepathy', 'Brain-computer interfaces connected via wireless', -40, 200, 16, '#9333EA', 2, ARRAY['6G', 'telepathy', 'wireless'], '{"people": ["Dr. Lisa Rodriguez"], "episode": "6G Telepathy", "episodeSlug": "6g-telepathy"}'),
  ('quantum-consciousness', 'Consciousness arises from quantum processes', 'Microtubules in neurons exhibiting quantum coherence', 50, 120, 15, '#0891B2', 2, ARRAY['quantum', 'consciousness', 'brain'], '{"people": ["Prof. Marcus Thompson", "Dr. Sarah Kim"], "episode": "Quantum Consciousness", "episodeSlug": "quantum-consciousness"}'),

  -- Biology & Medicine Claims
  ('life-on-mars', 'Microbial life exists on Mars', 'Subsurface organisms detected in Martian samples', -120, 200, 18, '#65A30D', 3, ARRAY['astrobiology', 'Mars', 'life'], '{"people": ["Dr. Sarah Kim", "Prof. Alex Chen"], "episode": "Life on Mars", "episodeSlug": "life-on-mars"}'),
  ('aging-reversed', 'Human aging can be fully reversed', 'Cellular reprogramming reversing biological age', 160, 100, 20, '#DC2626', 3, ARRAY['longevity', 'aging', 'biology'], '{"people": ["Dr. Elena Martinez"], "episode": "Reversing Aging", "episodeSlug": "reversing-aging"}'),
  ('brain-uploading', 'Human consciousness can be uploaded', 'Digital immortality through neural pattern transfer', -180, 80, 19, '#7C3AED', 3, ARRAY['consciousness', 'upload', 'immortality'], '{"people": ["Prof. Alex Chen", "Dr. Elena Martinez"], "episode": "Digital Immortality", "episodeSlug": "digital-immortality"}'),
  ('gene-therapy', 'Gene therapy will cure most diseases', 'Genetic modification eliminating hereditary conditions', 40, 180, 17, '#059669', 3, ARRAY['gene-therapy', 'genetic', 'disease'], '{"people": ["Prof. Lisa Rodriguez"], "episode": "Gene Therapy Revolution", "episodeSlug": "gene-therapy-revolution"}'),
  ('crispr-ethics', 'CRISPR use requires stricter ethics', 'Gene editing capabilities outpacing regulatory frameworks', -60, -160, 14, '#F59E0B', 3, ARRAY['genetics', 'ethics', 'CRISPR'], '{"people": ["Prof. Marcus Chen"], "episode": "CRISPR Ethics Debate", "episodeSlug": "crispr-ethics-debate"}'),
  ('bioprinting-organs', 'Bioprinting will end organ shortages', '3D printed organs using patient stem cells', 140, -40, 16, '#10B981', 3, ARRAY['bioprinting', 'organs', '3D'], '{"people": ["Dr. Sarah Mitchell"], "episode": "Bioprinting Organs", "episodeSlug": "bioprinting-organs"}'),
  ('precision-medicine', 'Precision medicine will personalize all treatments', 'Genomic data enabling individualized therapeutic approaches', -90, 140, 15, '#8B5CF6', 3, ARRAY['precision', 'genomics', 'personalized'], '{"people": ["Dr. Elena Vasquez"], "episode": "Precision Medicine", "episodeSlug": "precision-medicine"}'),
  ('synthetic-biology', 'Synthetic organisms will terraform planets', 'Engineered microbes transforming planetary atmospheres', 200, -120, 18, '#84CC16', 3, ARRAY['synthetic-biology', 'terraforming', 'planets'], '{"people": ["Dr. Lisa Rodriguez"], "episode": "Synthetic Biology", "episodeSlug": "synthetic-biology"}'),
  ('microbiome-therapy', 'Microbiome therapy revolutionizes medicine', 'Gut bacteria manipulation treating diverse conditions', -20, -200, 16, '#EF4444', 3, ARRAY['microbiome', 'bacteria', 'gut'], '{"people": ["Prof. James Wilson"], "episode": "Microbiome Medicine", "episodeSlug": "microbiome-medicine"}'),
  ('neural-prosthetics', 'Neural prosthetics restore full function', 'Brain-controlled artificial limbs matching natural ability', 110, -80, 17, '#6366F1', 3, ARRAY['prosthetics', 'neural', 'brain'], '{"people": ["Dr. Elena Vasquez", "Dr. Sarah Kim"], "episode": "Neural Prosthetics", "episodeSlug": "neural-prosthetics"}'),

  -- Climate & Environment Claims
  ('climate-tipping', 'Climate has passed critical tipping points', 'Multiple earth systems showing irreversible changes', -160, -100, 20, '#DC2626', 4, ARRAY['climate', 'environment', 'tipping'], '{"people": ["Dr. James Wilson", "Prof. Lisa Rodriguez"], "episode": "Climate Tipping Points", "episodeSlug": "climate-tipping-points"}'),
  ('renewable-transition', 'Renewable energy transition by 2040', 'Solar and wind becoming dominant energy sources', 180, 120, 18, '#059669', 4, ARRAY['renewable', 'solar', 'wind'], '{"people": ["Dr. Sarah Mitchell", "Prof. Marcus Thompson"], "episode": "Renewable Transition", "episodeSlug": "renewable-transition"}'),
  ('carbon-capture', 'Carbon capture technology will save us', 'Direct air capture removing CO2 from atmosphere', -140, 160, 16, '#10B981', 4, ARRAY['carbon-capture', 'CO2', 'technology'], '{"people": ["Prof. Alex Chen"], "episode": "Carbon Capture Tech", "episodeSlug": "carbon-capture-tech"}'),
  ('biodiversity-collapse', 'Sixth mass extinction is underway', 'Human activity causing unprecedented species loss', 70, 200, 19, '#7F1D1D', 4, ARRAY['extinction', 'biodiversity', 'species'], '{"people": ["Dr. Lisa Rodriguez", "Prof. James Wilson"], "episode": "Biodiversity Crisis", "episodeSlug": "biodiversity-crisis"}'),
  ('geoengineering-necessary', 'Geoengineering is necessary for climate', 'Technical interventions required to prevent catastrophe', -200, -40, 17, '#F59E0B', 4, ARRAY['geoengineering', 'climate', 'intervention'], '{"people": ["Dr. Elena Martinez"], "episode": "Geoengineering Solutions", "episodeSlug": "geoengineering-solutions"}'),
  ('ocean-acidification', 'Ocean acidification threatens marine life', 'CO2 absorption changing ocean chemistry catastrophically', 30, -180, 15, '#0891B2', 4, ARRAY['ocean', 'acidification', 'marine'], '{"people": ["Prof. Lisa Rodriguez"], "episode": "Ocean Acidification", "episodeSlug": "ocean-acidification"}'),
  ('rewilding-essential', 'Large-scale rewilding is essential', 'Restoring natural ecosystems to reverse biodiversity loss', -80, 220, 16, '#65A30D', 4, ARRAY['rewilding', 'ecosystems', 'restoration'], '{"people": ["Dr. James Wilson"], "episode": "Rewilding Earth", "episodeSlug": "rewilding-earth"}'),
  ('plastic-pollution', 'Plastic pollution requires global ban', 'Microplastics contaminating entire food chain', 190, -20, 14, '#BE185D', 4, ARRAY['plastic', 'pollution', 'microplastics'], '{"people": ["Prof. Marcus Chen"], "episode": "Plastic Crisis", "episodeSlug": "plastic-crisis"}'),
  ('forest-tipping-point', 'Amazon rainforest past tipping point', 'Deforestation causing irreversible ecosystem collapse', -120, -200, 18, '#166534', 4, ARRAY['Amazon', 'deforestation', 'tipping'], '{"people": ["Dr. Sarah Kim", "Prof. Alex Chen"], "episode": "Amazon Tipping Point", "episodeSlug": "amazon-tipping-point"}'),
  ('carbon-tax', 'Global carbon tax is essential', 'Pricing carbon emissions to address climate change', 150, 180, 15, '#059669', 4, ARRAY['carbon-tax', 'climate', 'pricing'], '{"people": ["Dr. Lisa Rodriguez", "Prof. Marcus Thompson"], "episode": "Carbon Tax Policy", "episodeSlug": "carbon-tax-policy"}'),

  -- Philosophy & Consciousness Claims
  ('consciousness-measurement', 'Consciousness can be scientifically measured', 'Integrated information theory validated empirically', -50, 160, 17, '#7C3AED', 5, ARRAY['consciousness', 'neuroscience', 'measurement'], '{"people": ["Dr. Sarah Kim"], "episode": "Measuring Consciousness", "episodeSlug": "measuring-consciousness"}'),
  ('free-will-illusion', 'Free will is an illusion', 'Neuroscience suggests all decisions are predetermined', 120, -160, 16, '#DC2626', 5, ARRAY['philosophy', 'neuroscience', 'free-will'], '{"people": ["Dr. Elena Vasquez"], "episode": "Free Will and Neuroscience", "episodeSlug": "free-will-neuroscience"}'),
  ('simulation-hypothesis', 'We live in a simulation', 'Statistical arguments for simulated reality', -170, 40, 18, '#1E40AF', 5, ARRAY['philosophy', 'reality', 'simulation'], '{"people": ["Prof. Lisa Rodriguez"], "episode": "Simulation Hypothesis", "episodeSlug": "simulation-hypothesis"}'),
  ('consciousness-hard', 'The hard problem of consciousness is unsolvable', 'Subjective experience cannot be reduced to physical processes', 80, 140, 15, '#7F1D1D', 5, ARRAY['philosophy', 'consciousness', 'hard-problem'], '{"people": ["Dr. James Wilson"], "episode": "Hard Problem of Consciousness", "episodeSlug": "hard-problem-consciousness"}'),
  ('panpsychism', 'Consciousness is a fundamental property', 'All matter has some form of conscious experience', -100, 240, 16, '#9333EA', 5, ARRAY['panpsychism', 'consciousness', 'matter'], '{"people": ["Prof. Alex Chen", "Dr. Elena Martinez"], "episode": "Panpsychism Debate", "episodeSlug": "panpsychism-debate"}'),
  ('mind-body-dualism', 'Mind and body are separate substances', 'Consciousness cannot be reduced to physical processes', 200, 80, 14, '#BE185D', 5, ARRAY['dualism', 'mind', 'consciousness'], '{"people": ["Dr. Sarah Kim"], "episode": "Mind-Body Dualism", "episodeSlug": "mind-body-dualism"}'),
  ('determinism-true', 'Hard determinism is true', 'All events including human actions are causally determined', -190, 120, 17, '#374151', 5, ARRAY['determinism', 'causation', 'freedom'], '{"people": ["Prof. Marcus Chen"], "episode": "Determinism Debate", "episodeSlug": "determinism-debate"}'),
  ('meaning-of-life', 'Life has inherent meaning', 'Purpose exists independent of human construction', 60, -140, 15, '#F59E0B', 5, ARRAY['meaning', 'purpose', 'existence'], '{"people": ["Dr. Elena Vasquez", "Prof. James Wilson"], "episode": "Meaning of Life", "episodeSlug": "meaning-of-life"}'),
  ('personal-identity', 'Personal identity is an illusion', 'No persistent self across time and change', -40, -240, 16, '#6366F1', 5, ARRAY['identity', 'self', 'persistence'], '{"people": ["Prof. Lisa Rodriguez"], "episode": "Personal Identity", "episodeSlug": "personal-identity"}'),

  -- Politics & Society Claims
  ('democracy-decline', 'Democracy is in global decline', 'Authoritarian systems gaining ground worldwide', 140, 60, 18, '#DC2626', 6, ARRAY['politics', 'democracy', 'authoritarianism'], '{"people": ["Prof. Marcus Chen", "Dr. Sarah Mitchell"], "episode": "Democracy in Crisis", "episodeSlug": "democracy-in-crisis"}'),
  ('ubi-necessary', 'Universal Basic Income is necessary', 'Automation making UBI economically essential', -80, 180, 19, '#10B981', 6, ARRAY['politics', 'economics', 'UBI'], '{"people": ["Dr. Elena Vasquez"], "episode": "Future of Work", "episodeSlug": "future-of-work"}'),
  ('privacy-dead', 'Privacy is effectively dead', 'Surveillance capitalism and state monitoring eliminate privacy', 100, -120, 17, '#7F1D1D', 6, ARRAY['privacy', 'surveillance', 'capitalism'], '{"people": ["Prof. Lisa Rodriguez"], "episode": "Privacy and Surveillance", "episodeSlug": "privacy-surveillance"}'),
  ('surveillance-state', 'Surveillance states are inevitable', 'Technology making total monitoring economically viable', -160, -60, 16, '#374151', 6, ARRAY['surveillance', 'state', 'monitoring'], '{"people": ["Dr. James Wilson", "Prof. Alex Chen"], "episode": "Surveillance State", "episodeSlug": "surveillance-state"}'),
  ('technocracy-superior', 'Technocracy is superior to democracy', 'Expert rule more effective than popular governance', 180, 160, 15, '#6366F1', 6, ARRAY['technocracy', 'expertise', 'governance'], '{"people": ["Dr. Sarah Mitchell"], "episode": "Technocracy vs Democracy", "episodeSlug": "technocracy-democracy"}'),
  ('nation-states-obsolete', 'Nation-states are becoming obsolete', 'Global networks replacing territorial sovereignty', -120, 140, 14, '#F97316', 6, ARRAY['nation-state', 'sovereignty', 'globalization'], '{"people": ["Prof. Marcus Thompson"], "episode": "End of Nation States", "episodeSlug": "end-nation-states"}'),
  ('direct-democracy', 'Direct democracy via technology is optimal', 'Digital platforms enabling true participatory governance', 40, 220, 16, '#059669', 6, ARRAY['democracy', 'technology', 'participation'], '{"people": ["Dr. Elena Martinez"], "episode": "Digital Democracy", "episodeSlug": "digital-democracy"}'),
  ('voting-mandatory', 'Voting should be mandatory', 'Compulsory participation improving democratic legitimacy', -200, 200, 13, '#8B5CF6', 6, ARRAY['voting', 'mandatory', 'participation'], '{"people": ["Prof. James Wilson"], "episode": "Mandatory Voting", "episodeSlug": "mandatory-voting"}'),
  ('cancel-culture', 'Cancel culture threatens open discourse', 'Social ostracism creating chilling effect on speech', 160, -100, 15, '#BE185D', 6, ARRAY['cancel-culture', 'discourse', 'speech'], '{"people": ["Dr. Sarah Kim", "Prof. Alex Chen"], "episode": "Cancel Culture Debate", "episodeSlug": "cancel-culture-debate"}'),

  -- Economics & Future Society Claims
  ('automation-unemployment', 'Automation will cause mass unemployment', 'AI and robotics displacing human workers', 120, 200, 18, '#EF4444', 7, ARRAY['automation', 'employment', 'AI'], '{"people": ["Dr. Sarah Mitchell"], "episode": "Automation and Employment", "episodeSlug": "automation-employment"}'),
  ('crypto-replace-fiat', 'Cryptocurrency will replace fiat currency', 'Decentralized finance disrupting traditional banking', -140, -120, 17, '#F59E0B', 7, ARRAY['crypto', 'finance', 'DeFi'], '{"people": ["Dr. James Wilson"], "episode": "Cryptocurrency Revolution", "episodeSlug": "cryptocurrency-revolution"}'),
  ('degrowth-necessary', 'Economic degrowth is necessary', 'Infinite growth impossible on finite planet', 80, 160, 16, '#65A30D', 7, ARRAY['economics', 'sustainability', 'degrowth'], '{"people": ["Prof. Marcus Chen"], "episode": "Economic Degrowth", "episodeSlug": "economic-degrowth"}'),
  ('wealth-inequality', 'Extreme wealth inequality is unsustainable', 'Concentration of wealth threatening social stability', -60, 120, 19, '#DC2626', 7, ARRAY['inequality', 'wealth', 'stability'], '{"people": ["Dr. Elena Vasquez", "Prof. Lisa Rodriguez"], "episode": "Wealth Inequality Crisis", "episodeSlug": "wealth-inequality-crisis"}'),
  ('post-scarcity', 'Post-scarcity economy is achievable', 'Technology eliminating material want for all humans', 200, -80, 15, '#10B981', 7, ARRAY['post-scarcity', 'abundance', 'technology'], '{"people": ["Dr. Sarah Kim"], "episode": "Post-Scarcity Future", "episodeSlug": "post-scarcity-future"}'),
  ('capitalism-collapse', 'Capitalism will collapse within decades', 'Internal contradictions leading to systemic failure', -180, 160, 18, '#7F1D1D', 7, ARRAY['capitalism', 'collapse', 'economics'], '{"people": ["Prof. Marcus Thompson"], "episode": "End of Capitalism", "episodeSlug": "end-of-capitalism"}'),
  ('gig-economy', 'Gig economy is the future of work', 'Independent contractors replacing traditional employment', 40, -160, 14, '#8B5CF6', 7, ARRAY['gig', 'work', 'contractors'], '{"people": ["Dr. Elena Martinez"], "episode": "Gig Economy Future", "episodeSlug": "gig-economy-future"}'),
  ('digital-currency', 'Central bank digital currencies replace cash', 'Government-issued digital money becoming standard', -20, 200, 16, '#F97316', 7, ARRAY['CBDC', 'digital', 'currency'], '{"people": ["Prof. Alex Chen"], "episode": "Digital Currency Era", "episodeSlug": "digital-currency-era"}'),
  ('sharing-economy', 'Sharing economy reduces material consumption', 'Access-based consumption replacing ownership models', 180, 40, 13, '#84CC16', 7, ARRAY['sharing', 'consumption', 'access'], '{"people": ["Dr. Lisa Rodriguez"], "episode": "Sharing Economy Impact", "episodeSlug": "sharing-economy-impact"}'),

  -- Education & Culture Claims
  ('ai-tutors', 'AI tutors will replace human teachers', 'Personalized artificial intelligence providing superior education', -100, -160, 17, '#6366F1', 8, ARRAY['AI', 'tutors', 'personalized'], '{"people": ["Dr. Elena Vasquez", "Prof. Marcus Chen"], "episode": "AI in Education", "episodeSlug": "ai-in-education"}'),
  ('college-obsolete', 'Traditional colleges will become obsolete', 'Online learning and alternative credentials replacing degrees', 60, 180, 16, '#EF4444', 8, ARRAY['college', 'online', 'credentials'], '{"people": ["Dr. Sarah Mitchell"], "episode": "Future of Higher Ed", "episodeSlug": "future-higher-education"}'),
  ('standardized-testing', 'Standardized testing harms education', 'Test-focused curricula reducing genuine learning', -200, -80, 15, '#BE185D', 8, ARRAY['testing', 'standardized', 'curriculum'], '{"people": ["Prof. James Wilson"], "episode": "Testing in Schools", "episodeSlug": "testing-in-schools"}'),
  ('digital-divide', 'Digital divide perpetuates inequality', 'Technology access determining educational opportunities', 140, 120, 18, '#7F1D1D', 8, ARRAY['digital-divide', 'inequality', 'access'], '{"people": ["Dr. Lisa Rodriguez", "Prof. Alex Chen"], "episode": "Digital Education Gap", "episodeSlug": "digital-education-gap"}'),
  ('cultural-relativism', 'Cultural relativism is morally correct', 'No culture superior to others in moral terms', -160, 40, 14, '#9333EA', 8, ARRAY['culture', 'relativism', 'morality'], '{"people": ["Prof. Marcus Thompson"], "episode": "Cultural Values", "episodeSlug": "cultural-values"}'),
  ('social-media-harmful', 'Social media is net harmful to society', 'Platforms promoting division and mental health issues', 20, -200, 19, '#DC2626', 8, ARRAY['social-media', 'harmful', 'division'], '{"people": ["Dr. Sarah Kim", "Dr. Elena Martinez"], "episode": "Social Media Impact", "episodeSlug": "social-media-impact"}'),
  ('learning-styles', 'Learning styles theory is scientifically invalid', 'No evidence for different optimal learning modalities', -80, -240, 13, '#F59E0B', 8, ARRAY['learning-styles', 'science', 'evidence'], '{"people": ["Prof. James Wilson"], "episode": "Learning Science", "episodeSlug": "learning-science"}'),
  ('critical-thinking', 'Critical thinking cannot be taught', 'Logical reasoning being domain-specific skill', 200, 160, 15, '#7C3AED', 8, ARRAY['critical-thinking', 'reasoning', 'domain'], '{"people": ["Dr. Elena Vasquez"], "episode": "Teaching Critical Thinking", "episodeSlug": "teaching-critical-thinking"}'),

  -- Health & Society Claims
  ('mental-health-epidemic', 'Mental health crisis is unprecedented', 'Modern society creating widespread psychological disorders', 100, 140, 20, '#EF4444', 9, ARRAY['mental-health', 'crisis', 'society'], '{"people": ["Dr. Sarah Mitchell", "Prof. Lisa Rodriguez"], "episode": "Mental Health Crisis", "episodeSlug": "mental-health-crisis"}'),
  ('pandemic-inevitable', 'Pandemic worse than COVID is inevitable', 'Viral evolution and global connectivity ensuring future outbreaks', -120, 180, 18, '#7F1D1D', 9, ARRAY['pandemic', 'virus', 'inevitable'], '{"people": ["Dr. James Wilson", "Prof. Marcus Chen"], "episode": "Future Pandemics", "episodeSlug": "future-pandemics"}'),
  ('antibiotic-resistance', 'Antibiotic resistance threatens civilization', 'Bacterial evolution making modern medicine obsolete', 160, -40, 17, '#BE185D', 9, ARRAY['antibiotics', 'resistance', 'bacteria'], '{"people": ["Prof. Alex Chen"], "episode": "Antibiotic Crisis", "episodeSlug": "antibiotic-crisis"}'),
  ('telemedicine-standard', 'Telemedicine will become standard care', 'Remote diagnosis and treatment replacing in-person visits', -40, 160, 15, '#10B981', 9, ARRAY['telemedicine', 'remote', 'digital'], '{"people": ["Dr. Elena Martinez"], "episode": "Telemedicine Future", "episodeSlug": "telemedicine-future"}'),
  ('immortality-achievable', 'Biological immortality is achievable', 'Senescence can be completely eliminated through intervention', 80, -180, 19, '#7C3AED', 9, ARRAY['immortality', 'aging', 'senescence'], '{"people": ["Dr. Sarah Kim", "Prof. Marcus Thompson"], "episode": "Quest for Immortality", "episodeSlug": "quest-for-immortality"}'),
  ('ethical-vegetarianism', 'Eating animals is morally wrong', 'Sentient beings have rights not to be harmed', -180, 120, 16, '#65A30D', 9, ARRAY['ethics', 'animals', 'vegetarianism'], '{"people": ["Prof. Lisa Rodriguez"], "episode": "Animal Ethics", "episodeSlug": "animal-ethics"}'),
  ('gene-drive-mosquitoes', 'Gene drives will eliminate disease vectors', 'Genetically modified mosquitoes preventing malaria transmission', 40, 240, 14, '#059669', 9, ARRAY['gene-drive', 'disease', 'genetics'], '{"people": ["Dr. Elena Vasquez"], "episode": "Gene Drive Technology", "episodeSlug": "gene-drive-technology"}'),

  -- Emerging Tech & Future Claims
  ('space-colonization', 'Mars colonization will begin by 2040', 'SpaceX and others establishing permanent settlements', -140, -180, 18, '#F97316', 10, ARRAY['space', 'Mars', 'colonization'], '{"people": ["Dr. Marcus Thompson", "Prof. Alex Chen"], "episode": "Mars Colony Future", "episodeSlug": "mars-colony-future"}'),
  ('asteroid-mining', 'Asteroid mining will revolutionize resources', 'Space-based extraction making rare materials abundant', 120, -200, 16, '#8B5CF6', 10, ARRAY['asteroid', 'mining', 'resources'], '{"people": ["Dr. Sarah Kim"], "episode": "Space Mining", "episodeSlug": "space-mining"}'),
  ('interstellar-travel', 'Interstellar travel is achievable this century', 'Breakthrough propulsion enabling nearby star travel', -60, -140, 17, '#1E40AF', 10, ARRAY['interstellar', 'travel', 'propulsion'], '{"people": ["Prof. James Wilson"], "episode": "Interstellar Journey", "episodeSlug": "interstellar-journey"}'),
  ('dyson-sphere', 'Dyson spheres will power civilization', 'Stellar energy capture enabling Type II civilization', 200, 200, 15, '#F59E0B', 10, ARRAY['Dyson-sphere', 'energy', 'stellar'], '{"people": ["Dr. Elena Martinez", "Prof. Marcus Thompson"], "episode": "Stellar Engineering", "episodeSlug": "stellar-engineering"}'),
  ('wormhole-travel', 'Wormhole travel may be possible', 'Exotic matter enabling faster-than-light travel', -200, -160, 14, '#7C3AED', 10, ARRAY['wormhole', 'travel', 'exotic-matter'], '{"people": ["Prof. Alex Chen"], "episode": "Wormhole Physics", "episodeSlug": "wormhole-physics"}'),
  ('galactic-internet', 'Galactic internet will connect civilizations', 'Quantum entanglement enabling instant communication', 180, -160, 16, '#06B6D4', 10, ARRAY['galactic', 'internet', 'quantum'], '{"people": ["Dr. Sarah Mitchell"], "episode": "Cosmic Communication", "episodeSlug": "cosmic-communication"}'),

  -- Wildcard & Speculative Claims
  ('alien-contact', 'Alien contact will occur this decade', 'SETI detection or government disclosure imminent', -80, 240, 20, '#10B981', 11, ARRAY['aliens', 'SETI', 'contact'], '{"people": ["Dr. James Wilson", "Prof. Lisa Rodriguez"], "episode": "Alien Contact", "episodeSlug": "alien-contact"}'),
  ('matrix-reality', 'Physical reality is computational', 'Universe running on cosmic computer substrate', 60, -240, 18, '#DC2626', 11, ARRAY['reality', 'computation', 'digital-physics'], '{"people": ["Prof. Marcus Chen", "Dr. Elena Vasquez"], "episode": "Digital Reality", "episodeSlug": "digital-reality"}'),
  ('time-loops', 'Time loops are naturally occurring', 'Causal loops creating self-consistent timelines', -160, -240, 16, '#BE185D', 11, ARRAY['time', 'loops', 'causality'], '{"people": ["Dr. Sarah Kim"], "episode": "Time Loop Physics", "episodeSlug": "time-loop-physics"}'),
  ('consciousness-virus', 'Consciousness can spread like a virus', 'Memetic evolution creating shared awareness', 140, 240, 17, '#9333EA', 11, ARRAY['consciousness', 'memetic', 'viral'], '{"people": ["Prof. Alex Chen", "Dr. Elena Martinez"], "episode": "Viral Consciousness", "episodeSlug": "viral-consciousness"}'),
  ('reality-glitches', 'Reality has observable glitches', 'Simulation artifacts detectable in physical laws', -240, 160, 15, '#EF4444', 11, ARRAY['reality', 'glitches', 'simulation'], '{"people": ["Dr. Lisa Rodriguez"], "episode": "Reality Glitches", "episodeSlug": "reality-glitches"}'),
  ('dream-sharing', 'Shared dreaming will be technologically enabled', 'Neural interfaces allowing collective dream experiences', 240, 120, 19, '#7C3AED', 11, ARRAY['dreams', 'sharing', 'neural'], '{"people": ["Prof. James Wilson", "Dr. Sarah Mitchell"], "episode": "Shared Dreams", "episodeSlug": "shared-dreams"}');

-- Step 4: Insert claim relationships/edges
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
  ((SELECT id FROM claims WHERE slug = 'forest-tipping-point'), (SELECT id FROM claims WHERE slug = 'climate-tipping'), 'supports', 0.9),
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
  ((SELECT id FROM claims WHERE slug = 'immortality-achievable'), (SELECT id FROM claims WHERE slug = 'aging-reversed'), 'supports', 0.9),
  
  -- Technology and society impacts
  ((SELECT id FROM claims WHERE slug = 'privacy-dead'), (SELECT id FROM claims WHERE slug = 'surveillance-state'), 'supports', 0.9),
  ((SELECT id FROM claims WHERE slug = 'social-media-harmful'), (SELECT id FROM claims WHERE slug = 'mental-health-epidemic'), 'supports', 0.8),
  ((SELECT id FROM claims WHERE slug = 'digital-divide'), (SELECT id FROM claims WHERE slug = 'wealth-inequality'), 'supports', 0.7),
  ((SELECT id FROM claims WHERE slug = 'cancel-culture'), (SELECT id FROM claims WHERE slug = 'democracy-decline'), 'related', 0.6),
  
  -- Future space and technology
  ((SELECT id FROM claims WHERE slug = 'space-colonization'), (SELECT id FROM claims WHERE slug = 'asteroid-mining'), 'supports', 0.8),
  ((SELECT id FROM claims WHERE slug = 'fusion-energy'), (SELECT id FROM claims WHERE slug = 'space-colonization'), 'supports', 0.7),
  ((SELECT id FROM claims WHERE slug = 'interstellar-travel'), (SELECT id FROM claims WHERE slug = 'dyson-sphere'), 'related', 0.6),
  ((SELECT id FROM claims WHERE slug = 'wormhole-travel'), (SELECT id FROM claims WHERE slug = 'galactic-internet'), 'supports', 0.7),
  
  -- Economic system connections
  ((SELECT id FROM claims WHERE slug = 'crypto-replace-fiat'), (SELECT id FROM claims WHERE slug = 'digital-currency'), 'related', 0.8),
  ((SELECT id FROM claims WHERE slug = 'capitalism-collapse'), (SELECT id FROM claims WHERE slug = 'wealth-inequality'), 'supports', 0.8),
  ((SELECT id FROM claims WHERE slug = 'post-scarcity'), (SELECT id FROM claims WHERE slug = 'automation-unemployment'), 'refutes', 0.7),
  ((SELECT id FROM claims WHERE slug = 'degrowth-necessary'), (SELECT id FROM claims WHERE slug = 'post-scarcity'), 'refutes', 0.8),
  
  -- Speculative and wildcard connections
  ((SELECT id FROM claims WHERE slug = 'alien-contact'), (SELECT id FROM claims WHERE slug = 'life-on-mars'), 'related', 0.6),
  ((SELECT id FROM claims WHERE slug = 'reality-glitches'), (SELECT id FROM claims WHERE slug = 'simulation-hypothesis'), 'supports', 0.8),
  ((SELECT id FROM claims WHERE slug = 'dream-sharing'), (SELECT id FROM claims WHERE slug = 'brain-interface'), 'related', 0.7),
  ((SELECT id FROM claims WHERE slug = 'consciousness-virus'), (SELECT id FROM claims WHERE slug = 'panpsychism'), 'related', 0.6),
  ((SELECT id FROM claims WHERE slug = 'time-loops'), (SELECT id FROM claims WHERE slug = 'time-travel-possible'), 'related', 0.7);

-- Step 5: Verify the data was inserted correctly
SELECT 
  COUNT(*) as total_claims,
  COUNT(CASE WHEN metadata->>'people' IS NOT NULL AND metadata->>'people' != '[]' THEN 1 END) as claims_with_people,
  COUNT(CASE WHEN metadata->>'episode' IS NOT NULL THEN 1 END) as claims_with_episodes
FROM claims;
