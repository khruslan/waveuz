# WaveLabs Phase B — Scroll-driven Polish

Date: 2026-05-23
Status: design draft
Depends on: Phase A assets being in `public/media/` and `data/site.ts`.

## Goal

Six existing sections currently render correctly but read as "flat slides." Phase B adds scroll-driven choreography and interaction polish that gives the page motion personality without redesigning composition. Performance and cleanup are first-class — every animation must respect `prefers-reduced-motion`, mobile gates, and Next.js route-change unmounts.

Phase B does not add or remove sections, does not regenerate Higgsfield assets, and does not change copy.

## In Scope

- `#hero` — layered parallax, char reveal, HUD ticker overlay, canvas particle overlay.
- `#stats` — counter-up + evidence-line draw + sparkline + suffix character pop.
- `#team` — scroll-in card lift + hover bio overlay (no layout shift) + optional video-on-hover.
- `#work` — paged scroll-snap with 3D card-fan reveal (not horizontal sticky — argued in synthesis).
- `#process` — pinned section with scrubbed video brightness and 4-step progressive reveal.
- `#calculator` — animated placeholder typing, output stream effect, success state.
- Global animation harness (`gsap.context`, ResizeObserver, ScrollTrigger.refresh debounce, matchMedia gates).
- `prefers-reduced-motion` fallback for every section above.

## Out of Scope

- Industry Presets section (Phase C).
- Compliance section (Phase C).
- Copy changes (Phase A).
- New assets (Phase A).
- Light theme polish beyond verifying nothing breaks.

## Architecture

All Phase B animations are created inside a single root effect in `WaveLabsApp.tsx`:

```ts
useEffect(() => {
  const ctx = gsap.context(() => {
    setupHero();
    setupStats();
    setupTeam();
    setupWork();
    setupProcess();
    setupCalculator();
  }, rootRef);

  const ro = new ResizeObserver(debounce(() => ScrollTrigger.refresh(), 200));
  ro.observe(document.body);

  return () => {
    ctx.revert();
    ro.disconnect();
  };
}, []);
```

`gsap.context` collects every tween and `ScrollTrigger.create` instance inside the closure and reverts inline styles on unmount. This is the single most important guard against Next.js route-change leaks.

Each `setupXxx` lives in its own file under `components/scroll/` (e.g., `components/scroll/hero.ts`). The current component is ~760 lines and already crowded — splitting choreography keeps `WaveLabsApp.tsx` focused on JSX and data, while letting each scroll system be tested in isolation.

```
components/
  WaveLabsApp.tsx
  scroll/
    hero.ts
    stats.ts
    team.ts
    work.ts
    process.ts
    calculator.ts
    index.ts       (exports the setupAll() entry that WaveLabsApp imports)
    types.ts       (shared types: SetupFn, SectionRefs)
```

Each setup function follows the same contract:

```ts
type SetupFn = (refs: SectionRefs) => void;
```

No setup function reads from `data/site.ts` or props — it only animates DOM under `rootRef`. This keeps the choreography decoupled from content shape; a copy change cannot break the animation.

## Section Choreographies

### 1. Hero

Layered system. One scroll-driven parallax for the video + title, one once-only intro timeline for the headline, one persistent canvas overlay with mouse-driven particles, one HUD ticker pinned over hero.

- **Scroll parallax (scrub 0.6):** background video `scale 1.08 → 1`, `opacity .25 → .12`, `filter blur(0) → blur(2px)` from `top top` to `bottom top`. Only `transform` and `opacity`. `force3D: true`.
- **Intro timeline (once, on mount):** per-character reveal across all three title lines using `split-type` (already in deps). `yPercent: 110 → 0`, `rotateX: -35 → 0`, `opacity: 0 → 1`, stagger `{ amount: .6, from: 'random' }`, duration 1.1, ease `expo.out`. Accent characters animate to `color: var(--a)` at `t + 0.4`. Chip clip-path inset reveal at `t + 0.3`. Four hero-sub-col cells stagger in at `t + 0.5`; each value uses a `gsap.to` typewriter snap to its final number/string for the "Markets" and "Status" cells.
- **Canvas particle overlay (`<canvas id="hero-fx">` mounted by `setupHero`):** 200 particles, `mix-blend-mode: screen`, additive cyan. Mouse position from Lenis velocity → `translate3d` on the canvas container (parallax-style drift, not particle-following). 16ms raf loop. Pause when `document.visibilityState !== 'visible'`.
- **HUD ticker (`<div className="hero-hud">` mounted by `setupHero`):** absolute-positioned bottom-right of hero, monospace, `font-variant-numeric: tabular-nums`. Cycles 4 lines: "uptime: 99.97%", "shipped today: 12 commits", "models in prod: 4", "queue depth: 0". Cycle every 4 s, line height fixed so the ticker does not shift layout.
- **Reduced motion:** intro and parallax disabled; canvas not mounted; HUD ticker static on first line.

### 2. Stats

`ScrollTrigger.create({ trigger: '#stats', start: 'top 70%', once: true })`. No scrub — these are punchlines.

- Per stat (stagger 0.15): wrapper `y: 40 → 0`, `opacity: 0 → 1`, 0.5 s. Counter writes via `gsap.to(obj, { value: target, duration: 1.6, ease: 'power3.out', onUpdate: writeText })`. The shared text-write helper formats `value + suffix` (`+`, `%`, `x`, `y`, `''`) and is the only DOM write per frame.
- Suffix character animates separately at `t + 1.4`: `scale: 0 → 1.2 → 1`, `rotate: -30 → 0`, ease `back.out(2.4)`, with a 200 ms color flash to `var(--a)`.
- Underline draws: `scaleX: 0 → 1`, `transformOrigin: left`, 0.5 s at `t + 1.5`, `background: var(--a)`. Markup: `<span className="st-underline" />` injected by `setupStats` per stat (one-time DOM mutation).
- Evidence line (already shipped in Phase A as `.st-evidence`): `clipPath: 'inset(0 100% 0 0)' → 'inset(0 0 0 0)'`, `opacity: .5 → 1`, 0.6 s, delay `t + 1.6`.
- All counter elements get `font-variant-numeric: tabular-nums` via CSS so width does not jitter mid-animation.

### 3. Team

Two layers: scroll-in once, hover bio overlay always.

- **Scroll in (`#team`, `start: 'top 75%'`, once):** 4 cards stagger 0.1, `y: 60 → 0`, `rotateX: -12 → 0`, `opacity: 0 → 1`, 0.7 s, ease `power3.out`. Initials block `scale: .6 → 1` with `back.out(1.6)` at `t + .2`.
- **Hover bio overlay:** each `.tm-member` markup gets an absolute-positioned `<div className="tm-bio">` (translated to 100%, opacity 0, pointer-events none). Card has `overflow: hidden`. Mouseenter:
  ```ts
  gsap.to(bio, { yPercent: -100, opacity: 1, duration: .45, ease: 'expo.out' });
  gsap.to(meta, { yPercent: -30, opacity: .4, duration: .45 });
  gsap.to(card, { scale: 1.02, duration: .4 });
  ```
  Mouseleave reverses with 0.35 s duration.
- Bio content slots (added to `data/site.ts` per member): one-line bio, one credential chip, one contact icon link. No biographies are invented — `data/site.ts` will hold placeholder strings until founders supply real text. Until then, bio overlay still works visually with the placeholders.
- **Optional video-on-hover (gated):** if `member.portraitVideo` exists in `data/site.ts`, render a muted 3 s portrait loop inside the card and play on `mouseenter`. Phase B ships the gate but does not require the videos — founders decide whether to generate them.
- **Reduced motion:** scroll-in disabled, hover overlay still works (it is essential interactivity, not motion polish), but `scale` boost and transition durations are halved.

### 4. Work

Three case cards. Argument against horizontal sticky scroll: three cards equals roughly three viewports of pinned scroll, which feels padded for the payload. Horizontal sticky pays off at 5+ cards or strong narrative chaining. Three cards work better as paged reveal with depth.

- Container `#work` retains its vertical layout. Each `.wk-card` gets:
  - `scroll-snap-align: start` and parent `#work .wk-grid { scroll-snap-type: y mandatory }` on screens > 768 px.
  - Per-card scroll trigger `{ trigger: card, start: 'top 80%', end: 'top 20%', scrub: 0.8 }`.
  - Timeline: `yPercent: 30 → 0`, `rotateX: 18 → 0`, `rotateY: ${i % 2 ? 6 : -6} → 0`, `scale: .92 → 1`, `opacity: 0 → 1`, `transformPerspective: 1200`, `transformOrigin: 'center bottom'`. Inner image `scale: 1.1 → 1`. Tag/name overlay `clipPath: 'inset(100% 0 0 0)' → 'inset(0)' ` at progress 0.6.
- `perspective: 1200px` lives on `#work` container as a CSS rule, never animated.
- Mobile (`<= 767px`): 3D entirely disabled via `matchMedia`. Scroll-snap optional; on touch the existing single-column layout reads fine without snap.
- **Reduced motion:** 3D and parallax disabled; cards fade in only.

### 5. Process

The biggest motion section. Pin the entire section, scrub video, advance steps.

- `ScrollTrigger.create({ trigger: '#process', start: 'top top', end: '+=2400', pin: true, scrub: .5, anticipatePin: 1 })`.
- Across scrub progress 0 → 1:
  - 0.00 → 1.00: background video `scale 1.05 → 1.15`, `filter brightness(.4) → brightness(.7) → brightness(.4)` with keyframe at 0.5.
  - 0.00 → 0.25: step 1 `xPercent: -40 → 0`, `opacity: 0 → 1`; number n clip-path reveal.
  - 0.25 → 0.50: step 2 same pattern, step 1 fades to `opacity: .25`.
  - 0.50 → 0.75: step 3, prior steps muted.
  - 0.75 → 1.00: step 4 + top progress bar `scaleX: 0 → 1`.
- Each `.pr-title` uses split-type words, stagger 0.04, `y: 100% → 0`.
- Mobile (`<= 767px`): replace `filter` animations with `opacity` keyframes (iOS Safari GPU cost). Pin still applies but with shorter `end: '+=1200'`.
- **Reduced motion:** pin disabled; section becomes a normal sticky-free scroll with steps fading in once.

### 6. Calculator

Three independent animation systems, all interaction-driven. Scroll-in is a simple fade (2 columns, stagger 0.15) so the section enters cleanly.

- **Animated placeholder typing:** while textarea is empty and not focused, cycle through 4 prompt examples by writing `placeholder` char-by-char. Cycle: type → hold 1.4 s → delete → next. Pause on focus, resume on blur if still empty.
- **Generate → output stream:** click handler:
  1. Button micro-bump `scale: .95 → 1` (yoyo), label swap to spinner, lock width.
  2. Output panel fades from `.3 → 1`.
  3. Response stream: append char-by-char into single text node via `gsap.to({ chars }, { ... onUpdate: writeSubstring })`. Caret element follows `outEl.offsetWidth`. CSS blink animation on caret.
  4. As each `\n` is hit, animate the just-completed `<span data-line>` `opacity: 0 → 1`, `x: -8 → 0`, 0.25 s.
- **Success state:** button label flips to "Готово", background flashes `var(--a)` for 0.4 s, output panel border pulses via `box-shadow` ripple, 6 short-lived particle divs spawn at button center, animate out in 0.7 s. All particles removed on tween complete.
- **Reduced motion:** placeholder typing disabled (placeholder set to first example statically); output stream renders in one frame; success pulse disabled; particles never spawned.

## Performance Budget

- 60 fps on mid-range laptops at desktop viewport with all sections in view (worst case: scrolling through hero into stats).
- 45 fps minimum on iPhone 12 at 390 × 844, no hero canvas, no work 3D, hero parallax half-disabled.
- Total Phase B JS added: ≤ 18 KB minified (excluding gsap which is already in deps).
- Lighthouse performance score ≥ 80 desktop, ≥ 65 mobile after Phase B lands (Phase A asset weight is the dominant factor below this).

## Reduced Motion

A single helper `prefersReducedMotion()` reads `matchMedia('(prefers-reduced-motion: reduce)').matches` and is consulted by every setup function. When true:
- All `scrub` parameters become `false` (sections appear in one frame).
- `once` triggers still fire (content must be visible).
- Hover overlays still work.
- Canvas overlay does not mount.
- HUD ticker freezes on first line.

The helper is reactive: it subscribes to `change` and triggers a refresh of the scroll harness, so toggling OS setting mid-session does not require a reload.

## Data Changes

`data/site.ts`:
- Each `teamMembers` entry gains optional fields: `bio?: string` (i18n key), `credential?: string` (i18n key), `contact?: string` (e.g., `mailto:emil@…` or LinkedIn URL), `portraitVideo?: string` (path under `/media/`). All optional — UI gracefully degrades.

`data/translations.generated.json`:
- Add `m1.bio`/`m2.bio`/`m3.bio`/`m4.bio` and matching `.credential` keys for EN/RU/UZ. Placeholder copy until founders supply real strings.

## File Changes

- `components/WaveLabsApp.tsx`: import `setupAll` from `components/scroll`, add `rootRef`, wrap existing JSX in `<div ref={rootRef}>`, add the single `useEffect` shown above. Add `<canvas id="hero-fx">` and `<div className="hero-hud">` inside `#hero`. Add `<span className="st-underline" />` and (if not already from Phase A) `<p className="st-evidence">` per stat. Add `<div className="tm-bio">` per team member.
- `components/scroll/*`: new files as listed in Architecture.
- `app/globals.css`: add classes `.hero-hud`, `.st-underline`, `.tm-bio`, `.calc-caret`, `.calc-particle`. Add `@media (prefers-reduced-motion: reduce)` overrides to mirror the runtime gate (defensive: even if JS fails, motion stays calm).
- `lib/i18n.ts`: untouched.
- `data/site.ts`: extend `teamMembers` shape (optional fields).
- `data/translations.generated.json`: add bio/credential keys.

## Testing

Unit (vitest):
- `lib/scroll/utils.ts` (debounce, prefersReducedMotion mock) — small pure functions, easy to test.
- `setupStats` formatter — ensure `format(value, suffix)` produces "4", "3y", "2", "12+".

E2E (Playwright):
- Existing `e2e/wavelabs.spec.ts` first test still passes (theme/lang/calculator/modal).
- Existing mobile fit test still passes (no horizontal overflow after Phase B markup additions).
- New test: with `prefers-reduced-motion: reduce` set via Playwright `emulateMedia`, page loads without console errors and all sections render content visibly.
- New test: hover a `.tm-member` and assert `.tm-bio` becomes visible (`opacity > 0.9`).

Manual:
- DevTools Performance recording during full-page scroll: no long tasks > 50 ms.
- DevTools "Slow 4G + 4x CPU throttle" — page is interactive within reasonable budget.

## Risks

- **Canvas + video + GSAP on iOS Safari.** Backgrounding the tab and returning sometimes leaks raf loops. Mitigation: `document.visibilityState` gate on the canvas raf and the HUD ticker interval; both bail when hidden.
- **Pinned process section + Lenis smooth scroll.** Pin + smooth scroll combos can fight; ScrollTrigger has a `lenis` interop already in their docs but the project uses raw Lenis. Mitigation: hook `ScrollTrigger.update` to `lenis.on('scroll')` once at boot (`scrollerProxy` pattern).
- **Counter performance.** Updating 4 text nodes 60 fps for 1.6 s is fine, but if `evidence` reflows mid-animation, layout thrash possible. Mitigation: `tabular-nums` + `min-width` on counter wrapper.
- **Adding files to a 760-line component is the right call but means a follow-up cleanup pass on `WaveLabsApp.tsx` is wise.** Phase B itself does not refactor unrelated parts of that component.

## Acceptance Criteria

Phase B is done when:
- All 6 sections animate as specified at desktop, and mobile gates engage correctly at 390 px.
- `prefers-reduced-motion: reduce` produces a calm page with no canvas, no scrub, no pin.
- No console errors on mount, on route navigation away, and on route navigation back.
- `npm run typecheck`, `npm run lint`, `npm test`, `npm run e2e` all pass (including new tests).
- `npm run build` succeeds and Lighthouse performance ≥ 80 desktop, ≥ 65 mobile.
- DevTools Performance flame chart on full-page scroll shows no long task > 50 ms.

## Open Questions

1. Do we generate portrait videos for the team (Phase A could include them but cost ~ 4 × Veo) or skip and ship hover bio overlay text-only?
2. HUD ticker copy — the four lines are dummies. What do we actually want to show? Live commit count from GitHub? Static "shipped this quarter"? Founders to decide.
