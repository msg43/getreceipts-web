# Apex Domain SSL Fix - Immediate Action Required

## Problem
- ✅ www.getreceipts.org works (using CNAME)
- ✅ www.skipthepodcast.com works (using CNAME)
- ❌ getreceipts.org fails with SSL error (using old IP)
- ❌ skipthepodcast.com fails with SSL error (using old IP)

## Root Cause
The apex domains are using the outdated Vercel IP address `76.76.19.19`. Vercel has updated their infrastructure.

## Immediate Fix - Update DNS in GoDaddy

### Step 1: Log into GoDaddy DNS Management

1. Go to [GoDaddy Domain Manager](https://dcc.godaddy.com/manage/)
2. Select "getreceipts.org" → DNS Management

### Step 2: Update GetReceipts.org A Records

**Replace the existing A record:**

```
OLD RECORD (DELETE):
Type: A
Name: @
Value: 76.76.19.19

NEW RECORD (ADD):
Type: A
Name: @
Value: 76.76.21.21
TTL: 600 seconds (10 minutes)
```

### Step 3: Update SkipThePodcast.com A Records

1. Go back to domain list, select "skipthepodcast.com" → DNS Management
2. **Replace the existing A record:**

```
OLD RECORD (DELETE):
Type: A
Name: @
Value: 76.76.19.19

NEW RECORD (ADD):
Type: A
Name: @
Value: 76.76.21.21
TTL: 600 seconds (10 minutes)
```

### Step 4: Verify CNAME Records (Should Already Be Correct)

Ensure these CNAME records exist and are correct:

**For GetReceipts.org:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 600 seconds
```

**For SkipThePodcast.com:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 600 seconds
```

## Alternative Solution (Recommended by Vercel)

Instead of A records, Vercel recommends using ALIAS/ANAME records for apex domains if GoDaddy supports them:

### Check if GoDaddy Supports ALIAS Records

1. In DNS management, look for "ALIAS" or "ANAME" record types
2. If available, replace A records with:

```
Type: ALIAS (or ANAME)
Name: @
Value: cname.vercel-dns.com
TTL: 600 seconds
```

This is more reliable than A records because it automatically updates if Vercel changes IPs.

## Timeline for Fix

- **DNS Update**: Immediate (in GoDaddy interface)
- **Propagation**: 10 minutes to 2 hours (TTL is 600 seconds)
- **SSL Provisioning**: Automatic once DNS propagates

## Verification Steps

### 1. Check DNS Propagation (after 10 minutes)
```bash
# Should return 76.76.21.21
dig getreceipts.org A +short
dig skipthepodcast.com A +short
```

### 2. Test HTTPS (after DNS propagates)
- Visit: https://getreceipts.org
- Visit: https://skipthepodcast.com
- Both should load without SSL errors

### 3. Check SSL Certificates
Use online SSL checker: https://www.ssllabs.com/ssltest/

## If Problems Persist

### 1. Check Vercel Domain Status
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Verify all 4 domains are listed:
   - getreceipts.org
   - www.getreceipts.org
   - skipthepodcast.com
   - www.skipthepodcast.com
3. Check if any show "Invalid Configuration" or "Pending"

### 2. Force SSL Refresh in Vercel
1. In Vercel domains, click "Refresh" next to each apex domain
2. Wait for SSL status to show "Valid"

### 3. Alternative Vercel IPs to Try
If 76.76.21.21 doesn't work, try these Vercel IPs:
- 76.76.21.21 (primary)
- 76.76.21.93 (secondary)

## Quick Reference Commands

```bash
# Check current DNS
dig getreceipts.org A +short
dig skipthepodcast.com A +short

# Check worldwide propagation
nslookup getreceipts.org 8.8.8.8
nslookup skipthepodcast.com 8.8.8.8

# Test HTTPS
curl -I https://getreceipts.org
curl -I https://skipthepodcast.com
```

## Emergency Fallback

If apex domains continue to fail, you can temporarily redirect them to www:

1. In GoDaddy, set up 301 redirects:
   - getreceipts.org → www.getreceipts.org
   - skipthepodcast.com → www.skipthepodcast.com

This ensures users can still access your sites while you troubleshoot.

---

**Priority**: HIGH - This affects user access to your domains
**Expected Resolution Time**: 10 minutes to 2 hours (depending on DNS propagation)
