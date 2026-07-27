import { NextResponse } from "next/server";
import { getMember } from "@/lib/academyAuth";
import { readJsonBody } from "@/lib/apiSecurity";
import { getPlaybookContent } from "@/content/playbook";
import { ownsPlaybook, loadProgress, saveProgress } from "@/lib/playbook/progress";
import { emptyProgress, type PlaybookProgress, type PlayStateValue, type StoredOutput, type SavedPlayCard } from "@/lib/playbook/contentSchema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATES: PlayStateValue[] = ["available", "explored", "in_my_plays", "used"];

async function gate(keyParam: string) {
  const member = await getMember();
  if (!member) return { error: NextResponse.json({ error: "Sign in required." }, { status: 401 }) };
  const content = getPlaybookContent(keyParam);
  if (!content) return { error: NextResponse.json({ error: "No interactive playbook for that key." }, { status: 404 }) };
  const owns = await ownsPlaybook(member.user.id, keyParam);
  if (!owns) return { error: NextResponse.json({ error: "This playbook isn't in your library." }, { status: 403 }) };
  return { userId: member.user.id, content };
}

export async function GET(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const g = await gate(key);
  if (g.error) return g.error;
  const progress = await loadProgress(g.userId, key, g.content.playbookVersion);
  return NextResponse.json(progress);
}

export async function PUT(request: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const g = await gate(key);
  if (g.error) return g.error;

  const body = (await readJsonBody(request).catch(() => null)) as Partial<PlaybookProgress> | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Bad body." }, { status: 400 });
  }

  // Sanitize: user_id + playbook_key + playbook_version are authoritative here,
  // never trusted from the client. Functional data only.
  const sanitized: PlaybookProgress = {
    ...emptyProgress(key, g.content.playbookVersion),
    recognized: Array.isArray(body.recognized) ? body.recognized.filter((x): x is string => typeof x === "string").slice(0, 100) : [],
    play_states: sanitizeStates(body.play_states),
    outputs: sanitizeOutputs(body.outputs),
    my_plays: sanitizeMyPlays(body.my_plays),
  };

  await saveProgress(g.userId, key, sanitized);
  return NextResponse.json({ ok: true });
}

function sanitizeStates(v: unknown): Record<string, PlayStateValue> {
  const out: Record<string, PlayStateValue> = {};
  if (v && typeof v === "object") {
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      if (typeof val === "string" && (STATES as string[]).includes(val)) out[k] = val as PlayStateValue;
    }
  }
  return out;
}

function sanitizeOutputs(v: unknown): Record<string, StoredOutput> {
  const out: Record<string, StoredOutput> = {};
  if (v && typeof v === "object") {
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      const o = val as Partial<StoredOutput> | null;
      if (o && typeof o === "object" && o.payload && typeof o.payload === "object") {
        out[k] = {
          output_schema_version: Number(o.output_schema_version) || 1,
          play_version: Number(o.play_version) || 1,
          payload: o.payload as Record<string, unknown>,
        };
      }
    }
  }
  return out;
}

function sanitizeMyPlays(v: unknown): SavedPlayCard[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((c): c is SavedPlayCard => Boolean(c) && typeof c === "object" && typeof (c as SavedPlayCard).play_id === "string")
    .slice(0, 50)
    .map((c) => ({
      play_id: String(c.play_id),
      play_version: Number(c.play_version) || 1,
      name: String(c.name ?? ""),
      when: String(c.when ?? ""),
      move: String(c.move ?? ""),
      lookingFor: String(c.lookingFor ?? ""),
      watchOut: String(c.watchOut ?? ""),
      remember: String(c.remember ?? ""),
    }));
}
