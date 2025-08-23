-- Debug API Key Setup
-- Run this in Supabase SQL Editor to see what's in the database

-- 1. Check if users exist
SELECT 'Users in database:' as check_type, email, name FROM users;

-- 2. Check if roles exist and are assigned
SELECT 'User roles:' as check_type, u.email, ur.name as role_name
FROM users u
LEFT JOIN user_role_assignments ura ON u.id = ura.user_id
LEFT JOIN user_roles ur ON ura.role_id = ur.id
WHERE u.email = 'matt@rainfall.llc';

-- 3. Check if API keys exist
SELECT 'API keys:' as check_type, ak.name, ak.permissions, ak.is_active, u.email as owner
FROM api_keys ak
JOIN users u ON ak.user_id = u.id;

-- 4. Show the hash that would be generated for your test key
SELECT 'Test key hash:' as info, 
       encode(digest('gr_f22efdfb258b25da7f4fdb1b264f830a', 'sha256'), 'hex') as test_key_hash;

-- 5. Show actual hashes in database
SELECT 'Database key hashes:' as info, key_hash FROM api_keys;
