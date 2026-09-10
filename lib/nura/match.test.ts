import assert from "node:assert/strict";
import test from "node:test";

import { memories } from "../../content/memories.ts";
import { answer } from "./answer.ts";
import { MIN_MARGIN, MIN_SCORE, matchMemory } from "./match.ts";

/** Questions the family's memories genuinely answer, and which memory each one is. */
const ANSWERABLE: Array<[string, string]> = [
  ["What's my granddaughter's name?", "granddaughter"],
  ["Where do I live?", "home"],
  ["Where do I live now?", "home"],
  ["who makes my tea", "tea"],
  ["Who is Sarah?", "granddaughter"],
  ["what day does michael call", "son"],
  ["when is dinner", "dinner"],
  ["what was my job", "work"],
  ["do I have a pet", "cat"],
  ["when was I born", "born"],
  ["who is my doctor", "doctor"],
];

/** Questions nothing in the memories answers. Every one of these must fall back. */
const UNANSWERABLE = [
  "What's my sister's name?",
  "What's the weather?",
  "Am I going to die?",
  "Who is the president?",
  "what's my password",
  "where are my keys",
];

test("matches the memory the question is actually about", () => {
  for (const [question, expectedId] of ANSWERABLE) {
    const match = matchMemory(question);
    assert.ok(match, `expected a match for "${question}"`);
    assert.equal(match.memory.id, expectedId, `wrong memory for "${question}"`);
  }
});

test("returns null when no memory answers the question", () => {
  for (const question of UNANSWERABLE) {
    assert.equal(
      matchMemory(question),
      null,
      `"${question}" should not have matched any memory`,
    );
  }
});

test("falls back rather than choosing between two equally good memories", () => {
  // "Anne" appears in four memories, so no single one is the answer.
  assert.equal(matchMemory("who is Anne"), null);
});

test("ignores empty and stopword-only questions", () => {
  assert.equal(matchMemory(""), null);
  assert.equal(matchMemory("what is the"), null);
});

test("thresholds stay in the range the matcher was tuned against", () => {
  assert.ok(MIN_SCORE >= 0.5);
  assert.ok(MIN_MARGIN >= 0.05);
});

test("phrase() is never called when no memory matches", async () => {
  let calls = 0;
  const spy = async (memory: (typeof memories)[number]) => {
    calls += 1;
    return memory.text;
  };

  for (const question of UNANSWERABLE) {
    const result = await answer(question, { phrase: spy });
    assert.equal(result.fellBack, true);
    assert.equal(result.sourceMemory, null);
    assert.equal(
      calls,
      0,
      `phrase() was reached for "${question}" with no memory behind it`,
    );
  }
});

test("phrase() is called exactly once, with the matched memory, when there is a match", async () => {
  const seen: string[] = [];
  const spy = async (memory: (typeof memories)[number]) => {
    seen.push(memory.id);
    return "rephrased";
  };

  const result = await answer("who makes my tea", { phrase: spy });

  assert.deepEqual(seen, ["tea"]);
  assert.equal(result.fellBack, false);
  assert.equal(result.answer, "rephrased");
  assert.equal(result.sourceMemory, "Anne makes you tea in the afternoon, around three.");
});

test("an answered question always carries the source memory it came from", async () => {
  const spy = async () => "rephrased";
  for (const [question] of ANSWERABLE) {
    const result = await answer(question, { phrase: spy });
    assert.equal(result.fellBack, false);
    assert.ok(
      memories.some((memory) => memory.text === result.sourceMemory),
      `"${question}" answered without a real source memory`,
    );
  }
});
