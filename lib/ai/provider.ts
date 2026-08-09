import Anthropic from "@anthropic-ai/sdk";
import { RehearsalProvider } from "@/lib/ai/rehearsal";

// Provider abstraction (server-only). All provider calls happen here; API keys
// are read from server env and never exposed to the browser. Anthropic is wired;
// OpenAI + fallback are feature-flagged for a later phase, but implement the same
// interface so the orchestrator never hard-codes a provider.

export interface GenerateOpts {
  system: string;
  user: string;
  schema: object;        // JSON schema for structured output
  model: string;
  maxTokens: number;
  timeoutSeconds: number;
  /** Which stage is asking. Only rehearsal needs it, to find a sample. */
  generationType?: string;
}

export interface GenerateResult {
  output: unknown;       // parsed JSON matching the schema
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  /** Served from cache at a tenth of the input price. */
  cacheReadTokens: number;
  /** Written to cache at 1.25x. Paid once, then read cheaply. */
  cacheWriteTokens: number;
}

export interface AiProvider {
  name: string;
  configured(): boolean;
  generate(opts: GenerateOpts): Promise<GenerateResult>;
}

class AnthropicProvider implements AiProvider {
  name = "anthropic";
  configured() { return !!process.env.ANTHROPIC_API_KEY; }
  async generate(opts: GenerateOpts): Promise<GenerateResult> {
    const client = new Anthropic({ timeout: opts.timeoutSeconds * 1000 });
    // The system instruction is the stable prefix: identical on every call for
    // a given stage, and identical across stages that share a voice. Caching it
    // costs 1.25x once and 0.1x on every later read.
    //
    // Caching is a PREFIX match, so this only works because nothing volatile
    // sits in front of it. Render order is tools, then system, then messages —
    // no tools here, so the system block is the front of the prompt, and
    // everything that changes per call lives in the user message behind it.
    const res = await client.messages.create({
      model: opts.model,
      max_tokens: opts.maxTokens,
      system: [{ type: "text", text: opts.system, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: opts.user }],
      output_config: { format: { type: "json_schema", schema: opts.schema } },
    } as Anthropic.MessageCreateParamsNonStreaming);
    const text = res.content.find((b): b is Anthropic.TextBlock => b.type === "text")?.text;
    if (!text) throw new Error("Empty model response");

    // Say what happened. A response cut off at the token ceiling is not valid
    // JSON, and JSON.parse reports it as "Unterminated string at position
    // 12142", which sends you looking for a bug in the schema.
    if (res.stop_reason === "max_tokens") {
      throw new Error(
        `Response hit the ${opts.maxTokens} token ceiling and was cut off mid-JSON. ` +
        `Raise the output limit or ask for less in one call.`,
      );
    }

    let output: unknown;
    try {
      output = JSON.parse(text);
    } catch (e) {
      throw new Error(
        `Model returned unparseable JSON (stop_reason ${res.stop_reason ?? "unknown"}, ` +
        `${res.usage?.output_tokens ?? "?"} output tokens): ${(e as Error).message}`,
      );
    }

    return {
      output,
      provider: this.name,
      model: opts.model,
      // input_tokens is the UNCACHED remainder only — the total prompt is all
      // three added together, not this field.
      inputTokens: res.usage?.input_tokens ?? 0,
      outputTokens: res.usage?.output_tokens ?? 0,
      cacheReadTokens: res.usage?.cache_read_input_tokens ?? 0,
      cacheWriteTokens: res.usage?.cache_creation_input_tokens ?? 0,
    };
  }
}

// Not wired yet (feature-flagged). Present so the abstraction is real.
class UnavailableProvider implements AiProvider {
  constructor(public name: string) {}
  configured() { return false; }
  async generate(): Promise<GenerateResult> {
    throw new Error(`Provider "${this.name}" is not enabled in this build.`);
  }
}

export function getProvider(name: string): AiProvider {
  switch (name) {
    case "anthropic": return new AnthropicProvider();
    // Replays a saved response. Never reaches a network or a bill.
    case "rehearsal": return new RehearsalProvider();
    default: return new UnavailableProvider(name);
  }
}
