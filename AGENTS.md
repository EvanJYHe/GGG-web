# Agents

This project uses the Payload CMS skill at `.agents/skills/payload/`.
Start with `.agents/skills/payload/SKILL.md` for a quick reference, then see `.agents/skills/payload/reference/` for detailed docs.

## Verification

- `pnpm test:int` — vitest integration tests (needs `DATABASE_URL` in `.env`).
- `pnpm test:e2e` — Playwright against `pnpm dev` on :3000; run `pnpm exec playwright install chromium` once first.
- `pnpm build` — also prerenders `/opengraph-image-*`; check it renders at `http://localhost:3000/` → `og:image` URL after `pnpm start`.
- `pnpm lint` currently fails on the legacy `.eslintrc` config (circular `react` plugin reference), unrelated to app code.

## Vendored fonts (`src/assets/fonts/`)

Only used by `src/app/(public)/opengraph-image.jsx`; Satori cannot consume `next/font`, and passing custom fonts drops the built-in default, so both a display and a body font are vendored. Both are SIL OFL 1.1 (license files sit alongside).

- `BebasNeue-Regular.ttf` — unmodified from https://github.com/google/fonts/tree/main/ofl/bebasneue
- `Inter-Regular-latin.ttf` — static `wght=400, opsz=14` instance of `Inter[opsz,wght].ttf` from https://github.com/google/fonts/tree/main/ofl/inter, subset to Google Fonts' "latin" range. Regenerate with:

  ```bash
  uvx --from fonttools fonttools varLib.instancer -o Inter-Regular.ttf "Inter[opsz,wght].ttf" wght=400 opsz=14
  uvx --from fonttools pyftsubset Inter-Regular.ttf --output-file=Inter-Regular-latin.ttf \
    --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
  ```
