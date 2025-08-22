-- Authentication and Authorization Migration for GetReceipts.org
-- Run this in Supabase SQL Editor after the main schema is set up

-- Add created_by columns to existing tables (if not already present)
ALTER TABLE claims 
  ALTER COLUMN created_by TYPE uuid USING created_by::uuid,
  ADD CONSTRAINT claims_created_by_fkey FOREIGN KEY (created_by) REFERENCES users(id);

-- Add created_by to knowledge tables
ALTER TABLE knowledge_people ADD COLUMN created_by uuid REFERENCES users(id);
ALTER TABLE knowledge_jargon ADD COLUMN created_by uuid REFERENCES users(id);
ALTER TABLE knowledge_models ADD COLUMN created_by uuid REFERENCES users(id);
ALTER TABLE claim_relationships ADD COLUMN created_by uuid REFERENCES users(id);

-- Create user roles table
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

-- Create user role assignments table
CREATE TABLE IF NOT EXISTS user_role_assignments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id uuid NOT NULL REFERENCES user_roles(id) ON DELETE CASCADE,
    assigned_by uuid REFERENCES users(id),
    assigned_at timestamp DEFAULT now()
);

-- Create API keys table
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

-- Create audit log table
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

-- Enable Row Level Security (RLS) for enhanced security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can view their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Admin users can view all user data
CREATE POLICY "Admins can view all users" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura 
            JOIN user_roles ur ON ura.role_id = ur.id 
            WHERE ura.user_id::text = auth.uid()::text 
            AND ur.name = 'admin'
        )
    );

-- User roles are readable by all authenticated users
CREATE POLICY "User roles are readable" ON user_roles
    FOR SELECT TO authenticated USING (true);

-- Only admins can manage user roles
CREATE POLICY "Admins can manage user roles" ON user_roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura 
            JOIN user_roles ur ON ura.role_id = ur.id 
            WHERE ura.user_id::text = auth.uid()::text 
            AND ur.name = 'admin'
        )
    );

-- Users can view their own role assignments
CREATE POLICY "Users can view own role assignments" ON user_role_assignments
    FOR SELECT USING (user_id::text = auth.uid()::text);

-- Only admins can manage role assignments
CREATE POLICY "Admins can manage role assignments" ON user_role_assignments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura 
            JOIN user_roles ur ON ura.role_id = ur.id 
            WHERE ura.user_id::text = auth.uid()::text 
            AND ur.name = 'admin'
        )
    );

-- Users can view their own API keys
CREATE POLICY "Users can view own API keys" ON api_keys
    FOR SELECT USING (user_id::text = auth.uid()::text);

-- Users can manage their own API keys
CREATE POLICY "Users can manage own API keys" ON api_keys
    FOR ALL USING (user_id::text = auth.uid()::text);

-- Audit log is readable by admins only
CREATE POLICY "Admins can view audit log" ON audit_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_role_assignments ura 
            JOIN user_roles ur ON ura.role_id = ur.id 
            WHERE ura.user_id::text = auth.uid()::text 
            AND ur.name = 'admin'
        )
    );

-- Comments for documentation
COMMENT ON TABLE user_roles IS 'Defines permission-based roles for users';
COMMENT ON TABLE user_role_assignments IS 'Maps users to their assigned roles';
COMMENT ON TABLE api_keys IS 'API keys for external services like knowledge_chipper';
COMMENT ON TABLE audit_log IS 'Comprehensive audit trail for all data changes';

COMMENT ON COLUMN api_keys.key_hash IS 'SHA256 hash of the API key for secure storage';
COMMENT ON COLUMN api_keys.permissions IS 'Array of permission strings granted to this API key';
COMMENT ON COLUMN audit_log.action IS 'Type of action: CREATE, UPDATE, DELETE';
COMMENT ON COLUMN audit_log.table_name IS 'Name of the table that was modified';
COMMENT ON COLUMN audit_log.record_id IS 'ID of the record that was modified';
