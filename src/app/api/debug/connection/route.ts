import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE;
    const databaseUrl = process.env.DATABASE_URL;
    
    // Test direct Supabase connection
    const testUrl = `${supabaseUrl}/rest/v1/claims?select=id&limit=1`;
    
    const response = await fetch(testUrl, {
      headers: {
        'apikey': supabaseAnonKey || '',
        'Authorization': `Bearer ${supabaseAnonKey || ''}`,
        'Content-Type': 'application/json'
      }
    });
    
    const responseText = await response.text();
    
    return NextResponse.json({
      environment_check: {
        supabaseUrl: supabaseUrl ? 'SET' : 'MISSING',
        supabaseAnonKey: supabaseAnonKey ? 'SET' : 'MISSING',
        serviceRole: serviceRole ? 'SET' : 'MISSING',
        databaseUrl: databaseUrl ? 'SET' : 'MISSING'
      },
      direct_test: {
        status: response.status,
        statusText: response.statusText,
        response: responseText.substring(0, 500) // First 500 chars
      },
      timestamp: new Date().toISOString()
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ 
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
