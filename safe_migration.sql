-- Safe GetReceipts.org Database Migration (No RLS Policies)
-- Run this in Supabase SQL Editor - No destructive warnings

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create users table first (needed for foreign keys)
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    email text UNIQUE NOT NULL,
    name text,
    avatar_url text,
    reputation_score integer DEFAULT 0,
    created_at timestamp DEFAULT now()
);

-- Create actors table
CREATE TABLE IF NOT EXISTS actors (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    bio text,
    links jsonb
);

-- Create claims table with proper user reference
CREATE TABLE IF NOT EXISTS claims (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL UNIQUE,
    text_short text NOT NULL,
    text_long text,
    topics text[],
    created_by uuid REFERENCES users(id),
    created_at timestamp DEFAULT now()
);

-- Create aggregates table
CREATE TABLE IF NOT EXISTS aggregates (
    claim_id uuid PRIMARY KEY NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    consensus_score numeric,
    support_count integer DEFAULT 0,
    dispute_count integer DEFAULT 0,
    support_weight numeric,
    dispute_weight numeric
);

-- Create model_reviews table
CREATE TABLE IF NOT EXISTS model_reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    claim_id uuid REFERENCES claims(id) ON DELETE CASCADE,
    model text NOT NULL,
    score numeric NOT NULL,
    rationale text,
    version text,
    reviewed_at timestamp DEFAULT now()
);

-- Create positions table
CREATE TABLE IF NOT EXISTS positions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    claim_id uuid REFERENCES claims(id) ON DELETE CASCADE,
    actor_id uuid REFERENCES actors(id),
    stance text NOT NULL,
    quote text,
    link text
);

-- Create sources table
CREATE TABLE IF NOT EXISTS sources (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    claim_id uuid NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    type text NOT NULL,
    title text,
    url text,
    doi text,
    venue text,
    date timestamp,
    cred_score numeric,
    meta jsonb
);

-- Knowledge artifacts from Knowledge_Chipper
CREATE TABLE IF NOT EXISTS knowledge_people (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    claim_id uuid NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    name text NOT NULL,
    bio text,
    expertise text[],
    credibility_score numeric,
    sources jsonb,
    created_by uuid REFERENCES users(id),
    created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS knowledge_jargon (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    claim_id uuid NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    term text NOT NULL,
    definition text NOT NULL,
    domain text,
    related_terms text[],
    examples text[],
    created_by uuid REFERENCES users(id),
    created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS knowledge_models (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    claim_id uuid NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text NOT NULL,
    domain text,
    key_concepts text[],
    relationships jsonb,
    created_by uuid REFERENCES users(id),
    created_at timestamp DEFAULT now()
);

-- Claim relationships for graph visualization
CREATE TABLE IF NOT EXISTS claim_relationships (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    from_claim_id uuid NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    to_claim_id uuid NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    relationship_type text NOT NULL,
    strength numeric DEFAULT 0.5,
    evidence text,
    created_by uuid REFERENCES users(id),
    created_at timestamp DEFAULT now()
);

-- User engagement system
CREATE TABLE IF NOT EXISTS claim_votes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    claim_id uuid NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    vote_type text NOT NULL,
    created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS claim_comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    claim_id uuid NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    parent_id uuid REFERENCES claim_comments(id) ON DELETE CASCADE,
    content text NOT NULL,
    vote_score integer DEFAULT 0,
    created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comment_votes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment_id uuid NOT NULL REFERENCES claim_comments(id) ON DELETE CASCADE,
    vote_type text NOT NULL,
    created_at timestamp DEFAULT now()
);

-- User roles and permissions
CREATE TABLE IF NOT EXISTS user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL UNIQUE,
    description text,
    can_create_claims integer DEFAULT 0,
    can_edit_claims integer DEFAULT 0,
    can_delete_claims integer DEFAULT 0,
    can_add_knowledge integer DEFAULT 0,
    can_edit_knowledge integer DEFAULT 0,
    can_delete_knowledge integer DEFAULT 0,
    can_moderate_comments integer DEFAULT 0,
    created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_role_assignments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id uuid NOT NULL REFERENCES user_roles(id) ON DELETE CASCADE,
    assigned_by uuid REFERENCES users(id),
    assigned_at timestamp DEFAULT now()
);

-- API Keys for knowledge_chipper and other external services
CREATE TABLE IF NOT EXISTS api_keys (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name text NOT NULL,
    key_hash text NOT NULL,
    permissions text[],
    last_used timestamp,
    expires_at timestamp,
    is_active integer DEFAULT 1,
    created_at timestamp DEFAULT now()
);

-- Audit log for all data changes
CREATE TABLE IF NOT EXISTS audit_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid REFERENCES users(id),
    api_key_id uuid REFERENCES api_keys(id),
    action text NOT NULL,
    table_name text NOT NULL,
    record_id uuid NOT NULL,
    old_values jsonb,
    new_values jsonb,
    ip_address text,
    user_agent text,
    created_at timestamp DEFAULT now()
);

-- Insert default roles
INSERT INTO user_roles (name, description, can_create_claims, can_edit_claims, can_delete_claims, can_add_knowledge, can_edit_knowledge, can_delete_knowledge, can_moderate_comments)
VALUES 
    ('admin', 'Full system access', 1, 1, 1, 1, 1, 1, 1),
    ('contributor', 'Can add and edit content', 1, 1, 0, 1, 1, 0, 0),
    ('knowledge_bot', 'Automated knowledge addition', 0, 0, 0, 1, 0, 0, 0),
    ('viewer', 'Read-only access', 0, 0, 0, 0, 0, 0, 0)
ON CONFLICT (name) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_table_name ON audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_user_id ON user_role_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_claims_created_by ON claims(created_by);
CREATE INDEX IF NOT EXISTS idx_knowledge_people_claim_id ON knowledge_people(claim_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_jargon_claim_id ON knowledge_jargon(claim_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_models_claim_id ON knowledge_models(claim_id);

-- Insert demo data
INSERT INTO claims (slug, text_short, text_long, topics, created_by) 
VALUES ('demo-claim-123', 'Climate change is real.', 'Long-form articulation that anthropogenic greenhouse gas emissions are driving statistically significant warming trends.', ARRAY['climate','science'], NULL)
ON CONFLICT (slug) DO NOTHING;

-- Get the claim ID for the demo claim and insert related data
DO $$
DECLARE
    demo_claim_id uuid;
BEGIN
    SELECT id INTO demo_claim_id FROM claims WHERE slug = 'demo-claim-123';
    
    IF demo_claim_id IS NOT NULL THEN
        INSERT INTO sources (claim_id, type, title, url) VALUES
            (demo_claim_id, 'report', 'IPCC AR6 Synthesis', 'https://www.ipcc.ch/report/ar6/syr/'),
            (demo_claim_id, 'org', 'NASA Climate Evidence', 'https://climate.nasa.gov/evidence/')
        ON CONFLICT DO NOTHING;
        
        INSERT INTO positions (claim_id, stance, quote) VALUES
            (demo_claim_id, 'support', '97% of climatologists')
        ON CONFLICT DO NOTHING;
        
        INSERT INTO aggregates (claim_id, consensus_score, support_count, dispute_count) VALUES
            (demo_claim_id, 0.97, 2, 0)
        ON CONFLICT (claim_id) DO NOTHING;
    END IF;
END $$;

-- Comments for documentation
COMMENT ON TABLE user_roles IS 'Defines permission-based roles for users';
COMMENT ON TABLE user_role_assignments IS 'Maps users to their assigned roles';
COMMENT ON TABLE api_keys IS 'API keys for external services like knowledge_chipper';
COMMENT ON TABLE audit_log IS 'Comprehensive audit trail for all data changes';

-- Verify setup
SELECT 'Database setup complete!' as status;
SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = 'public';
SELECT name as available_roles FROM user_roles ORDER BY name;
