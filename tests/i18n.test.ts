import { describe, expect, it } from "vitest";
import { teamMembers } from "@/data/site";
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
});
