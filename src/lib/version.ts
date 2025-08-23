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
  if (cachedVersion) {
    return cachedVersion;
  }

  try {
    const versionPath = join(process.cwd(), 'version.toml');
    const versionContent = readFileSync(versionPath, 'utf-8');
    const config = TOML.parse(versionContent) as VersionConfig;
    
    const { major, minor, patch, build } = config.version;
    cachedVersion = `v${major}.${minor}.${patch}.${build}`;
    
    return cachedVersion;
  } catch (error) {
    console.warn('Could not read version.toml, using fallback version');
    return 'v1.0.0.0';
  }
}

export function getVersionWithoutV(): string {
  return getVersion().replace('v', '');
}
