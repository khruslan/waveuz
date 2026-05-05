import { describe, expect, it } from "vitest";
import { calculateEstimate, formatCompactMoney, generateProposal } from "@/lib/calculator";

describe("calculator", () => {
  it("calculates fintech enterprise estimates across USD, EUR and UZS", () => {
    const estimate = calculateEstimate({
      idea: "AI-powered credit scoring system",
      industry: "fintech",
      scale: "enterprise"
    });

    expect(estimate.usd).toEqual({ low: 104000, high: 325000 });
    expect(estimate.eur).toEqual({ low: 95680, high: 299000 });
    expect(estimate.uzs).toEqual({ low: 1320800000, high: 4127500000 });
    expect(estimate.timelineWeeks).toBe("18 - 36");
  });

  it("formats compact values like the legacy calculator", () => {
    expect(formatCompactMoney(15000)).toBe("15k");
    expect(formatCompactMoney(1320800000)).toBe("1320.8M");
  });

  it("generates a localized proposal with the submitted idea", () => {
    const proposal = generateProposal(
      {
        idea: "Demand forecasting platform for retail",
        industry: "ecom",
        scale: "smb"
      },
      "ru",
      new Date("2026-05-04T00:00:00.000Z")
    );

    expect(proposal).toContain("КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ");
    expect(proposal).toContain("Demand forecasting platform for retail");
    expect(proposal).toContain("$30k - $80k USD");
    expect(proposal).toContain("10 - 18 недель");
  });
});
