# GoDaddy Multi-Domain Deployment Guide

This guide explains how to deploy your GetReceipts application with two domains hosted on GoDaddy: **GetReceipts.org** and **SkipThePodcast.com**.

## Current Configuration

### Domain Setup
- **GetReceipts.org**: Original branding, blue theme
- **SkipThePodcast.com**: Podcast-focused branding, blue theme
- **Both domains**: Share the same Supabase backend and publishing workflow

### Architecture
```
GoDaddy DNS → Vercel Hosting → Single Next.js App → Shared Supabase Database
```

## Step 1: Verify Current Vercel Deployment

First, ensure your current application is properly deployed to Vercel:

```bash
# Deploy to Vercel if not already done
npx vercel --prod

# Note the deployment URL (e.g., your-app.vercel.app)
```

## Step 2: Configure Domains in Vercel

### Add Custom Domains

1. **Go to Vercel Dashboard**:
   - Navigate to your project
   - Go to Settings → Domains

2. **Add Both Domains**:
   - Click "Add Domain"
   - Add: `getreceipts.org`
   - Add: `www.getreceipts.org`
   - Add: `skipthepodcast.com`
   - Add: `www.skipthepodcast.com`

3. **Note the DNS Instructions**:
   Vercel will provide DNS configuration instructions for each domain.

## Step 3: Configure DNS in GoDaddy

### For GetReceipts.org

1. **Log into GoDaddy Domain Manager**
2. **Go to DNS Management** for getreceipts.org
3. **Add/Update these records**:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 1 Hour

Type: A
Name: @
Value: 76.76.19.19
TTL: 1 Hour

Type: CNAME
Name: *
Value: cname.vercel-dns.com
TTL: 1 Hour
```

### For SkipThePodcast.com

1. **Go to DNS Management** for skipthepodcast.com
2. **Add/Update these records**:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 1 Hour

Type: A
Name: @
Value: 76.76.19.19
TTL: 1 Hour

Type: CNAME
Name: *
Value: cname.vercel-dns.com
TTL: 1 Hour
```

### Important Notes:
- Replace existing A and CNAME records if they conflict
- DNS propagation can take 24-48 hours
- Use `dig` or online DNS checkers to verify propagation

## Step 4: Test Domain Routing

### Local Testing (Optional)

Add to your `/etc/hosts` file for immediate testing:
```
127.0.0.1 getreceipts.local
127.0.0.1 skipthepodcast.local
```

Then run:
```bash
npm run dev
# Visit http://getreceipts.local:3000 and http://skipthepodcast.local:3000
```

### Live Testing

After DNS propagation:
1. Visit `https://getreceipts.org` - Should show original GetReceipts branding
2. Visit `https://skipthepodcast.com` - Should show SkipThePodcast branding
3. Test submission workflow on both domains
4. Verify both domains show the same claims data

## Step 5: SSL Certificates

Vercel automatically provides SSL certificates for custom domains. After DNS propagation:

1. **Check SSL Status** in Vercel dashboard under Domains
2. **Force HTTPS** by ensuring HTTP redirects to HTTPS
3. **Verify certificates** are valid for both domains

## Step 6: Environment Variables

No changes needed! Both domains use the same environment variables:

```bash
# These remain the same for both domains
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE=your_service_role_key
DATABASE_URL=your_database_url
```

## Step 7: Deploy Updated Configuration

Deploy the updated domain configuration:

```bash
# Commit the changes
git add .
git commit -m "Configure GetReceipts.org and SkipThePodcast.com domains"

# Deploy to production
npx vercel --prod

# Or use your existing push script
./scripts/smart-push.sh "Configure dual domain setup"
```

## Verification Checklist

### ✅ DNS Configuration
- [ ] GetReceipts.org points to Vercel
- [ ] www.GetReceipts.org points to Vercel
- [ ] SkipThePodcast.com points to Vercel
- [ ] www.SkipThePodcast.com points to Vercel
- [ ] DNS propagation complete (use `dig` to check)

### ✅ Domain Functionality
- [ ] GetReceipts.org loads with original branding
- [ ] SkipThePodcast.com loads with podcast-focused branding
- [ ] Both domains show same claims data
- [ ] Submit workflow works on both domains
- [ ] SSL certificates valid for both domains

### ✅ Cross-Domain Features
- [ ] Claims submitted on one domain appear on both
- [ ] API endpoints work from both domains
- [ ] Voting and comments work on both domains
- [ ] Embed functionality works for both domains

## Troubleshooting

### Domain Not Loading
1. **Check DNS**: Use `dig getreceipts.org` and `dig skipthepodcast.com`
2. **Verify Vercel**: Ensure domains are added in Vercel dashboard
3. **Check propagation**: DNS changes can take 24-48 hours
4. **Clear cache**: Clear browser cache and try incognito mode

### Wrong Branding Showing
1. **Check middleware**: Verify domain configuration in `src/middleware.ts`
2. **Verify deployment**: Ensure latest code is deployed to Vercel
3. **Clear cache**: Browser may be caching old version
4. **Check headers**: Use browser dev tools to verify request headers

### SSL Issues
1. **Wait for Vercel**: SSL provisioning can take a few minutes
2. **Check DNS**: Ensure DNS is properly configured
3. **Force refresh**: Try force-refreshing SSL in Vercel dashboard

### Claims Not Appearing
1. **Check database**: Verify both domains connect to same Supabase
2. **Check API**: Test API endpoints directly
3. **Verify env vars**: Ensure environment variables are identical

## Maintenance

### Adding More Domains
To add additional domains in the future:

1. Update `src/lib/domain-config.ts`
2. Update `src/middleware.ts`
3. Create new homepage component if needed
4. Add domain in Vercel dashboard
5. Configure DNS in domain registrar

### Monitoring
Consider setting up:
- Uptime monitoring for both domains
- Analytics tracking per domain
- Error monitoring with domain context

## Support

### GoDaddy Support
- DNS configuration help: GoDaddy customer support
- Domain management: GoDaddy domain manager

### Vercel Support
- Deployment issues: Vercel documentation
- Custom domain setup: Vercel domain configuration guide

### Application Support
- Check application logs in Vercel dashboard
- Monitor Supabase logs for database issues
- Use browser dev tools for client-side debugging

---

## Quick Commands Reference

```bash
# Check DNS propagation
dig getreceipts.org
dig skipthepodcast.com

# Deploy to production
npx vercel --prod

# Test locally with custom hosts
echo "127.0.0.1 getreceipts.local" >> /etc/hosts
echo "127.0.0.1 skipthepodcast.local" >> /etc/hosts

# Remove test hosts
sudo sed -i '' '/getreceipts.local/d' /etc/hosts
sudo sed -i '' '/skipthepodcast.local/d' /etc/hosts
```
