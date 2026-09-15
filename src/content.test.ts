import { describe, expect, it } from "vitest";
import * as content from "./content";

type Found = { path: string; text: string };

function collectStrings(value: unknown, path: string): Found[] {
  if (typeof value === "string") return [{ path, text: value }];
  if (Array.isArray(value)) return value.flatMap((item, i) => collectStrings(item, `${path}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) => collectStrings(item, `${path}.${key}`));
  }
  return [];
}

const allStrings = collectStrings(content, "content");
const DASH = /[‒–—―]|\s-\s/;

describe("copy rules", () => {
  it("contains no dash punctuation", () => {
    const offenders = allStrings.filter((s) => DASH.test(s.text)).map((s) => `${s.path}: ${s.text}`);
    expect(offenders).toEqual([]);
  });

  it("never mentions GetLokal or a 13 app count", () => {
    const joined = allStrings.map((s) => s.text).join("\n");
    expect(joined).not.toMatch(/getlokal/i);
    expect(joined).not.toMatch(/\b13\b/);
  });
});

describe("contact details", () => {
  it("uses the approved WhatsApp number, email and site URL", () => {
    expect(content.site.whatsappNumber).toBe("60193934247");
    expect(content.site.email).toBe("mussyahmi31@gmail.com");
    expect(content.site.url).toBe("https://mustafasyahmi.web.app");
  });
});

describe("services", () => {
  it("lists the four approved services with starting prices", () => {
    expect(content.services.map((s) => [s.name, s.price, s.unit ?? ""])).toEqual([
      ["Business website", "RM2,500", ""],
      ["Online store or ordering system", "RM8,000", ""],
      ["Custom web app or system", "RM15,000", ""],
      ["Monthly care plan", "RM300", "/month"],
    ]);
  });

  it("gives every service a pre-filled WhatsApp message and at least three inclusions", () => {
    for (const service of content.services) {
      expect(service.whatsappMessage.startsWith("Hi Mustafa")).toBe(true);
      expect(service.includes.length).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("work", () => {
  it("shows exactly the four approved live apps", () => {
    expect(content.work.map((w) => w.name)).toEqual(["KiraPoket", "MariSolat", "KadHariLahir", "LukisLukis"]);
  });

  it("links each app to its web.app URL and a local WebP screenshot", () => {
    for (const item of content.work) {
      expect(item.url).toMatch(/^https:\/\/[a-z]+\.web\.app$/);
      expect(item.image).toMatch(/^\/work\/[a-z]+\.webp$/);
    }
  });
});

describe("section sizes", () => {
  it("has 3 problems, 4 process steps and 6 FAQs", () => {
    expect(content.problems).toHaveLength(3);
    expect(content.processSteps).toHaveLength(4);
    expect(content.faqs).toHaveLength(6);
  });
});
