/**
 * Runs the answer engine over the questions it has to get right, and prints
 * what it did with each one. The last six have no matching memory: if any of
 * them comes back with fellBack=false, the threshold in lib/nura/match.ts is
 * too loose and the demo would be guessing.
 *
 *   npm run check
 */
import { answer } from "../lib/nura/answer.ts";
import { matchMemory } from "../lib/nura/match.ts";

const QUESTIONS = [
  "What's my granddaughter's name?",
  "Where do I live?",
  "who makes my tea",
  "Who is Sarah?",
  "what day does michael call",
  "when is dinner",
  "what was my job",
  "do I have a pet",
  "when was I born",
  "who is my doctor",
  "What's my sister's name?",
  "What's the weather?",
  "Am I going to die?",
  "Who is the president?",
  "what's my password",
  "where are my keys",
];

/** The tail of the list above. Every one of these has to fall back. */
const MUST_FALL_BACK = QUESTIONS.slice(-6);

async function main() {
  let failures = 0;

  for (const question of QUESTIONS) {
    // Phrasing is skipped here so the output shows the matcher's own decision
    // rather than a model's wording of it.
    const result = await answer(question, {
      phrase: async (memory) => memory.text,
    });
    const match = matchMemory(question);

    const shouldFallBack = MUST_FALL_BACK.includes(question);
    const wrong = shouldFallBack && !result.fellBack;
    if (wrong) failures += 1;

    console.log(`${wrong ? "WRONG" : "ok   "}  ${question}`);
    console.log(`         answer:   ${result.answer}`);
    console.log(`         fellBack: ${result.fellBack}`);
    console.log(`         source:   ${result.sourceMemory ?? "none"}`);
    if (match) {
      console.log(`         score:    ${match.score.toFixed(3)}`);
    }
    console.log("");
  }

  if (failures > 0) {
    console.error(
      `${failures} question(s) that nothing answers were answered anyway. Tighten MIN_SCORE or MIN_MARGIN in lib/nura/match.ts.`,
    );
    process.exitCode = 1;
    return;
  }

  console.log("All six unanswerable questions fell back.");
}

await main();
