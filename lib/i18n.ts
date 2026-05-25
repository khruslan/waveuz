import translationsRaw from "@/data/translations.generated.json";
import type { Locale } from "@/lib/types";

type TranslationValue = string | string[];
type TranslationTable = Record<Locale, Record<string, TranslationValue>>;

export const supportedLocales: Locale[] = ["en", "ru", "uz"];
export const translations = translationsRaw as TranslationTable;

const extraTranslations: TranslationTable = {
  en: {
    "theme.switcher": "Theme switcher",
    "theme.dark": "Dark",
    "theme.light": "Light",
    "lang.switcher": "Language switcher",
    "nav.home": "WaveLabs home",
    "country.uzbekistan": "Uzbekistan",
    "country.kazakhstan": "Kazakhstan",
    "mq.ai": "AI Development",
    "mq.ml": "Machine Learning",
    "mq.software": "Custom Software",
    "mq.data": "Data Engineering",
    "mq.transformation": "Digital Transformation",
    "mq.product": "Product Design",
    "mq.cloud": "Cloud Architecture",
    "mq.nlp": "NLP & LLMs",
    "Microservices": "Microservices",
    "Strategy": "Strategy",
    "Architecture": "Architecture",
    "Change Mgmt": "Change Management",
    "calc.title": "Estimate<br><em>your project</em>",
    "calc.sub": "Describe your idea. We calculate the investment<br>and generate a commercial proposal in seconds.",
    "calc.weeks": "weeks",
    "industry.fintech": "FinTech / Banking",
    "industry.ecom": "E-Commerce / Retail",
    "industry.logistics": "Logistics / Supply Chain",
    "industry.health": "Healthcare / MedTech",
    "industry.realestate": "Real Estate / PropTech",
    "industry.other": "Other",
    "scale.startup": "Startup / Early-stage",
    "scale.smb": "SMB (50-500 people)",
    "scale.enterprise": "Enterprise (500+ people)",
    "lead.sending": "Sending...",
    "lead.sent": "Sent",
    "lead.error": "Could not send — please email us directly.",
    "lead.error.note": "Our team will reach out within one business day.",
    "modal.close": "Close modal"
  },
  ru: {
    "theme.switcher": "Переключатель темы",
    "theme.dark": "Тёмная",
    "theme.light": "Светлая",
    "lang.switcher": "Переключатель языка",
    "nav.home": "WaveLabs главная",
    "country.uzbekistan": "Узбекистан",
    "country.kazakhstan": "Казахстан",
    "mq.ai": "AI-разработка",
    "mq.ml": "Машинное обучение",
    "mq.software": "Кастомное ПО",
    "mq.data": "Data Engineering",
    "mq.transformation": "Цифровая трансформация",
    "mq.product": "Продуктовый дизайн",
    "mq.cloud": "Cloud-архитектура",
    "mq.nlp": "NLP и LLM",
    "Microservices": "Микросервисы",
    "Strategy": "Стратегия",
    "Architecture": "Архитектура",
    "Change Mgmt": "Управление изменениями",
    "calc.title": "Оцените<br><em>ваш проект</em>",
    "calc.sub": "Опишите идею. Мы рассчитаем инвестицию<br>и сгенерируем коммерческое предложение за секунды.",
    "calc.weeks": "недель",
    "industry.fintech": "FinTech / Банкинг",
    "industry.ecom": "E-commerce / Ритейл",
    "industry.logistics": "Логистика / Supply Chain",
    "industry.health": "Healthcare / MedTech",
    "industry.realestate": "Недвижимость / PropTech",
    "industry.other": "Другое",
    "scale.startup": "Стартап / ранняя стадия",
    "scale.smb": "SMB (50-500 человек)",
    "scale.enterprise": "Enterprise (500+ человек)",
    "lead.sending": "Отправляем...",
    "lead.sent": "Отправлено",
    "lead.error": "Не удалось отправить — напишите нам напрямую.",
    "lead.error.note": "Мы свяжемся в течение одного рабочего дня.",
    "modal.close": "Закрыть окно"
  },
  uz: {
    "theme.switcher": "Mavzu almashtirgich",
    "theme.dark": "Qorong'i",
    "theme.light": "Yorug'",
    "lang.switcher": "Til almashtirgich",
    "nav.home": "WaveLabs bosh sahifa",
    "country.uzbekistan": "O'zbekiston",
    "country.kazakhstan": "Qozog'iston",
    "mq.ai": "AI ishlanma",
    "mq.ml": "Machine Learning",
    "mq.software": "Maxsus dasturlar",
    "mq.data": "Data Engineering",
    "mq.transformation": "Raqamli transformatsiya",
    "mq.product": "Mahsulot dizayni",
    "mq.cloud": "Cloud arxitekturasi",
    "mq.nlp": "NLP va LLM",
    "Microservices": "Mikroservislar",
    "Strategy": "Strategiya",
    "Architecture": "Arxitektura",
    "Change Mgmt": "O'zgarishlarni boshqarish",
    "calc.title": "Loyihangizni<br><em>baholang</em>",
    "calc.sub": "G'oyangizni tasvirlang. Biz investitsiyani hisoblaymiz<br>va tijorat taklifini soniyalarda yaratamiz.",
    "calc.weeks": "hafta",
    "industry.fintech": "FinTech / Bank",
    "industry.ecom": "E-commerce / Chakana savdo",
    "industry.logistics": "Logistika / Supply Chain",
    "industry.health": "Healthcare / MedTech",
    "industry.realestate": "Ko'chmas mulk / PropTech",
    "industry.other": "Boshqa",
    "scale.startup": "Startap / ilk bosqich",
    "scale.smb": "SMB (50-500 kishi)",
    "scale.enterprise": "Enterprise (500+ kishi)",
    "lead.sending": "Yuborilmoqda...",
    "lead.sent": "Yuborildi",
    "lead.error": "Yuborib boʻlmadi — bizga toʻgʻridan-toʻgʻri yozing.",
    "lead.error.note": "Bir ish kuni ichida bogʻlanamiz.",
    "modal.close": "Oynani yopish"
  }
};

export function isLocale(value: string | null | undefined): value is Locale {
  return supportedLocales.includes(value as Locale);
}

export function detectLocale(languageList: readonly string[] = []): Locale {
  for (const language of languageList) {
    const prefix = language.toLowerCase().split("-")[0];
    if (isLocale(prefix)) {
      return prefix;
    }
  }

  return "en";
}

export function translate(locale: Locale, key: string): string {
  const value = translations[locale]?.[key] ?? extraTranslations[locale]?.[key] ?? translations.en[key] ?? extraTranslations.en[key] ?? "";
  return typeof value === "string" ? value : "";
}

export function translateList(locale: Locale, key: string): string[] {
  const value = translations[locale]?.[key] ?? extraTranslations[locale]?.[key] ?? translations.en[key] ?? extraTranslations.en[key] ?? [];
  return Array.isArray(value) ? value : [];
}
