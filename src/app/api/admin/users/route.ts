import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, userRoles, userRoleAssignments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requirePermission, createAuditLog } from "@/lib/auth";

// GET all users with their roles
export async function GET(req: NextRequest) {
  try {
    // Require admin permissions
    const authResult = await requirePermission(req, 'admin');
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const usersWithRoles = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        reputationScore: users.reputationScore,
        createdAt: users.createdAt,
        roleName: userRoles.name,
        roleDescription: userRoles.description,
        assignedAt: userRoleAssignments.assignedAt,
      })
      .from(users)
      .leftJoin(userRoleAssignments, eq(users.id, userRoleAssignments.userId))
      .leftJoin(userRoles, eq(userRoleAssignments.roleId, userRoles.id))
      .orderBy(users.createdAt);

    // Group roles by user
    const userMap = new Map();
    for (const row of usersWithRoles) {
      if (!userMap.has(row.id)) {
        userMap.set(row.id, {
          id: row.id,
          email: row.email,
          name: row.name,
          reputationScore: row.reputationScore,
          createdAt: row.createdAt,
          roles: []
        });
      }
      
      if (row.roleName) {
        userMap.get(row.id).roles.push({
          name: row.roleName,
          description: row.roleDescription,
          assignedAt: row.assignedAt,
        });
      }
    }

    return NextResponse.json({ 
      users: Array.from(userMap.values()),
      total: userMap.size 
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST create new user
export async function POST(req: NextRequest) {
  try {
    // Require admin permissions
    const authResult = await requirePermission(req, 'admin');
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { user: adminUser, context } = authResult;

    const body = await req.json();
    const { email, name, initialRole } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user already exists
    const [existingUser] = await db.select().from(users).where(eq(users.email, email));
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    // Create user
    const [newUser] = await db.insert(users).values({
      email,
      name: name || null,
      reputationScore: 0,
    }).returning();

    // Assign initial role if specified
    if (initialRole) {
      const [role] = await db.select().from(userRoles).where(eq(userRoles.name, initialRole));
      if (role) {
        await db.insert(userRoleAssignments).values({
          userId: newUser.id,
          roleId: role.id,
          assignedBy: adminUser.id,
        });
      }
    }

    // Audit log
    await createAuditLog('CREATE', 'users', newUser.id, context, null, newUser);

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        initialRole: initialRole || null,
      },
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
