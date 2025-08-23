-- Create Fresh API Key for knowledge_chipper
-- Run this in Supabase SQL Editor

-- Clean slate: delete any existing knowledge_chipper keys
DELETE FROM api_keys WHERE name = 'knowledge_chipper';

-- Create new API key with explicit value so we know what it is
DO $$
DECLARE
    admin_user_id uuid;
    explicit_api_key text := 'gr_test_key_for_knowledge_chipper_123';
    api_key_hash text;
BEGIN
    -- Get admin user ID
    SELECT id INTO admin_user_id FROM users WHERE email = 'matt@rainfall.llc';
    
    IF admin_user_id IS NULL THEN
        RAISE EXCEPTION 'Admin user not found! Run the complete migration first.';
    END IF;
    
    -- Hash the explicit key
    api_key_hash := encode(digest(explicit_api_key, 'sha256'), 'hex');
    
    -- Create API key
    INSERT INTO api_keys (user_id, name, key_hash, permissions, is_active)
    VALUES (
        admin_user_id,
        'knowledge_chipper',
        api_key_hash,
        ARRAY['add_knowledge', 'create_claims'],
        1
    );
    
    RAISE NOTICE 'API Key created: %', explicit_api_key;
    RAISE NOTICE 'Test with: curl -X POST -H "Authorization: Bearer %" -H "Content-Type: application/json" -d ''{"claim_text": "Test", "topics": ["test"]}'' http://localhost:3000/api/receipts', explicit_api_key;
END $$;

-- Verify the setup
SELECT 
    'Verification:' as status,
    u.email,
    ak.name as api_key_name,
    ak.permissions,
    ak.is_active,
    'gr_test_key_for_knowledge_chipper_123' as use_this_key
FROM users u
JOIN api_keys ak ON u.id = ak.user_id
WHERE u.email = 'matt@rainfall.llc' AND ak.name = 'knowledge_chipper';
