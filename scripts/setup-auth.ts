/**
 * Setup script for user authentication and authorization system
 * Usage:
 *  1) Ensure DATABASE_URL is set in .env.local or environment
 *  2) Run: npx tsx scripts/setup-auth.ts
 */
import "dotenv/config";
import { db } from "@/lib/db";
import { users, userRoles, userRoleAssignments, apiKeys } from "@/db/schema";
import { DEFAULT_ROLES, generateApiKey, hashApiKey } from "@/lib/auth";
import { eq } from "drizzle-orm";

async function setupAuth() {
  try {
    console.log("Setting up authentication system...");

    // 1. Create default roles if they don't exist
    console.log("Creating default roles...");
    for (const roleData of DEFAULT_ROLES) {
      const [existingRole] = await db
        .select()
        .from(userRoles)
        .where(eq(userRoles.name, roleData.name));

      if (!existingRole) {
        await db.insert(userRoles).values(roleData);
        console.log(`✓ Created role: ${roleData.name}`);
      } else {
        console.log(`- Role already exists: ${roleData.name}`);
      }
    }

    // 2. Create admin user (you can customize this)
    const adminEmail = process.env.ADMIN_EMAIL || "admin@getreceipts.org";
    console.log(`\nCreating admin user: ${adminEmail}`);
    
    let adminUser;
    const [existingAdmin] = await db
      .select()
      .from(users)
      .where(eq(users.email, adminEmail));

    if (!existingAdmin) {
      [adminUser] = await db.insert(users).values({
        email: adminEmail,
        name: "System Administrator",
        reputationScore: 100,
      }).returning();
      console.log(`✓ Created admin user: ${adminEmail}`);
    } else {
      adminUser = existingAdmin;
      console.log(`- Admin user already exists: ${adminEmail}`);
    }

    // 3. Assign admin role to admin user
    const [adminRole] = await db
      .select()
      .from(userRoles)
      .where(eq(userRoles.name, 'admin'));

    const [existingAssignment] = await db
      .select()
      .from(userRoleAssignments)
      .where(eq(userRoleAssignments.userId, adminUser.id));

    if (!existingAssignment) {
      await db.insert(userRoleAssignments).values({
        userId: adminUser.id,
        roleId: adminRole.id,
        assignedBy: adminUser.id,
      });
      console.log(`✓ Assigned admin role to ${adminEmail}`);
    } else {
      console.log(`- Admin role already assigned to ${adminEmail}`);
    }

    // 4. Create API key for knowledge_chipper
    console.log("\nCreating API key for knowledge_chipper...");
    const [existingApiKey] = await db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.name, 'knowledge_chipper'));

    if (!existingApiKey) {
      const apiKeyValue = generateApiKey();
      const keyHash = hashApiKey(apiKeyValue);

      await db.insert(apiKeys).values({
        userId: adminUser.id,
        name: 'knowledge_chipper',
        keyHash,
        permissions: ['add_knowledge', 'create_claims'],
        expiresAt: null, // No expiration for this key
        isActive: 1,
      });

      console.log(`✓ Created API key for knowledge_chipper`);
      console.log(`\n🔑 API KEY (save this securely): ${apiKeyValue}`);
      console.log(`\nAdd this to your knowledge_chipper environment:`);
      console.log(`GETRECEIPTS_API_KEY=${apiKeyValue}`);
      console.log(`GETRECEIPTS_API_URL=http://localhost:3000/api`);
    } else {
      console.log(`- API key already exists for knowledge_chipper`);
      console.log(`- To regenerate, delete the existing key first`);
    }

    console.log("\n✅ Authentication setup complete!");
    console.log("\nNext steps:");
    console.log("1. Run database migration: npm run db:generate && npm run db:migrate");
    console.log("2. Update your knowledge_chipper configuration with the API key");
    console.log("3. Test the API with authentication headers");

  } catch (error) {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupAuth().then(() => {
    console.log("\nSetup completed successfully!");
    process.exit(0);
  }).catch((error) => {
    console.error("Setup failed:", error);
    process.exit(1);
  });
}

export { setupAuth };
