import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function GET() {
  try {
    console.log('🔧 Trying Supabase connection...');
    
    // First, try to list tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.log('Tables query failed, trying claims directly...');
    }
    
    // Try to get claims data directly
    const { data: claimsData, error: claimsError } = await supabase
      .from('claims')
      .select('*')
      .limit(5);
    
    // Try to get a simple count
    const { count, error: countError } = await supabase
      .from('claims')
      .select('*', { count: 'exact', head: true });
    
    return NextResponse.json({
      tables: tables || null,
      tablesError: tablesError?.message || null,
      claimsData: claimsData || null,
      claimsError: claimsError?.message || null,
      claimsCount: count,
      countError: countError?.message || null,
      timestamp: new Date().toISOString()
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Server error";
    console.error('Debug API error:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}