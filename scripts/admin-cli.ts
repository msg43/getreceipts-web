#!/usr/bin/env tsx
/**
 * Admin CLI tool for GetReceipts.org access control management
 * Usage:
 *   npx tsx scripts/admin-cli.ts <command> [options]
 * 
 * Commands:
 *   users              List all users
 *   user <email>       Show user details
 *   assign <email> <role>   Assign role to user
 *   remove <email> <role>   Remove role from user
 *   roles              List all roles
 *   api-keys           List all API keys
 *   audit [table]      Show audit log
 */

import "dotenv/config";
import { db } from "@/lib/db";
import { users, userRoles, userRoleAssignments, apiKeys, auditLog } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

const command = process.argv[2];
const args = process.argv.slice(3);

async function listUsers() {
  console.log("📋 All Users\n");
  
  const usersWithRoles = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      reputationScore: users.reputationScore,
      createdAt: users.createdAt,
      roleName: userRoles.name,
    })
    .from(users)
    .leftJoin(userRoleAssignments, eq(users.id, userRoleAssignments.userId))
    .leftJoin(userRoles, eq(userRoleAssignments.roleId, userRoles.id))
    .orderBy(users.email);

  // Group roles by user
  const userMap = new Map();
  for (const row of usersWithRoles) {
    if (!userMap.has(row.email)) {
      userMap.set(row.email, {
        ...row,
        roles: []
      });
    }
    
    if (row.roleName) {
      userMap.get(row.email).roles.push(row.roleName);
    }
  }

  for (const user of userMap.values()) {
    console.log(`👤 ${user.email}`);
    console.log(`   Name: ${user.name || 'N/A'}`);
    console.log(`   Reputation: ${user.reputationScore}`);
    console.log(`   Roles: ${user.roles.length > 0 ? user.roles.join(', ') : 'None'}`);
    console.log(`   Created: ${user.createdAt?.toLocaleDateString()}`);
    console.log();
  }
}

async function showUser(email: string) {
  if (!email) {
    console.error("❌ Email required");
    process.exit(1);
  }

  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) {
    console.error(`❌ User not found: ${email}`);
    process.exit(1);
  }

  console.log(`👤 User Details: ${email}\n`);
  console.log(`ID: ${user.id}`);
  console.log(`Name: ${user.name || 'N/A'}`);
  console.log(`Reputation: ${user.reputationScore}`);
  console.log(`Created: ${user.createdAt?.toLocaleDateString()}`);
  
  // Get roles
  const roles = await db
    .select({ name: userRoles.name, description: userRoles.description })
    .from(userRoleAssignments)
    .leftJoin(userRoles, eq(userRoleAssignments.roleId, userRoles.id))
    .where(eq(userRoleAssignments.userId, user.id));

  console.log(`\n🔑 Roles (${roles.length}):`);
  if (roles.length === 0) {
    console.log("   None assigned");
  } else {
    for (const role of roles) {
      console.log(`   • ${role.name} - ${role.description}`);
    }
  }

  // Get API keys
  const keys = await db
    .select({ name: apiKeys.name, isActive: apiKeys.isActive, lastUsed: apiKeys.lastUsed })
    .from(apiKeys)
    .where(eq(apiKeys.userId, user.id));

  console.log(`\n🗝️  API Keys (${keys.length}):`);
  if (keys.length === 0) {
    console.log("   None created");
  } else {
    for (const key of keys) {
      const status = key.isActive ? '✅ Active' : '❌ Inactive';
      const lastUsed = key.lastUsed ? key.lastUsed.toLocaleDateString() : 'Never';
      console.log(`   • ${key.name} - ${status} - Last used: ${lastUsed}`);
    }
  }
}

async function assignRole(email: string, roleName: string) {
  if (!email || !roleName) {
    console.error("❌ Email and role name required");
    process.exit(1);
  }

  // Get user
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) {
    console.error(`❌ User not found: ${email}`);
    process.exit(1);
  }

  // Get role
  const [role] = await db.select().from(userRoles).where(eq(userRoles.name, roleName));
  if (!role) {
    console.error(`❌ Role not found: ${roleName}`);
    process.exit(1);
  }

  // Check if already assigned
  const [existing] = await db
    .select()
    .from(userRoleAssignments)
    .where(and(
      eq(userRoleAssignments.userId, user.id),
      eq(userRoleAssignments.roleId, role.id)
    ));

  if (existing) {
    console.error(`❌ User ${email} already has role ${roleName}`);
    process.exit(1);
  }

  // Assign role
  await db.insert(userRoleAssignments).values({
    userId: user.id,
    roleId: role.id,
    assignedBy: user.id, // Self-assignment for CLI
  });

  console.log(`✅ Assigned role "${roleName}" to ${email}`);
}

async function removeRole(email: string, roleName: string) {
  if (!email || !roleName) {
    console.error("❌ Email and role name required");
    process.exit(1);
  }

  // Get user
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) {
    console.error(`❌ User not found: ${email}`);
    process.exit(1);
  }

  // Get role
  const [role] = await db.select().from(userRoles).where(eq(userRoles.name, roleName));
  if (!role) {
    console.error(`❌ Role not found: ${roleName}`);
    process.exit(1);
  }

  // Remove assignment
  const result = await db
    .delete(userRoleAssignments)
    .where(and(
      eq(userRoleAssignments.userId, user.id),
      eq(userRoleAssignments.roleId, role.id)
    ));

  console.log(`✅ Removed role "${roleName}" from ${email}`);
}

async function listRoles() {
  console.log("🔑 All Roles\n");
  
  const roles = await db.select().from(userRoles).orderBy(userRoles.name);
  
  for (const role of roles) {
    console.log(`📋 ${role.name}`);
    console.log(`   Description: ${role.description || 'N/A'}`);
    
    const permissions = [];
    if (role.canCreateClaims) permissions.push('create_claims');
    if (role.canEditClaims) permissions.push('edit_claims');
    if (role.canDeleteClaims) permissions.push('delete_claims');
    if (role.canAddKnowledge) permissions.push('add_knowledge');
    if (role.canEditKnowledge) permissions.push('edit_knowledge');
    if (role.canDeleteKnowledge) permissions.push('delete_knowledge');
    if (role.canModerateComments) permissions.push('moderate_comments');
    
    console.log(`   Permissions: ${permissions.join(', ') || 'None'}`);
    console.log();
  }
}

async function listApiKeys() {
  console.log("🗝️  All API Keys\n");
  
  const keys = await db
    .select({
      id: apiKeys.id,
      name: apiKeys.name,
      permissions: apiKeys.permissions,
      isActive: apiKeys.isActive,
      lastUsed: apiKeys.lastUsed,
      expiresAt: apiKeys.expiresAt,
      userEmail: users.email,
    })
    .from(apiKeys)
    .leftJoin(users, eq(apiKeys.userId, users.id))
    .orderBy(apiKeys.createdAt);

  for (const key of keys) {
    const status = key.isActive ? '✅ Active' : '❌ Inactive';
    const lastUsed = key.lastUsed ? key.lastUsed.toLocaleDateString() : 'Never';
    const expires = key.expiresAt ? key.expiresAt.toLocaleDateString() : 'Never';
    
    console.log(`🔑 ${key.name}`);
    console.log(`   Owner: ${key.userEmail}`);
    console.log(`   Status: ${status}`);
    console.log(`   Permissions: ${key.permissions?.join(', ') || 'None'}`);
    console.log(`   Last used: ${lastUsed}`);
    console.log(`   Expires: ${expires}`);
    console.log();
  }
}

async function showAuditLog(tableName?: string) {
  console.log("📋 Audit Log\n");
  
  let query = db
    .select({
      action: auditLog.action,
      tableName: auditLog.tableName,
      recordId: auditLog.recordId,
      userEmail: users.email,
      apiKeyName: apiKeys.name,
      createdAt: auditLog.createdAt,
    })
    .from(auditLog)
    .leftJoin(users, eq(auditLog.userId, users.id))
    .leftJoin(apiKeys, eq(auditLog.apiKeyId, apiKeys.id))
    .orderBy(desc(auditLog.createdAt))
    .limit(20);

  if (tableName) {
    query = query.where(eq(auditLog.tableName, tableName)) as any;
  }

  const logs = await query;
  
  for (const log of logs) {
    const actor = log.userEmail || log.apiKeyName || 'Unknown';
    console.log(`${log.createdAt?.toLocaleString()} | ${log.action} | ${log.tableName} | ${actor}`);
  }
}

// Main CLI handler
async function main() {
  try {
    switch (command) {
      case 'users':
        await listUsers();
        break;
      case 'user':
        await showUser(args[0]);
        break;
      case 'assign':
        await assignRole(args[0], args[1]);
        break;
      case 'remove':
        await removeRole(args[0], args[1]);
        break;
      case 'roles':
        await listRoles();
        break;
      case 'api-keys':
        await listApiKeys();
        break;
      case 'audit':
        await showAuditLog(args[0]);
        break;
      default:
        console.log(`
🔧 GetReceipts.org Admin CLI

Usage: npx tsx scripts/admin-cli.ts <command> [options]

Commands:
  users                    List all users with their roles
  user <email>             Show detailed user information
  assign <email> <role>    Assign role to user
  remove <email> <role>    Remove role from user
  roles                    List all available roles
  api-keys                 List all API keys
  audit [table]            Show recent audit log entries

Examples:
  npx tsx scripts/admin-cli.ts users
  npx tsx scripts/admin-cli.ts user admin@getreceipts.org
  npx tsx scripts/admin-cli.ts assign user@domain.com contributor
  npx tsx scripts/admin-cli.ts remove user@domain.com viewer
  npx tsx scripts/admin-cli.ts audit claims
        `);
        break;
    }
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}
