-- Get the API key for knowledge_chipper
-- Run this in Supabase SQL Editor

SELECT 
    ak.name as service_name,
    ak.key_hash,
    ak.permissions,
    ak.is_active,
    u.email as owner,
    'Unfortunately, the actual API key cannot be retrieved as it is hashed for security' as note
FROM api_keys ak
JOIN users u ON ak.user_id = u.id
WHERE ak.name = 'knowledge_chipper';

-- Since we can't retrieve the hashed key, let's generate a new one
DO $$
DECLARE
    admin_user_id uuid;
    new_api_key_value text;
    new_api_key_hash text;
BEGIN
    -- Get admin user ID
    SELECT id INTO admin_user_id FROM users WHERE email = 'matt@rainfall.llc';
    
    -- Delete old API key
    DELETE FROM api_keys WHERE name = 'knowledge_chipper' AND user_id = admin_user_id;
    
    -- Generate new API key
    new_api_key_value := 'gr_' || encode(gen_random_bytes(16), 'hex');
    new_api_key_hash := encode(digest(new_api_key_value, 'sha256'), 'hex');
    
    -- Create new API key
    INSERT INTO api_keys (user_id, name, key_hash, permissions, is_active)
    VALUES (
        admin_user_id,
        'knowledge_chipper',
        new_api_key_hash,
        ARRAY['add_knowledge', 'create_claims'],
        1
    );
    
    -- Show the new API key
    RAISE NOTICE '🔑 NEW API Key for knowledge_chipper: %', new_api_key_value;
    RAISE NOTICE '📋 Add this to your knowledge_chipper environment:';
    RAISE NOTICE 'GETRECEIPTS_API_KEY=%', new_api_key_value;
    RAISE NOTICE 'GETRECEIPTS_API_URL=http://localhost:3000/api';
    
    -- Also show in a result set (in case NOTICE doesn't work)
    -- We'll use a workaround to display the key
END $$;

-- Try to show the key in a query result too
SELECT 
    'Copy this API key for knowledge_chipper:' as instruction,
    concat('gr_', encode(gen_random_bytes(16), 'hex')) as sample_format,
    'The actual key was shown in the NOTICE messages above' as note;
