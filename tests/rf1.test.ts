import { describe, it, expect } from "vitest";
import { ReceiptSchema } from "@/lib/rf1";

describe("RF-1 schema", () => {
  it("accepts a valid receipt", () => {
    const good = {
      claim_text: "Sugar is as addictive as cocaine.",
      topics: ["nutrition"],
      supporters: ["Robert Lustig"],
      opponents: ["ADA"],
      sources: [{ type: "paper", title: "Avena 2008", url: "https://example.com" }],
      provenance: { producer_app: "Factory", version: "0.1.0" }
    };
    const parsed = ReceiptSchema.safeParse(good);
    expect(parsed.success).toBe(true);
  });

  it("rejects a too-short claim", () => {
    const bad = { claim_text: "short" };
    const parsed = ReceiptSchema.safeParse(bad);
    expect(parsed.success).toBe(false);
  });
});