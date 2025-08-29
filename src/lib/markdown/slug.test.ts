import { describe, it, expect } from 'vitest';
import { toSlug } from './slug';

describe('toSlug', () => {
  it('should convert basic string with special characters', () => {
    expect(toSlug("Alice & Bob")).toBe("alice-bob");
  });

  it('should handle accented characters and special symbols', () => {
    expect(toSlug("Épisode 12: AI—jobs")).toBe("episode-12-ai-jobs");
  });

  it('should trim leading and trailing spaces', () => {
    expect(toSlug("  spaces   ")).toBe("spaces");
  });

  it('should handle empty string', () => {
    expect(toSlug("")).toBe("");
  });

  it('should handle multiple consecutive special characters', () => {
    expect(toSlug("test---with---dashes")).toBe("test-with-dashes");
  });

  it('should handle string with only special characters', () => {
    expect(toSlug("!@#$%^&*()")).toBe("");
  });

  it('should handle Unicode characters beyond basic accents', () => {
    expect(toSlug("café naïve résumé")).toBe("cafe-naive-resume");
  });
});
