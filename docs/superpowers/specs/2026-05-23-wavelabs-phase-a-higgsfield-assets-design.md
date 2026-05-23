# WaveLabs Phase A — Higgsfield Brand Visual Uplift

Date: 2026-05-23
Status: design draft

## Goal

Replace the current placeholder video and image assets with a cohesive cinematic asset family generated through Higgsfield MCP, and tighten the hero copy and "stats" section so the landing stops claiming numbers that a 4-person studio cannot defend in a reference check. Visual language stays in the existing WaveLabs sub-brand (cyan accent #00D4FF, magenta #FF2D6B, near-black #06060A, Syne + Outfit).

Phase A does not touch scroll choreography (that is Phase B) and does not add new sections (Phase C). It is asset + copy work that lands on top of the existing component tree.

## In Scope

- Hero background video — replace.
- Process section background video — replace.
- Contact section background video — replace.
- Three Work case cover images — replace as a cohesive series.
- Five Service icon loops — add (currently sections show text-only cards).
- Hero copy: headline, subhead, chip, four hero-sub-col values.
- Stats section: replace fake aggregate metrics with honest studio signals and add one evidence line under each.
- Team "team.source" accent line and team intro copy adjustments where they touch the stats narrative.

## Out of Scope

- Any GSAP/Lenis/canvas changes beyond ensuring new assets behave the same way as old ones.
- New sections (Industry Presets, Compliance — go in Phase C).
- Brand token changes (WaveLabs stays cyan/Syne per stakeholder choice A).
- Light-theme palette redesign (light mode keeps current accents).
- Real client logo permissions and named outcomes — those are content questions for the founder team; the spec defines slots and copy patterns.

## Visual Direction

One coherent cinematic family. Every asset must read as belonging to the same studio.

- Color grade: shadows lean teal (#06060A → #0A1418), highlights flare cyan (#00D4FF) with occasional magenta caustic (#FF2D6B). No warm tones, no orange, no yellow.
- Lens grammar: 35mm anamorphic feel — slight horizontal lens flare and barrel distortion on edges. Avoid telephoto compression.
- Motion grammar: single continuous camera move per shot. No cuts. No quick zooms. Speed never exceeds "slow drift."
- Subject grammar: abstract material studies — chrome, glass, liquid metal, woven light. No human figures. No recognizable products. No literal "AI brain" or "neural net" tropes.

## Asset Specification

### 1. Hero background video

- **Slot:** `assets.heroVideo` in `data/site.ts`. Currently a Higgsfield placeholder mp4.
- **Format:** 21:9 (letterboxed in container) or 16:9 cropped to fill. mp4 + webm. ≤ 4 MB compressed, h.264 + opus.
- **Duration:** 8–10 s seamless loop.
- **Generator:** Veo 3.1 (`veo3_1`) at quality `high` or `ultra`, fallback Kling 3.0 (`kling3_0`) mode `4k`.
- **Prompt seed:** "macro shot of liquid chrome ribbons flowing through dark void, cyan rim light and magenta caustic flares, anamorphic 35mm lens, slow orbital camera, cinematic, seamless loop, no text, no logo."
- **Acceptance:** loops without visible cut; cyan is the dominant accent; readable as background at `opacity: 0.25` (current `#hero-vid.ready` rule).

### 2. Process background video

- **Slot:** `assets.processVideo`. Currently placeholder.
- **Format:** 16:9, mp4 + webm, ≤ 3 MB.
- **Duration:** 12 s.
- **Generator:** Seedance 1.5 Pro (`seedance_1_5`) at 720p for cost; upscale only if grading bench requires it.
- **Prompt seed:** "top-down isometric perspective of modular geometric blocks assembling into a build pipeline, mute palette of #1a1a22 and electric cyan accent only, no magenta, slow lateral drift, cinematic."
- **Acceptance:** reads as "engineering" not "marketing"; pairs visually with the process step copy without competing with it.

### 3. Contact background video

- **Slot:** `assets.contactVideo`. Currently placeholder.
- **Format:** 16:9, mp4 + webm, ≤ 3 MB.
- **Duration:** 10 s.
- **Generator:** Kling 3.0 (`kling3_0`) mode `std`.
- **Prompt seed:** "abstract neural mesh dissolving into volumetric smoke against deep black background, cyan filament edges, slow upward drift, cinematic, no text."
- **Acceptance:** quieter than hero (less contrast), reads as "closing" beat of the page.

### 4. Work case covers (×3, cohesive series)

- **Slot:** `assets.workImages` — currently three cdn webp images.
- **Format:** still 16:10 webp at 1600 px wide, ≤ 200 KB each. Optional companion mp4 (6 s loop) per cover if Phase B promotes Work to scroll-driven hover (Phase B decides).
- **Generator stack:**
  - Still frame: Soul Cinema (`soul_cinematic`) at quality `2k`, locked `soul_id` across the three so the grade is identical.
  - Motion (if produced): Seedance 2.0 (`seedance_2_0`) using the still as `start_image`, 6 s, 16:9 at 720p, mode `std`, genre `drama`.
- **Materials, one per cover, do not mix:**
  1. Liquid metal ribbons (case "AI Credit Scoring").
  2. Crystalline glass shards (case "Semantic Search").
  3. Woven light filaments (case "Supply Chain").
- **Camera:** lateral tracking left → right on every cover. Same lens.
- **Acceptance:** placed side by side, the three covers read as a series, not three random renders.

### 5. Service icon loops (×5)

- **Slot:** new field `assets.serviceIcons` in `data/site.ts`, array of webm/mp4 paths keyed by service number. Service cards in `WaveLabsApp.tsx` get a small video element above the n / name / desc.
- **Format:** square (1:1), 512 × 512, transparent webm (vp9 + alpha) when possible; fallback to opaque webm with `mix-blend-mode: screen` to read on dark bg, ≤ 300 KB each.
- **Duration:** 2 s seamless loop.
- **Generator:** Wan 2.6 (`wan2_6`) stylized at quality `720p`, 5 s, 1:1, then trim and loop in post.
- **Prompt pattern:** "minimal geometric pictogram of {service primitive} morphing into {service result}, single cyan accent on near-black, slow morph, looping, no text" — substitute primitives per service:
  1. ML/AI dev: sphere → lens
  2. Software engineering: cube → architecture
  3. Data platforms: stream of particles → grid
  4. Mobile: rectangle → folded surface
  5. Consulting: triangle → compass needle
- **Acceptance:** five icons share a single visual language; each is recognizable without copy.

### 6. Industry preset thumbnails (forward-looking, generated in Phase A, consumed in Phase C)

Phase C will need 15 still thumbnails (5 industries × 3 cards each). Generating them in Phase A keeps the cinematic family coherent and avoids regeneration cost during Phase C implementation.

- **Slot:** new field `assets.industryPresets` in `data/site.ts`, keyed by industry slug.
- **Format:** 3:2 webp at 1200 px wide, ≤ 180 KB each.
- **Generator:** Nano Banana Pro (`nano_banana_pro`) at 4k for primary, fallback Seedream 4.5 (`seedream_v4_5`) at `high`.
- **Prompt pattern:** "{industry abstract metaphor}, dark editorial composition, cyan rim light, magenta caustic flare, anamorphic lens, cinematic" — concrete metaphors per industry:
  - Banking: vaulted geometric tunnels, layered chrome
  - Retail: fractal shelves, light filament product silhouettes
  - Telecom: signal mesh, ribbons of data
  - FMCG: liquid material studies, slow viscosity
  - Government: monumental stone forms, cyan edge
- **Acceptance:** all 15 share grade and lens; each industry's three reads as a mini-series.

## Hero Copy Rewrite

Current hero title uses `hero.title.1/2/3` with placeholder "WaveLabs" wordmark. Replace with the CMO-validated vertical positioning.

### Headline (3 lines, EN/RU/UZ)

EN:
1. AI engineering for
2. Central Asian enterprises
3. From prototype to prod

RU:
1. AI-инженерия для
2. предприятий Центральной Азии
3. От прототипа до прода

UZ:
1. Markaziy Osiyo korxonalari uchun
2. AI muhandisligi
3. Prototipdan prodgacha

`hero-line--accent` lands on line 2. `hero-line--outline` lands on line 3.

### Subhead under headline

EN: "We build AI products under your data laws and your timelines. KZ + UZ. Banking, telecom, retail."
RU: "Строим AI-продукты под ваши данные, регуляторику и сроки. KZ + UZ. Банки, телеком, ритейл."
UZ: "Sizning ma'lumotlaringiz, qoidalaringiz va muddatlaringiz ostida AI-mahsulotlar quramiz. QZ + OʻZ. Banklar, telekom, chakana."

### Chip (above headline)

Keep current `hero.chip` slot but rewrite to "AI engineering studio · Tashkent · Almaty" (replaces any "ANALYTICS / ENGINEERING / DESIGN" current placeholders if present).

### Four hero-sub-col values

- `hero.loc.label` / `hero.loc.val`: "Based" / "Tashkent + Almaty"
- `hero.spec.label` / `hero.spec.val`: "Practice" / "AI, ML, Data, LLMs"
- `hero.accred.label` / `hero.accred.val`: "Markets" / "KZ · UZ · CIS"
- `hero.status.label` / `hero.status.val`: "Status" / "Taking 2 projects this quarter"

The status value is intentionally honest about scarcity. It also gives the calculator section social proof later.

Translation keys land in `data/translations.generated.json` for EN/RU/UZ.

## Stats Section Rewrite

Current: `{ value: "50", suffix: "+", label: "stats.l1" }`, `{ value: "340", suffix: "%", label: "stats.l2" }`, `{ value: "2", suffix: ".5x", label: "stats.l3" }`, `{ value: "100", suffix: "%", label: "stats.l4" }`. None of these are defensible for a 4-person studio.

Replacement: studio-level honest signals plus one evidence line per stat. Phase B will animate the counter + reveal evidence; Phase A only ships the data and copy.

New `stats` shape in `data/site.ts`:

```ts
export const stats = [
  { value: "4",  suffix: "",   label: "stats.l1", evidence: "stats.l1.ev" },
  { value: "3",  suffix: "y",  label: "stats.l2", evidence: "stats.l2.ev" },
  { value: "2",  suffix: "",   label: "stats.l3", evidence: "stats.l3.ev" },
  { value: "12", suffix: "+",  label: "stats.l4", evidence: "stats.l4.ev" }
];
```

Copy (EN, mirror in RU/UZ):
- `stats.l1`: "senior engineers"
  - `stats.l1.ev`: "every project led by founders, not juniors"
- `stats.l2`: "in market"
  - `stats.l2.ev`: "KZ + UZ since 2023, no offshore handoff"
- `stats.l3`: "countries deployed"
  - `stats.l3.ev`: "production systems live in Kazakhstan and Uzbekistan"
- `stats.l4`: "production projects shipped"
  - `stats.l4.ev`: "live AI systems across banking, telecom, and retail clients" — founders confirm the value `12` before launch; otherwise replace with the verified count.

`evidence` field requires a small `WaveLabsApp.tsx` change: the `.st-card` markup gains a sibling `<p className="st-evidence">{t(stat.evidence)}</p>`. CSS already provides `--fg2` color for muted text — reuse.

## Team Source Line

Current `team.source` reads "RA Group team / Команда RA Group / RA Group jamoasi". Keep verbatim. Phase A does not change team data (already correct per the previous plan). Phase B will add hover bio overlay.

## Data and File Changes

- `data/site.ts`: extend `assets` with `serviceIcons` and `industryPresets`. Replace `stats` array shape (add `evidence`). No new shapes elsewhere.
- `data/translations.generated.json`: add 4 evidence keys per locale; rewrite `hero.title.*`, `hero.sub`, `hero.chip`, `hero.loc.*`, `hero.spec.*`, `hero.accred.*`, `hero.status.*`. Replace `stats.l1`–`stats.l4`.
- `components/WaveLabsApp.tsx`: render `serviceIcons[n]` inside each `.sv-card` (small video above `.sv-num`); render `stat.evidence` under each `.st-card`. No other markup changes.
- `app/globals.css`: add `.sv-icon` class (size, blend mode); add `.st-evidence` class (Outfit 12 px, `var(--fg2)`, max-width 220 px, margin-top 8 px).
- `lib/i18n.ts`: untouched — translation table is data-driven.

## Asset Pipeline

Assets live in `public/media/`. Naming convention:
```
public/media/hero.mp4
public/media/hero.webm
public/media/process.mp4
public/media/process.webm
public/media/contact.mp4
public/media/contact.webm
public/media/work-01.webp   (liquid metal)
public/media/work-02.webp   (crystal glass)
public/media/work-03.webp   (woven light)
public/media/svc-01.webm    (ml-ai)
public/media/svc-02.webm    (software)
public/media/svc-03.webm    (data)
public/media/svc-04.webm    (mobile)
public/media/svc-05.webm    (consulting)
public/media/ind-banking-{01,02,03}.webp
public/media/ind-retail-{01,02,03}.webp
public/media/ind-telecom-{01,02,03}.webp
public/media/ind-fmcg-{01,02,03}.webp
public/media/ind-gov-{01,02,03}.webp
```

`data/site.ts` references these by relative path (`/media/hero.mp4`). The CDN URLs in current `assets` are removed.

`.gitignore` does not exclude `public/`, so committed assets ship with the repo. If size becomes a problem, mid-Phase decision: move to Vercel Blob or keep in repo (decision deferred until total `public/media/` size measured after generation).

## Generation Workflow

For every asset above, the steps are:
1. Open the appropriate Higgsfield MCP generator (`generate_image` or `generate_video`) with the prompt and parameters in this spec.
2. Run `virality_predictor` on candidate outputs only for the industry preset thumbnails (Phase C selection criterion); skip for hero/process/contact/work/icons — those judged on grade and motion, not virality.
3. Download finalized asset, transcode (ffmpeg) to web-friendly format and the size budgets above.
4. Drop into `public/media/`.
5. Update `data/site.ts` reference.

A short helper script `scripts/gen-asset.sh` is optional — not required by this spec.

## Acceptance Criteria

Phase A is done when:
- All assets listed above exist in `public/media/` and are referenced from `data/site.ts`.
- Hero renders the new 3-line headline + subhead + 4-col metadata in EN/RU/UZ without overflow at 390 px width.
- Stats section renders 4 honest signals + 4 evidence lines without breaking the 4-column desktop grid or the 2-column mobile grid.
- `npm run typecheck`, `npm run lint`, `npm test` all pass.
- `npm run build` succeeds.
- Visual review at desktop and at 390 px width confirms cinematic series reads cohesively.

## Risks

- **Asset size bloat.** 15 industry thumbnails + 3 video loops + 5 icons could push `public/media/` past 30 MB. Mitigation: enforce size budgets per asset; measure before commit.
- **Higgsfield generation cost.** ~10 video generations × Veo/Kling pricing + 15 image generations. Mitigation: budget check in calling code; reuse Soul Cinema `soul_id` to avoid regenerating grade.
- **CMO copy needs founder sign-off.** "Taking 2 projects this quarter" and "12+ production projects shipped" are claims the founders must confirm. Mitigation: spec marks both as `[нужны данные]` — implementation pauses until confirmed.
- **Light theme contrast.** New assets graded for dark mode; on `data-theme="light"` the hero video already drops to `.08` opacity (existing rule). Verify the new hero asset still reads at that opacity.

## Open Questions (need founder data before implementation)

1. Can we claim "12+ production projects shipped" honestly, or what is the true count?
2. Is "Taking 2 projects this quarter" accurate, or should we set a different scarcity signal (or remove)?
3. Are there at least 3 client logos we can name publicly + one quantified outcome per case? Phase A does not block on this, but Phase B (Work + Team polish) will need it.
