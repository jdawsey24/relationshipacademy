// The Relationship Snapshot nurture sequence: 4 emails over ~10 days, drafted in
// the RLC voice, nurturing toward the Academy. Pure content + rendering (no I/O)
// so it's easy to review/edit. Timing is offsetDays from enrollment.

export interface StepVars {
  firstName: string | null;
  growthAreas: string[];
  resultsUrl: string;
  academyUrl: string;
  unsubscribeUrl: string;
}

export interface SequenceStep {
  key: string;
  offsetDays: number;
  subject: (v: StepVars) => string;
  body: (v: StepVars) => { html: string; text: string };
}

const NAVY = "#1C3557";
const CORAL = "#D9777D";
const IVORY = "#F7F4EF";
const CHARCOAL = "#333333";

const hi = (v: StepVars) => (v.firstName ? `Hi ${v.firstName},` : "Hi there,");
const growthPhrase = (v: StepVars) =>
  v.growthAreas.length ? v.growthAreas.join(" and ") : "the areas that matter most to you";

// Shared HTML shell — inline styles (email clients ignore <style>/external CSS).
function layout(inner: string, v: StepVars, opts?: { cta?: { label: string; url: string } }): string {
  const cta = opts?.cta
    ? `<tr><td style="padding:8px 0 4px;">
         <a href="${opts.cta.url}" style="display:inline-block;background:${CORAL};color:#ffffff;text-decoration:none;font-weight:600;font-size:16px;padding:14px 30px;border-radius:9999px;">${opts.cta.label}</a>
       </td></tr>`
    : "";
  return `<!doctype html><html><body style="margin:0;padding:0;background:${IVORY};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${IVORY};padding:28px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;padding:36px 32px;font-family:Georgia,'Times New Roman',serif;color:${CHARCOAL};">
        <tr><td style="padding-bottom:8px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#8a8a8a;">Relationship Life Cycle&trade;</td></tr>
        ${inner}
        ${cta}
      </table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;padding:18px 32px;font-family:Arial,sans-serif;font-size:12px;line-height:1.6;color:#9a9a9a;">
        <tr><td>
          You're receiving this because you took the Relationship Snapshot&trade;.<br/>
          <a href="${v.unsubscribeUrl}" style="color:#9a9a9a;">Unsubscribe</a> &middot; Janelle Dawsey, LMFT &middot; Relationship Life Cycle&trade;
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`;
}

const p = (t: string) => `<tr><td style="font-size:17px;line-height:1.65;color:${CHARCOAL};padding:6px 0;">${t}</td></tr>`;
const h1 = (t: string) => `<tr><td style="font-size:26px;line-height:1.25;color:${NAVY};font-weight:600;padding:6px 0 10px;">${t}</td></tr>`;

const footerText = (v: StepVars) =>
  `\n\n—\nYou're receiving this because you took the Relationship Snapshot.\nUnsubscribe: ${v.unsubscribeUrl}\nJanelle Dawsey, LMFT · Relationship Life Cycle`;

export const SEQUENCE: SequenceStep[] = [
  {
    key: "results",
    offsetDays: 0,
    subject: () => "Your Relationship Snapshot results",
    body: (v) => ({
      html: layout(
        h1("Your snapshot is ready") +
          p(`${hi(v)}`) +
          p("Thank you for taking the Relationship Snapshot&trade;. It's a real act of care to pause and look honestly at your relationship — and you just did that.") +
          p("Your results show where your relationship is developmentally right now: what's working, and the areas with the most room to grow. There are no grades here, just a clearer picture.") +
          p("You can revisit your results anytime:"),
        v,
        { cta: { label: "View your results", url: v.resultsUrl } }
      ),
      text: `${hi(v)}\n\nThank you for taking the Relationship Snapshot. It's a real act of care to pause and look honestly at your relationship — and you just did that.\n\nYour results show where your relationship is developmentally right now: what's working, and the areas with the most room to grow. There are no grades here, just a clearer picture.\n\nView your results: ${v.resultsUrl}${footerText(v)}`,
    }),
  },
  {
    key: "understand",
    offsetDays: 2,
    subject: () => "Making sense of your snapshot",
    body: (v) => ({
      html: layout(
        h1("How to read your snapshot") +
          p(`${hi(v)}`) +
          p("A quick guide to what your results mean, now that you've had a couple of days with them.") +
          p("<strong>Your six domains</strong> — like communication, trust, and conflict — each get a score and a label (Strength, Healthy Development, Growth Opportunity, or Needs Attention). Together they show the shape of how your relationship is functioning today.") +
          p("<strong>Developmental alignment</strong> tells you whether your day-to-day habits match the stage your relationship is in. When they don't quite line up, that's not a problem — it's just useful information about where to focus.") +
          p("The most helpful question isn't &ldquo;is my score good?&rdquo; — it's &ldquo;what's one area I'd like to feel more solid in?&rdquo;"),
        v,
        { cta: { label: "Revisit your results", url: v.resultsUrl } }
      ),
      text: `${hi(v)}\n\nA quick guide to what your results mean.\n\nYour six domains — like communication, trust, and conflict — each get a score and a label (Strength, Healthy Development, Growth Opportunity, or Needs Attention). Together they show the shape of how your relationship is functioning today.\n\nDevelopmental alignment tells you whether your day-to-day habits match the stage your relationship is in. When they don't quite line up, that's not a problem — it's just useful information about where to focus.\n\nThe most helpful question isn't "is my score good?" — it's "what's one area I'd like to feel more solid in?"\n\nRevisit your results: ${v.resultsUrl}${footerText(v)}`,
    }),
  },
  {
    key: "growth-tip",
    offsetDays: 5,
    subject: (v) => `One small step for ${v.growthAreas[0] ?? "your relationship"}`,
    body: (v) => ({
      html: layout(
        h1("Small steps, real change") +
          p(`${hi(v)}`) +
          p(`Your snapshot pointed to ${growthPhrase(v)} as an area with room to grow. The good news: growth here rarely comes from big dramatic changes. It comes from small, repeatable moments.`) +
          p("This week, try one thing: when something feels off between you, name it out loud gently instead of waiting for it to pass. &ldquo;I noticed I felt a little distant today&rdquo; is a full sentence — and often the start of a good conversation.") +
          p("That single habit — noticing and naming — quietly strengthens almost every domain the snapshot measures."),
        v,
        { cta: { label: "See your growth areas", url: v.resultsUrl } }
      ),
      text: `${hi(v)}\n\nYour snapshot pointed to ${growthPhrase(v)} as an area with room to grow. The good news: growth here rarely comes from big dramatic changes. It comes from small, repeatable moments.\n\nThis week, try one thing: when something feels off between you, name it out loud gently instead of waiting for it to pass. "I noticed I felt a little distant today" is a full sentence — and often the start of a good conversation.\n\nThat single habit — noticing and naming — quietly strengthens almost every domain the snapshot measures.\n\nSee your growth areas: ${v.resultsUrl}${footerText(v)}`,
    }),
  },
  {
    key: "academy",
    offsetDays: 9,
    subject: () => "Ready to go a little deeper?",
    body: (v) => ({
      html: layout(
        h1("Keep growing with the Academy") +
          p(`${hi(v)}`) +
          p("Your snapshot showed you where things stand. If you're ready to actually build on it, that's what the Relationship Academy is for.") +
          p(`Inside, you'll find guided lessons, live sessions, and a supportive community — all organized around the same framework behind your snapshot, so you can strengthen ${growthPhrase(v)} with real structure and support.`) +
          p("It's a warm, judgment-free place to keep doing this work. I'd love to see you there."),
        v,
        { cta: { label: "Join the Relationship Academy", url: v.academyUrl } }
      ),
      text: `${hi(v)}\n\nYour snapshot showed you where things stand. If you're ready to actually build on it, that's what the Relationship Academy is for.\n\nInside, you'll find guided lessons, live sessions, and a supportive community — all organized around the same framework behind your snapshot, so you can strengthen ${growthPhrase(v)} with real structure and support.\n\nIt's a warm, judgment-free place to keep doing this work. I'd love to see you there.\n\nJoin the Relationship Academy: ${v.academyUrl}${footerText(v)}`,
    }),
  },
];

export function renderStep(step: SequenceStep, v: StepVars): { subject: string; html: string; text: string } {
  const { html, text } = step.body(v);
  return { subject: step.subject(v), html, text };
}
