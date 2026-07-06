import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { readJsonBody } from "@/lib/apiSecurity";
import {
  computeAlignment,
  computeCompetencyPhaseScores,
  computeDomainScores,
  computeExpirationRisk,
  EXPIRATION_STRUCTURAL_SLUG,
} from "@/lib/scoring";
import type {
  CompetencyPhase,
  Domain,
  Question,
  ResultLevel,
  RiskLevel,
  ScoreRequest,
  ScoreResponse,
  ScoreRequestResponse,
} from "@/types/assessment";

// This route writes to Supabase with the service role key, so it must run in
// the Node.js runtime (not the Edge runtime) and never be statically cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_QUIZ_TYPES = new Set(["snapshot", "profile"]);

function badRequest(message: string, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status: 400 });
}

/** Validate the request body shape and return a typed ScoreRequest or an error message. */
function parseRequest(body: unknown): { ok: true; data: ScoreRequest } | { ok: false; message: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, message: "Request body must be a JSON object." };
  }
  const b = body as Record<string, unknown>;

  if (typeof b.session_id !== "string" || b.session_id.length === 0) {
    return { ok: false, message: "session_id is required." };
  }
  if (typeof b.quiz_type !== "string" || !VALID_QUIZ_TYPES.has(b.quiz_type)) {
    return { ok: false, message: "quiz_type must be 'snapshot' or 'profile'." };
  }
  if (typeof b.structural_phase_slug !== "string") {
    return { ok: false, message: "structural_phase_slug is required." };
  }
  if (!Array.isArray(b.responses) || b.responses.length === 0) {
    return { ok: false, message: "responses must be a non-empty array." };
  }

  const responses: ScoreRequestResponse[] = [];
  for (const r of b.responses) {
    if (typeof r !== "object" || r === null) {
      return { ok: false, message: "Each response must be an object." };
    }
    const rr = r as Record<string, unknown>;
    if (typeof rr.question_id !== "string") {
      return { ok: false, message: "Each response needs a string question_id." };
    }
    if (
      typeof rr.raw_response !== "number" ||
      !Number.isFinite(rr.raw_response) ||
      rr.raw_response < 1 ||
      rr.raw_response > 5
    ) {
      return {
        ok: false,
        message: `raw_response for ${rr.question_id} must be a number 1–5.`,
      };
    }
    responses.push({ question_id: rr.question_id, raw_response: rr.raw_response });
  }

  return {
    ok: true,
    data: {
      session_id: b.session_id,
      quiz_type: b.quiz_type as ScoreRequest["quiz_type"],
      name: typeof b.name === "string" ? b.name : "",
      email: typeof b.email === "string" ? b.email : "",
      relationship_length:
        typeof b.relationship_length === "string" ? b.relationship_length : "",
      relationship_status_detail:
        typeof b.relationship_status_detail === "string"
          ? b.relationship_status_detail
          : "",
      structural_phase_slug:
        b.structural_phase_slug as ScoreRequest["structural_phase_slug"],
      responses,
    },
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await readJsonBody(request); // 100 KB cap — blocks oversized payloads
  } catch {
    return badRequest("Invalid JSON body.");
  }

  const parsed = parseRequest(body);
  if (!parsed.ok) return badRequest(parsed.message);
  const req = parsed.data;

  let supabase;
  try {
    supabase = getSupabaseAdminClient();
  } catch (e) {
    return NextResponse.json(
      { error: "Server misconfigured: Supabase credentials missing." },
      { status: 500 }
    );
  }

  // --- Load reference data -------------------------------------------------
  const [
    questionsRes,
    domainsRes,
    competencyPhasesRes,
    structuralPhasesRes,
    resultLevelsRes,
    riskLevelsRes,
    assessmentVersionsRes,
  ] = await Promise.all([
    supabase
      .from("questions")
      .select("id, score_direction, domain_id, competency_phase_id, in_snapshot, in_profile"),
    supabase.from("domains").select("id, slug, name"),
    supabase.from("competency_phases").select("id, slug, measure_type, name"),
    supabase.from("structural_phases").select("id, slug, name"),
    supabase
      .from("result_levels")
      .select("id, domain_id, level, title, score_min, score_max"),
    supabase.from("risk_levels").select("id, risk_level, title, score_min, score_max"),
    supabase
      .from("assessment_versions")
      .select("id, active_from, active_to"),
  ]);

  const refError =
    questionsRes.error ||
    domainsRes.error ||
    competencyPhasesRes.error ||
    structuralPhasesRes.error ||
    resultLevelsRes.error ||
    riskLevelsRes.error ||
    assessmentVersionsRes.error;
  if (refError) {
    return NextResponse.json(
      { error: "Failed to load reference data." },
      { status: 502 }
    );
  }

  const questions = (questionsRes.data ?? []) as Question[];
  const domains = (domainsRes.data ?? []) as Domain[];
  const competencyPhases = (competencyPhasesRes.data ?? []) as CompetencyPhase[];
  const structuralPhases = (structuralPhasesRes.data ?? []) as {
    id: string;
    slug: string;
  }[];
  const resultLevels = (resultLevelsRes.data ?? []) as ResultLevel[];
  const riskLevels = (riskLevelsRes.data ?? []) as RiskLevel[];
  const assessmentVersions = (assessmentVersionsRes.data ?? []) as {
    id: string;
    active_from: string | null;
    active_to: string | null;
  }[];

  // The active version has no active_to; fall back to the only/first row.
  const activeVersion =
    assessmentVersions.find((v) => v.active_to === null) ?? assessmentVersions[0];
  if (!activeVersion) {
    return NextResponse.json(
      { error: "No assessment version configured." },
      { status: 502 }
    );
  }

  // --- Compute (pure) ------------------------------------------------------
  const domainScores = computeDomainScores(
    req.responses,
    questions,
    domains,
    resultLevels
  );
  const competencyPhaseScores = computeCompetencyPhaseScores(
    req.responses,
    questions,
    competencyPhases,
    resultLevels
  );
  const expirationRisk = computeExpirationRisk(
    req.responses,
    questions,
    competencyPhases,
    riskLevels
  );
  const alignment = computeAlignment(
    req.structural_phase_slug,
    competencyPhaseScores
  );

  // --- Persist -------------------------------------------------------------
  // The schema has no DB-side defaults for id / timestamp columns, so the API
  // supplies them explicitly. `now` timestamps every row written this request.
  const now = new Date().toISOString();

  const structuralPhase = structuralPhases.find(
    (p) => p.slug === req.structural_phase_slug
  );
  if (!structuralPhase) {
    return badRequest(
      `Unknown structural_phase_slug '${req.structural_phase_slug}'.`
    );
  }

  // Parent session first (upsert so re-scoring the same session is idempotent).
  const { error: sessionError } = await supabase
    .from("quiz_sessions")
    .upsert(
      {
        id: req.session_id,
        assessment_version_id: activeVersion.id,
        quiz_type: req.quiz_type,
        name: req.name,
        email: req.email,
        relationship_length: req.relationship_length,
        relationship_status_detail: req.relationship_status_detail,
        started_at: now,
        completed_at: now,
      },
      { onConflict: "id" }
    );
  if (sessionError) {
    return NextResponse.json(
      { error: "Failed to write quiz_sessions." },
      { status: 502 }
    );
  }

  // Structural phase self-selection. No unique constraint on session_id, so
  // delete-then-insert rather than upsert (keeps re-scoring idempotent).
  await supabase
    .from("structural_phase_selection")
    .delete()
    .eq("session_id", req.session_id);
  const { error: structuralSelError } = await supabase
    .from("structural_phase_selection")
    .insert({
      id: randomUUID(),
      session_id: req.session_id,
      structural_phase_id: structuralPhase.id,
      selected_at: now,
    });
  if (structuralSelError) {
    return NextResponse.json(
      {
        error: "Failed to write structural_phase_selection.",
      },
      { status: 502 }
    );
  }

  // Raw responses — one row per answered item.
  const questionsById = new Map(questions.map((q) => [q.id, q]));
  const responseRows = req.responses
    .filter((r) => questionsById.has(r.question_id))
    .map((r) => {
      const q = questionsById.get(r.question_id)!;
      const scored =
        q.score_direction === "reverse" ? 6 - r.raw_response : r.raw_response;
      return {
        id: randomUUID(),
        session_id: req.session_id,
        question_id: r.question_id,
        raw_response: r.raw_response,
        scored_value: scored,
        created_at: now,
      };
    });

  // Replace any prior responses for this session, then insert fresh ones.
  await supabase.from("quiz_responses").delete().eq("session_id", req.session_id);
  if (responseRows.length > 0) {
    const { error: responsesError } = await supabase
      .from("quiz_responses")
      .insert(responseRows);
    if (responsesError) {
      return NextResponse.json(
        {
          error: "Failed to write quiz_responses.",
        },
        { status: 502 }
      );
    }
  }

  // Domain scores.
  await supabase.from("domain_scores").delete().eq("session_id", req.session_id);
  if (domainScores.length > 0) {
    const { error } = await supabase.from("domain_scores").insert(
      domainScores.map((d) => ({
        id: randomUUID(),
        session_id: req.session_id,
        domain_id: d.domain_id,
        average_score: d.average_score,
        result_level_id: d.result_level_id,
        created_at: now,
      }))
    );
    if (error) {
      return NextResponse.json(
        { error: "Failed to write domain_scores." },
        { status: 502 }
      );
    }
  }

  // Competency phase scores (competency phases ONLY).
  await supabase
    .from("competency_phase_scores")
    .delete()
    .eq("session_id", req.session_id);
  if (competencyPhaseScores.length > 0) {
    const { error } = await supabase.from("competency_phase_scores").insert(
      competencyPhaseScores.map((c) => ({
        id: randomUUID(),
        session_id: req.session_id,
        competency_phase_id: c.competency_phase_id,
        average_score: c.average_score,
        result_level_id: c.result_level_id,
        created_at: now,
      }))
    );
    if (error) {
      return NextResponse.json(
        {
          error: "Failed to write competency_phase_scores.",
        },
        { status: 502 }
      );
    }
  }

  // Expiration risk (separate table, separate language).
  await supabase
    .from("expiration_risk_results")
    .delete()
    .eq("session_id", req.session_id);
  if (expirationRisk) {
    const { error } = await supabase.from("expiration_risk_results").insert({
      id: randomUUID(),
      session_id: req.session_id,
      average_score: expirationRisk.average_score,
      risk_level_id: expirationRisk.risk_level_id,
      created_at: now,
    });
    if (error) {
      return NextResponse.json(
        {
          error: "Failed to write expiration_risk_results.",
        },
        { status: 502 }
      );
    }
  }

  // Alignment — only when structural phase is a competency phase.
  await supabase
    .from("alignment_results")
    .delete()
    .eq("session_id", req.session_id);
  if (alignment && req.structural_phase_slug !== EXPIRATION_STRUCTURAL_SLUG) {
    const { error } = await supabase.from("alignment_results").insert({
      id: randomUUID(),
      session_id: req.session_id,
      structural_phase_id: structuralPhase.id,
      matching_competency_phase_id: alignment.matching_competency_phase_id,
      alignment_status: alignment.alignment_status,
      interpretation_text: alignment.interpretation_text,
      created_at: now,
    });
    if (error) {
      return NextResponse.json(
        { error: "Failed to write alignment_results." },
        { status: 502 }
      );
    }
  }

  // --- Respond -------------------------------------------------------------
  const responseBody: ScoreResponse = {
    session_id: req.session_id,
    domain_scores: domainScores,
    competency_phase_scores: competencyPhaseScores,
    expiration_risk: expirationRisk
      ? {
          average_score: expirationRisk.average_score,
          risk_level: expirationRisk.risk_level,
        }
      : null,
    alignment: alignment
      ? {
          status: alignment.alignment_status,
          structural_phase: alignment.structural_phase,
        }
      : null,
    quiz_type: req.quiz_type,
  };

  return NextResponse.json(responseBody, { status: 200 });
}
