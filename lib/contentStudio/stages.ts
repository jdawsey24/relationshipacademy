// The four stages of building a script.
//
// She pastes what she saw. The Studio proposes hooks. She picks one, and it
// stays picked. Then bodies against that hook. Then the close. Then it
// assembles what she chose.
//
// Each stage is one model call with the same voice instruction and a different
// user template, so improving the voice improves every stage at once.
//
// Anthropic's structured output rejects maxItems and rejects minItems above 1,
// so an array cannot carry "give me five of these" and asking in the prompt does
// not hold: the bodies stage returned one body and the close stage returned zero
// CTAs while using an eighth of its token budget.
//
// So the options are NUMBERED SLOTS, every one of them required. The count stops
// being a request and becomes something the response has to satisfy to validate.

// "variations" is the default path: whole scripts that differ from each other.
// The rest are the by-hand path, kept because building a piece a part at a time
// is still sometimes what she wants.
/** Its own budget, its own pause, its own conversation limits. See 0070. */
export const CONTENT_STUDIO_SURFACE = "content_studio";

export const STAGES = ["read", "variations", "tighten", "hooks", "bodies", "close", "assemble"] as const;
export type Stage = (typeof STAGES)[number];

/** How many options each stage produces. A required slot for each one. */
export const STAGE_LIMITS: Record<Stage, number> = {
  read: 3, variations: 3, tighten: 1, hooks: 8, bodies: 5, close: 5, assemble: 1,
};

/**
 * Room to answer, per stage.
 *
 * The shared setting is 8,000, which is right for a single draft and not for
 * three complete scripts with endings on them: that run was cut off mid-JSON at
 * the ceiling. Raising the global would change every other generator in the
 * system, so the stages that need more say so here.
 */
export const STAGE_MAX_TOKENS: Partial<Record<Stage, number>> = {
  variations: 20000, bodies: 14000,
};

/** `thing_1 … thing_n`, all required. The only way to make a count binding. */
function slots(prefix: string, n: number, item: object) {
  const properties: Record<string, object> = {};
  const required: string[] = [];
  for (let i = 1; i <= n; i++) {
    properties[`${prefix}_${i}`] = item;
    required.push(`${prefix}_${i}`);
  }
  return { properties, required };
}

/**
 * The shortest a real answer can be, per kind.
 *
 * A required slot guarantees the key exists, not that it says anything. Asked
 * for five CTAs it did not want to write, the model returned {"family":"x",
 * "content":"x"} five times, which validates perfectly and is worthless. Worse,
 * the assemble stage then wrote its own CTA rather than choking on "x".
 *
 * So substance is checked here. Anything under the bar is dropped before it can
 * be saved, chosen, or assembled from.
 */
export const MIN_LENGTH: Record<string, number> = {
  hook: 12, body: 80, resolution: 20, cta: 40,
};

export function isUsable(kind: string, text: string | null | undefined): boolean {
  const v = (text ?? "").trim();
  if (v.length < (MIN_LENGTH[kind] ?? 12)) return false;
  // A slot filled to satisfy the validator rather than to answer.
  if (/^[a-z0-9\W]{1,3}$/i.test(v)) return false;
  return true;
}

/** Read `thing_1 … thing_n` back out in order, skipping anything empty. */
export function readSlots<T>(out: Record<string, unknown>, prefix: string, n: number): T[] {
  const rows: T[] = [];
  for (let i = 1; i <= n; i++) {
    const v = out[`${prefix}_${i}`];
    if (v == null) continue;
    if (typeof v === "string" && !v.trim()) continue;
    rows.push(v as T);
  }
  return rows;
}

export const HOOK_FORMATS = [
  "to_camera", "stitch", "cold_open", "flash_forward", "anticipation",
] as const;

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const BRIEF = {
  type: "object",
  additionalProperties: false,
  properties: {
    audience: { type: "string" },
    phase: { type: "string", description: "Phase name from the supplied list" },
    developmental_task: { type: "string", description: "That phase's task, from the list. Never invented." },
    competencies: { type: "array", items: { type: "string" }, description: "Codes from the supplied list only" },
    core_struggle: { type: "string" },
    core_lesson: { type: "string", description: "Never said out loud in the hook" },
    mistaken_interpretation: { type: "string" },
    viewer_realization: { type: "string" },
    transformation: { type: "string" },
  },
  required: ["audience", "phase", "developmental_task", "core_struggle", "core_lesson"],
} as const;

const HOOK_ITEM = {
  type: "object",
  additionalProperties: false,
  properties: {
    technique: { type: "string", description: "Plain name for the way in. Not from a fixed list." },
    format: { type: "string", enum: HOOK_FORMATS as unknown as string[] },
    line: { type: "string", description: "What she says. Spoken, contractions, no em dashes." },
    on_screen: { type: "string", description: "What is on screen. For a stitch, which clip." },
    why: { type: "string", description: "What makes somebody stop or argue." },
  },
  required: ["technique", "format", "line", "why"],
} as const;

const BODY_ITEM = {
  type: "object",
  additionalProperties: false,
  properties: {
    technique: { type: "string" },
    content: { type: "string", description: "The body only. Do not repeat the hook." },
  },
  required: ["technique", "content"],
} as const;

const CTA_ITEM = {
  type: "object",
  additionalProperties: false,
  properties: {
    family: { type: "string" },
    content: { type: "string" },
  },
  required: ["family", "content"],
} as const;

const DIRECTION_ITEM = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", description: "Three or four words. What this take is." },
    angle: { type: "string", description: "Two or three sentences in her voice: what this one argues and where it lands." },
    why_different: { type: "string", description: "One sentence on what this one does that the others do not." },
  },
  required: ["label", "angle", "why_different"],
} as const;

const VARIATION_ITEM = {
  type: "object",
  additionalProperties: false,
  properties: {
    approach: { type: "string", description: "Plain name for what makes this one different. Two or three words." },
    hook_format: { type: "string", enum: HOOK_FORMATS as unknown as string[] },
    on_screen: { type: "string", description: "What is on screen at the top. For a stitch, which clip." },
    script: { type: "string", description: "The whole thing: opening through call to action, as one spoken piece." },
  },
  required: ["approach", "hook_format", "script"],
} as const;

export const STAGE_SCHEMAS: Record<Stage, object> = {
  read: {
    type: "object",
    additionalProperties: false,
    properties: {
      readback: {
        type: "string",
        description: "Two or three sentences. What she seems to be saying, in plain language, no jargon.",
      },
      ...slots("direction", STAGE_LIMITS.read, DIRECTION_ITEM).properties,
    },
    required: ["readback", ...slots("direction", STAGE_LIMITS.read, DIRECTION_ITEM).required],
  },

  variations: {
    type: "object",
    additionalProperties: false,
    properties: {
      brief: BRIEF,
      ...slots("variation", STAGE_LIMITS.variations, VARIATION_ITEM).properties,
    },
    required: ["brief", ...slots("variation", STAGE_LIMITS.variations, VARIATION_ITEM).required],
  },

  tighten: {
    type: "object",
    additionalProperties: false,
    properties: {
      script: { type: "string" },
      cut_notes: { type: "string", description: "What came out and why, in one or two sentences." },
    },
    required: ["script", "cut_notes"],
  },

  hooks: {
    type: "object",
    additionalProperties: false,
    properties: {
      brief: BRIEF,
      ...slots("hook", STAGE_LIMITS.hooks, HOOK_ITEM).properties,
    },
    required: ["brief", ...slots("hook", STAGE_LIMITS.hooks, HOOK_ITEM).required],
  },

  bodies: {
    type: "object",
    additionalProperties: false,
    properties: {
      ...slots("body", STAGE_LIMITS.bodies, BODY_ITEM).properties,
      strongest_lines: { type: "array", items: { type: "string" } },
    },
    required: slots("body", STAGE_LIMITS.bodies, BODY_ITEM).required,
  },

  close: {
    type: "object",
    additionalProperties: false,
    properties: {
      ...slots("resolution", STAGE_LIMITS.close, { type: "string" }).properties,
      ...slots("cta", STAGE_LIMITS.close, CTA_ITEM).properties,
    },
    required: [
      ...slots("resolution", STAGE_LIMITS.close, { type: "string" }).required,
      ...slots("cta", STAGE_LIMITS.close, CTA_ITEM).required,
    ],
  },

  assemble: {
    type: "object",
    additionalProperties: false,
    properties: {
      script: { type: "string", description: "Hook, body, resolution, CTA as one spoken piece. Line breaks are breathing points." },
      seconds_est: { type: "number" },
      review: {
        type: "object",
        additionalProperties: false,
        properties: {
          hook_opens_a_loop: { type: "boolean" },
          lesson_arrives_late: { type: "boolean" },
          no_diagnosis_of_the_man: { type: "boolean" },
          cta_names_the_transformation: { type: "boolean" },
          contractions_throughout: { type: "boolean" },
          concerns: { type: "array", items: { type: "string" }, description: "Empty if there are none. Do not invent one." },
        },
        required: ["hook_opens_a_loop", "lesson_arrives_late", "no_diagnosis_of_the_man",
                   "cta_names_the_transformation", "contractions_throughout", "concerns"],
      },
    },
    // The review is required. Optional means it does not happen: the first
    // assembled script came back with review {} and nothing noticed.
    required: ["script", "review"],
  },
};

// ---------------------------------------------------------------------------
// User templates
// ---------------------------------------------------------------------------

export const STAGE_TEMPLATES: Record<Stage, string> = {
  read: `What she wrote:
{{topic}}

What she saw, if she pasted anything:
{{source}}

Phases and their developmental tasks (use only these):
{{phases}}

Competencies (use only these codes):
{{competencies}}

Two jobs, and no writing yet.

First, say back what you think she's getting at. Two or three sentences, plain,
in the way she'd say it. Reflect the argument rather than tidying it into
something more general. If the mechanism she named is what makes it interesting,
keep the mechanism. If you're inferring rather than repeating, say so.

Then give her three ways this could go: direction_1, direction_2, direction_3.

They have to be genuinely different pieces, not three phrasings of one. Different
target, different argument, or a different thing being separated out. If two of
them would produce the same script, replace one.

No hooks, no scripts, no format talk, and don't mention a phase or a competency
by name. She's deciding what the piece is about, not how it's built.`,

  variations: `What she saw:
{{source}}

Her note on it:
{{topic}}

What this one points people to:
{{offer}}

The direction she chose:
{{chosen_direction}}

Where it's going:
{{platform}}

What she's asked for:
{{direction}}

Phases and their developmental tasks (use only these):
{{phases}}

Competencies (use only these codes):
{{competencies}}

Work out the brief first, privately. Then write three complete scripts of it:
variation_1, variation_2, variation_3.

Each one stands on its own, and reads start to finish as something to shoot. No
headings, no labels, no stage directions inside it.

Break the lines where she'd breathe. Short beats on their own line, a blank line
between thoughts. Never one solid paragraph, however short the piece is.

End the way the ending rule says. If nothing was supplied above, land the
insight and stop. Do not invent an offer and do not add "follow me for more" to
have something there.

Same lesson in all three. What changes is the way in and the shape: a different
opening, a different route through the middle, a different place it lands. One
of them should have no list in it at all and get there through the story.

Forty-five to seventy-five seconds each, which is about one hundred and twenty
to one hundred and ninety words. Count as you go. Do not run long.

The exception is satire. If she asked for satire, follow that skeleton exactly,
all ten items, and let it run as long as it runs.`,

  tighten: `The script:
{{script}}

It runs about {{seconds}} seconds. Bring it to {{target}}.

Cut, do not rewrite. Her lines stay her lines. Take out the sentence that
repeats a point already made, the second example where one was enough, and the
throat-clearing between the opening and the first real question.

Do not cut the specific detail that makes a line land, and do not cut the call
to action. If the only way to hit the target is to lose something that matters,
get as close as you can and say what you would have had to lose.

Then say plainly what came out.`,

  hooks: `What she saw:
{{source}}

Her note on it:
{{topic}}

What this one points people to:
{{offer}}

The direction she chose:
{{chosen_direction}}

Where it's going:
{{platform}}

What she's asked for:
{{direction}}

Phases and their developmental tasks (use only these):
{{phases}}

Competencies (use only these codes):
{{competencies}}

Work out the brief first, privately, then fill hook_1 through hook_8.

Vary the format. At least three should not be to-camera. If a clip was supplied,
at least two should stitch it. Do not write eight versions of one sentence, and
do not give away the lesson in any of them.`,

  bodies: `What she saw:
{{source}}

The brief:
{{brief}}

The hook she picked, which is now fixed:
{{hook}}

What she's asked for:
{{direction}}

Fill body_1 through body_5. Each one teaches the same lesson a different way. Do not repeat the hook at the top of them.

Vary the shape, not just the words. Not every one gets a numbered list. At least
one should have no list at all and get there through the story. Let the lengths
differ.

Then pull out the individual lines worth keeping, wherever they came from.`,

  close: `The brief:
{{brief}}

The hook:
{{hook}}

The body she picked:
{{body}}

What this one points people to:
{{offer}}

Fill resolution_1 through resolution_5 with closing lines that finish what the
hook opened.

Then cta_1 through cta_5, each from a different angle, pointing at what was
supplied above. If nothing was supplied, or what was supplied does not fit who
is watching, write five different ways to land the piece and stop instead. Do
not invent something to sell.

The closes should sound like she arrived there, not like she wrote them first.`,

  assemble: `The hook:
{{hook}}

The body:
{{body}}

The close:
{{resolution}}

The CTA:
{{cta}}

Put these together as one spoken script.

These are her selections. Keep her wording. Your job is the seams: make it sound
like one continuous thought instead of four pieces stacked up. Add or cut a
connecting line where the joins show. Do not rewrite what she chose, and do not
add a new lesson.`,
};
