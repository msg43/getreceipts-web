-- Complete GetReceipts.org Database Setup
-- Run this in Supabase SQL Editor

-- Enable pgvector extension
create extension if not exists vector;

-- Create all tables
CREATE TABLE "actors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"bio" text,
	"links" jsonb
);

CREATE TABLE "claims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"text_short" text NOT NULL,
	"text_long" text,
	"topics" text[],
	"created_by" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "claims_slug_unique" UNIQUE("slug")
);

CREATE TABLE "aggregates" (
	"claim_id" uuid PRIMARY KEY NOT NULL,
	"consensus_score" numeric,
	"support_count" integer DEFAULT 0,
	"dispute_count" integer DEFAULT 0,
	"support_weight" numeric,
	"dispute_weight" numeric
);

CREATE TABLE "model_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"claim_id" uuid,
	"model" text NOT NULL,
	"score" numeric NOT NULL,
	"rationale" text,
	"version" text,
	"reviewed_at" timestamp DEFAULT now()
);

CREATE TABLE "positions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"claim_id" uuid,
	"actor_id" uuid,
	"stance" text NOT NULL,
	"quote" text,
	"link" text
);

CREATE TABLE "sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"claim_id" uuid NOT NULL,
	"type" text NOT NULL,
	"title" text,
	"url" text,
	"doi" text,
	"venue" text,
	"date" timestamp,
	"cred_score" numeric,
	"meta" jsonb
);

-- Add foreign key constraints
ALTER TABLE "aggregates" ADD CONSTRAINT "aggregates_claim_id_claims_id_fk" 
    FOREIGN KEY ("claim_id") REFERENCES "public"."claims"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "model_reviews" ADD CONSTRAINT "model_reviews_claim_id_claims_id_fk" 
    FOREIGN KEY ("claim_id") REFERENCES "public"."claims"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "positions" ADD CONSTRAINT "positions_claim_id_claims_id_fk" 
    FOREIGN KEY ("claim_id") REFERENCES "public"."claims"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "sources" ADD CONSTRAINT "sources_claim_id_claims_id_fk" 
    FOREIGN KEY ("claim_id") REFERENCES "public"."claims"("id") ON DELETE cascade ON UPDATE no action;

-- Insert demo data
INSERT INTO "claims" ("slug", "text_short", "text_long", "topics", "created_by") VALUES
    ('demo-claim-123', 'Climate change is real.', 'Long-form articulation that anthropogenic greenhouse gas emissions are driving statistically significant warming trends.', ARRAY['climate','science'], 'seed-script');

-- Get the claim ID for the demo claim
INSERT INTO "sources" ("claim_id", "type", "title", "url") 
SELECT id, 'report', 'IPCC AR6 Synthesis', 'https://www.ipcc.ch/report/ar6/syr/' 
FROM "claims" WHERE "slug" = 'demo-claim-123';

INSERT INTO "sources" ("claim_id", "type", "title", "url") 
SELECT id, 'org', 'NASA Climate Evidence', 'https://climate.nasa.gov/evidence/' 
FROM "claims" WHERE "slug" = 'demo-claim-123';

INSERT INTO "positions" ("claim_id", "stance", "quote") 
SELECT id, 'support', '97% of climatologists' 
FROM "claims" WHERE "slug" = 'demo-claim-123';

INSERT INTO "aggregates" ("claim_id", "consensus_score", "support_count", "dispute_count") 
SELECT id, 0.97, 2, 0 
FROM "claims" WHERE "slug" = 'demo-claim-123';

-- Verify setup
SELECT 'Setup complete!' as status;
SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('claims', 'sources', 'positions', 'aggregates', 'actors', 'model_reviews');
SELECT COUNT(*) as demo_claims FROM claims WHERE slug = 'demo-claim-123';
