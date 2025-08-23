import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auditLog, users, apiKeys } from "@/db/schema";
import { desc, eq, and, gte, lte, count } from "drizzle-orm";
import { requirePermission } from "@/lib/auth";

// GET audit log with filtering and pagination
export async function GET(req: NextRequest) {
  try {
    // Require admin permissions
    const authResult = await requirePermission(req, 'admin');
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const action = url.searchParams.get('action'); // CREATE, UPDATE, DELETE
    const tableName = url.searchParams.get('table');
    const userId = url.searchParams.get('userId');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    // Build filter conditions
    const conditions = [];
    if (action) conditions.push(eq(auditLog.action, action));
    if (tableName) conditions.push(eq(auditLog.tableName, tableName));
    if (userId) conditions.push(eq(auditLog.userId, userId));
    if (startDate) conditions.push(gte(auditLog.createdAt, new Date(startDate)));
    if (endDate) conditions.push(lte(auditLog.createdAt, new Date(endDate)));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const [{ count: totalCount }] = await db
      .select({ count: count() })
      .from(auditLog)
      .where(whereClause);

    // Get paginated results
    const offset = (page - 1) * limit;
    const logs = await db
      .select({
        id: auditLog.id,
        action: auditLog.action,
        tableName: auditLog.tableName,
        recordId: auditLog.recordId,
        oldValues: auditLog.oldValues,
        newValues: auditLog.newValues,
        ipAddress: auditLog.ipAddress,
        userAgent: auditLog.userAgent,
        createdAt: auditLog.createdAt,
        userEmail: users.email,
        userName: users.name,
        apiKeyName: apiKeys.name,
      })
      .from(auditLog)
      .leftJoin(users, eq(auditLog.userId, users.id))
      .leftJoin(apiKeys, eq(auditLog.apiKeyId, apiKeys.id))
      .where(whereClause)
      .orderBy(desc(auditLog.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      filters: {
        action,
        tableName,
        userId,
        startDate,
        endDate,
      },
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
