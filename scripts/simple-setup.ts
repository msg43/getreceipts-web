/**
 * Simple setup script that creates an API key directly in Supabase
 * Run this SQL in Supabase SQL Editor instead of using the Node.js script
 */

console.log(`
🔧 Manual Setup Instructions

Instead of running this script, execute the following SQL in your Supabase SQL Editor:

-- 1. Create admin user
INSERT INTO users (email, name, reputation_score)
VALUES ('matt@rainfall.llc', 'Matthew Greer', 100)
ON CONFLICT (email) DO NOTHING;

-- 2. Get admin user ID and assign admin role
DO $$
DECLARE
    admin_user_id uuid;
    admin_role_id uuid;
BEGIN
    -- Get admin user ID
    SELECT id INTO admin_user_id FROM users WHERE email = 'matt@rainfall.llc';
    
    -- Get admin role ID
    SELECT id INTO admin_role_id FROM user_roles WHERE name = 'admin';
    
    -- Assign admin role if not already assigned
    INSERT INTO user_role_assignments (user_id, role_id, assigned_by)
    VALUES (admin_user_id, admin_role_id, admin_user_id)
    ON CONFLICT DO NOTHING;
    
    -- Create API key for knowledge_chipper
    INSERT INTO api_keys (user_id, name, key_hash, permissions, is_active)
    VALUES (
        admin_user_id,
        'knowledge_chipper',
        'gr_' || encode(gen_random_bytes(16), 'hex'),  -- Generate a key hash
        ARRAY['add_knowledge', 'create_claims'],
        1
    )
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE 'Setup complete! Admin user created and API key generated.';
END $$;

-- 3. View your API key (save this!)
SELECT 
    ak.name,
    'gr_' || encode(decode(ak.key_hash, 'hex'), 'hex') as api_key,
    ak.permissions,
    u.email as owner
FROM api_keys ak
JOIN users u ON ak.user_id = u.id
WHERE ak.name = 'knowledge_chipper';

After running this SQL, you'll get your API key to use in knowledge_chipper.
`);
