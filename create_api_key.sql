-- Simple API Key Generator for knowledge_chipper
-- Run this in Supabase SQL Editor

-- First, let's clean up any existing key
DELETE FROM api_keys WHERE name = 'knowledge_chipper';

-- Create a new API key with a simple, visible approach
WITH new_key AS (
  SELECT 
    'gr_' || encode(gen_random_bytes(16), 'hex') as api_key_value
),
user_info AS (
  SELECT id as user_id FROM users WHERE email = 'matt@rainfall.llc'
),
key_insert AS (
  INSERT INTO api_keys (user_id, name, key_hash, permissions, is_active)
  SELECT 
    ui.user_id,
    'knowledge_chipper',
    encode(digest(nk.api_key_value, 'sha256'), 'hex'),
    ARRAY['add_knowledge', 'create_claims'],
    1
  FROM new_key nk, user_info ui
  RETURNING id
)
SELECT 
  '🔑 YOUR API KEY FOR KNOWLEDGE_CHIPPER:' as step_1,
  nk.api_key_value as YOUR_API_KEY,
  '📋 Add to knowledge_chipper environment:' as step_2,
  concat('GETRECEIPTS_API_KEY=', nk.api_key_value) as env_var_1,
  'GETRECEIPTS_API_URL=http://localhost:3000/api' as env_var_2
FROM new_key nk;
