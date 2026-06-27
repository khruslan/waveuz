import type { CalculatorEstimate, CalculatorInput, CompanyScale, Industry, Locale } from "@/lib/types";

const BASE: Record<CompanyScale, { low: number; high: number; weeks: string }> = {
  startup: { low: 15_000, high: 30_000, weeks: "6 - 10" },
  smb: { low: 30_000, high: 80_000, weeks: "10 - 18" },
  enterprise: { low: 80_000, high: 250_000, weeks: "18 - 36" }
};

const MULTIPLIERS: Record<Industry, number> = {
  fintech: 1.3,
  health: 1.2,
  logistics: 1.1,
  ecom: 1,
  realestate: 0.95,
  other: 1
};

const INDUSTRY_NAMES: Record<Locale, Record<Industry, string>> = {
  en: {
    fintech: "FinTech",
    ecom: "E-Commerce",
    logistics: "Logistics",
    health: "Healthcare",
    realestate: "Real Estate",
    other: "Technology"
  },
  ru: {
    fintech: "FinTech",
    ecom: "e-commerce",
    logistics: "логистики",
    health: "healthcare",
    realestate: "недвижимости",
    other: "технологий"
  },
  uz: {
    fintech: "FinTech",
    ecom: "e-commerce",
    logistics: "logistika",
    health: "healthcare",
    realestate: "ko'chmas mulk",
    other: "texnologiya"
  },
  kk: {
    fintech: "FinTech",
    ecom: "e-commerce",
    logistics: "логистика",
    health: "healthcare",
    realestate: "жылжымайтын мүлік",
    other: "технология"
  }
};

const DEFAULT_IDEA: Record<Locale, string> = {
  en: "AI system",
  ru: "AI-система",
  uz: "AI tizim",
  kk: "AI-жүйе"
};

const DATE_LOCALE: Record<Locale, string> = {
  en: "en-GB",
  ru: "ru-RU",
  uz: "uz-Latn-UZ",
  kk: "kk-KZ"
};

const EUR_RATE = 0.92;
const UZS_RATE = 12_700;

export function formatCompactMoney(value: number): string {
  if (value >= 1_000_000) {
    return `${Number((value / 1_000_000).toFixed(1))}M`;
  }

  if (value >= 1_000) {
    return `${Math.round(value / 1_000)}k`;
  }

  return String(Math.round(value));
}

export function calculateEstimate(input: CalculatorInput): CalculatorEstimate {
  const base = BASE[input.scale];
  const multiplier = MULTIPLIERS[input.industry] ?? 1;
  const usd = {
    low: Math.round(base.low * multiplier),
    high: Math.round(base.high * multiplier)
  };
  const eur = {
    low: Math.round(usd.low * EUR_RATE),
    high: Math.round(usd.high * EUR_RATE)
  };
  const uzs = {
    low: Math.round(usd.low * UZS_RATE),
    high: Math.round(usd.high * UZS_RATE)
  };

  return {
    input,
    usd,
    eur,
    uzs,
    timelineWeeks: base.weeks,
    display: {
      usd: `$${formatCompactMoney(usd.low)} - $${formatCompactMoney(usd.high)}`,
      eur: `€${formatCompactMoney(eur.low)} - €${formatCompactMoney(eur.high)}`,
      uzs: `${formatCompactMoney(uzs.low)} - ${formatCompactMoney(uzs.high)} UZS`,
      timeline: `${base.weeks} weeks`
    }
  };
}

export function generateProposal(input: CalculatorInput, locale: Locale, date = new Date()): string {
  const estimate = calculateEstimate(input);
  const idea = input.idea.trim() || DEFAULT_IDEA[locale];
  const dateStr = date.toLocaleDateString(DATE_LOCALE[locale], {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  });
  const industry = INDUSTRY_NAMES[locale][input.industry];
  const businessContext =
    input.scale === "enterprise" ? "enterprise" : input.scale === "smb" ? "SMB" : "early-stage";

  const commonInvestment = `$${formatCompactMoney(estimate.usd.low)} - $${formatCompactMoney(
    estimate.usd.high
  )} USD
€${formatCompactMoney(estimate.eur.low)} - €${formatCompactMoney(estimate.eur.high)} EUR`;

  const proposals: Record<Locale, string> = {
    en: `COMMERCIAL PROPOSAL
WaveLabs AI Engineering Studio
Date: ${dateStr}

PROJECT: ${idea}

SCOPE
Based on your brief, WaveLabs proposes a ${industry} AI solution tailored to your ${businessContext} business context.

INVESTMENT
${commonInvestment}
Flexible payment structure available.

TIMELINE
${estimate.timelineWeeks} weeks to production-ready system.

WHAT YOU GET
-> C-Level direct engagement
-> Weekly delivery milestones
-> 60-day post-launch support included
-> IP fully owned by your company

NEXT STEP
Reply to this proposal or contact us directly:
hello@wavelabs.uz | IT Park · AIFC · Astana Hub`,
    ru: `КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ
WaveLabs AI Engineering Studio
Дата: ${dateStr}

ПРОЕКТ: ${idea}

ЗАДАЧА
На основе вашего запроса WaveLabs предлагает AI-решение для ${industry}-сектора, адаптированное под формат ${
      input.scale === "enterprise" ? "корпорации" : input.scale === "smb" ? "среднего бизнеса" : "стартапа"
    }.

ИНВЕСТИЦИЯ
${commonInvestment}
Гибкий график оплаты.

СРОКИ
${estimate.timelineWeeks} недель до продакшн-готового решения.

ЧТО ВЫ ПОЛУЧАЕТЕ
-> Прямое взаимодействие с C-Level командой
-> Еженедельные поставки
-> 60 дней поддержки после запуска
-> IP полностью ваш

СЛЕДУЮЩИЙ ШАГ
Свяжитесь с нами:
hello@wavelabs.uz | IT Park · AIFC · Astana Hub`,
    uz: `TIJORAT TAKLIFI
WaveLabs AI Engineering Studio
Sana: ${dateStr}

LOYIHA: ${idea}

VAZIFA
Sizning so'rovingiz asosida WaveLabs ${industry} sektori uchun AI yechim taklif etadi.

INVESTITSIYA
${commonInvestment}
Moslashuvchan to'lov jadvali mavjud.

MUDDATLAR
${estimate.timelineWeeks} hafta ishga tayyor tizim uchun.

NIMANI OLASIZ
-> C-Level jamoa bilan to'g'ridan-to'g'ri aloqa
-> Haftalik yetkazib berish
-> Ishga tushirishdan keyin 60 kunlik qo'llab-quvvatlash
-> IP to'liq sizniki

KEYINGI QADAM
Biz bilan bog'laning:
hello@wavelabs.uz | IT Park · AIFC · Astana Hub`,
    kk: `КОММЕРЦИЯЛЫҚ ҰСЫНЫС
WaveLabs AI Engineering Studio
Күні: ${dateStr}

ЖОБА: ${idea}

МІНДЕТ
Сіздің сұранысыңыз негізінде WaveLabs ${industry} секторы үшін ${
      input.scale === "enterprise" ? "корпорация" : input.scale === "smb" ? "орта бизнес" : "стартап"
    } форматына бейімделген AI-шешім ұсынады.

ИНВЕСТИЦИЯ
${commonInvestment}
Икемді төлем кестесі қолжетімді.

МЕРЗІМ
Продакшнға дайын жүйеге дейін ${estimate.timelineWeeks} апта.

СІЗ НЕ АЛАСЫЗ
-> C-Level командамен тікелей өзара әрекеттесу
-> Апта сайынғы жеткізілімдер
-> Іске қосқаннан кейін 60 күндік қолдау
-> IP толығымен сіздікі

КЕЛЕСІ ҚАДАМ
Бізбен байланысыңыз:
hello@wavelabs.uz | IT Park · AIFC · Astana Hub`
  };

  return proposals[locale] ?? proposals.en;
}
