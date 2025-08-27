# Pre-Push Validation Setup

This project now includes automated pre-push validation to catch issues before they reach CI/CD.

## What's Included

### Git Hooks with Husky
- **Husky** is installed to manage Git hooks
- **Pre-push hook** runs validation checks before pushing to remote

### Pre-Push Checks
The pre-push hook runs:
1. **ESLint** - Code linting to catch syntax and style issues
2. **Tests** - Unit tests to ensure functionality works
3. **Build check** (optional) - Ensures the project builds successfully

### Available Scripts

```bash
# Run individual checks
npm run lint           # Run ESLint
npm run lint:fix       # Run ESLint with auto-fix
npm run test           # Run tests once
npm run test:watch     # Run tests in watch mode

# Run all pre-push checks manually
npm run pre-push       # Lint + test + build
```

## Configuration

### Pre-Push Hook Location
`.husky/pre-push` - The Git hook script that runs before pushing

### Customizing Checks
Edit `.husky/pre-push` to:
- Add/remove validation steps
- Enable/disable build checking
- Adjust error messages

### Package.json Scripts
The following scripts were added:
- `lint:fix` - Auto-fix linting issues
- `test:watch` - Run tests in watch mode  
- `pre-push` - Run all validation checks manually
- `prepare` - Husky setup (runs on npm install)

## Usage

### Automatic Validation
When you run `git push`, the pre-push hook automatically:
1. Runs linting checks
2. Runs unit tests
3. Blocks the push if any checks fail

### Manual Validation
Run validation manually before committing:
```bash
npm run pre-push
```

### Bypassing Hooks (Emergency Only)
In emergencies, you can bypass pre-push hooks:
```bash
git push --no-verify
```
**Note:** Only use this in urgent situations as it skips all validation.

## Fixed Issues

### Linting Errors
Fixed the following ESLint errors in `scripts/debug-mobile.js`:
- Converted `require()` imports to ES modules (`import`)
- Removed unused `responseTime` variable
- Renamed file to `.mjs` for proper ES module support

### Build Integration
The setup integrates with your existing CI/CD pipeline:
- Local pre-push validation catches issues early
- CI still runs full validation including build
- Faster feedback loop for developers

## Benefits

1. **Faster Development** - Catch issues locally before CI
2. **Consistent Code Quality** - Automated linting on every push
3. **Fewer Failed CI Builds** - Pre-validation reduces CI failures
4. **Team Consistency** - Everyone gets the same validation checks

## Troubleshooting

### Hook Not Running
```bash
# Reinstall Husky hooks
npx husky install
```

### Permission Issues
```bash
# Make hook executable
chmod +x .husky/pre-push
```

### Skipping Specific Checks
Edit `.husky/pre-push` and comment out unwanted validation steps.
