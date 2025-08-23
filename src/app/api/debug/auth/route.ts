import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🔍 Testing environment variables...");
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    return NextResponse.json({
      success: true,
      environment: {
        supabaseUrl: supabaseUrl ? "✅ Set" : "❌ Missing",
        serviceRoleKey: serviceRoleKey ? "✅ Set" : "❌ Missing",
        serviceRoleKeyLength: serviceRoleKey?.length || 0,
        serviceRoleKeyStart: serviceRoleKey?.substring(0, 20) || "Not found",
      }
    });
    
  } catch (error) {
    console.error("Auth debug error:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
