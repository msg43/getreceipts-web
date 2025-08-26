#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import TOML from '@iarna/toml';

const versionPath = path.join(process.cwd(), 'version.toml');

try {
  // Read current version
  const versionContent = fs.readFileSync(versionPath, 'utf-8');
  const config = TOML.parse(versionContent);
  
  // Increment build number
  config.version.build += 1;
  
  // Update last_updated date
  config.metadata.last_updated = new Date().toISOString().split('T')[0];
  
  // Write back to file
  const newContent = TOML.stringify(config);
  fs.writeFileSync(versionPath, newContent);
  
  const { major, minor, patch, build } = config.version;
  const versionString = `v${major}.${minor}.${patch}.${build}`;
  
  console.log(`✅ Version incremented to ${versionString}`);
  
} catch (error) {
  console.error('❌ Error incrementing version:', error.message);
  process.exit(1);
}
