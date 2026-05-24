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

  it("assets expose serviceIcons and industryPresets", () => {
    expect(Array.isArray(assets.serviceIcons)).toBe(true);
    expect(assets.serviceIcons).toHaveLength(5);
    expect(typeof assets.industryPresets).toBe("object");
    expect(Object.keys(assets.industryPresets).sort()).toEqual(
      ["banking", "fmcg", "government", "retail", "telecom"]
    );
  });
});
