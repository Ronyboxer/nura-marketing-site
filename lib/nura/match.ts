import { memories, type Memory } from "../../content/memories.ts";

/**
 * Deterministic lexical matching. No embeddings, no model call.
 *
 * Ten memories do not need vector search. A deterministic matcher is instant,
 * free, predictable, and — most importantly here — tunable in one place, which
 * matters because this function is the safety boundary: if it returns null,
 * no model is ever asked anything.
 *
 * This file has no framework imports and runs unchanged in Node, a browser,
 * or React Native.
 */

/** A match is only accepted at or above this score. */
export const MIN_SCORE = 0.5;

/** ...and only if it beats the runner-up by more than this. Ambiguity falls back. */
export const MIN_MARGIN = 0.05;

/** Words that carry no information about which memory is being asked for. */
const STOPWORDS = new Set([
  // The required list.
  "what", "where", "who", "when", "is", "my", "the", "a", "do", "did", "i",
  "does", "am", "are", "of", "in", "on", "to",
  // Question scaffolding that behaves identically: auxiliaries, and the words
  // people wrap around the thing they actually want ("what's my X's NAME",
  // "where do I live NOW").
  "was", "were", "be", "been", "have", "has", "had", "name", "now", "today",
  "me", "you", "your", "it", "and", "for", "at", "s",
]);

/**
 * Synonyms, applied after stopword removal. Each entry lets one token match a
 * memory written in different words. Kept deliberately small: every entry is a
 * chance to answer a question the family did not actually answer.
 *
 * Note on `where`: the brief suggested `where -> live/home`, but `where` is on
 * the required stopword list, and expanding it made "where are my keys" match
 * the home memory and answer instead of falling back. The home memory already
 * lists `where`, `live`, `home`, `house` and `staying` as keywords, so nothing
 * is lost by leaving it out.
 */
const SYNONYMS: Record<string, string[]> = {
  wife: ["husband", "spouse"],
  spouse: ["husband"],
  widow: ["husband"],
  widower: ["husband"],
  mum: ["daughter", "anne"],
  mom: ["daughter", "anne"],
  mother: ["daughter", "anne"],
  kid: ["son", "daughter"],
  child: ["son", "daughter"],
  grandchild: ["granddaughter"],
  grandkid: ["granddaughter"],
  eat: ["dinner", "food", "meal"],
  eating: ["dinner", "food"],
  supper: ["dinner"],
  food: ["dinner"],
  drink: ["tea"],
  kitty: ["cat"],
  kitten: ["cat"],
  apartment: ["home"],
  flat: ["home"],
  physician: ["doctor"],
  surgery: ["doctor"],
  teach: ["teacher", "work"],
  teaching: ["teacher", "work"],
  retired: ["work"],
  ring: ["call"],
  telephone: ["phone", "call"],
  birthplace: ["born", "leeds"],
};

/** Weight given to a proper noun or a word that is rare across the memories. */
const RARE_WEIGHT = 1.5;
const COMMON_WEIGHT = 1;

/** A word counts as rare if it appears in at most this many memories. */
const RARE_DOC_FREQUENCY = 2;

export type Match = { memory: Memory; score: number };

/** Light stem: drop a possessive, then a plural s. Applied to both sides. */
function stem(word: string): string {
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) {
    return word.slice(0, -1);
  }
  return word;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/['’]s\b/g, "")
    .replace(/[^a-z0-9\s]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/** Every word a memory can be matched on: its keywords plus its own text. */
function memoryVocabulary(memory: Memory): Set<string> {
  const words = [...memory.keywords.flatMap(tokenize), ...tokenize(memory.text)];
  return new Set(words.map(stem));
}

const VOCABULARIES: Map<string, Set<string>> = new Map(
  memories.map((memory) => [memory.id, memoryVocabulary(memory)]),
);

/** How many memories contain each word. Used to tell rare words from common ones. */
const DOC_FREQUENCY: Map<string, number> = (() => {
  const counts = new Map<string, number>();
  for (const vocabulary of VOCABULARIES.values()) {
    for (const word of vocabulary) {
      counts.set(word, (counts.get(word) ?? 0) + 1);
    }
  }
  return counts;
})();

type ContentWord = {
  /** The word itself plus any synonyms; matching any one of them counts. */
  forms: string[];
  weight: number;
};

/**
 * A question reduced to the words that actually select a memory, each carrying
 * the weight it should have in the score.
 */
export function contentWords(question: string): ContentWord[] {
  const raw = tokenize(question);
  // A capitalised word that is not the first word of the question is treated as
  // a proper noun: "Who is Sarah?" leans on Sarah, not on "who".
  const properNouns = new Set(
    question
      .split(/\s+/)
      .slice(1)
      .filter((word) => /^[A-Z][a-z]/.test(word))
      .flatMap(tokenize)
      .map(stem),
  );

  const seen = new Set<string>();
  const words: ContentWord[] = [];

  for (const token of raw) {
    if (STOPWORDS.has(token)) continue;
    const word = stem(token);
    if (STOPWORDS.has(word) || seen.has(word)) continue;
    seen.add(word);

    const synonyms = (SYNONYMS[token] ?? SYNONYMS[word] ?? []).map(stem);
    const documentFrequency = DOC_FREQUENCY.get(word) ?? 0;
    const isRare =
      documentFrequency > 0 && documentFrequency <= RARE_DOC_FREQUENCY;
    const isProperNoun = properNouns.has(word);

    words.push({
      forms: [word, ...synonyms],
      weight: isRare || isProperNoun ? RARE_WEIGHT : COMMON_WEIGHT,
    });
  }

  return words;
}

/** The share of the question's weighted content words this memory accounts for. */
export function scoreMemory(words: ContentWord[], memory: Memory): number {
  const vocabulary = VOCABULARIES.get(memory.id);
  if (!vocabulary || words.length === 0) return 0;

  let matched = 0;
  let total = 0;
  for (const word of words) {
    total += word.weight;
    if (word.forms.some((form) => vocabulary.has(form))) {
      matched += word.weight;
    }
  }

  return total === 0 ? 0 : matched / total;
}

/**
 * The one question this whole product turns on: is there a memory that answers
 * this, clearly and unambiguously? If not, the answer is null, and null means
 * Nura says so rather than guessing.
 */
export function matchMemory(question: string): Match | null {
  const words = contentWords(question);
  if (words.length === 0) return null;

  const ranked = memories
    .map((memory) => ({ memory, score: scoreMemory(words, memory) }))
    .sort((a, b) => b.score - a.score);

  const best = ranked[0];
  const runnerUp = ranked[1];
  if (!best || best.score < MIN_SCORE) return null;
  if (runnerUp && best.score - runnerUp.score <= MIN_MARGIN) return null;

  return best;
}
