import { getSupabaseAdminClient } from "@/lib/supabase";

// Full-relationship mapping validation (owner ruling 2026-08-06).
//
// "Does this competency_id exist?" is not enough. A real id paired with the
// wrong phase or the wrong domain is an INVALID mapping that would produce
// confidently wrong content, and the foreign key cannot express that constraint
// because each column is individually valid.
//
// What must hold together:
//   competency_id  exists in fw_competencies (canonical core record)
//   framework_stat that construct is canonical, not provisional
//   phase          the phase on that competency's own canonical row
//   developmental  the task belonging to that phase
//   domain         the domain on that competency's own canonical row
//   source record  a canonical narrative row exists for the competency
//   source status  that record is active
//
// WHAT THIS DOES *NOT* CHECK. `record_status` is editorial state — whether the
// detail record is finished — and it does not gate anything here. Nor does this
// decide publication: that is per-source use approval (ce_source_use_approvals).
// A validated mapping means "this is the right competency", not "this may ship".
//
// COVERAGE IS READ FROM THE DATA, NEVER HARDCODED. Knowledge Base v2.4 added 44
// canonical Recovery and Renewal competencies, so the earlier assumption that
// those two phases have none is now false. The check below asks Postgres which
// phases actually carry canonical competencies, so the next KB revision cannot
// silently invalidate it.

export interface MappingInput {
  competency_id: string;
  phase_id?: string | null;
  domain_id?: string | null;
}

export interface MappingValidation {
  valid: boolean;
  errors: string[];
  resolved: {
    competency_id: string | null;
    competency_name: string | null;
    framework_status: string | null;
    phase_id: string | null;
    phase_name: string | null;
    developmental_task: string | null;
    domain_id: string | null;
    domain_name: string | null;
    source_record: string | null;
    source_status: string | null;
  };
}

const empty: MappingValidation["resolved"] = {
  competency_id: null, competency_name: null, framework_status: null,
  phase_id: null, phase_name: null,
  developmental_task: null, domain_id: null, domain_name: null,
  source_record: null, source_status: null,
};

/**
 * The phase and domain a competency canonically belongs to.
 *
 * The Content Studio needs this because the model there names a COMPETENCY and
 * nothing else. Deriving the placement from canon is stronger than asking for it
 * and checking the answer: a wrong placement stops being detectable and becomes
 * unrepresentable. Nothing can propose Self-Trust under Exploration, because
 * nothing gets to propose a phase at all.
 *
 * This does not relax validateMapping. Callers that DO assert a phase — the
 * Content Engine bridge path — keep the cross-phase check as their defence, and
 * the derived pair is still put through the full validation, which can still
 * fail on canonical status, developmental task, or the source record.
 *
 * Returns nulls when the competency is unknown, so validateMapping reports the
 * missing competency rather than this returning a confident empty placement.
 */
export async function canonicalPlacement(competencyId: string): Promise<{
  phase_id: string | null;
  domain_id: string | null;
}> {
  const s = getSupabaseAdminClient();
  const { data: comp } = await s
    .from("fw_competencies").select("phase, domain")
    .eq("competency_id", competencyId).maybeSingle();
  const c = comp as { phase: string; domain: string } | null;
  if (!c) return { phase_id: null, domain_id: null };

  const [{ data: phase }, { data: domain }] = await Promise.all([
    s.from("fw_phases").select("phase_id").ilike("name", c.phase).maybeSingle(),
    s.from("fw_domains").select("domain_id").ilike("name", c.domain).maybeSingle(),
  ]);
  return {
    phase_id: (phase as { phase_id: string } | null)?.phase_id ?? null,
    domain_id: (domain as { domain_id: string } | null)?.domain_id ?? null,
  };
}

/**
 * Validate the whole relationship, not one field at a time. Returns every error
 * found rather than the first, so a reviewer sees the full picture in one pass.
 */
export async function validateMapping(input: MappingInput): Promise<MappingValidation> {
  const s = getSupabaseAdminClient();
  const errors: string[] = [];
  const resolved = { ...empty };

  // --- 1. The competency must exist in canon --------------------------------
  const { data: comp } = await s
    .from("fw_competencies")
    .select("competency_id, name, phase, domain, developmental_task, framework_status")
    .eq("competency_id", input.competency_id)
    .maybeSingle();

  if (!comp) {
    errors.push(`"${input.competency_id}" is not a canonical competency.`);
    return { valid: false, errors, resolved };
  }

  const c = comp as {
    competency_id: string; name: string; phase: string; domain: string;
    developmental_task: string | null; framework_status: string | null;
  };
  resolved.competency_id = c.competency_id;
  resolved.competency_name = c.name;
  resolved.framework_status = c.framework_status ?? null;

  if (c.framework_status && c.framework_status !== "canonical") {
    errors.push(
      `${c.competency_id} carries framework_status "${c.framework_status}". Only canonical constructs can be mapped.`,
    );
  }

  // --- 2. The phase must be the competency's OWN phase -----------------------
  if (input.phase_id) {
    const { data: phase } = await s
      .from("fw_phases").select("phase_id, name, developmental_task")
      .eq("phase_id", input.phase_id).maybeSingle();

    if (!phase) {
      errors.push(`Phase "${input.phase_id}" does not exist.`);
    } else {
      const p = phase as { phase_id: string; name: string; developmental_task: string };
      resolved.phase_id = p.phase_id;
      resolved.phase_name = p.name;
      resolved.developmental_task = p.developmental_task;

      if (p.name.toLowerCase() !== c.phase.toLowerCase()) {
        // The failure the owner named: a real competency under the wrong phase.
        errors.push(
          `Cross-phase mapping: ${c.competency_id} belongs to ${c.phase}, but the bridge claims ${p.name}.`,
        );
      }
      // Asked of the data, not of a constant, so a KB revision that adds or
      // removes a phase's competencies is picked up without a code change.
      const { count: phaseCompetencies } = await s
        .from("fw_competencies")
        .select("competency_id", { count: "exact", head: true })
        .eq("phase", p.name)
        .eq("framework_status", "canonical");

      if (!phaseCompetencies) {
        errors.push(
          `${p.name} has no canonical competencies, so no competency can be mapped to it. Use an approved phase or leave the mapping open.`,
        );
      }
      if (p.developmental_task && c.developmental_task &&
          p.developmental_task.toLowerCase() !== c.developmental_task.toLowerCase()) {
        errors.push(
          `Developmental task mismatch: ${c.competency_id} carries "${c.developmental_task}", ${p.name} requires "${p.developmental_task}".`,
        );
      }
    }
  } else {
    errors.push("No phase was supplied. A mapping needs phase, domain and competency together.");
  }

  // --- 3. The domain must be the competency's OWN domain ---------------------
  if (input.domain_id) {
    const { data: domain } = await s
      .from("fw_domains").select("domain_id, name").eq("domain_id", input.domain_id).maybeSingle();

    if (!domain) {
      errors.push(`Domain "${input.domain_id}" does not exist.`);
    } else {
      const d = domain as { domain_id: string; name: string };
      resolved.domain_id = d.domain_id;
      resolved.domain_name = d.name;
      if (d.name.toLowerCase() !== c.domain.toLowerCase()) {
        errors.push(
          `Cross-domain mapping: ${c.competency_id} belongs to ${c.domain}, but the bridge claims ${d.name}.`,
        );
      }
    }
  } else {
    errors.push("No domain was supplied. A mapping needs phase, domain and competency together.");
  }

  // --- 4. An approved source record must exist and be active -----------------
  const { data: kb } = await s
    .from("kb_competencies")
    .select("code, status")
    .eq("code", input.competency_id)
    .eq("kind", "competency")
    .maybeSingle();

  if (!kb) {
    // Expected for the 44 Recovery/Renewal competencies until the kb_competencies
    // narrative layer is imported from v2.4 — a separate import from the one that
    // populated fw_competencies. The construct is canonical; there is simply no
    // narrative text to quote yet, so nothing can be written from it.
    errors.push(
      `No canonical narrative record exists for ${c.competency_id}; it cannot be sourced. ` +
        `(kb_competencies still holds the v2.1 narrative layer — the v2.4 narrative import is outstanding.)`,
    );
  } else {
    const k = kb as { code: string; status: string };
    resolved.source_record = k.code;
    resolved.source_status = k.status;
    if (k.status !== "active") {
      errors.push(`The source record for ${c.competency_id} is "${k.status}", not active.`);
    }
  }

  return { valid: errors.length === 0, errors, resolved };
}

/**
 * Grading gate. Weak, forced and rejected bridges are visible for review but
 * never eligible for drafting — "visible" and "accepted for use" are different
 * states. Mirrors the DB check constraint; both exist deliberately, because this
 * one produces a readable reason and the constraint is the thing that cannot be
 * bypassed.
 */
export const ELIGIBLE_STATUSES = ["strong", "moderate"] as const;

export function computeEligibility(
  status: string,
  mappingValid: boolean,
): { eligible: boolean; reason: string } {
  if (!(ELIGIBLE_STATUSES as readonly string[]).includes(status)) {
    return { eligible: false, reason: `A "${status}" bridge is visible for review but not accepted for use.` };
  }
  if (!mappingValid) {
    return { eligible: false, reason: "The framework mapping did not validate." };
  }
  return { eligible: true, reason: "Strong or moderate, with a validated mapping." };
}
