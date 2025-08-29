/**
 * Centralized slugging function for URL-safe string conversion.
 * 
 * This function normalizes Unicode characters, removes combining marks,
 * converts to lowercase, and replaces non-alphanumeric characters with hyphens.
 * 
 * @param input - The string to convert to a slug
 * @returns A URL-safe slug string
 */
export function toSlug(input: string): string {
  return input
    .normalize('NFKD') // Unicode normalization - decompose characters
    .replace(/[\u0300-\u036f]/g, '') // Strip combining marks (accents, etc.)
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens
}
