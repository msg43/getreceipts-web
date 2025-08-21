-- Run this in Supabase SQL Editor after creating your project
-- This enables the pgvector extension for future vector search capabilities

create extension if not exists vector;

-- Verify the extension is installed
select * from pg_extension where extname = 'vector';
