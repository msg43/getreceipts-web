# GetReceipts.org - Implementation Tasks

This document tracks the 25-step implementation plan for GetReceipts.org, a web app and API for publishing and sharing "receipts" of claims/counterclaims with sources and a Consensus Meter.

**Stack**: Next.js + TypeScript + Tailwind + shadcn/ui + Drizzle ORM + Supabase (Postgres/Auth/Storage), deployed on Vercel.

## Progress Overview
- ✅ Context ingestion complete - existing artifacts analyzed
- 🔄 Task management setup in progress
- ⏳ Implementation plan ready for execution

---

## Implementation Checklist

### 0) Prerequisites (one time)
- [ ] Install Node 20+, pnpm or npm, Git, GitHub account, Vercel account, Supabase account
- [ ] Enable Git in Cursor, open integrated terminal

**Acceptance Criteria:**
- [ ] All required tools installed and accessible
- [ ] Development environment configured

**Artifacts:**
- Environment verification commands run successfully

---

### 1) New GitHub repo (from inside Cursor)
- [ ] Create folder & init git
- [ ] Create GitHub repo and add remote
- [ ] Create README.md with project blurb, license, and stack list

**Acceptance Criteria:**
- [ ] Git repository initialized
- [ ] GitHub remote configured
- [ ] README.md contains project description and tech stack

**Artifacts:**
- `README.md` with project overview
- Git repository with remote origin

---

### 2) Scaffold Next.js app
- [x] Run `npx create-next-app@latest . --ts --eslint --tailwind --app --src-dir --import-alias "@/*"`

**Acceptance Criteria:**
- [x] Next.js 14+ app created with TypeScript
- [x] App Router enabled with src directory
- [x] Tailwind CSS configured
- [x] ESLint configured

**Artifacts:**
- Complete Next.js application structure
- `package.json` with all base dependencies

---

### 3) Core dependencies
- [x] Install core packages: `npm install lucide-react date-fns nanoid zod`
- [x] Initialize shadcn/ui: `npx shadcn@latest init`
- [x] Add shadcn components: `npx shadcn@latest add button card badge dropdown-menu progress input textarea avatar tooltip dialog tabs separator alert alert-dialog skeleton`
- [x] Install database packages: `npm install drizzle-orm pg postgres`
- [x] Install dev database tools: `npm install -D drizzle-kit`
- [x] Install vector support: `npm install pgvector`
- [x] Install Supabase client: `npm install @supabase/supabase-js`
- [x] Install caching: `npm install lru-cache`
- [x] Install testing packages: `npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event ts-node prettier`

**Acceptance Criteria:**
- [x] All dependencies installed without conflicts
- [x] shadcn/ui components available for use
- [x] Package.json reflects all required dependencies

**Artifacts:**
- Updated `package.json` with all dependencies
- `components.json` from shadcn/ui init

---

### 4) Tailwind & shadcn verification
- [x] Verify tailwind.config.ts includes ./src/**/*.{ts,tsx} and shadcn paths
- [x] Ensure src/app/globals.css has @tailwind directives
- [x] Run dev server to verify components build

**Acceptance Criteria:**
- [x] Tailwind configuration includes all necessary paths
- [x] CSS directives properly imported
- [x] Development server starts without errors
- [x] shadcn components render correctly

**Artifacts:**
- Verified `tailwind.config.ts`
- Verified `src/app/globals.css`
- Successful dev server startup

---

### 5) Supabase project & DB setup
- [ ] Create a Supabase project
- [ ] Run `create extension if not exists vector;` in SQL Editor
- [ ] Create service role key for server-side tasks
- [ ] Collect URL and anon key for environment variables

**Acceptance Criteria:**
- [ ] Supabase project created and accessible
- [ ] Vector extension enabled
- [ ] Service role key generated
- [ ] Database connection credentials available

**Artifacts:**
- Supabase project dashboard access
- Database with vector extension
- Environment variable values documented

---

### 6) Environment variables (Cursor → .env.local)
- [x] Create .env.local with required variables:
  - NEXT_PUBLIC_SITE_URL=http://localhost:3000
  - NEXT_PUBLIC_SUPABASE_URL=...
  - NEXT_PUBLIC_SUPABASE_ANON_KEY=...
  - SUPABASE_SERVICE_ROLE=... (server only)
  - DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/db

**Acceptance Criteria:**
- [x] All environment variables defined
- [x] Variables accessible in application
- [x] Service role key kept server-side only

**Artifacts:**
- `.env.local` with all required variables
- `.env.example` template for deployment

---

### 7) Drizzle config & DB client
- [ ] Implement drizzle.config.ts ✅ (existing)
- [ ] Implement src/lib/db.ts ✅ (existing)

**Acceptance Criteria:**
- [ ] Drizzle configuration points to correct schema and database
- [ ] Database client exports working connection

**Artifacts:**
- `drizzle.config.ts` ✅ (verified existing)
- `src/lib/db.ts` ✅ (verified existing)

---

### 8) Data model (MVP – RF‑1 friendly)
- [ ] Implement src/db/schema.ts ✅ (existing)
- [ ] Run: `pnpm drizzle-kit generate`
- [ ] Run: `pnpm drizzle-kit migrate`

**Acceptance Criteria:**
- [ ] Database schema supports RF-1 format
- [ ] All tables created: claims, sources, actors, positions, modelReviews, aggregates
- [ ] Foreign key relationships established
- [ ] Migrations run successfully

**Artifacts:**
- `src/db/schema.ts` ✅ (verified existing)
- Generated migration files in `drizzle/` directory
- Applied database migrations

---

### 9) Supabase client (optional, for auth later)
- [ ] Implement src/lib/supabase.ts ✅ (existing)

**Acceptance Criteria:**
- [ ] Supabase client configured with environment variables
- [ ] Client ready for future auth integration

**Artifacts:**
- `src/lib/supabase.ts` ✅ (verified existing)

---

### 10) RF‑1 validation (Zod)
- [ ] Implement src/lib/rf1.ts ✅ (existing)

**Acceptance Criteria:**
- [ ] Zod schemas validate RF-1 format
- [ ] Receipt and Source schemas properly defined
- [ ] Type inference working correctly

**Artifacts:**
- `src/lib/rf1.ts` ✅ (verified existing)

---

### 11) API routes (App Router)
- [ ] POST /api/receipts: Factory ingress with RF‑1 validation ✅ (existing)
- [ ] GET /api/badge/[slug].svg: Ratio Badge SVG ✅ (existing)
- [ ] GET /api/claims/[slug]: Return claim+sources+reviews+aggregates JSON ✅ (existing)
- [ ] Optional stubs: /api/search, /api/rechecks

**Acceptance Criteria:**
- [ ] POST /api/receipts accepts and validates RF-1 format
- [ ] Badge SVG generates proper consensus visualization
- [ ] Claims API returns complete claim data
- [ ] All routes handle errors gracefully

**Artifacts:**
- `src/app/api/receipts/route.ts` ✅ (verified existing)
- `src/app/api/badge/[slug]/route.ts` ✅ (verified existing)
- `src/app/api/claims/[slug]/route.ts` ✅ (verified existing)

---

### 12) Pages & components
- [ ] / (Home): Trending, Live Disagreements, placeholders OK
- [ ] /submit: Upload or paste RF‑1 → preview → POST /api/receipts ✅ (existing)
- [ ] /claim/[slug]: Claim header, badge, model dropdown, Evidence & Positions tabs ✅ (existing)
- [ ] /embed/[slug]: Compact iframe card ✅ (existing)
- [ ] Add Open Graph metadata for claim pages (use badge for og:image)

**Acceptance Criteria:**
- [ ] Home page displays trending claims and disagreements
- [ ] Submit page allows RF-1 JSON input and preview
- [ ] Claim pages show complete claim information with interactive elements
- [ ] Embed pages provide compact iframe-ready cards
- [ ] Open Graph metadata enhances social sharing

**Artifacts:**
- `src/app/page.tsx` (home page)
- `src/app/submit/page.tsx` ✅ (verified existing)
- `src/app/claim/[slug]/page.tsx` ✅ (verified existing)
- `src/app/embed/[slug]/page.tsx` ✅ (verified existing)

---

### 13) Utilities
- [ ] Snippet builder for Reddit/X-safe copy ✅ (existing)
- [ ] Platform-tailored copy (markdown/plaintext)

**Acceptance Criteria:**
- [ ] Snippet generation works for social media platforms
- [ ] Copy functionality includes platform-specific formatting
- [ ] Snippets include claim, consensus percentage, and link

**Artifacts:**
- `src/lib/snippet.ts` ✅ (verified existing)
- Enhanced snippet utilities for multiple platforms

---

### 14) Rate limiting (basic)
- [ ] Add IP-based token bucket/LRU for POST /api/receipts

**Acceptance Criteria:**
- [ ] Rate limiting prevents API abuse
- [ ] Reasonable limits for legitimate usage
- [ ] Clear error messages for rate-limited requests

**Artifacts:**
- Rate limiting middleware or utility
- Updated API routes with rate limiting

---

### 15) Testing
- [x] Vitest setup
- [x] Tests for RF‑1 schema validation
- [x] Tests for receipts route
- [x] Tests for badge route SVG integrity

**Acceptance Criteria:**
- [x] Test framework configured and running
- [x] Core functionality covered by tests
- [x] All tests passing with `npm test`

**Artifacts:**
- `vitest.config.ts`
- Test files for critical functionality
- Test scripts in package.json

---

### 16) Linting/Formatting
- [x] ESLint configuration active
- [x] Prettier config
- [x] Add scripts: "lint", "test", "build", "dev"

**Acceptance Criteria:**
- [x] Code passes ESLint checks
- [x] Prettier formats code consistently
- [x] All npm scripts work correctly

**Artifacts:**
- `.eslintrc.json` configuration
- `.prettierrc` configuration
- Updated `package.json` scripts

---

### 17) GitHub Actions (CI)
- [x] Create .github/workflows/ci.yml
- [x] Setup Node, install deps, build, lint, test
- [x] Optional: Upload artifacts

**Acceptance Criteria:**
- [x] CI pipeline configured
- [x] All checks included (build, lint, test)
- [x] Pipeline ready for GitHub integration

**Artifacts:**
- `.github/workflows/ci.yml`
- Successful CI runs

---

### 18) Vercel deploy
- [x] Push initial code to GitHub
- [x] Import repo into Vercel
- [x] Set environment variables in Vercel
- [x] Deploy and verify endpoints

**Acceptance Criteria:**
- [x] Application deploys successfully
- [x] All environment variables configured
- [x] API endpoints accessible
- [x] Home page and key routes working

**Artifacts:**
- Deployed application URL
- Vercel project configuration
- Working production endpoints

---

### 19) Supabase RLS (hardening later)
- [ ] Add RLS policies for client-side reads/writes
- [ ] Ensure service-role usage stays server-side

**Acceptance Criteria:**
- [ ] Row Level Security policies implemented
- [ ] Client-side access properly restricted
- [ ] Server-side operations maintain full access

**Artifacts:**
- RLS policies in Supabase dashboard
- Security audit of client/server access patterns

---

### 20) Analytics & SEO
- [x] Add Plausible/GA analytics
- [x] JSON‑LD for claims
- [x] Proper og: tags using badge for social previews
- [x] UTM tagging on copy links

**Acceptance Criteria:**
- [ ] Analytics tracking user interactions
- [ ] Rich social media previews
- [ ] Structured data for search engines
- [ ] UTM parameters in shared links

**Artifacts:**
- Analytics configuration
- Open Graph and JSON-LD metadata
- Enhanced social sharing

---

### 21) Observability
- [x] Basic logging on API routes
- [x] Vercel monitoring or Logflare integration

**Acceptance Criteria:**
- [ ] API requests logged with relevant details
- [ ] Error tracking and monitoring active
- [ ] Performance metrics available

**Artifacts:**
- Logging utilities
- Monitoring dashboard access
- Error tracking configuration

---

### 22) Security basics
- [x] Security headers in next.config.js (CSP, frame-ancestors allow /embed)
- [x] Validate and normalize URLs/DOIs
- [x] Body size limits on API

**Acceptance Criteria:**
- [ ] Security headers properly configured
- [ ] Input validation prevents common attacks
- [ ] API endpoints have reasonable size limits
- [ ] Embed pages work in iframes

**Artifacts:**
- `next.config.js` with security headers
- Input validation utilities
- API middleware for security

---

### 23) Seed & demo content
- [ ] Create scripts/seed.ts for demo claims/sources
- [ ] Verify UI with demo data

**Acceptance Criteria:**
- [ ] Seed script creates realistic demo data
- [ ] UI components display correctly with demo content
- [ ] Demo claims cover various scenarios

**Artifacts:**
- `scripts/seed.ts`
- Demo database with sample claims
- Verified UI rendering

---

### 24) Cursor automation: project rules
- [ ] Create .cursor/rules/getreceipts.mdc with goals, rules, tasks
- [ ] Document Cursor Autopilot instructions

**Acceptance Criteria:**
- [ ] Cursor rules file provides clear project guidance
- [ ] Rules cover API endpoints, pages, tests, and CI
- [ ] Autopilot can understand project structure and goals

**Artifacts:**
- `.cursor/rules/getreceipts.mdc`
- Documented development workflow

---

### 25) Optional next steps
- [ ] Multi-model reviews population (cron/queue)
- [ ] Thinker pages & follows/watchlists
- [ ] Search with pgvector
- [ ] Obsidian plugin to publish RF‑1 directly
- [ ] GitHub PR ingestion to API

**Acceptance Criteria:**
- [ ] Advanced features identified and planned
- [ ] Architecture supports future enhancements
- [ ] Integration points documented

**Artifacts:**
- Future roadmap documentation
- Architecture notes for extensions
- Plugin/integration specifications

---

## Commit Message Format
```
feat(scope): <short change> (#<step-number>)
```

Example: `feat(api): add RF‑1 validation to /api/receipts (#10)`

## Quality Standards
- TypeScript strict mode enabled
- ESLint passes without errors
- Vitest tests runnable with `pnpm test`
- Server components preferred; hydrate only where necessary
- Route handlers kept small; extract helpers to `src/lib/*`
- Caching headers for SVG and embeds
- Service-role keys never exposed client-side
