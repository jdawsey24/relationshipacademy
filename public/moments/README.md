# Relationship Moments™ — landing page image assets

Drop your images in this folder (`/public/moments/`) with these exact filenames.
Until a file exists, its tile shows a soft brand tint (never a broken image), so
the page looks intentional before the assets arrive.

| Filename | Used on the landing page for | Suggested crop |
|----------|------------------------------|----------------|
| `coffee.jpg` | Two people talking over coffee (hero + "who it's for") | portrait / square |
| `walking.jpg` | A couple walking together (hero + "who it's for") | portrait / square |
| `conversation.jpg` | A respectful conversation ("recognition" + "who it's for") | portrait 3:4 |
| `planning.jpg` | A couple planning together ("recognition" + "who it's for") | portrait 3:4 |
| `journal.jpg` | Someone reflecting in a journal (hero + "who it's for") | portrait / square |
| `janelle-portrait.jpg` | Founder portrait ("Created by a relationship therapist") | portrait 4:5 |

Notes
- These render as CSS `background-size: cover`, so any reasonable resolution works
  (aim for ~1000px on the short edge; `.jpg`, `.png`, or `.webp` — if you use a
  different extension, tell me and I'll update `components/landing/moments.ts`).
- The hero moments float and parallax; keep the subjects roughly centered so they
  stay in frame as they move.
- Per the brief: isolated "moments," not large romantic stock photography.
