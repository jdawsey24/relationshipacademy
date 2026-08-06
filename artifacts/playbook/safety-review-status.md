# Where the playbook safety review stands

*Written 2026-08-05. Plain English on purpose — this is the note to read first if you're
picking this up cold, months from now.*

---

## What this is

The playbooks contain wording about serious things: suicide, abuse, grief, and when someone
should stop using the tools and go get real help. That wording needs a clinician's sign-off.
You're the clinician, so it's your sign-off — nobody else can give it.

There's a checklist of every piece of that wording. **92 items. 2 are approved.**

The playbooks are live and selling while the other 90 are unreviewed. That's the honest
position. It isn't an emergency, and it also isn't nothing.

---

## What's been decided

**The crisis paragraph** (`CRISIS_ESCALATION`) — approved as written on 2026-08-05, no changes.
This is the block about suicide, staying safe, and calling or texting 988. It's written once
and reused in all six places crisis language appears, so approving it once covered all six.

**The "if you don't feel safe" guide** (`lit-shared-if-you-dont-feel-safe`) — approved, with the
National Domestic Violence Hotline added: 1-800-799-7233, or text START to 88788, plus a line
for people outside the US. This guide is used in three playbooks.

You asked whether the hotline could be monetised. The answer was no, and it ships unmonetised.
Don't add affiliate or referral arrangements to crisis referrals later — that hotline is a
nonprofit with no affiliate programme, and putting revenue between someone in danger and help
would be a professional-conduct problem with your license attached to it.

---

## What got fixed along the way

These were bugs, not wording decisions, so they were fixed rather than queued for approval.
They mattered more than the sign-offs did.

**The crisis wording was hidden.** It sat behind a link that had to be clicked, and the link
said *"If this feels bigger than a dating moment"* — hardcoded, so it appeared on every
playbook including the one for a partner who died. A grieving person was asked whether things
felt bigger than a dating moment in order to reach the wording about suicide. It's now a
"Support" box that's simply on the page, and the crisis paragraph stands on its own instead of
being buried at the end of a ten-line block.

**Eighteen safety messages were never displayed at all.** The code only showed this kind of
copy for one type of card and silently skipped the other. Among the hidden ones: the card
telling someone frightened of their partner that the playbook's advice is the wrong advice for
them — invisible in all three playbooks carrying it. Also the bereavement redirects, the
addiction redirect, and the caregiving, illness and grieving-differently add-ons. All now
render.

**One worry that turned out fine:** the code only ever shows the first safety message in a
play, so a second would be invisible. No play has two. 26 messages, all reachable.

---

## What's left, and how much it matters

90 items. They are not equal, and the scary part is largely done.

The crisis language — the wording that could actually contribute to harm if it were wrong — is
the shared block you already approved. Most of what remains is literature that points people
toward a GP or a therapist. Lower stakes, but not zero: it still makes claims about what
someone's experience means.

**One open question**, if you ever come back to it. Items 4 and 5 (`lit-c11-checked-out` in
Accepting What Is, `lit-c15-empty` in Feeling Seen) both describe flatness that has spread
beyond the relationship — including "you've stopped expecting anything to get better anywhere"
— and stop at "worth mentioning to a GP." Neither carries the crisis wording, though the
in-play signposts in those same playbooks do. Is that threshold deliberate? Someone described
by that sentence may be further along than a GP referral assumes. That's a clinical judgement,
which is why it's still sitting here.

---

## How to pick it back up

```bash
# Regenerate the checklist from whatever the playbooks currently say
(set -a; . ./.env.local; set +a; npx tsx scripts/generateSafetyCopyChecklist.ts)
```

- The checklist is `artifacts/playbook/safety-copy-review-checklist.md`. It is **generated** —
  don't edit it by hand, your edits will be wiped next time it runs.
- Your decisions live in `artifacts/playbook/safety-copy-decisions.json`, keyed by item id.
  That's why regenerating is safe: the generator merges them back in. This has been tested —
  the checklist was regenerated after a content change and still reported the two sign-offs.
- Items are ordered by leverage, not by playbook. Shared copy first (one decision covers many
  playbooks), then crisis → abuse → grief → everything else.
- To record a decision, add an entry to the decisions file and re-run the generator.

Nothing decays if you leave it. Re-running the generator after editing any playbook copy is
the only maintenance it needs, and only if you want the checklist to match what currently
ships.
