#!/bin/bash

# Smart Push Script with Auto-Version Increment
# Usage: ./scripts/smart-push.sh [commit-message]

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Smart Push with Auto-Version Increment${NC}"
echo "================================================"

# Check if there are any changes to commit
if git diff --quiet && git diff --cached --quiet; then
    echo -e "${YELLOW}⚠️  No changes to commit${NC}"
    exit 0
fi

# Get commit message from argument or prompt
if [ -z "$1" ]; then
    echo -e "${YELLOW}💬 Enter commit message:${NC}"
    read -r COMMIT_MSG
else
    COMMIT_MSG="$1"
fi

# Show what will be committed
echo -e "\n${BLUE}📋 Changes to be committed:${NC}"
git status --short

# Stage all changes
echo -e "\n${BLUE}📦 Staging changes...${NC}"
git add .

# Increment version
echo -e "\n${BLUE}🔢 Incrementing version...${NC}"
npm run version:increment

# Add the updated version.toml to the commit
git add version.toml

# Commit with the provided message
echo -e "\n${BLUE}💾 Committing changes...${NC}"
git commit -m "$COMMIT_MSG"

# Get the new version for display
NEW_VERSION=$(node -e "
const TOML = require('@iarna/toml');
const fs = require('fs');
const config = TOML.parse(fs.readFileSync('version.toml', 'utf-8'));
const {major, minor, patch, build} = config.version;
console.log(\`v\${major}.\${minor}.\${patch}.\${build}\`);
")

echo -e "\n${GREEN}✅ Committed with version: $NEW_VERSION${NC}"

# Push to remote
echo -e "\n${BLUE}🌐 Pushing to remote...${NC}"
git push

echo -e "\n${GREEN}🎉 Successfully pushed with auto-incremented version: $NEW_VERSION${NC}"
echo -e "${BLUE}🔗 Changes are now live on GitHub!${NC}"
