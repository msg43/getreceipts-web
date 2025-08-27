-- 05_sample_data.sql: Sample data for testing the graph visualization

-- Insert sample clusters
INSERT INTO claim_clusters (id, name, color, x, y, node_count) VALUES
  (1, 'Technology', '#3B82F6', -100, -50, 0),
  (2, 'Science', '#10B981', 100, -50, 0),
  (3, 'Philosophy', '#8B5CF6', 0, 100, 0),
  (4, 'Politics', '#EF4444', -100, 100, 0),
  (5, 'Economics', '#F59E0B', 100, 100, 0),
  (6, 'Health & Medicine', '#EC4899', -200, 0, 0),
  (7, 'Environment', '#84CC16', 200, 0, 0),
  (8, 'Education', '#F97316', 0, -150, 0),
  (9, 'Culture & Society', '#6366F1', -150, -150, 0),
  (10, 'Space & Astronomy', '#8B5CF6', 150, -150, 0)
ON CONFLICT (id) DO NOTHING;

-- Insert sample claims
INSERT INTO claims (slug, title, content, x, y, node_size, node_color, community_id, tags, metadata) VALUES
  -- Technology cluster
  ('ai-consciousness', 'AI systems will achieve consciousness by 2050', 'Advanced neural networks show emergent properties suggesting consciousness', -120, -70, 15, '#3B82F6', 1, ARRAY['AI', 'consciousness', 'future'], '{"people": ["Dr. Elena Vasquez", "Prof. Marcus Chen"], "episode": "The Future of AI Consciousness", "episodeSlug": "future-ai-consciousness"}'),
  ('quantum-computing', 'Quantum computing will break current encryption', 'RSA and similar encryption methods vulnerable to quantum attacks', -80, -60, 12, '#3B82F6', 1, ARRAY['quantum', 'security'], '{"people": ["Dr. Sarah Kim", "Dr. Alex Rivera"], "episode": "Quantum Revolution", "episodeSlug": "quantum-revolution"}'),
  ('brain-interface', 'Brain-computer interfaces will be mainstream', 'Direct neural connections enabling thought-based control', -110, -30, 10, '#3B82F6', 1, ARRAY['neurotechnology', 'BCI'], '{"people": ["Dr. Elena Vasquez", "Dr. Michael Torres"], "episode": "The Future of AI Consciousness", "episodeSlug": "future-ai-consciousness"}'),
  
  -- Science cluster
  ('climate-tipping', 'Climate has passed critical tipping points', 'Multiple earth systems showing irreversible changes', 120, -80, 18, '#10B981', 2, ARRAY['climate', 'environment'], '{"people": ["Dr. Linda Park", "Prof. James Wilson"], "episode": "Climate Crisis Tipping Points", "episodeSlug": "climate-crisis-tipping"}'),
  ('fusion-energy', 'Fusion energy is finally viable', 'Recent breakthroughs show net energy gain', 90, -50, 14, '#10B981', 2, ARRAY['energy', 'fusion'], '{"people": ["Dr. Robert Zhang", "Dr. Ana Martinez"], "episode": "The Energy Revolution", "episodeSlug": "energy-revolution"}'),
  ('crispr-ethics', 'CRISPR use requires stricter ethics', 'Gene editing capabilities outpacing regulatory frameworks', 110, -20, 11, '#10B981', 2, ARRAY['genetics', 'ethics'], '{"people": ["Dr. Lisa Thompson", "Prof. David Kumar"], "episode": "Ethics in Gene Editing", "episodeSlug": "ethics-gene-editing"}'),
  
  -- Philosophy cluster
  ('free-will-illusion', 'Free will is an illusion', 'Neuroscience suggests all decisions are predetermined', -20, 90, 16, '#8B5CF6', 3, ARRAY['philosophy', 'neuroscience'], '{"people": ["Prof. Rachel Adams", "Dr. Tom Anderson"], "episode": "The Illusion of Choice", "episodeSlug": "illusion-of-choice"}'),
  ('simulation-hypothesis', 'We live in a simulation', 'Statistical arguments for simulated reality', 20, 110, 13, '#8B5CF6', 3, ARRAY['philosophy', 'reality'], '{"people": ["Dr. Kevin Liu", "Prof. Sarah Williams"], "episode": "Reality or Simulation", "episodeSlug": "reality-or-simulation"}'),
  ('consciousness-hard', 'The hard problem of consciousness is unsolvable', 'Subjective experience cannot be reduced to physical processes', 0, 130, 15, '#8B5CF6', 3, ARRAY['philosophy', 'consciousness'], '{"people": ["Prof. Marcus Chen", "Dr. Elena Vasquez"], "episode": "The Mystery of Consciousness", "episodeSlug": "mystery-of-consciousness"}'),
  
  -- Politics cluster
  ('democracy-decline', 'Democracy is in global decline', 'Authoritarian systems gaining ground worldwide', -120, 90, 17, '#EF4444', 4, ARRAY['politics', 'democracy'], '{"people": ["Prof. Angela Foster", "Dr. Hassan Ahmed"], "episode": "Democracy Under Threat", "episodeSlug": "democracy-under-threat"}'),
  ('ubi-necessary', 'Universal Basic Income is necessary', 'Automation making UBI economically essential', -80, 110, 14, '#EF4444', 4, ARRAY['politics', 'economics', 'UBI'], '{"people": ["Dr. Maria Santos", "Prof. Chris Johnson"], "episode": "The Future of Work", "episodeSlug": "future-of-work"}'),
  ('privacy-dead', 'Privacy is effectively dead', 'Surveillance capitalism and state monitoring eliminate privacy', -100, 130, 12, '#EF4444', 4, ARRAY['privacy', 'surveillance'], '{"people": ["Dr. Alex Rivera", "Prof. Nina Petrov"], "episode": "The End of Privacy", "episodeSlug": "end-of-privacy"}'),
  
  -- Economics cluster
  ('crypto-replace-fiat', 'Cryptocurrency will replace fiat currency', 'Decentralized finance disrupting traditional banking', 80, 90, 15, '#F59E0B', 5, ARRAY['crypto', 'finance'], '{"people": ["Dr. Ben Rodriguez", "Prof. Kate O'Connor"], "episode": "The Crypto Revolution", "episodeSlug": "crypto-revolution"}'),
  ('automation-unemployment', 'Automation will cause mass unemployment', 'AI and robotics displacing human workers', 120, 110, 16, '#F59E0B', 5, ARRAY['automation', 'employment'], '{"people": ["Dr. Maria Santos", "Dr. Michael Torres"], "episode": "The Future of Work", "episodeSlug": "future-of-work"}'),
  ('degrowth-necessary', 'Economic degrowth is necessary', 'Infinite growth impossible on finite planet', 100, 130, 13, '#F59E0B', 5, ARRAY['economics', 'sustainability'], '{"people": ["Prof. Emma Green", "Dr. Carlos Silva"], "episode": "Rethinking Growth", "episodeSlug": "rethinking-growth"}'),
  
  -- More Technology cluster claims
  ('ar-reality', 'Augmented reality will replace smartphones', 'AR glasses becoming primary computing interface', -90, -45, 12, '#3B82F6', 1, ARRAY['AR', 'mobile', 'interface']),
  ('autonomous-vehicles', 'Self-driving cars will dominate by 2035', 'Level 5 autonomy achieved for passenger vehicles', -140, -55, 14, '#3B82F6', 1, ARRAY['automotive', 'AI', 'transportation']),
  ('robot-workers', 'Humanoid robots in every workplace', 'General purpose robots becoming economically viable', -85, -75, 11, '#3B82F6', 1, ARRAY['robotics', 'labor', 'automation']),
  ('neural-networks', 'Neural networks will surpass human intelligence', 'Artificial general intelligence emerging from scaled transformers', -125, -40, 16, '#3B82F6', 1, ARRAY['AGI', 'neural-nets', 'intelligence']),
  ('biocomputing', 'Biological computers will replace silicon', 'DNA and protein-based computing systems', -95, -85, 10, '#3B82F6', 1, ARRAY['biotech', 'computing', 'DNA']),
  ('space-internet', 'Satellite internet will be universal', 'Low Earth orbit constellations providing global coverage', -75, -35, 13, '#3B82F6', 1, ARRAY['satellites', 'internet', 'space']),
  ('holographic-displays', 'Holographic displays replace screens', 'True 3D volumetric displays for all devices', -130, -85, 9, '#3B82F6', 1, ARRAY['holography', 'display', '3D']),
  ('brain-uploading', 'Human consciousness can be uploaded', 'Digital immortality through neural pattern transfer', -105, -25, 18, '#3B82F6', 1, ARRAY['consciousness', 'upload', 'immortality']),
  ('metamaterials', 'Metamaterials enable invisibility cloaks', 'Engineered materials manipulating electromagnetic waves', -115, -65, 8, '#3B82F6', 1, ARRAY['materials', 'physics', 'invisibility']),
  ('6g-telepathy', '6G networks enable digital telepathy', 'Brain-computer interfaces connected via wireless', -70, -80, 15, '#3B82F6', 1, ARRAY['6G', 'telepathy', 'wireless']),
  
  -- More Science cluster claims
  ('dark-matter-solved', 'Dark matter mystery will be solved', 'New particle physics theories explaining cosmic structure', 130, -60, 17, '#10B981', 2, ARRAY['physics', 'dark-matter', 'cosmology']),
  ('life-on-mars', 'Microbial life exists on Mars', 'Subsurface organisms detected in Martian samples', 85, -85, 16, '#10B981', 2, ARRAY['astrobiology', 'Mars', 'life']),
  ('aging-reversed', 'Human aging can be fully reversed', 'Cellular reprogramming reversing biological age', 140, -45, 19, '#10B981', 2, ARRAY['longevity', 'aging', 'biology']),
  ('room-temperature-superconductor', 'Room temperature superconductors discovered', 'Revolutionary materials enabling lossless power transmission', 95, -75, 18, '#10B981', 2, ARRAY['superconductors', 'materials', 'energy']),
  ('consciousness-measurement', 'Consciousness can be scientifically measured', 'Integrated information theory validated empirically', 115, -35, 14, '#10B981', 2, ARRAY['consciousness', 'neuroscience', 'measurement']),
  ('time-travel-possible', 'Time travel is theoretically possible', 'Closed timelike curves in general relativity', 75, -65, 12, '#10B981', 2, ARRAY['physics', 'time', 'relativity']),
  ('parallel-universes', 'Parallel universes are real', 'Many-worlds interpretation of quantum mechanics', 105, -55, 13, '#10B981', 2, ARRAY['quantum', 'multiverse', 'physics']),
  ('synthetic-biology', 'Synthetic organisms will terraform planets', 'Engineered microbes transforming planetary atmospheres', 125, -25, 15, '#10B981', 2, ARRAY['synthetic-biology', 'terraforming', 'planets']),
  ('quantum-consciousness', 'Consciousness arises from quantum processes', 'Microtubules in neurons exhibiting quantum coherence', 80, -40, 11, '#10B981', 2, ARRAY['quantum', 'consciousness', 'brain']),
  ('gene-drive-mosquitoes', 'Gene drives will eliminate disease vectors', 'Genetically modified mosquitoes preventing malaria transmission', 135, -70, 14, '#10B981', 2, ARRAY['gene-drive', 'disease', 'genetics']),
  
  -- More Philosophy cluster claims
  ('moral-realism', 'Objective moral truths exist', 'Ethical facts independent of human opinions', -30, 120, 14, '#8B5CF6', 3, ARRAY['ethics', 'morality', 'objectivity']),
  ('personal-identity', 'Personal identity is an illusion', 'No persistent self across time and change', 30, 85, 12, '#8B5CF6', 3, ARRAY['identity', 'self', 'persistence']),
  ('meaning-of-life', 'Life has inherent meaning', 'Purpose exists independent of human construction', -10, 140, 16, '#8B5CF6', 3, ARRAY['meaning', 'purpose', 'existence']),
  ('mind-body-dualism', 'Mind and body are separate substances', 'Consciousness cannot be reduced to physical processes', 10, 95, 13, '#8B5CF6', 3, ARRAY['dualism', 'mind', 'consciousness']),
  ('determinism-true', 'Hard determinism is true', 'All events including human actions are causally determined', -25, 105, 15, '#8B5CF6', 3, ARRAY['determinism', 'causation', 'freedom']),
  ('nihilism-correct', 'Nihilism is the correct worldview', 'Life has no inherent meaning or value', 25, 125, 11, '#8B5CF6', 3, ARRAY['nihilism', 'meaning', 'value']),
  ('panpsychism', 'Consciousness is a fundamental property', 'All matter has some form of conscious experience', -5, 115, 14, '#8B5CF6', 3, ARRAY['panpsychism', 'consciousness', 'matter']),
  ('ethical-vegetarianism', 'Eating animals is morally wrong', 'Sentient beings have rights not to be harmed', 15, 75, 12, '#8B5CF6', 3, ARRAY['ethics', 'animals', 'vegetarianism']),
  ('absurdism-response', 'Absurdism is the proper response to meaninglessness', 'Embracing the absurd rather than seeking false meaning', -15, 125, 10, '#8B5CF6', 3, ARRAY['absurdism', 'meaning', 'Camus']),
  ('aesthetic-realism', 'Aesthetic properties are objective', 'Beauty and artistic value exist independent of observers', 35, 105, 9, '#8B5CF6', 3, ARRAY['aesthetics', 'beauty', 'objectivity']),
  
  -- More Politics cluster claims
  ('direct-democracy', 'Direct democracy via technology is optimal', 'Digital platforms enabling true participatory governance', -140, 120, 15, '#EF4444', 4, ARRAY['democracy', 'technology', 'participation']),
  ('anarchism-viable', 'Anarchism is a viable political system', 'Voluntary associations can replace state governance', -90, 85, 13, '#EF4444', 4, ARRAY['anarchism', 'governance', 'voluntary']),
  ('globalism-inevitable', 'World government is inevitable', 'Global challenges requiring supranational authority', -110, 140, 16, '#EF4444', 4, ARRAY['globalism', 'world-government', 'authority']),
  ('voting-mandatory', 'Voting should be mandatory', 'Compulsory participation improving democratic legitimacy', -85, 125, 12, '#EF4444', 4, ARRAY['voting', 'mandatory', 'participation']),
  ('capitalism-collapse', 'Capitalism will collapse within decades', 'Internal contradictions leading to systemic failure', -125, 105, 18, '#EF4444', 4, ARRAY['capitalism', 'collapse', 'economics']),
  ('surveillance-state', 'Surveillance states are inevitable', 'Technology making total monitoring economically viable', -95, 115, 17, '#EF4444', 4, ARRAY['surveillance', 'state', 'monitoring']),
  ('nation-states-obsolete', 'Nation-states are becoming obsolete', 'Global networks replacing territorial sovereignty', -130, 85, 14, '#EF4444', 4, ARRAY['nation-state', 'sovereignty', 'globalization']),
  ('technocracy-superior', 'Technocracy is superior to democracy', 'Expert rule more effective than popular governance', -75, 135, 13, '#EF4444', 4, ARRAY['technocracy', 'expertise', 'governance']),
  ('revolution-necessary', 'Revolutionary change is necessary', 'Reform insufficient for addressing systemic problems', -115, 125, 15, '#EF4444', 4, ARRAY['revolution', 'change', 'reform']),
  ('political-correctness', 'Political correctness threatens free speech', 'Social pressure creating new forms of censorship', -105, 95, 11, '#EF4444', 4, ARRAY['free-speech', 'censorship', 'PC']),
  
  -- More Economics cluster claims
  ('post-scarcity', 'Post-scarcity economy is achievable', 'Technology eliminating material want for all humans', 90, 115, 17, '#F59E0B', 5, ARRAY['post-scarcity', 'abundance', 'technology']),
  ('wealth-inequality', 'Extreme wealth inequality is unsustainable', 'Concentration of wealth threatening social stability', 110, 85, 16, '#F59E0B', 5, ARRAY['inequality', 'wealth', 'stability']),
  ('circular-economy', 'Circular economy will replace linear model', 'Closed-loop systems eliminating waste and extraction', 85, 135, 14, '#F59E0B', 5, ARRAY['circular', 'sustainability', 'waste']),
  ('carbon-tax', 'Global carbon tax is essential', 'Pricing carbon emissions to address climate change', 125, 95, 15, '#F59E0B', 5, ARRAY['carbon-tax', 'climate', 'pricing']),
  ('digital-currency', 'Central bank digital currencies replace cash', 'Government-issued digital money becoming standard', 75, 105, 13, '#F59E0B', 5, ARRAY['CBDC', 'digital', 'currency']),
  ('gig-economy', 'Gig economy is the future of work', 'Independent contractors replacing traditional employment', 105, 125, 12, '#F59E0B', 5, ARRAY['gig', 'work', 'contractors']),
  ('resource-wars', 'Resource scarcity will cause future wars', 'Competition for water and minerals driving conflict', 95, 75, 18, '#F59E0B', 5, ARRAY['resources', 'war', 'scarcity']),
  ('sharing-economy', 'Sharing economy reduces material consumption', 'Access-based consumption replacing ownership models', 115, 115, 11, '#F59E0B', 5, ARRAY['sharing', 'consumption', 'access']),
  ('sovereign-wealth', 'Sovereign wealth funds will dominate markets', 'State-controlled capital reshaping global finance', 135, 105, 14, '#F59E0B', 5, ARRAY['sovereign', 'wealth', 'state']),
  ('algorithmic-trading', 'Algorithmic trading destabilizes markets', 'High-frequency trading creating systemic risks', 70, 125, 13, '#F59E0B', 5, ARRAY['algorithms', 'trading', 'risk']),
  
  -- Health & Medicine cluster claims
  ('precision-medicine', 'Precision medicine will personalize all treatments', 'Genomic data enabling individualized therapeutic approaches', -220, -10, 16, '#EC4899', 6, ARRAY['precision', 'genomics', 'personalized']),
  ('immortality-achievable', 'Biological immortality is achievable', 'Senescence can be completely eliminated through intervention', -185, 15, 19, '#EC4899', 6, ARRAY['immortality', 'aging', 'senescence']),
  ('mental-health-epidemic', 'Mental health crisis is unprecedented', 'Modern society creating widespread psychological disorders', -215, 25, 17, '#EC4899', 6, ARRAY['mental-health', 'crisis', 'society']),
  ('antibiotic-resistance', 'Antibiotic resistance threatens civilization', 'Bacterial evolution making modern medicine obsolete', -190, -25, 18, '#EC4899', 6, ARRAY['antibiotics', 'resistance', 'bacteria']),
  ('gene-therapy', 'Gene therapy will cure most diseases', 'Genetic modification eliminating hereditary conditions', -175, 5, 15, '#EC4899', 6, ARRAY['gene-therapy', 'genetic', 'disease']),
  ('pandemic-inevitable', 'Pandemic worse than COVID is inevitable', 'Viral evolution and global connectivity ensuring future outbreaks', -225, -20, 16, '#EC4899', 6, ARRAY['pandemic', 'virus', 'inevitable']),
  ('telemedicine-standard', 'Telemedicine will become standard care', 'Remote diagnosis and treatment replacing in-person visits', -195, 35, 13, '#EC4899', 6, ARRAY['telemedicine', 'remote', 'digital']),
  ('bioprinting-organs', 'Bioprinting will end organ shortages', '3D printed organs using patient stem cells', -170, -15, 14, '#EC4899', 6, ARRAY['bioprinting', 'organs', '3D']),
  ('microbiome-therapy', 'Microbiome therapy revolutionizes medicine', 'Gut bacteria manipulation treating diverse conditions', -205, 10, 12, '#EC4899', 6, ARRAY['microbiome', 'bacteria', 'gut']),
  ('neural-prosthetics', 'Neural prosthetics restore full function', 'Brain-controlled artificial limbs matching natural ability', -180, -35, 15, '#EC4899', 6, ARRAY['prosthetics', 'neural', 'brain']),
  
  -- Environment cluster claims
  ('climate-irreversible', 'Climate change effects are irreversible', 'Feedback loops making warming self-sustaining', 185, -15, 18, '#84CC16', 7, ARRAY['climate', 'irreversible', 'feedback']),
  ('renewable-transition', 'Renewable energy transition by 2040', 'Solar and wind becoming dominant energy sources', 225, 10, 16, '#84CC16', 7, ARRAY['renewable', 'solar', 'wind']),
  ('biodiversity-collapse', 'Sixth mass extinction is underway', 'Human activity causing unprecedented species loss', 195, -30, 19, '#84CC16', 7, ARRAY['extinction', 'biodiversity', 'species']),
  ('geoengineering-necessary', 'Geoengineering is necessary for climate', 'Technical interventions required to prevent catastrophe', 170, 20, 15, '#84CC16', 7, ARRAY['geoengineering', 'climate', 'intervention']),
  ('ocean-acidification', 'Ocean acidification threatens marine life', 'CO2 absorption changing ocean chemistry catastrophically', 210, -5, 17, '#84CC16', 7, ARRAY['ocean', 'acidification', 'marine']),
  ('plastic-pollution', 'Plastic pollution requires global ban', 'Microplastics contaminating entire food chain', 190, 25, 14, '#84CC16', 7, ARRAY['plastic', 'pollution', 'microplastics']),
  ('rewilding-essential', 'Large-scale rewilding is essential', 'Restoring natural ecosystems to reverse biodiversity loss', 220, -25, 13, '#84CC16', 7, ARRAY['rewilding', 'ecosystems', 'restoration']),
  ('carbon-capture', 'Carbon capture technology will save us', 'Direct air capture removing CO2 from atmosphere', 175, -5, 14, '#84CC16', 7, ARRAY['carbon-capture', 'CO2', 'technology']),
  ('forest-tipping-point', 'Amazon rainforest past tipping point', 'Deforestation causing irreversible ecosystem collapse', 205, 15, 16, '#84CC16', 7, ARRAY['Amazon', 'deforestation', 'tipping']),
  ('nuclear-waste', 'Nuclear waste problem is unsolvable', 'Radioactive materials posing permanent environmental threat', 180, 35, 12, '#84CC16', 7, ARRAY['nuclear', 'waste', 'radioactive']),
  
  -- Education cluster claims
  ('ai-tutors', 'AI tutors will replace human teachers', 'Personalized artificial intelligence providing superior education', -15, -170, 15, '#F97316', 8, ARRAY['AI', 'tutors', 'personalized']),
  ('college-obsolete', 'Traditional colleges will become obsolete', 'Online learning and alternative credentials replacing degrees', 20, -185, 16, '#F97316', 8, ARRAY['college', 'online', 'credentials']),
  ('learning-styles', 'Learning styles theory is scientifically invalid', 'No evidence for different optimal learning modalities', -35, -155, 12, '#F97316', 8, ARRAY['learning-styles', 'science', 'evidence']),
  ('standardized-testing', 'Standardized testing harms education', 'Test-focused curricula reducing genuine learning', 5, -165, 14, '#F97316', 8, ARRAY['testing', 'standardized', 'curriculum']),
  ('critical-thinking', 'Critical thinking cannot be taught', 'Logical reasoning being domain-specific skill', -25, -180, 11, '#F97316', 8, ARRAY['critical-thinking', 'reasoning', 'domain']),
  ('homework-ineffective', 'Homework is largely ineffective', 'Little correlation between homework and academic achievement', 15, -155, 10, '#F97316', 8, ARRAY['homework', 'effectiveness', 'achievement']),
  ('grade-inflation', 'Grade inflation undermines education', 'Artificially high grades reducing academic standards', -5, -185, 13, '#F97316', 8, ARRAY['grades', 'inflation', 'standards']),
  ('vocational-training', 'Vocational training is undervalued', 'Technical skills more economically valuable than liberal arts', 30, -170, 14, '#F97316', 8, ARRAY['vocational', 'technical', 'skills']),
  ('early-childhood', 'Early childhood education is most important', 'Ages 0-5 having greatest impact on life outcomes', -20, -140, 17, '#F97316', 8, ARRAY['early-childhood', 'development', 'outcomes']),
  ('digital-divide', 'Digital divide perpetuates inequality', 'Technology access determining educational opportunities', 10, -175, 15, '#F97316', 8, ARRAY['digital-divide', 'inequality', 'access']),
  
  -- Culture & Society cluster claims
  ('cultural-relativism', 'Cultural relativism is morally correct', 'No culture superior to others in moral terms', -170, -135, 13, '#6366F1', 9, ARRAY['culture', 'relativism', 'morality']),
  ('social-media-harmful', 'Social media is net harmful to society', 'Platforms promoting division and mental health issues', -135, -165, 16, '#6366F1', 9, ARRAY['social-media', 'harmful', 'division']),
  ('gender-spectrum', 'Gender exists on a spectrum', 'Binary gender categories insufficient for human diversity', -155, -120, 14, '#6366F1', 9, ARRAY['gender', 'spectrum', 'diversity']),
  ('religion-declining', 'Religious belief is in terminal decline', 'Secularization making religion obsolete in modern societies', -185, -155, 15, '#6366F1', 9, ARRAY['religion', 'decline', 'secularization']),
  ('cancel-culture', 'Cancel culture threatens open discourse', 'Social ostracism creating chilling effect on speech', -120, -140, 12, '#6366F1', 9, ARRAY['cancel-culture', 'discourse', 'speech']),
  ('cultural-appropriation', 'Cultural appropriation is always harmful', 'Using elements from other cultures constitutes exploitation', -165, -170, 11, '#6366F1', 9, ARRAY['appropriation', 'culture', 'exploitation']),
  ('individualism-toxic', 'Extreme individualism is toxic', 'Hyper-individualistic culture undermining social cohesion', -145, -185, 14, '#6366F1', 9, ARRAY['individualism', 'toxic', 'cohesion']),
  ('art-subjective', 'Artistic value is purely subjective', 'No objective standards for judging aesthetic worth', -175, -125, 10, '#6366F1', 9, ARRAY['art', 'subjective', 'aesthetic']),
  ('traditional-family', 'Traditional family structure is optimal', 'Nuclear families providing best environment for children', -130, -180, 13, '#6366F1', 9, ARRAY['family', 'traditional', 'children']),
  ('globalization-homogenizes', 'Globalization destroys cultural diversity', 'Economic integration eliminating local cultural practices', -160, -140, 15, '#6366F1', 9, ARRAY['globalization', 'diversity', 'culture']),
  
  -- Space & Astronomy cluster claims
  ('mars-colonization', 'Mars colonization will happen this century', 'Self-sustaining human settlements on Mars by 2100', 135, -165, 17, '#8B5CF6', 10, ARRAY['Mars', 'colonization', 'settlement']),
  ('alien-life', 'Alien life will be discovered within decades', 'Microbial or technological signatures detected soon', 170, -185, 18, '#8B5CF6', 10, ARRAY['aliens', 'life', 'discovery']),
  ('space-elevator', 'Space elevators are economically viable', 'Carbon nanotube tethers making orbit access cheap', 155, -135, 14, '#8B5CF6', 10, ARRAY['space-elevator', 'nanotubes', 'orbit']),
  ('asteroid-mining', 'Asteroid mining will transform economy', 'Space-based resources making rare elements abundant', 185, -150, 16, '#8B5CF6', 10, ARRAY['asteroid', 'mining', 'resources']),
  ('fermi-paradox', 'Great Filter explains Fermi paradox', 'Civilizations destroying themselves before becoming detectable', 120, -180, 15, '#8B5CF6', 10, ARRAY['Fermi', 'filter', 'civilization']),
  ('space-warfare', 'Space warfare is inevitable', 'Military conflict extending to orbital and lunar domains', 175, -170, 13, '#8B5CF6', 10, ARRAY['space', 'warfare', 'military']),
  ('generation-ships', 'Generation ships will carry humans to stars', 'Multi-generational voyages to nearby star systems', 140, -145, 12, '#8B5CF6', 10, ARRAY['generation-ships', 'interstellar', 'voyage']),
  ('dark-energy', 'Dark energy will accelerate universe death', 'Cosmic expansion eventually leading to heat death', 165, -160, 14, '#8B5CF6', 10, ARRAY['dark-energy', 'expansion', 'heat-death']),
  ('wormholes-real', 'Traversable wormholes are possible', 'Exotic matter enabling faster-than-light travel', 125, -155, 11, '#8B5CF6', 10, ARRAY['wormholes', 'FTL', 'exotic-matter']),
  ('space-tourism', 'Space tourism will become mainstream', 'Orbital flights accessible to middle-class consumers', 180, -125, 13, '#8B5CF6', 10, ARRAY['space-tourism', 'orbital', 'accessible'])
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
  ('fusion-energy', 'crypto-replace-fiat', 'related', 0.4),
  
  -- New Technology connections
  ('ar-reality', 'brain-interface', 'related', 0.7),
  ('autonomous-vehicles', 'automation-unemployment', 'supports', 0.8),
  ('robot-workers', 'automation-unemployment', 'supports', 0.9),
  ('neural-networks', 'ai-consciousness', 'supports', 0.8),
  ('biocomputing', 'aging-reversed', 'related', 0.6),
  ('space-internet', 'mars-colonization', 'supports', 0.7),
  ('holographic-displays', 'ar-reality', 'supports', 0.8),
  ('brain-uploading', 'ai-consciousness', 'supports', 0.7),
  ('brain-uploading', 'immortality-achievable', 'supports', 0.9),
  ('metamaterials', 'quantum-computing', 'related', 0.5),
  ('6g-telepathy', 'brain-interface', 'supports', 0.8),
  
  -- New Science connections
  ('dark-matter-solved', 'parallel-universes', 'related', 0.6),
  ('life-on-mars', 'alien-life', 'supports', 0.8),
  ('aging-reversed', 'immortality-achievable', 'supports', 0.9),
  ('room-temperature-superconductor', 'renewable-transition', 'supports', 0.8),
  ('consciousness-measurement', 'ai-consciousness', 'related', 0.7),
  ('time-travel-possible', 'parallel-universes', 'related', 0.7),
  ('synthetic-biology', 'mars-colonization', 'supports', 0.6),
  ('quantum-consciousness', 'consciousness-hard', 'refutes', 0.8),
  ('gene-drive-mosquitoes', 'gene-therapy', 'related', 0.7),
  
  -- New Philosophy connections
  ('moral-realism', 'cultural-relativism', 'refutes', 0.9),
  ('personal-identity', 'free-will-illusion', 'supports', 0.8),
  ('meaning-of-life', 'nihilism-correct', 'refutes', 0.9),
  ('mind-body-dualism', 'consciousness-hard', 'supports', 0.8),
  ('determinism-true', 'free-will-illusion', 'supports', 0.9),
  ('panpsychism', 'consciousness-hard', 'refutes', 0.7),
  ('ethical-vegetarianism', 'moral-realism', 'related', 0.6),
  ('absurdism-response', 'nihilism-correct', 'related', 0.7),
  ('aesthetic-realism', 'art-subjective', 'refutes', 0.9),
  
  -- New Politics connections
  ('direct-democracy', 'democracy-decline', 'refutes', 0.8),
  ('anarchism-viable', 'nation-states-obsolete', 'supports', 0.8),
  ('globalism-inevitable', 'nation-states-obsolete', 'supports', 0.9),
  ('voting-mandatory', 'democracy-decline', 'refutes', 0.7),
  ('capitalism-collapse', 'wealth-inequality', 'supports', 0.8),
  ('surveillance-state', 'privacy-dead', 'supports', 0.9),
  ('technocracy-superior', 'democracy-decline', 'supports', 0.7),
  ('revolution-necessary', 'capitalism-collapse', 'supports', 0.8),
  ('political-correctness', 'cancel-culture', 'related', 0.8),
  
  -- New Economics connections
  ('post-scarcity', 'automation-unemployment', 'refutes', 0.8),
  ('wealth-inequality', 'capitalism-collapse', 'supports', 0.8),
  ('circular-economy', 'degrowth-necessary', 'supports', 0.7),
  ('carbon-tax', 'climate-irreversible', 'refutes', 0.7),
  ('digital-currency', 'crypto-replace-fiat', 'related', 0.8),
  ('gig-economy', 'automation-unemployment', 'related', 0.6),
  ('resource-wars', 'climate-tipping', 'supports', 0.8),
  ('sharing-economy', 'post-scarcity', 'supports', 0.6),
  ('sovereign-wealth', 'capitalism-collapse', 'related', 0.5),
  ('algorithmic-trading', 'capitalism-collapse', 'supports', 0.6),
  
  -- Health & Medicine connections
  ('precision-medicine', 'gene-therapy', 'supports', 0.8),
  ('immortality-achievable', 'aging-reversed', 'supports', 0.9),
  ('mental-health-epidemic', 'social-media-harmful', 'supports', 0.7),
  ('antibiotic-resistance', 'pandemic-inevitable', 'supports', 0.8),
  ('gene-therapy', 'crispr-ethics', 'related', 0.8),
  ('pandemic-inevitable', 'globalism-inevitable', 'refutes', 0.6),
  ('telemedicine-standard', 'ai-tutors', 'related', 0.6),
  ('bioprinting-organs', 'gene-therapy', 'related', 0.7),
  ('microbiome-therapy', 'precision-medicine', 'supports', 0.7),
  ('neural-prosthetics', 'brain-interface', 'supports', 0.9),
  
  -- Environment connections
  ('climate-irreversible', 'climate-tipping', 'supports', 0.9),
  ('renewable-transition', 'fusion-energy', 'supports', 0.8),
  ('biodiversity-collapse', 'climate-tipping', 'supports', 0.8),
  ('geoengineering-necessary', 'climate-irreversible', 'supports', 0.8),
  ('ocean-acidification', 'climate-tipping', 'supports', 0.8),
  ('plastic-pollution', 'biodiversity-collapse', 'supports', 0.7),
  ('rewilding-essential', 'biodiversity-collapse', 'refutes', 0.8),
  ('carbon-capture', 'climate-irreversible', 'refutes', 0.8),
  ('forest-tipping-point', 'climate-tipping', 'supports', 0.9),
  ('nuclear-waste', 'renewable-transition', 'refutes', 0.6),
  
  -- Education connections
  ('ai-tutors', 'neural-networks', 'supports', 0.8),
  ('college-obsolete', 'digital-divide', 'related', 0.6),
  ('learning-styles', 'standardized-testing', 'related', 0.5),
  ('standardized-testing', 'grade-inflation', 'related', 0.7),
  ('critical-thinking', 'ai-tutors', 'refutes', 0.6),
  ('homework-ineffective', 'standardized-testing', 'refutes', 0.7),
  ('grade-inflation', 'college-obsolete', 'supports', 0.6),
  ('vocational-training', 'college-obsolete', 'supports', 0.8),
  ('early-childhood', 'ai-tutors', 'refutes', 0.5),
  ('digital-divide', 'wealth-inequality', 'supports', 0.8),
  
  -- Culture & Society connections
  ('cultural-relativism', 'moral-realism', 'refutes', 0.9),
  ('social-media-harmful', 'mental-health-epidemic', 'supports', 0.8),
  ('gender-spectrum', 'traditional-family', 'refutes', 0.7),
  ('religion-declining', 'meaning-of-life', 'refutes', 0.7),
  ('cancel-culture', 'political-correctness', 'related', 0.8),
  ('cultural-appropriation', 'globalization-homogenizes', 'related', 0.6),
  ('individualism-toxic', 'social-media-harmful', 'supports', 0.7),
  ('art-subjective', 'aesthetic-realism', 'refutes', 0.9),
  ('traditional-family', 'early-childhood', 'supports', 0.6),
  ('globalization-homogenizes', 'nation-states-obsolete', 'supports', 0.7),
  
  -- Space & Astronomy connections
  ('mars-colonization', 'life-on-mars', 'related', 0.7),
  ('alien-life', 'fermi-paradox', 'refutes', 0.8),
  ('space-elevator', 'asteroid-mining', 'supports', 0.8),
  ('asteroid-mining', 'resource-wars', 'refutes', 0.8),
  ('fermi-paradox', 'alien-life', 'refutes', 0.8),
  ('space-warfare', 'mars-colonization', 'refutes', 0.6),
  ('generation-ships', 'mars-colonization', 'related', 0.7),
  ('dark-energy', 'dark-matter-solved', 'related', 0.7),
  ('wormholes-real', 'time-travel-possible', 'supports', 0.8),
  ('space-tourism', 'mars-colonization', 'supports', 0.6),
  
  -- Cross-cluster connections
  ('ai-consciousness', 'consciousness-measurement', 'related', 0.8),
  ('automation-unemployment', 'ubi-necessary', 'supports', 0.9),
  ('climate-tipping', 'resource-wars', 'supports', 0.8),
  ('brain-interface', 'neural-prosthetics', 'supports', 0.9),
  ('quantum-computing', 'room-temperature-superconductor', 'related', 0.6),
  ('gene-therapy', 'aging-reversed', 'supports', 0.8),
  ('surveillance-state', 'social-media-harmful', 'supports', 0.7),
  ('mars-colonization', 'space-internet', 'requires', 0.8),
  ('renewable-transition', 'carbon-capture', 'supports', 0.7),
  ('digital-currency', 'surveillance-state', 'supports', 0.7)
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
