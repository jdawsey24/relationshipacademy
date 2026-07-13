import Anthropic from "@anthropic-ai/sdk";

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
}

export interface GenerateResult {
  output: unknown;       // parsed JSON matching the schema
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
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
    const res = await client.messages.create({
      model: opts.model,
      max_tokens: opts.maxTokens,
      system: opts.system,
      messages: [{ role: "user", content: opts.user }],
      output_config: { format: { type: "json_schema", schema: opts.schema } },
    } as Anthropic.MessageCreateParamsNonStreaming);
    const text = res.content.find((b): b is Anthropic.TextBlock => b.type === "text")?.text;
    if (!text) throw new Error("Empty model response");
    return {
      output: JSON.parse(text),
      provider: this.name,
      model: opts.model,
      inputTokens: res.usage?.input_tokens ?? 0,
      outputTokens: res.usage?.output_tokens ?? 0,
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
    default: return new UnavailableProvider(name);
  }
}
