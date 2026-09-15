import { describe, expect, it } from "vitest";
import { whatsappLink } from "./whatsapp";

describe("whatsappLink", () => {
  it("links to Mustafa's WhatsApp number by default", () => {
    expect(whatsappLink("Hi")).toBe("https://wa.me/60193934247?text=Hi");
  });

  it("encodes spaces, commas and question marks in the message", () => {
    expect(whatsappLink("Hi Mustafa, can we talk?")).toBe(
      "https://wa.me/60193934247?text=Hi%20Mustafa%2C%20can%20we%20talk%3F",
    );
  });

  it("uses another number when one is given", () => {
    expect(whatsappLink("Hi", "60123456789")).toBe("https://wa.me/60123456789?text=Hi");
  });
});
