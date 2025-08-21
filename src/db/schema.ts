import { pgTable, uuid, text, timestamp, integer, jsonb, numeric } from "drizzle-orm/pg-core";

export const claims = pgTable("claims", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  textShort: text("text_short").notNull(),
  textLong: text("text_long"),
  topics: text("topics").array(),
  createdBy: text("created_by"),
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