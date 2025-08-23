-- Manual Setup for GetReceipts.org Authentication
-- Run this in Supabase SQL Editor

-- 1. Create admin user
INSERT INTO users (email, name, reputation_score)
VALUES ('matt@rainfall.llc', 'Matthew Greer', 100)
ON CONFLICT (email) DO NOTHING;

-- 2. Setup admin user with role and API key
DO $$
DECLARE
    admin_user_id uuid;
    admin_role_id uuid;
    api_key_value text;
    api_key_hash text;
BEGIN
    -- Get admin user ID
    SELECT id INTO admin_user_id FROM users WHERE email = 'matt@rainfall.llc';
    
    -- Get admin role ID
    SELECT id INTO admin_role_id FROM user_roles WHERE name = 'admin';
    
    -- Assign admin role if not already assigned
    INSERT INTO user_role_assignments (user_id, role_id, assigned_by)
    VALUES (admin_user_id, admin_role_id, admin_user_id)
    ON CONFLICT DO NOTHING;
    
    -- Generate API key
    api_key_value := 'gr_' || encode(gen_random_bytes(16), 'hex');
    api_key_hash := encode(digest(api_key_value, 'sha256'), 'hex');
    
    -- Create API key for knowledge_chipper
    INSERT INTO api_keys (user_id, name, key_hash, permissions, is_active)
    VALUES (
        admin_user_id,
        'knowledge_chipper',
        api_key_hash,
        ARRAY['add_knowledge', 'create_claims'],
        1
    )
    ON CONFLICT DO NOTHING;
    
    -- Show the API key (SAVE THIS!)
    RAISE NOTICE 'API Key for knowledge_chipper: %', api_key_value;
    RAISE NOTICE 'Add this to your knowledge_chipper environment:';
    RAISE NOTICE 'GETRECEIPTS_API_KEY=%', api_key_value;
    RAISE NOTICE 'GETRECEIPTS_API_URL=http://localhost:3000/api';
END $$;

-- 3. Verify setup
SELECT 
    u.email,
    ur.name as role,
    ak.name as api_key_name,
    ak.permissions,
    ak.is_active
FROM users u
LEFT JOIN user_role_assignments ura ON u.id = ura.user_id
LEFT JOIN user_roles ur ON ura.role_id = ur.id
LEFT JOIN api_keys ak ON u.id = ak.user_id
WHERE u.email = 'matt@rainfall.llc';

SELECT 'Setup complete! Check the NOTICE messages above for your API key.' as status;
