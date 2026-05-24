# WaveLabs Team And Mobile Design

Date: 2026-05-22

## Goal

Replace the placeholder Team content with the confirmed RA Group team data and make the current WaveLabs React site feel intentional on narrow mobile viewports without changing the desktop visual direction.

## Source Content

Use the named team members and roles shown on the RA Group About page:

- Anel Ryspaeva - Founder & CEO
- Emil Khusnutdinov - CEO
- Ruslan Khusenov - CTO
- Madina Saylaubayeva - Project Manager

The WaveLabs site should not invent experience claims, client claims, or biographies for these people. The existing card accent line may use a short neutral source label or company label if an extra line is still needed visually.

## Team Block

Keep the current Team section structure and visual language:

- Preserve the existing section placement and four-card grid on desktop.
- Replace temporary initials, names, roles, and experience labels with the confirmed content.
- Keep cards strict and compact: initials avatar, name, role, and one quiet accent line at most.
- Keep the mobile team layout in one readable column at phone widths.

## Mobile Adaptation

Focus on current layout pressure points rather than redesigning the whole page:

- Keep the desktop header unchanged while making language controls and the call-to-action fit on narrow widths.
- Let the hero chip and hero title wrap without clipping or horizontal overflow.
- Remove inline grid assumptions that prevent hero metadata from following mobile CSS.
- Tighten mobile spacing for long text, cards, forms, and calculator controls where needed.
- Preserve theme switching, locale switching, animations, and the existing visual palette.

## Data And Translation Rules

Team names stay as proper names in every locale. Role labels should be translated through the existing EN/RU/UZ translation path.

Do not add unverified WaveLabs metrics or biographies during this pass. Keep company copy changes limited to the team source update unless a mobile fix requires layout text to wrap differently.

## Verification

Check the result with:

- focused tests for team data or translation fallback if the data shape changes;
- typecheck, lint, and existing test suite;
- mobile and desktop browser verification of the header, hero, Team section, calculator, modal form, and horizontal overflow.
