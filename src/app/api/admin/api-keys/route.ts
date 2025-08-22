import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiKeys, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { requirePermission, generateApiKey, hashApiKey, createAuditLog } from "@/lib/auth";

// GET all API keys (admin only)
export async function GET(req: NextRequest) {
  try {
    // Require admin permissions
    const authResult = await requirePermission(req, 'admin');
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { user, context } = authResult;

    const keys = await db
      .select({
        id: apiKeys.id,
        userId: apiKeys.userId,
        userEmail: users.email,
        userName: users.name,
        name: apiKeys.name,
        permissions: apiKeys.permissions,
        lastUsed: apiKeys.lastUsed,
        expiresAt: apiKeys.expiresAt,
        isActive: apiKeys.isActive,
        createdAt: apiKeys.createdAt,
      })
      .from(apiKeys)
      .leftJoin(users, eq(apiKeys.userId, users.id))
      .orderBy(apiKeys.createdAt);

    return NextResponse.json({ api_keys: keys });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST create new API key
export async function POST(req: NextRequest) {
  try {
    // Require admin permissions
    const authResult = await requirePermission(req, 'admin');
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { user, context } = authResult;

    const body = await req.json();
    const { userId, name, permissions, expiresAt } = body;

    // Validate required fields
    if (!userId || !name || !permissions) {
      return NextResponse.json({ 
        error: "Missing required fields: userId, name, permissions" 
      }, { status: 400 });
    }

    // Validate user exists
    const [targetUser] = await db.select().from(users).where(eq(users.id, userId));
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate API key
    const apiKeyValue = generateApiKey();
    const keyHash = hashApiKey(apiKeyValue);

    const [newApiKey] = await db.insert(apiKeys).values({
      userId,
      name,
      keyHash,
      permissions,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isActive: 1,
    }).returning();

    // Audit log
    await createAuditLog('CREATE', 'api_keys', newApiKey.id, context, null, {
      ...newApiKey,
      keyHash: '[HIDDEN]', // Don't log the actual hash
    });

    return NextResponse.json({
      message: "API key created successfully",
      api_key: apiKeyValue, // Return the actual key only once
      key_info: {
        id: newApiKey.id,
        name: newApiKey.name,
        permissions: newApiKey.permissions,
        user_email: targetUser.email,
        expires_at: newApiKey.expiresAt,
      },
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE deactivate API key
export async function DELETE(req: NextRequest) {
  try {
    // Require admin permissions
    const authResult = await requirePermission(req, 'admin');
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { user, context } = authResult;

    const url = new URL(req.url);
    const keyId = url.searchParams.get('id');

    if (!keyId) {
      return NextResponse.json({ error: "API key ID required" }, { status: 400 });
    }

    // Get existing key for audit log
    const [existingKey] = await db.select().from(apiKeys).where(eq(apiKeys.id, keyId));
    if (!existingKey) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    // Deactivate the key (don't actually delete for audit purposes)
    await db
      .update(apiKeys)
      .set({ isActive: 0 })
      .where(eq(apiKeys.id, keyId));

    // Audit log
    await createAuditLog('UPDATE', 'api_keys', keyId, context, 
      { isActive: existingKey.isActive }, 
      { isActive: 0 }
    );

    return NextResponse.json({
      message: "API key deactivated successfully",
      key_id: keyId,
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
