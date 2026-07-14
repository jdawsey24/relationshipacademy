// The Relationship Snapshot nurture sequence: 4 emails over ~10 days, in the RLC
// voice, nurturing toward the Academy. Pure content + rendering (no I/O) so it's
// easy to review/edit. Timing is offsetDays from enrollment.

export interface StepVars {
  firstName: string | null;
  resultsUrl: string;
  frameworkUrl: string;
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

// Shared HTML shell — inline styles (email clients ignore <style>/external CSS).
function layout(inner: string, v: StepVars, opts?: { cta?: { label: string; url: string } }): string {
  const cta = opts?.cta
    ? `<tr><td style="padding:10px 0 4px;">
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
    subject: () => "Your Relationship Snapshot Is Ready",
    body: (v) => ({
      html: layout(
        h1("Your snapshot is ready") +
          p(hi(v)) +
          p("Most people have never been taught how relationships actually develop. Instead, we rely on advice from family, social media, or past experiences.") +
          p("Your Relationship Snapshot&trade; is designed to help you step back and understand where you are today — so you can make more intentional decisions moving forward."),
        v,
        { cta: { label: "View your results", url: v.resultsUrl } }
      ),
      text: `${hi(v)}\n\nMost people have never been taught how relationships actually develop. Instead, we rely on advice from family, social media, or past experiences.\n\nYour Relationship Snapshot is designed to help you step back and understand where you are today — so you can make more intentional decisions moving forward.\n\nView your results: ${v.resultsUrl}${footerText(v)}`,
    }),
  },
  {
    key: "myth",
    offsetDays: 2,
    subject: () => "The Biggest Myth About Relationships",
    body: (v) => ({
      html: layout(
        h1("The biggest myth about relationships") +
          p(hi(v)) +
          p("Most people believe successful relationships happen because two people found &ldquo;the right person.&rdquo;") +
          p("In reality, relationships require development.") +
          p("People grow.<br/>Relationships change.<br/>New challenges emerge.") +
          p("The healthiest relationships aren't the ones without problems — they're the ones that continue developing through each season of life.") +
          p("Every relationship moves through recognizable patterns and stages. Learning to see them is where intentional growth begins."),
        v,
        { cta: { label: "Learn more about the Relationship Life Cycle&trade;", url: v.frameworkUrl } }
      ),
      text: `${hi(v)}\n\nMost people believe successful relationships happen because two people found "the right person."\n\nIn reality, relationships require development.\n\nPeople grow.\nRelationships change.\nNew challenges emerge.\n\nThe healthiest relationships aren't the ones without problems — they're the ones that continue developing through each season of life.\n\nEvery relationship moves through recognizable patterns and stages. Learning to see them is where intentional growth begins.\n\nLearn more about the Relationship Life Cycle: ${v.frameworkUrl}${footerText(v)}`,
    }),
  },
  {
    key: "label",
    offsetDays: 5,
    subject: () => "There's More to Your Relationship Than a Label",
    body: (v) => ({
      html: layout(
        h1("There's more to your relationship than a label") +
          p(hi(v)) +
          p("Being single, dating, engaged, or married tells us very little about how a relationship is actually functioning.") +
          p("Two married couples can have completely different levels of trust, communication, emotional intimacy, and partnership.") +
          p("Likewise, two people who are dating may be in very different places developmentally.") +
          p("That's why the Relationship Life Cycle&trade; focuses on understanding how relationships grow — not just what they look like on the outside."),
        v,
        { cta: { label: "Explore the framework", url: v.frameworkUrl } }
      ),
      text: `${hi(v)}\n\nBeing single, dating, engaged, or married tells us very little about how a relationship is actually functioning.\n\nTwo married couples can have completely different levels of trust, communication, emotional intimacy, and partnership.\n\nLikewise, two people who are dating may be in very different places developmentally.\n\nThat's why the Relationship Life Cycle focuses on understanding how relationships grow — not just what they look like on the outside.\n\nExplore the framework: ${v.frameworkUrl}${footerText(v)}`,
    }),
  },
  {
    key: "academy",
    offsetDays: 9,
    subject: () => "Continue Building Stronger Relationships",
    body: (v) => ({
      html: layout(
        h1("Continue building stronger relationships") +
          p(hi(v)) +
          p("A snapshot can show you where you are today.") +
          p("It can't teach you how to build healthier communication, strengthen trust, navigate conflict, deepen emotional intimacy, or prepare for future transitions.") +
          p("That's exactly why I created the Relationship Academy.") +
          p("Inside, you'll learn practical relationship skills grounded in the Relationship Life Cycle&trade; Framework — through lessons, live trainings, workbooks, and a community committed to growing healthier relationships.") +
          p("Whether you're single, dating, engaged, married, healing after heartbreak, or preparing for what's next, your relationship education doesn't have to stop with one assessment."),
        v,
        { cta: { label: "Join the Relationship Academy", url: v.academyUrl } }
      ),
      text: `${hi(v)}\n\nA snapshot can show you where you are today.\n\nIt can't teach you how to build healthier communication, strengthen trust, navigate conflict, deepen emotional intimacy, or prepare for future transitions.\n\nThat's exactly why I created the Relationship Academy.\n\nInside, you'll learn practical relationship skills grounded in the Relationship Life Cycle Framework — through lessons, live trainings, workbooks, and a community committed to growing healthier relationships.\n\nWhether you're single, dating, engaged, married, healing after heartbreak, or preparing for what's next, your relationship education doesn't have to stop with one assessment.\n\nJoin the Relationship Academy: ${v.academyUrl}${footerText(v)}`,
    }),
  },
];

export function renderStep(step: SequenceStep, v: StepVars): { subject: string; html: string; text: string } {
  const { html, text } = step.body(v);
  return { subject: step.subject(v), html, text };
}
