import { NextResponse } from "next/server";
import { requireAiOwner } from "@/lib/ai/guard";
import { getAdminUser } from "@/lib/supabaseServer";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { audit } from "@/lib/audit";
import {
  ApprovalError, AUDIENCES, PERMITTED_USES,
  recordPublicUseApproval, revokePublicUseApproval, sourceFingerprint,
  type Audience, type PermittedUse,
} from "@/lib/contentEngine/scriptBuilder/governance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public-use approvals — the only thing that makes a source publishable.
//
// Until this existed, checkPublicUse could return "not approved" and nothing
// else: the governance layer could refuse but never permit, so every draft the
// engine produced was permanently review-only. Reading half of a gate is not a
// gate.

export async function GET(request: Request) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;

  const s = getSupabaseAdminClient();
  const url = new URL(request.url);
  const phase = url.searchParams.get("phase");

  const { data: approvals, error } = await s
    .from("ce_source_use_approvals")
    .select("id, source_type, source_id, permitted_use, audience, restrictions, reviewer, reviewed_at, expires_at, status, approved_source_hash")
    .order("reviewed_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Competencies to approve against, so the screen can show what is covered and
  // what is not without the operator assembling the list themselves.
  let q = s.from("fw_competencies")
    .select("competency_id, name, phase, domain, framework_status, record_status")
    .order("competency_id");
  if (phase) q = q.eq("phase", phase);
  const { data: competencies } = await q;

  const { data: phases } = await s.from("fw_phases").select("name").order("name");

  return NextResponse.json({
    approvals: approvals ?? [],
    competencies: competencies ?? [],
    phases: (phases ?? []).map((p) => (p as { name: string }).name),
    permittedUses: PERMITTED_USES,
    audiences: AUDIENCES,
  });
}

export async function POST(request: Request) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;

  let body: {
    source_type?: string; source_id?: string;
    permitted_use?: PermittedUse[]; audience?: Audience[];
    restrictions?: string; notes?: string; expires_at?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (!body.source_type || !body.source_id) {
    return NextResponse.json({ error: "source_type and source_id are required." }, { status: 400 });
  }

  const user = await getAdminUser();
  // The reviewer is the signed-in owner, never a value from the request body —
  // an approval must record who actually approved it.
  const reviewer = user?.email ?? null;
  if (!reviewer) return NextResponse.json({ error: "Could not identify the reviewer." }, { status: 403 });

  try {
    const r = await recordPublicUseApproval({
      sourceType: body.source_type,
      sourceId: body.source_id,
      permittedUse: body.permitted_use ?? [],
      audience: body.audience ?? [],
      restrictions: body.restrictions ?? null,
      notes: body.notes ?? null,
      expiresAt: body.expires_at ?? null,
      reviewer,
    });
    await audit({
      actor: reviewer,
      action: "content_engine.public_use.approved",
      metadata: {
        source_type: body.source_type, source_id: body.source_id,
        permitted_use: body.permitted_use, audience: body.audience, hash: r.hash,
      },
    });
    return NextResponse.json(r, { status: 201 });
  } catch (e) {
    if (e instanceof ApprovalError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: "Could not record the approval." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;

  const url = new URL(request.url);
  const sourceType = url.searchParams.get("source_type");
  const sourceId = url.searchParams.get("source_id");
  if (!sourceType || !sourceId) {
    return NextResponse.json({ error: "source_type and source_id are required." }, { status: 400 });
  }

  const user = await getAdminUser();
  try {
    await revokePublicUseApproval(sourceType, sourceId, user?.email ?? "unknown");
    await audit({
      actor: user?.email ?? null,
      action: "content_engine.public_use.revoked",
      metadata: { source_type: sourceType, source_id: sourceId },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof ApprovalError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: "Could not revoke." }, { status: 500 });
  }
}

/** Preview what would be approved, so a reviewer sees the content first. */
export async function PATCH(request: Request) {
  const auth = await requireAiOwner();
  if (auth instanceof NextResponse) return auth;
  let body: { source_type?: string; source_id?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }); }
  if (!body.source_type || !body.source_id) {
    return NextResponse.json({ error: "source_type and source_id are required." }, { status: 400 });
  }
  const fp = await sourceFingerprint(body.source_type, body.source_id);
  if (!fp) return NextResponse.json({ error: "Source not found." }, { status: 404 });
  return NextResponse.json({ hash: fp.hash, version: fp.version, snapshot: fp.snapshot });
}
