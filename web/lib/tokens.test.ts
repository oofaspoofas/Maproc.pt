import { describe, expect, it } from "vitest";
import { contrast, tokens } from "./tokens";

describe("accessible brand palette", () => {
  it("retains the original logo colours", () => {
    expect(tokens.navy).toBe("#003686");
    expect(tokens.orange).toBe("#ff6700");
  });
  it("does not mistake bright orange for accessible text on white", () => {
    expect(contrast(tokens.orange, "#ffffff")).toBeLessThan(3);
  });
  it("passes AA for all intended text and surface combinations", () => {
    for (const [fg, bg] of [
      [tokens.orangeInk, tokens.surfaceLight],
      [tokens.orangeInk, "#ffffff"],
      [tokens.textOnDark, tokens.surfaceDark],
      [tokens.textMutedOnDark, tokens.surfaceDark],
      [tokens.orange, tokens.surfaceDark],
      [tokens.surfaceDark, tokens.orange],
      [tokens.navy, tokens.surfaceLight],
    ])
      expect(contrast(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });
});
