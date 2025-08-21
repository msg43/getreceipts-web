import { describe, it, expect } from "vitest";
import { badgeSvg } from "@/lib/badgeSvg";

describe("badgeSvg", () => {
  it("returns valid SVG string", () => {
    const svg = badgeSvg(0.85);
    expect(svg).toContain("<svg");
    expect(svg).toContain("linearGradient");
    expect(svg).toContain("circle");
  });

  it("clamps values outside 0..1", () => {
    const low = badgeSvg(-5);
    const high = badgeSvg(5);
    expect(low).toContain("Consensus 0%");
    expect(high).toContain("Consensus 100%");
  });
});