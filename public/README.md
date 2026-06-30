# Logo assets

Drop the brand PNGs here. Until they're present, the UI renders an on-brand
typographic placeholder via `components/Logo.tsx` (nothing breaks).

| File | Used for | Logo variant |
|---|---|---|
| `RLC_logo_transparent.png` | nav header, home, results header | `full` |
| `RLC_logomark_trans.png` | progress-bar header, mobile nav | `mark` |
| `RLC_white.png` | white version for navy backgrounds | `full` tone="white" |
| `RLCWordmark.png` | result-page headers (wordmark only) | `wordmark` |
| `RLC_monogram.png` | results footer watermark | `monogram` |
| `RLC_favicon.png` | favicon (referenced in app/layout.tsx) | — |

## Switching from placeholder to real assets

Once the files are here, edit each variant branch in `components/Logo.tsx` to
render `<img src="/RLC_*.png" alt="Relationship Life Cycle" />` (or `next/image`)
instead of the typographic markup. The variant→file mapping above is also noted
inline in that component.

Do NOT use `lifecycleexplanation.png` in the quiz UI — it is a logo explainer
only.
