// The rules that can be checked without asking anybody.
//
// Every rule below is one the owner stated, and several she stated twice. A
// prompt can carry them and mostly comply. Mostly is the problem: the run that
// breaks a rule is the run she has to read carefully, which is the attention
// this is supposed to save.
//
// So they are checked here. BLOCKING failures never reach the screen — the
// option is dropped and the stage regenerates. NOTES are things worth her
// knowing that are not automatically wrong.
//
// WHAT IS DELIBERATELY NOT HERE. "Is a specific woman the subject, or is the
// culture?" is the correction she gave most often and it cannot be done
// lexically: her own gold-standard hook opens "Have you ever watched a woman
// tell one dating story online," where the comment section is the target and the
// woman is the scene. Mine opened "A woman said 'I'm not chasing'" and put her
// on trial. Same words, opposite move. That one stays with the model's review
// and with her.

export interface VoiceFinding {
  rule: string;
  detail: string;
  blocking: boolean;
}

/** Contractions she would have used. Their expanded form is the tell. */
const EXPANDED =
  /\b(do not|does not|did not|cannot|can not|will not|would not|should not|is not|are not|was not|were not|has not|have not|had not|it is|that is|there is|you are|we are|they are|I am|you will|we will|they will|you have|we have)\b/gi;

const CONTRACTION = /\b\w+['’](t|s|re|ve|ll|d|m)\b/i;

/** Phrases she named. Not a general taste filter. */
const BANNED: [RegExp, string][] = [
  [/[—–]/, "em dash"],
  [/I don'?t know who needs to hear this/i, "\"I don't know who needs to hear this\""],
  [/let that sink in/i, "\"let that sink in\""],
  [/read that again/i, "\"read that again\""],
  [/\bnormalize\b/i, "\"normalize\""],
  [/level up your love life/i, "\"level up your love life\""],
  [/\bI do this too\b/i, "Janelle put in it as confession"],
  [/here'?s how I check myself/i, "Janelle put in it as confession"],
];

/** A four-word opening repeated three times is a template, not speech. */
function repeatedStem(text: string): string | null {
  const counts = new Map<string, number>();
  for (const line of text.split(/[\n.!?]+/)) {
    const words = line.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length < 5) continue;
    const stem = words.slice(0, 4).join(" ");
    counts.set(stem, (counts.get(stem) ?? 0) + 1);
  }
  for (const [stem, n] of counts) if (n >= 3) return `"${stem}…" opens ${n} times`;
  return null;
}

/** Spoken delivery, roughly. Used only for the finished script. */
export function estimateSeconds(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.round((words / 2.6) * 10) / 10;
}

export const SECONDS_MIN = 45;
export const SECONDS_MAX = 75;

/**
 * Check a piece of writing.
 *
 * `kind` is "hook" | "body" | "resolution" | "cta" | "script". Short kinds skip
 * the checks that only make sense over a paragraph — a six-word hook with no
 * contractions in it is not formal, it is just short.
 */
export function voiceCheck(kind: string, text: string): VoiceFinding[] {
  const out: VoiceFinding[] = [];
  const t = (text ?? "").trim();
  if (!t) return out;

  for (const [pattern, label] of BANNED) {
    if (pattern.test(t)) {
      out.push({ rule: "banned", detail: `${label} — she asked for it gone`, blocking: true });
    }
  }

  // Contractions. Only meaningful where there was an opportunity to use one:
  // an expanded form present and no contraction anywhere.
  const expanded = t.match(EXPANDED);
  if (expanded && !CONTRACTION.test(t)) {
    out.push({
      rule: "contractions",
      detail: `"${expanded[0]}" and not one contraction in it`,
      blocking: true,
    });
  }

  if (kind === "body" || kind === "script") {
    const stem = repeatedStem(t);
    if (stem) out.push({ rule: "repeated_stem", detail: stem, blocking: true });

    // Line breaks are breathing points. A script delivered as one solid block
    // cannot be read off a phone, and it is the first thing that goes when the
    // prompt gets crowded: adding the offer instruction produced three scripts
    // in a row with no breaks in them at all.
    const words = t.split(/\s+/).filter(Boolean).length;
    const lines = t.split("\n").filter((l) => l.trim()).length;
    if (words > 60 && lines < 4) {
      out.push({
        rule: "no_breath",
        detail: `${words} words in ${lines} paragraph${lines === 1 ? "" : "s"}, nowhere to breathe`,
        blocking: true,
      });
    }
  }

  if (kind === "script") {
    const seconds = estimateSeconds(t);
    if (seconds < SECONDS_MIN || seconds > SECONDS_MAX) {
      // Not blocking. She may want a longer piece, and regenerating a good
      // script for being eight seconds over would be its own kind of wrong.
      out.push({
        rule: "length",
        detail: `about ${Math.round(seconds)}s, outside ${SECONDS_MIN} to ${SECONDS_MAX}`,
        blocking: false,
      });
    }
  }

  // A framework code on screen. Never correct in a script.
  const code = t.match(/\b[A-Z]{3}-[A-Z]{4}-\d{3}\b|\bPH-\d{3}\b|\bDOM-\d{3}\b/);
  if (code) {
    out.push({ rule: "framework_code", detail: `${code[0]} would be read out loud`, blocking: true });
  }

  return out;
}

export const blocking = (f: VoiceFinding[]) => f.filter((x) => x.blocking);
export const notes = (f: VoiceFinding[]) => f.filter((x) => !x.blocking);
