import { describe, expect, it } from "vitest";
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
});
