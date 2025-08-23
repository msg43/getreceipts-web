import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userRoles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requirePermission, createAuditLog } from "@/lib/auth";

// GET all roles
export async function GET(req: NextRequest) {
  try {
    // Require admin permissions
    const authResult = await requirePermission(req, 'admin');
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const roles = await db.select().from(userRoles).orderBy(userRoles.name);

    return NextResponse.json({ roles });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST create new role
export async function POST(req: NextRequest) {
  try {
    // Require admin permissions
    const authResult = await requirePermission(req, 'admin');
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { context } = authResult;

    const body = await req.json();
    const {
      name,
      description,
      canCreateClaims = 0,
      canEditClaims = 0,
      canDeleteClaims = 0,
      canAddKnowledge = 0,
      canEditKnowledge = 0,
      canDeleteKnowledge = 0,
      canModerateComments = 0,
    } = body;

    if (!name) {
      return NextResponse.json({ error: "Role name is required" }, { status: 400 });
    }

    // Check if role already exists
    const [existingRole] = await db.select().from(userRoles).where(eq(userRoles.name, name));
    if (existingRole) {
      return NextResponse.json({ error: "Role already exists" }, { status: 409 });
    }

    const [newRole] = await db.insert(userRoles).values({
      name,
      description,
      canCreateClaims,
      canEditClaims,
      canDeleteClaims,
      canAddKnowledge,
      canEditKnowledge,
      canDeleteKnowledge,
      canModerateComments,
    }).returning();

    // Audit log
    await createAuditLog('CREATE', 'user_roles', newRole.id, context, null, newRole);

    return NextResponse.json({
      message: "Role created successfully",
      role: newRole,
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PUT update existing role
export async function PUT(req: NextRequest) {
  try {
    // Require admin permissions
    const authResult = await requirePermission(req, 'admin');
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { context } = authResult;

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Role ID is required" }, { status: 400 });
    }

    // Get existing role for audit log
    const [existingRole] = await db.select().from(userRoles).where(eq(userRoles.id, id));
    if (!existingRole) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    const [updatedRole] = await db
      .update(userRoles)
      .set(updates)
      .where(eq(userRoles.id, id))
      .returning();

    // Audit log
    await createAuditLog('UPDATE', 'user_roles', id, context, existingRole, updatedRole);

    return NextResponse.json({
      message: "Role updated successfully",
      role: updatedRole,
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
