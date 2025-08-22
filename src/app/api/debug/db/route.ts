import { db } from "@/lib/db";
import { claims } from "@/db/schema";

export const runtime = 'nodejs';

export async function GET() {
  try {
    // Test basic connection
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 20) + '...');
    
    // Test simple query
    const result = await db.select().from(claims).limit(1);
    
    return Response.json({ 
      success: true, 
      message: "Database connection successful",
      claimsCount: result.length,
      firstClaim: result[0] || null
    });
  } catch (error: any) {
    console.error('Database connection failed:', error);
    
    return Response.json({ 
      success: false, 
      error: error.message,
      code: error.code,
      severity: error.severity,
      detail: error.detail
    }, { status: 500 });
  }
}
