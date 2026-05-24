export type Locale = "en" | "ru" | "uz";
export type Theme = "dark" | "light";

export type Industry = "fintech" | "ecom" | "logistics" | "health" | "realestate" | "other";
export type CompanyScale = "startup" | "smb" | "enterprise";

export interface CalculatorInput {
  idea: string;
  industry: Industry;
  scale: CompanyScale;
}

export interface MoneyRange {
  low: number;
  high: number;
}

export interface CalculatorEstimate {
  input: CalculatorInput;
  usd: MoneyRange;
  eur: MoneyRange;
  uzs: MoneyRange;
  timelineWeeks: string;
  display: {
    usd: string;
    eur: string;
    uzs: string;
    timeline: string;
  };
}

export interface LeadPayload {
  name: string;
  contact: string;
  message: string;
  source: "modal" | "contact" | "calculator";
  estimate?: string;
}

export type StatItem = {
  value: string;
  suffix: string;
  label: string;
  evidence: string;
};

export type IndustryPresetCard = {
  image: string;
  useCaseKey: string;
  outcomeKey: string;
};
