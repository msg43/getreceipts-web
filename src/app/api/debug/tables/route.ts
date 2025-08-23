import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";

export async function GET() {
  try {
    console.log("🔍 Testing Supabase client connection...");
    
    // Test 1: Check if we can connect to Supabase
    const { error: authError } = await supabase.auth.getUser();
    
    // Test 2: Try to query api_keys table directly with Supabase client
    const { data: apiKeys, error: apiKeysError } = await supabase
      .from('api_keys')
      .select('name, is_active')
      .limit(5);
    
    // Test 3: Try to query users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('email')
      .limit(5);
    
    return NextResponse.json({
      success: true,
      supabaseConnection: {
        authError: authError?.message || "No auth error",
        apiKeysQuery: {
          success: !apiKeysError,
          error: apiKeysError?.message,
          count: apiKeys?.length || 0,
          data: apiKeys
        },
        usersQuery: {
          success: !usersError,
          error: usersError?.message,
          count: users?.length || 0,
          data: users
        }
      }
    });
    
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      connectionInfo: "Connection failed"
    }, { status: 500 });
  }
}
