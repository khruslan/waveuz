import { describe, expect, it } from "vitest";
import { assets, stats, teamMembers } from "@/data/site";
import { detectLocale, translate } from "@/lib/i18n";

describe("i18n", () => {
  it("detects supported locales from browser language lists", () => {
    expect(detectLocale(["ru-RU", "en-US"])).toBe("ru");
    expect(detectLocale(["uz-Latn-UZ", "ru-RU"])).toBe("uz");
    expect(detectLocale(["fr-FR"])).toBe("en");
  });

  it("falls back to English when a key is missing", () => {
    expect(translate("ru", "nav.cta")).toBe("Связаться");
    expect(translate("uz", "missing.key")).toBe("");
  });

  it("uses confirmed team members and localized roles", () => {
    expect(teamMembers.map((member) => member.name)).toEqual([
      "Anel Ryspaeva",
      "Emil Khusnutdinov",
      "Ruslan Khusenov",
      "Madina Saylaubayeva"
    ]);
    expect(teamMembers.map((member) => member.xp)).toEqual([
      "team.source",
      "team.source",
      "team.source",
      "team.source"
    ]);
    expect(translate("en", "m1.role")).toBe("Founder & CEO");
    expect(translate("ru", "m4.role")).toBe("Проектный менеджер");
    expect(translate("uz", "team.source")).toBe("RA Group jamoasi");
  });

  it("stats have honest studio signals and evidence keys", () => {
    expect(stats).toHaveLength(4);
    expect(stats.map((s) => s.value)).toEqual(["4", "3", "2", "12"]);
    expect(stats.map((s) => s.suffix)).toEqual(["", "y", "", "+"]);
    expect(stats.every((s) => typeof s.evidence === "string" && s.evidence.length > 0)).toBe(true);
  });

  it("assets expose serviceIcons", () => {
    expect(Array.isArray(assets.serviceIcons)).toBe(true);
    expect(assets.serviceIcons).toHaveLength(5);
  });

  it("hero uses vertical positioning copy in all locales", () => {
    expect(translate("en", "hero.title.1")).toBe("AI engineering for");
    expect(translate("en", "hero.title.2")).toBe("Central Asian enterprises");
    expect(translate("en", "hero.title.3")).toBe("From prototype to prod");
    expect(translate("ru", "hero.title.1")).toBe("AI-инженерия для");
    expect(translate("uz", "hero.title.2")).toBe("AI muhandisligi");
    expect(translate("en", "hero.sub")).toBe(
      "We build AI products under your data laws and your timelines. KZ + UZ. Banking, telecom, retail."
    );
    expect(translate("en", "hero.chip")).toBe("AI engineering studio · Tashkent · Almaty");
    expect(translate("ru", "hero.loc.val")).toBe("Ташкент + Алматы");
    expect(translate("en", "hero.status.val")).toBe("Taking 2 projects this quarter");
  });

  it("industryPresets translation keys are placeholders until Phase C", () => {
    // Intentionally empty until Phase C populates ind.* keys.
    expect(translate("en", "ind.banking.c1.uc")).toBe("");
    expect(translate("en", "ind.gov.c3.out")).toBe("");
  });

  it("stats use honest signals and have evidence copy", () => {
    expect(translate("en", "stats.l1")).toBe("senior engineers");
    expect(translate("en", "stats.l1.ev")).toBe("every project led by founders, not juniors");
    expect(translate("ru", "stats.l3")).toBe("страны");
    expect(translate("uz", "stats.l4")).toContain("loyiha");
  });
});
