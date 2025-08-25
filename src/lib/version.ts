import * as TOML from '@iarna/toml';
import { readFileSync } from 'fs';
import { join } from 'path';

interface VersionConfig {
  version: {
    major: number;
    minor: number;
    patch: number;
    build: number;
  };
  metadata: {
    last_updated: string;
    description: string;
  };
}

let cachedVersion: string | null = null;

export function getVersion(): string {
  // Return cached version if available
  if (cachedVersion) {
    return cachedVersion;
  }

  // Return fallback version if running in browser
  if (typeof window !== 'undefined') {
    cachedVersion = 'v1.0.0.0';
    return cachedVersion;
  }

  try {
    // Only attempt file read on server-side
    const versionPath = join(process.cwd(), 'version.toml');
    const versionContent = readFileSync(versionPath, 'utf-8');
    const config = TOML.parse(versionContent) as VersionConfig;
    
    const { major, minor, patch, build } = config.version;
    cachedVersion = `v${major}.${minor}.${patch}.${build}`;
    
    return cachedVersion;
  } catch (error) {
    console.warn('Could not read version.toml, using fallback version');
    cachedVersion = 'v1.0.0.0';
    return cachedVersion;
  }
}

export function getVersionWithoutV(): string {
  return getVersion().replace('v', '');
}
