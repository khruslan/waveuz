# WaveLabs Phase C — Industry Presets + Compliance Section

Date: 2026-05-23
Status: design draft
Depends on: Phase A industry thumbnails being in `public/media/` and Phase B not pinning at the new section's scroll range.

## Goal

Add two new sections that no enterprise-tier AI studio in the competitive set ships, both anchored to the buyer's primary objection: "do these people understand my industry and my regulator?"

- **Industry Presets** — five industry-keyed Higgsfield-generated showcases, each a static 3-card mini-gallery. Click an industry → calculator opens pre-filled with the industry tag.
- **Compliance & Data Residency** — a quiet, dense block under Process that names PDPL KZ, NB RK requirements, data residency posture, and security touchpoints. Removes the most common gating concern for Tier-1 bank buyers.

Phase C is a content-and-conversion play, not a motion play. Animation budget is small — sections rely on Phase B's harness.

## In Scope

- New `#industry-presets` section between Work and Process.
- New `#compliance` section between Process and Team.
- 5 industries × 3 cards (15 cards) wired to data + assets generated in Phase A.
- Calculator pre-fill via URL parameter `?industry=<slug>`.
- Compliance section content: 6 commitments, 1 contact pointer, no diagrams.
- North Star metric instrumentation: click-through from preset card → calculator entry.
- i18n for all new copy (EN/RU/UZ).

## Out of Scope

- Live Higgsfield generation at runtime (CPO advisor explicitly cut option B — pre-generated only).
- Email gating for "full-res" assets (mentioned as a risk mitigation but deferred — start without gating, add only if engagement signals warrant).
- Real-time `virality_predictor` polling (used only at asset-curation time in Phase A).
- Compliance section diagrams / certificates / legal copy review (founders + counsel out of scope here).
- Light theme dedicated grade for new assets (use existing dark assets at light-mode opacity rules).

## Section 1: Industry Presets

### Position and Framing

Place between `#work` and `#process`. Rationale: `#work` is "what we built," `#industry-presets` is "and here's what we could build for you specifically." Process follows as "and this is how we'd do it." This ordering matches the buyer's mental flow.

Section heading (EN): "Industry presets — what AI looks like in your sector"
RU: "Отраслевые сценарии — как AI выглядит в вашем секторе"
UZ: "Tarmoq stsenariylari — sizning sohangizda AI qanday ko'rinadi"

Subhead (EN): "Five-minute previews of AI products we have built or could build for KZ + UZ leaders in each industry."
RU: "Пятиминутные превью AI-продуктов, которые мы построили или могли бы построить для лидеров KZ + UZ в каждой отрасли."
UZ: "QZ + OʻZ yetakchilari uchun har bir tarmoqda quradigan AI-mahsulotlarning besh daqiqalik koʻrinishlari."

### Markup and Behavior

Top row: 5 industry "tabs" (not buttons — flat editorial chips like the existing `tech-tag` style).
- Banking · Retail · Telecom · FMCG · Government
- Active tab gets `color: var(--a)` and underline. One tab is active at a time; defaults to Banking.

Below: a 3-card grid (`grid-template-columns: repeat(3, 1fr)` on desktop, single column on mobile). Each card:
- Image (3:2 webp, from `assets.industryPresets[industry][i]`).
- Use-case label (one short noun phrase, e.g., "Real-time fraud scoring").
- One-line outcome ("Reduced false positives 38% in pilot").
- Small "Prompt seen → Soul Cinema" badge (transparency move — buyers must see we are honest about what was generated).
- The whole card is a link to `/?industry={slug}#calculator`.

Tab switch is instant — no transition for the tab list itself. The 3-card grid below cross-fades 0.2 s (`opacity: 0 → 1`). State lives in component state, not URL — switching tabs does not push history.

### Data Shape (extends `data/site.ts`)

```ts
export const industryPresets = [
  {
    slug: "banking",
    labelKey: "ind.banking",
    cards: [
      { image: "/media/ind-banking-01.webp", useCaseKey: "ind.banking.c1.uc", outcomeKey: "ind.banking.c1.out", promptHint: "Soul Cinema" },
      { image: "/media/ind-banking-02.webp", useCaseKey: "ind.banking.c2.uc", outcomeKey: "ind.banking.c2.out", promptHint: "Soul Cinema" },
      { image: "/media/ind-banking-03.webp", useCaseKey: "ind.banking.c3.uc", outcomeKey: "ind.banking.c3.out", promptHint: "Soul Cinema" }
    ]
  },
  // retail, telecom, fmcg, government — same shape
];
```

i18n keys land in `data/translations.generated.json`. The 15 use-case + 15 outcome strings are drafted as part of this spec (Appendix A).

### Calculator Pre-fill

Calculator click handler reads `searchParams.get('industry')` on mount. If set, the matching industry chip in the calculator selector is pre-selected and the textarea seeds with the use-case copy from the clicked card.

This needs a small change in the calculator component (currently in `WaveLabsApp.tsx`) to accept an initial industry slug. The implementation surface is small: one `useSearchParams` hook + a controlled `<select>` default.

### Acceptance — Industry Presets

- 5 tabs render; clicking switches the 3-card grid below in < 250 ms.
- Each card image loads from `public/media/`, lazy by default (`loading="lazy"`).
- Clicking any card navigates to `/?industry=banking#calculator` (etc.), the page scrolls to the calculator, and the calculator industry chip is pre-selected.
- New section does not break Phase B scroll harness — refresh on mount fires only if the section enters/exits viewport, not on tab switches.
- Mobile: 3 cards stack as 1 column; tab list wraps onto two rows if needed.
- Lighthouse performance still ≥ 80 desktop after Phase C lands.

## Section 2: Compliance & Data Residency

### Position and Framing

Place between `#process` and `#team`. Rationale: after the buyer reads how we work, the next concern is "does this fit our regulator?" The compliance block is short — six bullet-style commitments and a one-line invitation to ask for the long answer.

Section heading (EN): "Compliance, data residency, and audit posture"
RU: "Соответствие, локальное хранение данных, аудит"
UZ: "Muvofiqlik, ma'lumotlar rezidentligi, audit"

### Content (the six commitments)

EN copy (mirror in RU/UZ):
1. **PDPL KZ ready.** We build under Kazakhstan's Personal Data Protection Law and can name data controllers, processors, and lawful basis in our deliverables.
2. **NB RK aware.** For banking clients, we deliver under the regulator's directives on outsourcing of IT functions and customer-data processing.
3. **Local hosting by default.** Production systems run in KZ or UZ data centers unless the customer specifies otherwise. AWS Astana, GCP Almaty, on-prem — all supported.
4. **No cross-border processing without consent.** Training, inference, and any LLM API calls that cross borders require written customer consent and a documented data-flow map.
5. **Audit trail standard.** Every model inference is logged with prompt hash, model version, and customer-side request ID. Logs ship to the customer's SIEM by default.
6. **Single point of contact for security review.** One engineer on our team owns the security questionnaire response and can be on a call with your CISO inside 48 hours.

Below the six: a quiet line — "Detailed posture document on request — write to security@wavelabs.kz."

### Markup and Behavior

Single-column on every viewport. Each commitment is a `<li>` with a bold lead phrase (`<strong>PDPL KZ ready.</strong>`) and a one-line explanation. No icons (the section is intentionally serious — icons would soften the message). No animation beyond a single scroll-in fade orchestrated by Phase B harness (`once: true`, stagger 0.05, opacity only).

### Acceptance — Compliance

- 6 commitments render in order at all viewports without overflow.
- Each commitment line wraps to ≤ 3 lines at 320 px width.
- Email link is `mailto:security@wavelabs.kz` and is the only link in the section.
- Section reads as "calm" — no accent color highlights except the section title.
- `npm run typecheck`, `npm run lint`, `npm test`, `npm run e2e` pass.

## Instrumentation

We need to know whether Phase C is working. CPO advisor set the North Star at preset-card → calculator CTR ≥ 12% over two weeks; below 8% means kill the section.

- Click on a preset card emits a `preset_click` event with `{ industry, card_index, locale }`.
- Calculator submission emits `calculator_submit` with the `industry` query param attached.
- CTR derivation: `count(calculator_submit where industry != null) / count(preset_click)`.
- Analytics destination: TBD (no analytics infra on the site currently). For this Phase C ship: log events to `/api/track` (new POST endpoint) and persist to a flat file or stdout for the first sprint. Replace with a real destination after the kill-or-keep decision.

Compliance section: no instrumentation. It is a buyer-confidence asset, not a funnel step.

## Risks

- **Tab switch causes ScrollTrigger.refresh storm.** Mitigation: tab state is React-local only; no DOM reflow large enough to require refresh. Verify in Performance recording.
- **15 thumbnails inflate bundle.** Each ~180 KB → 2.7 MB total. Mitigation: enforce `loading="lazy"` and `decoding="async"`; only the active tab's three thumbnails are eagerly loaded (could be done with `priority` only on active tab; non-active tabs use full lazy).
- **Compliance copy may need legal review.** Specifically the PDPL and NB RK commitments. Mitigation: ship-block step in implementation plan is "founders confirm with counsel that copy is defensible."
- **Pre-filled calculator may surprise users who navigate directly to `/`.** Mitigation: the pre-fill only triggers when `?industry=` is present.
- **Phase C lands without Phase A assets.** Order of operations: implementation plans should sequence A → B → C strictly. If a stakeholder wants C earlier, mock the 15 thumbnails with grey placeholder rectangles for the dev iteration, but do not ship without real assets.

## Appendix A — Industry Card Copy (drafts, EN)

Banking:
1. "Real-time fraud scoring" / "Reduced false positives 38% in pilot"
2. "Branch traffic forecasting" / "Improved staffing accuracy 22% week-over-week"
3. "LLM-assisted KYC review" / "Cut analyst review time per case from 9 to 3 minutes"

Retail:
1. "Catalog enrichment from images" / "Auto-classified 84k SKUs in two days"
2. "Demand forecasting for promotions" / "Reduced over-stock waste 17%"
3. "Recommendation engine for app" / "Lifted basket size 11% in A/B test"

Telecom:
1. "Churn prediction at 30-day horizon" / "Identified 64% of likely churners 4 weeks out"
2. "Network anomaly detection" / "Cut MTTD from 22 to 6 minutes on core links"
3. "Voice-of-customer summarization" / "1.2M tickets digested into weekly themes"

FMCG:
1. "Shelf compliance from store-walk video" / "Detected stock-outs in 92% of audited stores"
2. "Promo elasticity modeling" / "Identified 3 promo SKUs to retire"
3. "Sentiment from social + reviews" / "Surfaced 8 quality issues before survey signal"

Government:
1. "Citizen-services chatbot in three languages" / "Deflected 41% of phone calls in pilot"
2. "Public-records search relevance" / "Top-1 recall up from 0.42 to 0.73"
3. "Document classification for archives" / "Processed 4.6M pages in 11 days"

These are templates — founders should confirm or replace each with truthful claims before launch. Numbers marked here are illustrative for design fidelity, not approved facts.

## File Changes Summary

- `data/site.ts`: add `industryPresets` array; touch `industries` only if the calculator chip ids need to match preset slugs (verify, do not duplicate).
- `data/translations.generated.json`: add `~50 keys` for industry labels + card copy + section headings + compliance section.
- `components/WaveLabsApp.tsx`: render two new sections; add `useSearchParams` hook for calculator pre-fill; calculator state accepts initial industry.
- `components/IndustryPresets.tsx` (new): tab list + 3-card grid + cross-fade.
- `components/Compliance.tsx` (new): plain ordered list, no animation logic (Phase B harness picks it up).
- `app/globals.css`: classes `.ind-tabs`, `.ind-tab`, `.ind-grid`, `.ind-card`, `.cmp-list`, `.cmp-item`.
- `app/api/track/route.ts` (new): POST handler, validates `event` shape with zod, appends to stdout or a JSONL file.

## Acceptance — Phase C as a whole

- Two new sections render at all locales and viewports.
- Calculator pre-fill works end-to-end (click preset card → calculator industry selected).
- Tracking events fire on preset click and calculator submit.
- All existing tests still pass; new tests cover:
  - Preset tab switch (Playwright: click "Retail" tab, assert correct cards visible).
  - Calculator pre-fill (Playwright: visit `/?industry=telecom#calculator`, assert chip pre-selected).
  - Compliance section reads in all 3 locales without overflow at 320 px width.
- `npm run build` succeeds.
- North Star instrumentation (event log) verified in dev — click + submit produces both events.

## Open Questions

1. Where do tracking events ship in production? (Plausible, PostHog, BigQuery, custom?) Founders to decide before Phase C launches.
2. Is `security@wavelabs.kz` real? If not, replace with the real shared inbox or remove the line.
3. Card outcome numbers in Appendix A — which are real? Each must be confirmed before launch.
4. Should industry tab default be Banking, or set by `Accept-Language` (CIS tilts banking-first)? Default Banking is fine; flag if a different default is preferred.
