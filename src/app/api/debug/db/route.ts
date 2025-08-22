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
  } catch (error: unknown) {
    console.error('Database connection failed:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = error && typeof error === 'object' ? {
      code: (error as { code?: string }).code,
      severity: (error as { severity?: string }).severity,
      detail: (error as { detail?: string }).detail
    } : {};
    
    return Response.json({ 
      success: false, 
      error: errorMessage,
      ...errorDetails
    }, { status: 500 });
  }
}
