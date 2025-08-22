-- Enhanced GetReceipts Schema Migration
-- Run this to add Knowledge_Chipper integration and user engagement features

-- Knowledge artifacts from Knowledge_Chipper
CREATE TABLE IF NOT EXISTS knowledge_people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  bio TEXT,
  expertise TEXT[],
  credibility_score NUMERIC(3,2),
  sources JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS knowledge_jargon (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  term TEXT NOT NULL,
  definition TEXT NOT NULL,
  domain TEXT,
  related_terms TEXT[],
  examples TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS knowledge_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  domain TEXT,
  key_concepts TEXT[],
  relationships JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Claim relationships for graph visualization
CREATE TABLE IF NOT EXISTS claim_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  to_claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL CHECK (relationship_type IN ('supports', 'contradicts', 'extends', 'contextualizes')),
  strength NUMERIC(3,2) DEFAULT 0.5,
  evidence TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(from_claim_id, to_claim_id, relationship_type)
);

-- User engagement system
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  reputation_score INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS claim_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down', 'credible', 'not_credible')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, claim_id, vote_type)
);

CREATE TABLE IF NOT EXISTS claim_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES claim_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  vote_score INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comment_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment_id UUID NOT NULL REFERENCES claim_comments(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, comment_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_knowledge_people_claim_id ON knowledge_people(claim_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_jargon_claim_id ON knowledge_jargon(claim_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_models_claim_id ON knowledge_models(claim_id);
CREATE INDEX IF NOT EXISTS idx_claim_relationships_from ON claim_relationships(from_claim_id);
CREATE INDEX IF NOT EXISTS idx_claim_relationships_to ON claim_relationships(to_claim_id);
CREATE INDEX IF NOT EXISTS idx_claim_votes_claim_id ON claim_votes(claim_id);
CREATE INDEX IF NOT EXISTS idx_claim_comments_claim_id ON claim_comments(claim_id);
CREATE INDEX IF NOT EXISTS idx_claim_comments_parent_id ON claim_comments(parent_id);

-- Add any missing columns to existing tables
ALTER TABLE claims ADD COLUMN IF NOT EXISTS text_long TEXT;
ALTER TABLE sources ADD COLUMN IF NOT EXISTS credibility_score NUMERIC(3,2);

-- Views for easier querying
CREATE OR REPLACE VIEW claim_with_artifacts AS
SELECT 
  c.*,
  agg.consensus_score,
  COUNT(DISTINCT kp.id) as people_count,
  COUNT(DISTINCT kj.id) as jargon_count,
  COUNT(DISTINCT km.id) as models_count,
  COUNT(DISTINCT cr.id) as relationships_count
FROM claims c
LEFT JOIN aggregates agg ON agg.claim_id = c.id
LEFT JOIN knowledge_people kp ON kp.claim_id = c.id
LEFT JOIN knowledge_jargon kj ON kj.claim_id = c.id
LEFT JOIN knowledge_models km ON km.claim_id = c.id
LEFT JOIN claim_relationships cr ON cr.from_claim_id = c.id
GROUP BY c.id, agg.consensus_score;

-- Function to calculate claim engagement score
CREATE OR REPLACE FUNCTION calculate_engagement_score(claim_uuid UUID)
RETURNS NUMERIC AS $$
DECLARE
  vote_score NUMERIC := 0;
  comment_score NUMERIC := 0;
  relationship_score NUMERIC := 0;
  artifact_score NUMERIC := 0;
  total_score NUMERIC := 0;
BEGIN
  -- Vote score (upvotes - downvotes, credible - not_credible)
  SELECT 
    COALESCE(SUM(CASE 
      WHEN vote_type = 'up' THEN 1
      WHEN vote_type = 'down' THEN -1
      WHEN vote_type = 'credible' THEN 2
      WHEN vote_type = 'not_credible' THEN -2
      ELSE 0
    END), 0) INTO vote_score
  FROM claim_votes 
  WHERE claim_id = claim_uuid;
  
  -- Comment engagement score
  SELECT 
    COALESCE(COUNT(*) * 0.5 + SUM(vote_score) * 0.1, 0) INTO comment_score
  FROM claim_comments 
  WHERE claim_id = claim_uuid;
  
  -- Relationship score (connected claims)
  SELECT 
    COALESCE(COUNT(*) * 0.3, 0) INTO relationship_score
  FROM claim_relationships 
  WHERE from_claim_id = claim_uuid OR to_claim_id = claim_uuid;
  
  -- Knowledge artifacts score
  SELECT 
    COALESCE(
      (SELECT COUNT(*) FROM knowledge_people WHERE claim_id = claim_uuid) * 0.2 +
      (SELECT COUNT(*) FROM knowledge_jargon WHERE claim_id = claim_uuid) * 0.1 +
      (SELECT COUNT(*) FROM knowledge_models WHERE claim_id = claim_uuid) * 0.3,
      0
    ) INTO artifact_score;
  
  total_score := vote_score + comment_score + relationship_score + artifact_score;
  
  RETURN total_score;
END;
$$ LANGUAGE plpgsql;

-- Insert demo data for testing (optional)
-- Uncomment these lines if you want sample data

/*
-- Demo user
INSERT INTO users (email, name) VALUES ('demo@example.com', 'Demo User') 
ON CONFLICT (email) DO NOTHING;

-- Get a demo claim ID (adjust this query based on your existing data)
WITH demo_claim AS (
  SELECT id FROM claims LIMIT 1
)
-- Demo knowledge artifacts
INSERT INTO knowledge_people (claim_id, name, bio, expertise, credibility_score)
SELECT id, 'Dr. Jane Smith', 'AI researcher and professor', ARRAY['Machine Learning', 'AI Ethics'], 0.85
FROM demo_claim;

INSERT INTO knowledge_jargon (claim_id, term, definition, domain, examples)
SELECT id, 'Large Language Model', 'A type of AI model trained on vast amounts of text data', 'AI/ML', ARRAY['GPT-4', 'BERT', 'T5']
FROM demo_claim;

INSERT INTO knowledge_models (claim_id, name, description, domain, key_concepts)
SELECT id, 'Transformer Architecture', 'The underlying neural network architecture powering modern LLMs', 'Deep Learning', ARRAY['Attention', 'Self-Attention', 'Multi-Head Attention']
FROM demo_claim;
*/

-- Grant permissions (adjust based on your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
