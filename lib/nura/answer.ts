import { fallbackLine } from "../../content/memories.ts";
import { matchMemory } from "./match.ts";
import { phrase as defaultPhrase } from "./phrase.ts";

export type AnswerResult = {
  answer: string;
  fellBack: boolean;
  sourceMemory: string | null;
};

/** Injectable so a test can prove the model is never reached without a match. */
export type AnswerOptions = {
  phrase?: typeof defaultPhrase;
};

/**
 * The safety guarantee, and the order is the guarantee.
 *
 * The decision to answer happens before any model is involved. If no memory
 * matches, this function returns the fallback line and the model is never
 * asked anything. There is no branch below where a model response reaches the
 * caller without a matched memory behind it.
 */
export async function answer(
  question: string,
  options: AnswerOptions = {},
): Promise<AnswerResult> {
  const match = matchMemory(question); // 1. deterministic, no model

  if (!match) {
    // 2. stop. phrase() is never reached.
    return { answer: fallbackLine, fellBack: true, sourceMemory: null };
  }

  // 3. the model sees ONLY this one memory
  const phrase = options.phrase ?? defaultPhrase;
  const text = await phrase(match.memory);

  return { answer: text, fellBack: false, sourceMemory: match.memory.text };
}
