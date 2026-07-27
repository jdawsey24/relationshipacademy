// Rev 3 feature isolation flag.
//
// Rev 3 (the five-object guided-change experience) is built behind this flag so
// the deployed v0 Playbook is not destabilized while Rev 3 is implemented and
// reviewed. OFF by default; the v0 delivery path never reads it. Mirrors the
// `COMPANION_ENABLED` convention (lib/companion.ts).
//
// Owner gates preserved: enabling this flag does NOT run the `playbook_events`
// migration and does NOT deploy — both remain explicit, separate owner actions.

export const PLAYBOOK_REV3_ENABLED = process.env.NEXT_PUBLIC_PLAYBOOK_REV3 === "true";
