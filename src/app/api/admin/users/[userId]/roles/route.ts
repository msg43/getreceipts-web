import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, userRoles, userRoleAssignments } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { requirePermission, createAuditLog } from "@/lib/auth";

// POST assign role to user
export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    // Require admin permissions
    const authResult = await requirePermission(req, 'admin');
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { user: adminUser, context } = authResult;

    const { userId } = await params;
    const body = await req.json();
    const { roleName } = body;

    if (!roleName) {
      return NextResponse.json({ error: "Role name is required" }, { status: 400 });
    }

    // Validate user exists
    const [targetUser] = await db.select().from(users).where(eq(users.id, userId));
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Validate role exists
    const [role] = await db.select().from(userRoles).where(eq(userRoles.name, roleName));
    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    // Check if user already has this role
    const [existingAssignment] = await db
      .select()
      .from(userRoleAssignments)
      .where(and(
        eq(userRoleAssignments.userId, userId),
        eq(userRoleAssignments.roleId, role.id)
      ));

    if (existingAssignment) {
      return NextResponse.json({ error: "User already has this role" }, { status: 409 });
    }

    // Assign role
    const [assignment] = await db.insert(userRoleAssignments).values({
      userId,
      roleId: role.id,
      assignedBy: adminUser.id,
    }).returning();

    // Audit log
    await createAuditLog('CREATE', 'user_role_assignments', assignment.id, context, null, assignment);

    return NextResponse.json({
      message: "Role assigned successfully",
      assignment: {
        userId,
        roleName,
        assignedBy: adminUser.email,
        assignedAt: assignment.assignedAt,
      },
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE remove role from user
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    // Require admin permissions
    const authResult = await requirePermission(req, 'admin');
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { user: adminUser, context } = authResult;

    const { userId } = await params;
    const url = new URL(req.url);
    const roleName = url.searchParams.get('role');

    if (!roleName) {
      return NextResponse.json({ error: "Role name is required" }, { status: 400 });
    }

    // Get role ID
    const [role] = await db.select().from(userRoles).where(eq(userRoles.name, roleName));
    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    // Get existing assignment for audit log
    const [existingAssignment] = await db
      .select()
      .from(userRoleAssignments)
      .where(and(
        eq(userRoleAssignments.userId, userId),
        eq(userRoleAssignments.roleId, role.id)
      ));

    if (!existingAssignment) {
      return NextResponse.json({ error: "User does not have this role" }, { status: 404 });
    }

    // Remove role assignment
    await db
      .delete(userRoleAssignments)
      .where(and(
        eq(userRoleAssignments.userId, userId),
        eq(userRoleAssignments.roleId, role.id)
      ));

    // Audit log
    await createAuditLog('DELETE', 'user_role_assignments', existingAssignment.id, context, existingAssignment, null);

    return NextResponse.json({
      message: "Role removed successfully",
      userId,
      roleName,
      removedBy: adminUser.email,
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
