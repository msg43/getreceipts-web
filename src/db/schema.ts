import { pgTable, uuid, text, timestamp, integer, jsonb, numeric } from "drizzle-orm/pg-core";

export const claims = pgTable("claims", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  textShort: text("text_short").notNull(),
  textLong: text("text_long"),
  topics: text("topics").array(),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sources = pgTable("sources", {
  id: uuid("id").primaryKey().defaultRandom(),
  claimId: uuid("claim_id").notNull().references(() => claims.id, { onDelete: "cascade" }),
  type: text("type").notNull(),          // paper|article|video|org|book|report
  title: text("title"),
  url: text("url"),
  doi: text("doi"),
  venue: text("venue"),
  date: timestamp("date"),
  credibilityScore: numeric("cred_score"),  // 0..1 (optional, computed later)
  meta: jsonb("meta"),
});

export const actors = pgTable("actors", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: text("type").notNull(), // person|org
  bio: text("bio"),
  links: jsonb("links"),
});

export const positions = pgTable("positions", {
  id: uuid("id").primaryKey().defaultRandom(),
  claimId: uuid("claim_id").references(() => claims.id, { onDelete: "cascade" }),
  actorId: uuid("actor_id"),
  stance: text("stance").notNull(), // support|oppose|neutral
  quote: text("quote"),
  link: text("link"),
});

export const modelReviews = pgTable("model_reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  claimId: uuid("claim_id").references(() => claims.id, { onDelete: "cascade" }),
  model: text("model").notNull(), // gpt-4o|claude|gemini|llama
  score: numeric("score").notNull(), // 0..1
  rationale: text("rationale"),
  version: text("version"),
  reviewedAt: timestamp("reviewed_at").defaultNow(),
});

export const aggregates = pgTable("aggregates", {
  claimId: uuid("claim_id").primaryKey().references(() => claims.id, { onDelete: "cascade" }),
  consensusScore: numeric("consensus_score"), // 0..1
  supportCount: integer("support_count").default(0),
  disputeCount: integer("dispute_count").default(0),
  supportWeight: numeric("support_weight"),
  disputeWeight: numeric("dispute_weight"),
});

// Knowledge artifacts from Knowledge_Chipper
export const knowledgePeople = pgTable("knowledge_people", {
  id: uuid("id").primaryKey().defaultRandom(),
  claimId: uuid("claim_id").notNull().references(() => claims.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  bio: text("bio"),
  expertise: text("expertise").array(),
  credibilityScore: numeric("credibility_score"),
  sources: jsonb("sources"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const knowledgeJargon = pgTable("knowledge_jargon", {
  id: uuid("id").primaryKey().defaultRandom(),
  claimId: uuid("claim_id").notNull().references(() => claims.id, { onDelete: "cascade" }),
  term: text("term").notNull(),
  definition: text("definition").notNull(),
  domain: text("domain"),
  relatedTerms: text("related_terms").array(),
  examples: text("examples").array(),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const knowledgeModels = pgTable("knowledge_models", {
  id: uuid("id").primaryKey().defaultRandom(),
  claimId: uuid("claim_id").notNull().references(() => claims.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  domain: text("domain"),
  keyConcepts: text("key_concepts").array(),
  relationships: jsonb("relationships"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Claim relationships for graph visualization
export const claimRelationships = pgTable("claim_relationships", {
  id: uuid("id").primaryKey().defaultRandom(),
  fromClaimId: uuid("from_claim_id").notNull().references(() => claims.id, { onDelete: "cascade" }),
  toClaimId: uuid("to_claim_id").notNull().references(() => claims.id, { onDelete: "cascade" }),
  relationshipType: text("relationship_type").notNull(),
  strength: numeric("strength").default("0.5"),
  evidence: text("evidence"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// User engagement system
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  reputationScore: integer("reputation_score").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const claimVotes = pgTable("claim_votes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  claimId: uuid("claim_id").notNull().references(() => claims.id, { onDelete: "cascade" }),
  voteType: text("vote_type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const claimComments = pgTable("claim_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  claimId: uuid("claim_id").notNull().references(() => claims.id, { onDelete: "cascade" }),
  parentId: uuid("parent_id").references(() => claimComments.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  voteScore: integer("vote_score").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const commentVotes = pgTable("comment_votes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  commentId: uuid("comment_id").notNull().references(() => claimComments.id, { onDelete: "cascade" }),
  voteType: text("vote_type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User roles and permissions
export const userRoles = pgTable("user_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(), // admin, moderator, contributor, viewer
  description: text("description"),
  canCreateClaims: integer("can_create_claims").default(0), // 0 = false, 1 = true
  canEditClaims: integer("can_edit_claims").default(0),
  canDeleteClaims: integer("can_delete_claims").default(0),
  canAddKnowledge: integer("can_add_knowledge").default(0),
  canEditKnowledge: integer("can_edit_knowledge").default(0),
  canDeleteKnowledge: integer("can_delete_knowledge").default(0),
  canModerateComments: integer("can_moderate_comments").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userRoleAssignments = pgTable("user_role_assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  roleId: uuid("role_id").notNull().references(() => userRoles.id, { onDelete: "cascade" }),
  assignedBy: uuid("assigned_by").references(() => users.id),
  assignedAt: timestamp("assigned_at").defaultNow(),
});

// API Keys for knowledge_chipper and other external services
export const apiKeys = pgTable("api_keys", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // e.g., "knowledge_chipper", "research_bot"
  keyHash: text("key_hash").notNull(), // hashed API key
  permissions: text("permissions").array(), // ["add_knowledge", "create_claims"]
  lastUsed: timestamp("last_used"),
  expiresAt: timestamp("expires_at"),
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// Audit log for all data changes
export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  apiKeyId: uuid("api_key_id").references(() => apiKeys.id),
  action: text("action").notNull(), // CREATE, UPDATE, DELETE
  tableName: text("table_name").notNull(),
  recordId: uuid("record_id").notNull(),
  oldValues: jsonb("old_values"),
  newValues: jsonb("new_values"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});