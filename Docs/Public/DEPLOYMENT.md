# GetReceipts.org - Deployment Guide

This guide covers deploying GetReceipts.org to production using Supabase and Vercel.

## Prerequisites

- [Supabase](https://supabase.com) account
- [Vercel](https://vercel.com) account
- [GitHub](https://github.com) repository

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose organization and enter project details:
   - **Name**: `getreceipts-org`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users

### 1.2 Enable pgvector Extension

1. Go to **SQL Editor** in your Supabase dashboard
2. Run this SQL command:

```sql
-- Enable pgvector extension for future vector search capabilities
create extension if not exists vector;
```

### 1.3 Get Database Credentials

1. Go to **Settings** → **Database**
2. Copy the **Connection string** (URI format)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL**
   - **anon public key**
   - **service_role key** (keep this secret!)

## Step 2: Run Database Migrations

### 2.1 Set Environment Variables Locally

Create `.env.local` in your project root:

```bash
# Next.js Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE=your_service_role_key_here

# Database Configuration
DATABASE_URL=postgresql://postgres:password@db.your-project-id.supabase.co:5432/postgres
```

### 2.2 Run Migrations

```bash
# Generate migration files
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Optional: Seed with demo data
npm run db:seed
```

## Step 3: Vercel Deployment

### 3.1 Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave default)

### 3.2 Environment Variables

In Vercel project settings, add these environment variables:

```bash
# Production URL (update after first deployment)
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app

# Supabase (same as local)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE=your_service_role_key_here
DATABASE_URL=postgresql://postgres:password@db.your-project-id.supabase.co:5432/postgres

# Optional: Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-domain.com
```

### 3.3 Deploy

1. Click **"Deploy"**
2. Wait for build to complete
3. Update `NEXT_PUBLIC_SITE_URL` with your actual Vercel URL
4. Redeploy if needed

## Step 4: Custom Domain (Optional)

### 4.1 Add Domain in Vercel

1. Go to **Project Settings** → **Domains**
2. Add your custom domain
3. Configure DNS records as instructed

### 4.2 Update Environment Variables

Update `NEXT_PUBLIC_SITE_URL` to use your custom domain.

## Step 5: Verification

### 5.1 Test Endpoints

Visit these URLs to verify deployment:

- `https://your-domain.com/` - Home page
- `https://your-domain.com/submit` - Submit form
- `https://your-domain.com/api/receipts` - Should return 405 (Method Not Allowed)

### 5.2 Submit Test Receipt

1. Go to `/submit`
2. Paste this test RF-1 JSON:

```json
{
  "claim_text": "Test claim for deployment verification",
  "sources": [
    {
      "type": "article",
      "title": "Test Source",
      "url": "https://example.com"
    }
  ],
  "supporters": ["Test supporter"],
  "provenance": {
    "producer_app": "deployment-test"
  }
}
```

3. Click **"Publish"**
4. Verify claim page and badge generation work

## Step 6: Monitoring & Analytics

### 6.1 Vercel Analytics

1. Go to **Project Settings** → **Analytics**
2. Enable **Web Analytics**

### 6.2 Plausible Analytics (Optional)

1. Sign up at [Plausible.io](https://plausible.io)
2. Add your domain
3. Add `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` environment variable
4. Redeploy

### 6.3 Error Monitoring

Consider adding:
- [Sentry](https://sentry.io) for error tracking
- [LogFlare](https://logflare.app) for log aggregation

## Step 7: Security Checklist

- ✅ Service role key is server-side only
- ✅ Rate limiting is enabled
- ✅ Input validation is active
- ✅ Security headers are configured
- ✅ HTTPS is enforced
- ✅ Database credentials are secure

## Troubleshooting

### Build Errors

```bash
# Check types locally
npx tsc --noEmit

# Run build locally
npm run build
```

### Database Connection Issues

1. Verify `DATABASE_URL` format
2. Check Supabase project status
3. Ensure pgvector extension is enabled

### Environment Variable Issues

1. Verify all required variables are set
2. Check for typos in variable names
3. Ensure service role key is not exposed client-side

## Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Update database schema if needed
npm run db:generate
npm run db:migrate
```

### Backup Strategy

- Supabase automatically backs up your database
- Consider exporting important data regularly
- Monitor usage and scale as needed

## Support

For deployment issues:
1. Check [Vercel Documentation](https://vercel.com/docs)
2. Check [Supabase Documentation](https://supabase.com/docs)
3. Review application logs in Vercel dashboard
4. Check database logs in Supabase dashboard