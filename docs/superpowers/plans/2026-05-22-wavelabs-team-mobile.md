# WaveLabs Team And Mobile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace placeholder WaveLabs team cards with confirmed RA Group people and make the current page fit narrow mobile screens cleanly.

**Architecture:** Keep the existing data-driven React section and translation path. Update `teamMembers` to confirmed names and role keys, add focused tests around that source data, then adjust shared CSS and the hero markup so responsive rules control mobile layout without changing the desktop composition.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, Playwright, CSS variables and responsive CSS.

---

## File Map

- Modify `/Users/khusnutdinov/testhiggsfield/data/site.ts` for confirmed team card data.
- Modify `/Users/khusnutdinov/testhiggsfield/data/translations.generated.json` and `/Users/khusnutdinov/testhiggsfield/lib/i18n.ts` for translated team role and label keys.
- Modify `/Users/khusnutdinov/testhiggsfield/tests/i18n.test.ts` for confirmed team data and translated role coverage.
- Modify `/Users/khusnutdinov/testhiggsfield/e2e/wavelabs.spec.ts` for narrow viewport fit checks.
- Modify `/Users/khusnutdinov/testhiggsfield/components/WaveLabsApp.tsx` to let mobile CSS own hero metadata columns and render the updated team labels.
- Modify `/Users/khusnutdinov/testhiggsfield/app/globals.css` for header, hero, Team, form, and section spacing at mobile widths.

### Task 1: Confirmed Team Data

**Files:**
- Modify: `/Users/khusnutdinov/testhiggsfield/tests/i18n.test.ts`
- Modify: `/Users/khusnutdinov/testhiggsfield/data/site.ts`
- Modify: `/Users/khusnutdinov/testhiggsfield/data/translations.generated.json`
- Modify: `/Users/khusnutdinov/testhiggsfield/lib/i18n.ts`

- [ ] **Step 1: Write the failing team data test**

Add assertions that `teamMembers` exposes:

```ts
expect(teamMembers.map((member) => member.name)).toEqual([
  "Anel Ryspaeva",
  "Emil Khusnutdinov",
  "Ruslan Khusenov",
  "Madina Saylaubayeva"
]);
expect(translate("ru", "m4.role")).toBe("Project Manager");
```

Update the exact role assertion after introducing locale role keys so the test proves translated roles are not placeholder WaveLabs biographies.

- [ ] **Step 2: Run the focused test to verify it fails**

Run:

```bash
npm test -- tests/i18n.test.ts
```

Expected: the team assertion fails because `site.ts` still contains placeholder names and experience labels.

- [ ] **Step 3: Implement the confirmed team data**

Replace `teamMembers` with:

```ts
[
  { initials: "AR", name: "Anel Ryspaeva", role: "m1.role", xp: "team.source" },
  { initials: "EK", name: "Emil Khusnutdinov", role: "m2.role", xp: "team.source" },
  { initials: "RK", name: "Ruslan Khusenov", role: "m3.role", xp: "team.source" },
  { initials: "MS", name: "Madina Saylaubayeva", role: "m4.role", xp: "team.source" }
]
```

Set role translations to Founder & CEO, CEO, CTO, and Project Manager in EN/RU/UZ data, and add a neutral `team.source` label for the accent line.

- [ ] **Step 4: Run the focused test to verify it passes**

Run:

```bash
npm test -- tests/i18n.test.ts
```

Expected: team data and translation checks pass.

### Task 2: Mobile Layout Pressure Points

**Files:**
- Modify: `/Users/khusnutdinov/testhiggsfield/e2e/wavelabs.spec.ts`
- Modify: `/Users/khusnutdinov/testhiggsfield/components/WaveLabsApp.tsx`
- Modify: `/Users/khusnutdinov/testhiggsfield/app/globals.css`

- [ ] **Step 1: Write the failing narrow viewport check**

Extend the mobile E2E test with:

```ts
await expect(page.locator("body")).toHaveJSProperty(
  "scrollWidth",
  await page.locator("body").evaluate((body) => body.clientWidth)
);
await expect(page.locator(".tm-member")).toHaveCount(4);
```

If the existing Playwright matcher cannot express the scroll-width check reliably, use a single `page.evaluate` assertion that returns whether `document.documentElement.scrollWidth <= document.documentElement.clientWidth`.

- [ ] **Step 2: Run the focused E2E check to verify current mobile risk**

Run:

```bash
npm run test:e2e -- --project=mobile --grep "stable mobile first screen"
```

Expected: the fit assertion exposes current mobile overflow or confirms the structural check before CSS changes.

- [ ] **Step 3: Let responsive CSS control the hero metadata**

Remove the inline `gridTemplateColumns` style from the hero metadata row:

```tsx
<div className="hero-sub-row">
```

- [ ] **Step 4: Add responsive CSS changes**

Update mobile rules to:

- reduce header gaps and button padding below `560px`;
- make hero chip text wrap and let the hero title use a mobile clamp;
- preserve one-column Team cards on phones;
- avoid text overflow in long card and form content;
- keep fixed theme switcher clear of form controls.

- [ ] **Step 5: Run the focused E2E test again**

Run:

```bash
npm run test:e2e -- --project=mobile --grep "stable mobile first screen"
```

Expected: mobile assertions pass.

### Task 3: Full Verification

**Files:**
- Verify changed project files only.

- [ ] **Step 1: Run unit checks**

Run:

```bash
npm run typecheck
npm run lint
npm test
```

Expected: all commands exit successfully.

- [ ] **Step 2: Run production build**

Run:

```bash
npm run build
```

Expected: Next.js build completes successfully.

- [ ] **Step 3: Inspect desktop and mobile output**

Check `http://localhost:3000/` on desktop and a mobile viewport for:

- header controls;
- hero chip, title, and metadata;
- Team cards with confirmed names and roles;
- calculator controls;
- modal/contact forms;
- no horizontal overflow.
