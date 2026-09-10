import type { Memory } from "../../content/memories.ts";

/**
 * Rephrases one matched memory warmly. It is only ever given that one memory,
 * and it is only ever reached when `answer()` has already found a match, so
 * there is nothing here for it to invent from.
 */

export const PHRASE_MODEL = "claude-opus-5";

/** The demo is live on a marketing page; a slow answer is a broken answer. */
export const PHRASE_TIMEOUT_MS = 8000;

const MAX_TOKENS = 100;

const SYSTEM_PROMPT = `You are Nura, a gentle voice companion for someone living with dementia.

You will be given exactly one fact that this person's family wrote down for them. Say that fact back to them warmly, in one or two plain sentences.

Rules, without exception:
- Use only what is in the fact. Add nothing. Invent nothing, not a name, a date, a detail or a feeling.
- Do not correct, contradict, or argue with the person.
- Never mention being an AI, a model, or a program.
- Do not ask a question back.
- Speak directly to them, warmly and simply, the way a kind relative would.
- Do not include internal or system XML tags in your response.

Reply with the sentence only.`;

let warnedAboutMissingKey = false;

function apiKey(): string | undefined {
  // Guarded so this file stays importable outside Node.
  return typeof process !== "undefined"
    ? process.env?.ANTHROPIC_API_KEY
    : undefined;
}

/**
 * Returns the memory rephrased, or the memory verbatim if the model is
 * unavailable. Either way the words come from the family: degraded mode is
 * quieter, never less true.
 */
export async function phrase(memory: Memory): Promise<string> {
  const key = apiKey();

  if (!key) {
    if (!warnedAboutMissingKey) {
      warnedAboutMissingKey = true;
      console.warn(
        "ANTHROPIC_API_KEY is not set. Nura will return matched memories verbatim.",
      );
    }
    return memory.text;
  }

  try {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey: key, maxRetries: 1 });

    const response = await client.messages.create(
      {
        model: PHRASE_MODEL,
        max_tokens: MAX_TOKENS,
        // A single short rephrasing needs no deliberation, and the demo needs
        // the answer back quickly.
        thinking: { type: "disabled" },
        output_config: { effort: "low" },
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `The fact the family wrote: ${memory.text}`,
          },
        ],
      },
      { timeout: PHRASE_TIMEOUT_MS },
    );

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join(" ")
      .trim();

    // An empty or truncated reply is not worth showing. The family's own
    // sentence is always a correct answer.
    if (!text || response.stop_reason === "refusal") return memory.text;

    return text;
  } catch (error) {
    console.warn(
      "Phrasing failed; returning the matched memory verbatim.",
      error instanceof Error ? error.message : error,
    );
    return memory.text;
  }
}
