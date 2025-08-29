# CI Debugging and Monitoring Guide

## Quick CI Status Check

1. **GitHub Actions**: Go to https://github.com/msg43/getreceipts-web/actions
2. **Latest Run**: Click on the most recent workflow run to see logs
3. **Matrix Jobs**: Check both Node.js 18.x and 20.x versions

## Latest Commits Being Tested

- `fd95912` - Improve CI configuration (latest)
- `66f7db8` - Fix CI failures: Add strict linting and pre-commit hooks

## Common CI Issues and Solutions

### 1. Environment Variable Issues
**Symptoms**: Build fails with missing Supabase URL or keys
**Fixed in latest**: Added all required placeholder environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 
- `SUPABASE_SERVICE_ROLE`
- `DATABASE_URL`

### 2. ESLint Warnings Treated as Errors
**Symptoms**: Build fails on ESLint warnings
**Fixed in latest**: 
- Removed unused `safeRelationships` variable
- Using `npm run lint:strict` with `--max-warnings 0`

### 3. TypeScript Compilation Errors
**Status**: Should be resolved - type checking passes locally

### 4. Test Failures
**Status**: All 12 tests pass locally

## Debugging Commands (Run Locally)

```bash
# Full CI simulation
npm run ci

# Individual checks
npm run type-check
npm run lint:strict  
npm run test
npm run build

# Test with CI environment variables
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co \
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder-anon-key \
SUPABASE_SERVICE_ROLE=placeholder-service-key \
DATABASE_URL=postgresql://placeholder:placeholder@placeholder.supabase.co:5432/postgres \
npm run ci
```

## What to Look for in CI Logs

1. **Step: Install dependencies** - Should complete without errors
2. **Step: Run CI checks** - This runs our consolidated script
3. **Matrix Strategy** - Both Node 18.x and 20.x should pass
4. **Environment Variables** - Check if placeholders are being used correctly

## Expected CI Process

1. Checkout code
2. Setup Node.js (18.x and 20.x matrix)
3. Install dependencies (`npm ci`)
4. Run CI checks (`npm run ci` which includes):
   - Type checking
   - Strict linting (no warnings allowed)
   - Tests
   - Build with placeholder environment variables

## If CI Still Fails

1. Check the specific error message in GitHub Actions logs
2. Run the failing command locally with CI environment variables
3. Look for any new warnings or errors introduced
4. Check if any dependencies have changed

## Monitoring Script

You can use this one-liner to check CI status:
```bash
# Check latest commit and its status
git log --oneline -1 && echo "Check: https://github.com/msg43/getreceipts-web/actions"
```
