# Version System Documentation

## Overview
GetReceipts.org uses an automated version system that increments the build number on every push to GitHub. The version is displayed in the lower right corner of the homepage.

## Version Format
- **Format**: `v{major}.{minor}.{patch}.{build}`
- **Example**: `v1.0.0.1`
- **Location**: `version.toml` file in the project root

## Files Created/Modified

### 1. `version.toml`
Contains the version configuration:
```toml
[version]
major = 1
minor = 0
patch = 0
build = 1

[metadata]
last_updated = "2025-01-27"
description = "GetReceipts.org - Claim Receipt Platform"
```

### 2. `src/lib/version.ts`
Utility functions to read version from TOML:
- `getVersion()` - Returns full version string (e.g., "v1.0.0.1")
- `getVersionWithoutV()` - Returns version without 'v' prefix

### 3. `scripts/increment-version.js`
Node.js script that:
- Reads current version from `version.toml`
- Increments the build number
- Updates the `last_updated` date
- Writes back to the file

### 4. `scripts/smart-push.sh`
Bash script that:
- Stages all changes
- Increments version automatically
- Commits with custom message
- Pushes to GitHub
- Shows colorful progress output

## Usage

### Method 1: NPM Script (Simple)
```bash
npm run push
```

### Method 2: Smart Push Script (Recommended)
```bash
./scripts/smart-push.sh "Your commit message here"
```

### Method 3: Manual Version Increment
```bash
npm run version:increment
```

## Homepage Integration
- The version number appears in the lower right corner of the footer
- Replaces the previous "GitHub" link
- Styled with monospace font and muted colors
- Updates automatically on each deployment

## Workflow
1. Make your code changes
2. Run `./scripts/smart-push.sh "Your commit message"`
3. Script automatically:
   - Stages changes
   - Increments build number (e.g., v1.0.0.1 → v1.0.0.2)
   - Commits with your message + version update
   - Pushes to GitHub
4. Version appears on homepage after deployment

## Manual Version Management
To manually update major/minor/patch versions, edit `version.toml`:
```toml
[version]
major = 2  # Major release
minor = 1  # New features
patch = 0  # Bug fixes
build = 0  # Auto-incremented
```

## Benefits
- ✅ Automatic version tracking
- ✅ No manual version management needed
- ✅ Visible version on homepage
- ✅ Git history includes version increments
- ✅ Easy to track deployments
- ✅ Professional appearance
