import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

console.log('🔧 Trying Supabase connection...');

// Try using Supabase client connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE || 'placeholder_key';

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Also keep the postgres connection as fallback
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/placeholder';
console.log('Database connection attempt:', connectionString.replace(/:[^@]*@/, ':***@'));

export const sql = postgres(connectionString, { 
  prepare: false,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 60,
});
export const db = drizzle(sql);