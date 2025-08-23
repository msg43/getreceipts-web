# Production Debug Checklist for GetReceipts

## Client-Side Error Resolution

The "Application error: a client-side exception has occurred" typically indicates missing environment variables or failed API calls in production. Here's your step-by-step resolution guide:

## ✅ **Immediate Actions**

### 1. **Check Vercel Environment Variables**
Ensure these are set in your Vercel dashboard:

```bash
NEXT_PUBLIC_SITE_URL=https://getreceipts-web.vercel.app
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE=your_supabase_service_role_key
DATABASE_URL=your_postgresql_connection_string
```

### 2. **Verify Supabase Configuration**
- Check that your Supabase project is active
- Verify RLS (Row Level Security) policies allow public reads for claims
- Ensure your database tables exist: `claims`, `aggregates`, `sources`, `positions`, etc.

### 3. **Test API Endpoints**
Visit these URLs to verify they work:
- `https://getreceipts-web.vercel.app/api/badge/test`
- `https://getreceipts-web.vercel.app/api/graph/claims`
- `https://getreceipts-web.vercel.app/api/claims/test`

## 🔧 **Code Improvements Applied**

### Error Boundaries Added
- Wrapped `ClaimGraph`, `VotingWidget`, and `CommentsSection` in error boundaries
- Added fallback UI for component failures
- Improved error logging for debugging

### Environment Variable Fallbacks
- Added fallback URLs when `NEXT_PUBLIC_SITE_URL` is missing
- Improved client-side environment variable handling
- Added graceful degradation for clipboard API

### API Error Handling
- Enhanced error handling in `ClaimGraph` component
- Added proper HTTP status checking
- Fallback data structures to prevent crashes

### Database Query Protection
- Added `.catch()` handlers to all database queries
- Graceful fallbacks for missing data
- Improved error logging

## 🚨 **Common Issues & Solutions**

### Issue 1: "Cannot read properties of undefined"
**Cause:** Missing environment variables
**Solution:** Set all required environment variables in Vercel

### Issue 2: "Failed to fetch" errors
**Cause:** API endpoints returning 500 errors
**Solution:** Check Supabase connection and database schema

### Issue 3: D3.js rendering errors
**Cause:** Invalid data structure from API
**Solution:** Error boundary now catches and handles these gracefully

### Issue 4: Clipboard API failures
**Cause:** Non-HTTPS context or browser restrictions
**Solution:** Added fallback copy mechanism

## 🔍 **Debugging Steps**

1. **Check Browser Console:**
   - Open Developer Tools → Console
   - Look for specific error messages
   - Note any failed network requests

2. **Check Network Tab:**
   - Look for failed API calls (red status codes)
   - Verify response data structure
   - Check for CORS issues

3. **Verify Environment:**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Ensure all variables are set and deployed
   - Redeploy after adding missing variables

## 📋 **Deployment Verification**

After fixing environment variables, verify these work:

- [ ] Claim pages load without errors
- [ ] Badge images display correctly  
- [ ] Voting widget functions properly
- [ ] Graph visualization renders
- [ ] Copy snippet button works
- [ ] Comments section loads
- [ ] No console errors in browser

## 🆘 **If Issues Persist**

1. **Check Vercel Function Logs:**
   - Go to Vercel Dashboard → Functions → View Logs
   - Look for server-side errors

2. **Database Connection Test:**
   - Visit `/api/debug/auth` to test Supabase connection
   - Check if tables exist and are accessible

3. **Gradual Rollback:**
   - Temporarily disable problematic components
   - Identify the specific failing component
   - Fix incrementally

## 📞 **Emergency Fallback**

If the site is completely broken, you can temporarily:
1. Comment out the `ClaimGraph` component import
2. Remove the D3.js dependency temporarily
3. Deploy a minimal version while debugging

The error boundaries will now prevent complete page crashes and show helpful error messages instead.
