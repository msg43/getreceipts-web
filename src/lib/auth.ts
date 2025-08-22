import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { users, apiKeys, userRoles, userRoleAssignments, auditLog } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { createHash } from "crypto";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  permissions: string[];
  isApiKey?: boolean;
  apiKeyName?: string;
}

export interface AuditContext {
  userId?: string;
  apiKeyId?: string;
  ipAddress?: string;
  userAgent?: string;
}

// Hash API key for storage/comparison
export function hashApiKey(apiKey: string): string {
  return createHash('sha256').update(apiKey).digest('hex');
}

// Generate secure API key
export function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'gr_'; // GetReceipts prefix
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Extract authentication from request
export async function authenticateRequest(req: NextRequest): Promise<AuthUser | null> {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader) {
    return null;
  }

  // Check for API key (Bearer token)
  if (authHeader.startsWith('Bearer ')) {
    const apiKey = authHeader.substring(7);
    return await authenticateApiKey(apiKey);
  }

  // Check for session-based auth (future implementation)
  // For now, return null for session auth
  return null;
}

// Authenticate API key
async function authenticateApiKey(apiKey: string): Promise<AuthUser | null> {
  const keyHash = hashApiKey(apiKey);
  
  const [keyRecord] = await db
    .select({
      id: apiKeys.id,
      userId: apiKeys.userId,
      name: apiKeys.name,
      permissions: apiKeys.permissions,
      isActive: apiKeys.isActive,
      expiresAt: apiKeys.expiresAt,
      userEmail: users.email,
      userName: users.name,
    })
    .from(apiKeys)
    .leftJoin(users, eq(apiKeys.userId, users.id))
    .where(and(
      eq(apiKeys.keyHash, keyHash),
      eq(apiKeys.isActive, 1)
    ));

  if (!keyRecord) {
    return null;
  }

  // Check expiration
  if (keyRecord.expiresAt && new Date(keyRecord.expiresAt) < new Date()) {
    return null;
  }

  // Update last used timestamp
  await db
    .update(apiKeys)
    .set({ lastUsed: new Date() })
    .where(eq(apiKeys.id, keyRecord.id));

  return {
    id: keyRecord.userId,
    email: keyRecord.userEmail!,
    name: keyRecord.userName || undefined,
    permissions: keyRecord.permissions || [],
    isApiKey: true,
    apiKeyName: keyRecord.name,
  };
}

// Get user permissions from roles
export async function getUserPermissions(userId: string): Promise<string[]> {
  const roleAssignments = await db
    .select({
      canCreateClaims: userRoles.canCreateClaims,
      canEditClaims: userRoles.canEditClaims,
      canDeleteClaims: userRoles.canDeleteClaims,
      canAddKnowledge: userRoles.canAddKnowledge,
      canEditKnowledge: userRoles.canEditKnowledge,
      canDeleteKnowledge: userRoles.canDeleteKnowledge,
      canModerateComments: userRoles.canModerateComments,
    })
    .from(userRoleAssignments)
    .leftJoin(userRoles, eq(userRoleAssignments.roleId, userRoles.id))
    .where(eq(userRoleAssignments.userId, userId));

  const permissions: string[] = [];
  
  for (const role of roleAssignments) {
    if (role.canCreateClaims) permissions.push('create_claims');
    if (role.canEditClaims) permissions.push('edit_claims');
    if (role.canDeleteClaims) permissions.push('delete_claims');
    if (role.canAddKnowledge) permissions.push('add_knowledge');
    if (role.canEditKnowledge) permissions.push('edit_knowledge');
    if (role.canDeleteKnowledge) permissions.push('delete_knowledge');
    if (role.canModerateComments) permissions.push('moderate_comments');
  }

  return [...new Set(permissions)]; // Remove duplicates
}

// Check if user has specific role
export async function checkUserHasRole(userId: string, roleName: string): Promise<boolean> {
  const [assignment] = await db
    .select()
    .from(userRoleAssignments)
    .leftJoin(userRoles, eq(userRoleAssignments.roleId, userRoles.id))
    .where(eq(userRoleAssignments.userId, userId))
    .where(eq(userRoles.name, roleName));

  return !!assignment;
}

// Check if user has specific permission
export function hasPermission(user: AuthUser, permission: string): boolean {
  return user.permissions.includes(permission);
}

// Create audit log entry
export async function createAuditLog(
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  tableName: string,
  recordId: string,
  context: AuditContext,
  oldValues?: any,
  newValues?: any
): Promise<void> {
  await db.insert(auditLog).values({
    userId: context.userId || null,
    apiKeyId: context.apiKeyId || null,
    action,
    tableName,
    recordId,
    oldValues: oldValues || null,
    newValues: newValues || null,
    ipAddress: context.ipAddress || null,
    userAgent: context.userAgent || null,
  });
}

// Authorization middleware
export async function requirePermission(
  req: NextRequest,
  permission: string
): Promise<{ user: AuthUser; context: AuditContext } | { error: string; status: number }> {
  const user = await authenticateRequest(req);
  
  if (!user) {
    return { error: "Authentication required", status: 401 };
  }

  // Special case for 'admin' permission - check if user has admin role
  if (permission === 'admin') {
    const userPermissions = await getUserPermissions(user.id);
    const hasAdminRole = await checkUserHasRole(user.id, 'admin');
    
    if (!hasAdminRole) {
      return { error: "Admin access required", status: 403 };
    }
    
    // Merge role permissions with API key permissions
    user.permissions = [...new Set([...user.permissions, ...userPermissions])];
  } else if (!hasPermission(user, permission)) {
    return { error: "Insufficient permissions", status: 403 };
  }

  const context: AuditContext = {
    userId: user.isApiKey ? undefined : user.id,
    apiKeyId: user.isApiKey ? user.id : undefined,
    ipAddress: req.ip || req.headers.get('x-forwarded-for') || 'unknown',
    userAgent: req.headers.get('user-agent') || 'unknown',
  };

  return { user, context };
}

// Default roles setup (for initial database seeding)
export const DEFAULT_ROLES = [
  {
    name: 'admin',
    description: 'Full system access',
    canCreateClaims: 1,
    canEditClaims: 1,
    canDeleteClaims: 1,
    canAddKnowledge: 1,
    canEditKnowledge: 1,
    canDeleteKnowledge: 1,
    canModerateComments: 1,
  },
  {
    name: 'contributor',
    description: 'Can add and edit content',
    canCreateClaims: 1,
    canEditClaims: 1,
    canDeleteClaims: 0,
    canAddKnowledge: 1,
    canEditKnowledge: 1,
    canDeleteKnowledge: 0,
    canModerateComments: 0,
  },
  {
    name: 'knowledge_bot',
    description: 'Automated knowledge addition',
    canCreateClaims: 0,
    canEditClaims: 0,
    canDeleteClaims: 0,
    canAddKnowledge: 1,
    canEditKnowledge: 0,
    canDeleteKnowledge: 0,
    canModerateComments: 0,
  },
  {
    name: 'viewer',
    description: 'Read-only access',
    canCreateClaims: 0,
    canEditClaims: 0,
    canDeleteClaims: 0,
    canAddKnowledge: 0,
    canEditKnowledge: 0,
    canDeleteKnowledge: 0,
    canModerateComments: 0,
  },
];
