# Public assets

Web-ready logo assets served by the site:

| File | Used for | Logo variant |
|---|---|---|
| `logo-full.png` | nav, home, intro, capture, results header, profile | `full` / `wordmark` |
| `logo-mark.png` | progress-bar header, results footer | `mark` / `monogram` |
| `favicon.png` | favicon (referenced in app/layout.tsx) | — |

These are generated from the original artwork in the repo-root `brand/` folder
(white keyed to transparent, trimmed, downscaled). The originals there are large
mockup/source renders and are intentionally NOT served publicly.

## Regenerating

The web assets were derived from `brand/RLC.png` (full logo) and
`brand/RLCmark.png` (mark) — the two clean, flat exports. The other brand files
(`RLC logo transparent.png`, `RLC logomark trans.png`, `RLC white.png`, etc.)
are gray-background presentation mockups, not usable as-is. If the artwork
changes, re-run a white-key + trim + downscale pass (sharp) from the clean
source into `logo-full.png` / `logo-mark.png` / `favicon.png`.

`brand/lifecycleexplanation.png` is a logo explainer — do NOT use it in the UI.
