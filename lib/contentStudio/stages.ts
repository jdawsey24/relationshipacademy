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
// so counts are asked for in the prompt and enforced in code.

export const STAGES = ["hooks", "bodies", "close", "assemble"] as const;
export type Stage = (typeof STAGES)[number];

/** How many options survive to the screen. Enforced here, not hoped for. */
export const STAGE_LIMITS: Record<Stage, number> = {
  hooks: 8, bodies: 5, close: 5, assemble: 1,
};

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

export const STAGE_SCHEMAS: Record<Stage, object> = {
  hooks: {
    type: "object",
    additionalProperties: false,
    properties: {
      brief: BRIEF,
      hooks: {
        type: "array",
        items: {
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
        },
      },
    },
    required: ["brief", "hooks"],
  },

  bodies: {
    type: "object",
    additionalProperties: false,
    properties: {
      bodies: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            technique: { type: "string" },
            content: { type: "string", description: "The body only. Do not repeat the hook." },
          },
          required: ["technique", "content"],
        },
      },
      strongest_lines: { type: "array", items: { type: "string" } },
    },
    required: ["bodies"],
  },

  close: {
    type: "object",
    additionalProperties: false,
    properties: {
      resolutions: { type: "array", items: { type: "string" } },
      ctas: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            family: { type: "string" },
            content: { type: "string" },
          },
          required: ["family", "content"],
        },
      },
    },
    required: ["resolutions", "ctas"],
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
          concerns: { type: "array", items: { type: "string" } },
        },
        required: ["hook_opens_a_loop", "lesson_arrives_late", "no_diagnosis_of_the_man"],
      },
    },
    required: ["script"],
  },
};

// ---------------------------------------------------------------------------
// User templates
// ---------------------------------------------------------------------------

export const STAGE_TEMPLATES: Record<Stage, string> = {
  hooks: `What she saw:
{{source}}

Her note on it:
{{topic}}

Phases and their developmental tasks (use only these):
{{phases}}

Competencies (use only these codes):
{{competencies}}

Work out the brief first, privately, then write eight hooks.

Vary the format. At least three should not be to-camera. If a clip was supplied,
at least two should stitch it. Do not write eight versions of one sentence, and
do not give away the lesson in any of them.`,

  bodies: `What she saw:
{{source}}

The brief:
{{brief}}

The hook she picked, which is now fixed:
{{hook}}

Write five bodies for that hook. Each one teaches the same lesson a different
way. Do not repeat the hook at the top of them.

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

Write five closing lines that finish what the hook opened, and five CTAs for
Dating With Your Eyes Open from different angles.

The closes should sound like she arrived there, not like she wrote them first.
The CTAs should sound like the next sentence out of her mouth.`,

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
