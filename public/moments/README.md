# Relationship Moments™ — landing page image mapping

The landing page (`/relationship-snapshot`) pulls images from `/public`. Current
mapping (edit `components/landing/moments.ts` to reassign):

| Slot | File in /public | Used on |
|------|-----------------|---------|
| coffee | `coffee.jpg` | hero + who-it's-for |
| walking | `walking.jpg` | hero + who-it's-for |
| conversation | `talking.png` | recognition section |
| planning | `working together.jpg` | recognition section |
| journal | `journaling.jpg` | hero + who-it's-for |
| proposal | `proposal.jpg` | who-it's-for |
| olderCouple | `older couple.jpg` | who-it's-for |
| cooking | `cooking together.jpg` | who-it's-for |
| **portrait** | `janelle-portrait.jpg` **(not added yet)** | trust section |

To do
- **Add your founder portrait** as `/public/janelle-portrait.jpg` (4:5 works best).
  Until then, that tile shows a soft plum tint.
- Unused-but-available files in /public you can swap in: `talking 2.jpg`,
  `shared responsibilities.jpg`, `excitement.jpg`, `older couple knitting.jpg`.
- Tiles render as `background-size: cover`; keep subjects roughly centered (the
  hero moments float + parallax).
