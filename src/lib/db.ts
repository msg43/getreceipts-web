import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Only log database connections in development mode, not during build
if (process.env.NODE_ENV === 'development' && typeof window === 'undefined') {
  console.log('🔧 Initializing Supabase connection...');
}

// Try using Supabase client connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE || 'placeholder_key';

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Also keep the postgres connection as fallback
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/placeholder';

// Only log connection string in development mode
if (process.env.NODE_ENV === 'development' && typeof window === 'undefined') {
  console.log('Database connection attempt:', connectionString.replace(/:[^@]*@/, ':***@'));
}

export const sql = postgres(connectionString, { 
  prepare: false,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 60,
});
export const db = drizzle(sql);