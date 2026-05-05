import { describe, expect, it } from "vitest";
import { formatTelegramMessage, leadPayloadSchema } from "@/lib/leads";

describe("leads", () => {
  it("validates the lead payload contract", () => {
    const parsed = leadPayloadSchema.parse({
      name: "Arslan",
      contact: "@arslan",
      message: "We need an AI scoring model",
      source: "modal"
    });

    expect(parsed.source).toBe("modal");
  });

  it("rejects empty lead contact information", () => {
    expect(() =>
      leadPayloadSchema.parse({
        name: "Arslan",
        contact: "",
        message: "Project",
        source: "contact"
      })
    ).toThrow();
  });

  it("formats Telegram-safe lead messages", () => {
    const message = formatTelegramMessage({
      name: "Arslan",
      contact: "@arslan",
      message: "AI scoring <urgent>",
      source: "calculator",
      estimate: "$15k - $30k"
    });

    expect(message).toContain("<b>New WaveLabs lead</b>");
    expect(message).toContain("AI scoring &lt;urgent&gt;");
    expect(message).toContain("$15k - $30k");
  });
});
