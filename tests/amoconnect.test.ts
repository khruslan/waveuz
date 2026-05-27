import { describe, expect, it } from "vitest";
import { buildAmoConnectBody } from "@/lib/amoconnect";
import type { LeadPayload } from "@/lib/types";

const base: LeadPayload = {
  name: "Arslan",
  contact: "+998901234567",
  message: "AI scoring project",
  source: "modal"
};

describe("amoconnect body", () => {
  it("uses phone when contact is not an email", () => {
    const body = buildAmoConnectBody(base, "https://wavelabs.kz");
    expect(body.phone).toBe("+998901234567");
    expect(body.email).toBeUndefined();
    expect(body.name).toBe("Arslan");
    expect(body.lead_name).toBe("WaveLabs · modal");
    expect(body.lead_comment).toBe("AI scoring project");
    expect(body.url).toBe("https://wavelabs.kz");
  });

  it("uses email when contact looks like an address", () => {
    const body = buildAmoConnectBody(
      { ...base, contact: "buyer@bank.kz" },
      "https://wavelabs.kz"
    );
    expect(body.email).toBe("buyer@bank.kz");
    expect(body.phone).toBeUndefined();
  });

  it("appends estimate to lead_comment when present", () => {
    const body = buildAmoConnectBody(
      { ...base, estimate: "$30k - $80k USD · 6-12 weeks" },
      "https://wavelabs.kz"
    );
    expect(body.lead_comment).toContain("AI scoring project");
    expect(body.lead_comment).toContain("Estimate: $30k - $80k USD · 6-12 weeks");
  });

  it("passes amo_visitor_uid + utm when supplied", () => {
    const body = buildAmoConnectBody(
      {
        ...base,
        amoVisitorUid: "uid-123",
        utm: {
          utm_source: "facebook",
          utm_medium: "post",
          utm_campaign: "launch"
        }
      },
      "https://wavelabs.kz"
    );
    expect(body.amo_visitor_uid).toBe("uid-123");
    expect(body.utm).toEqual({
      utm_source: "facebook",
      utm_medium: "post",
      utm_campaign: "launch"
    });
  });

  it("omits utm when all keys are empty", () => {
    const body = buildAmoConnectBody(
      { ...base, utm: { utm_source: "", utm_medium: "" } },
      "https://wavelabs.kz"
    );
    expect(body.utm).toBeUndefined();
  });

  it("prefers payload.pageUrl over the fallback", () => {
    const body = buildAmoConnectBody(
      { ...base, pageUrl: "https://wavelabs.kz/?utm_source=fb" },
      "https://fallback.local"
    );
    expect(body.url).toBe("https://wavelabs.kz/?utm_source=fb");
  });
});
