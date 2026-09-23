import { describe, expect, it } from "vitest";
import { estimateFor, estimateMessage, type Answers } from "./estimate";

const answers = (overrides: Partial<Answers> = {}): Answers => ({
  need: "store",
  size: "medium",
  payment: "yes",
  timeline: "soon",
  ...overrides,
});

describe("estimateFor", () => {
  it("prices a small business website at the published starting price", () => {
    expect(estimateFor(answers({ need: "website", size: "small", payment: "no", timeline: "soon" }))).toEqual({
      kind: "range",
      low: 2500,
      high: 3500,
    });
  });

  it("adds payment handling to a website only", () => {
    expect(estimateFor(answers({ need: "website", size: "small", payment: "yes", timeline: "soon" }))).toEqual({
      kind: "range",
      low: 4000,
      high: 5500,
    });
    expect(estimateFor(answers({ need: "store", size: "small", payment: "yes", timeline: "soon" }))).toEqual(
      estimateFor(answers({ need: "store", size: "small", payment: "no", timeline: "soon" })),
    );
  });

  it("scales with size", () => {
    expect(estimateFor(answers({ need: "store", size: "medium", payment: "yes", timeline: "soon" }))).toEqual({
      kind: "range",
      low: 10000,
      high: 13500,
    });
    // 8000 times 1.6 is 12800, which rounds down to 12500; 12500 times 1.35
    // is 16875, which rounds up to 17000.
    expect(estimateFor(answers({ need: "store", size: "large", payment: "yes", timeline: "soon" }))).toEqual({
      kind: "range",
      low: 12500,
      high: 17000,
    });
  });

  it("adds a rush premium for as soon as possible", () => {
    const rushed = estimateFor(answers({ need: "custom", size: "large", payment: "no", timeline: "asap" }));
    const relaxed = estimateFor(answers({ need: "custom", size: "large", payment: "no", timeline: "soon" }));
    expect(rushed.kind).toBe("range");
    expect(relaxed.kind).toBe("range");
    if (rushed.kind === "range" && relaxed.kind === "range") {
      expect(rushed.low).toBeGreaterThan(relaxed.low);
    }
  });

  it("never quotes below the published starting price", () => {
    for (const need of ["website", "store", "custom"] as const) {
      const result = estimateFor(answers({ need, size: "small", payment: "no", timeline: "exploring" }));
      const floors = { website: 2500, store: 8000, custom: 15000 };
      if (result.kind === "range") expect(result.low).toBeGreaterThanOrEqual(floors[need]);
    }
  });

  it("rounds to the nearest 500", () => {
    const result = estimateFor(answers({ need: "custom", size: "large", payment: "no", timeline: "asap" }));
    if (result.kind === "range") {
      expect(result.low % 500).toBe(0);
      expect(result.high % 500).toBe(0);
    }
  });

  it("shows the tiers instead of a range when the visitor is not sure", () => {
    expect(estimateFor(answers({ need: "unsure" }))).toEqual({ kind: "tiers" });
  });
});

describe("estimateMessage", () => {
  it("lists the answers and the range", () => {
    const given = answers({ need: "store", size: "medium", payment: "yes", timeline: "soon" });
    const message = estimateMessage(given, estimateFor(given));
    expect(message).toBe(
      [
        "Hi Mustafa, I used the estimator on your website.",
        "What I need: Online store or ordering system",
        "Size: 10 to 50 pages or products",
        "Online payment: Yes",
        "Timeline: In the next 1 to 3 months",
        "Estimate shown: RM10,000 to RM13,500",
      ].join("\n"),
    );
  });

  it("says so when the visitor is not sure what they need", () => {
    const given = answers({ need: "unsure" });
    const message = estimateMessage(given, estimateFor(given));
    expect(message).toContain("What I need: Not sure yet");
    expect(message).toContain("Estimate shown: not sure yet, I would like your advice");
  });

  it("contains no dash punctuation", () => {
    const given = answers();
    expect(estimateMessage(given, estimateFor(given))).not.toMatch(/[‒–—―]|\s-\s/);
  });
});
