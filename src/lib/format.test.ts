import { describe, expect, it } from "vitest";
import { formatRinggit, parseRinggit } from "./format";

describe("formatRinggit", () => {
  it("groups thousands and prefixes RM", () => {
    expect(formatRinggit(2500)).toBe("RM2,500");
    expect(formatRinggit(15000)).toBe("RM15,000");
  });

  it("leaves hundreds ungrouped", () => {
    expect(formatRinggit(300)).toBe("RM300");
  });

  it("rounds to whole ringgit", () => {
    expect(formatRinggit(2499.6)).toBe("RM2,500");
  });
});

describe("parseRinggit", () => {
  it("reads the number out of a price string", () => {
    expect(parseRinggit("RM2,500")).toBe(2500);
    expect(parseRinggit("RM300")).toBe(300);
  });
});
