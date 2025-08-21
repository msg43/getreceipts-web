/**
 * URL validation and sanitization utilities
 */

const ALLOWED_PROTOCOLS = ['http:', 'https:'];
const BLOCKED_DOMAINS = ['localhost', '127.0.0.1', '0.0.0.0'];

export function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    
    // Check protocol
    if (!ALLOWED_PROTOCOLS.includes(url.protocol)) {
      return false;
    }
    
    // Check for blocked domains (prevent SSRF)
    if (BLOCKED_DOMAINS.includes(url.hostname)) {
      return false;
    }
    
    // Check for private IP ranges
    if (isPrivateIP(url.hostname)) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

export function sanitizeUrl(urlString: string): string | null {
  if (!isValidUrl(urlString)) {
    return null;
  }
  
  try {
    const url = new URL(urlString);
    // Remove potentially dangerous parameters
    url.searchParams.delete('javascript');
    url.searchParams.delete('data');
    
    return url.toString();
  } catch {
    return null;
  }
}

function isPrivateIP(hostname: string): boolean {
  // Basic check for private IP ranges
  const privateRanges = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^169\.254\./, // Link-local
  ];
  
  return privateRanges.some(range => range.test(hostname));
}

/**
 * DOI validation
 */
export function isValidDOI(doi: string): boolean {
  // Basic DOI format validation
  const doiRegex = /^10\.\d{4,}\/[^\s]+$/;
  return doiRegex.test(doi);
}

export function normalizeDOI(doi: string): string | null {
  if (!doi) return null;
  
  // Remove common prefixes
  const cleaned = doi
    .replace(/^(https?:\/\/)?(dx\.)?doi\.org\//, '')
    .replace(/^doi:/, '')
    .trim();
  
  return isValidDOI(cleaned) ? cleaned : null;
}

/**
 * Text sanitization
 */
export function sanitizeText(text: string, maxLength: number = 5000): string {
  return text
    .trim()
    .slice(0, maxLength)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ''); // Remove control characters
}

/**
 * Input size validation
 */
export const INPUT_LIMITS = {
  CLAIM_SHORT: 500,
  CLAIM_LONG: 5000,
  QUOTE: 1000,
  TITLE: 200,
  URL: 2000,
  DOI: 100,
  VENUE: 200,
  TOPIC: 50,
  MAX_SOURCES: 20,
  MAX_POSITIONS: 50,
  MAX_TOPICS: 10,
} as const;
