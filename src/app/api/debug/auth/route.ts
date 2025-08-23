import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🔍 Testing environment variables...");
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE;
    
    return NextResponse.json({
      success: true,
      environment: {
        supabaseUrl: supabaseUrl ? "✅ Set" : "❌ Missing",
        serviceRoleKey: serviceRoleKey ? "✅ Set" : "❌ Missing",
      },
      message: "Environment check completed"
    });
  } catch (error) {
    console.error("🚨 Environment check failed:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}