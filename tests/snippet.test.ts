import { describe, it, expect } from "vitest";
import { buildSnippet } from "@/lib/snippet";

describe("buildSnippet", () => {
  it("formats a shareable snippet", () => {
    const s = buildSnippet("abc123", "Climate change is real.", 97);
    expect(s).toContain("🧾 Climate change is real.");
    expect(s).toContain("Consensus: 97%");
    expect(s).toContain("https://getreceipts.org/claim/abc123");
  });
});