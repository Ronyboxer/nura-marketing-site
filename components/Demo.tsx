"use client";

import { ChevronDown } from "lucide-react";
import { useId, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { memories } from "@/content/memories.ts";
import { demo } from "@/content/site";

type Answer = {
  answer: string;
  sourceMemory: string | null;
  fellBack: boolean;
};

/** Long enough to read as thought, short enough not to feel like waiting. */
const MINIMUM_PAUSE_MS = 600;

function MemoryList() {
  return (
    <ul className="border-l border-line-strong">
      {memories.map((memory, index) => (
        <li
          key={memory.id}
          className={`t-body-s px-4 py-3 text-ink-2 ${
            index === 0 ? "" : "border-t border-line"
          }`}
        >
          {memory.text}
        </li>
      ))}
    </ul>
  );
}

export function Demo() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [memoriesOpen, setMemoriesOpen] = useState(false);

  const inputId = useId();
  const memoriesId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  async function ask(asked: string) {
    const trimmed = asked.trim();
    if (trimmed.length < 4 || pending) return;

    setPending(true);
    setError(null);
    setAnswer(null);

    const startedAt = Date.now();
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });
      const body = await response.json();

      // Hold the pause even when the answer comes back instantly, so the
      // rhythm of the demo stays the same whether or not it was cached.
      const elapsed = Date.now() - startedAt;
      if (elapsed < MINIMUM_PAUSE_MS) {
        await new Promise((resolve) =>
          setTimeout(resolve, MINIMUM_PAUSE_MS - elapsed),
        );
      }

      if (!response.ok) {
        setError(body?.error ?? "Something went wrong. Please try again.");
      } else {
        setAnswer(body as Answer);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  function askChip(chipQuestion: string) {
    setQuestion(chipQuestion);
    void ask(chipQuestion);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-panel">
      <div className="grid lg:grid-cols-[minmax(0,4fr)_minmax(0,5fr)]">
        {/* What the family wrote. On mobile this collapses so the input stays
            within reach; on desktop it is simply there, all of it. */}
        <section
          aria-labelledby={`${memoriesId}-label`}
          className="bg-sunken lg:border-r lg:border-line"
        >
          <div className="flex items-center justify-between gap-4 px-6 pt-6 lg:pb-4">
            <h3 id={`${memoriesId}-label`} className="t-label text-ink-3">
              {demo.memoriesLabel}
            </h3>
            <button
              type="button"
              aria-expanded={memoriesOpen}
              aria-controls={memoriesId}
              onClick={() => setMemoriesOpen((open) => !open)}
              className="t-body-s -mr-2 flex h-11 items-center gap-2 rounded-md px-2 font-medium text-green transition-colors duration-150 ease-nura hover:bg-green-50 lg:hidden"
            >
              {memoriesOpen ? "Hide" : "Show"}
              <ChevronDown
                aria-hidden="true"
                className={`h-4 w-4 transition-transform duration-220 ease-nura ${
                  memoriesOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
          <div
            id={memoriesId}
            className={`px-6 pb-6 ${memoriesOpen ? "" : "hidden lg:block"}`}
          >
            <MemoryList />
          </div>
        </section>

        {/* Where the visitor does the thing the page is about. */}
        <section className="p-6 md:p-8">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void ask(question);
            }}
          >
            <label htmlFor={inputId} className="t-label text-ink-3">
              {demo.inputLabel}
            </label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                id={inputId}
                ref={inputRef}
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder={demo.placeholder}
                maxLength={200}
                autoComplete="off"
                className="t-body min-h-11 flex-1 rounded-sm border border-line-strong bg-sunken px-4 py-3 text-ink transition-colors duration-150 ease-nura placeholder:text-ink-3 focus:border-green"
              />
              <Button
                type="submit"
                size="large"
                disabled={pending || question.trim().length < 4}
              >
                {demo.submit}
              </Button>
            </div>
          </form>

          <p className="t-label mt-6 text-ink-3">{demo.chipsLabel}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {demo.chips.map((chip) => (
              <li key={chip.question}>
                <button
                  type="button"
                  onClick={() => askChip(chip.question)}
                  disabled={pending}
                  className="t-body-s flex h-8 items-center gap-3 rounded-sm border border-line bg-surface px-3 text-ink-2 transition-colors duration-150 ease-nura hover:border-line-strong hover:bg-sunken disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {chip.question}
                  {chip.marker ? (
                    <span className="t-label text-clay">{chip.marker}</span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>

          <div aria-live="polite" className="mt-6">
            {pending ? (
              <p className="t-body-s animate-slow-pulse text-ink-3">
                {demo.thinking}
              </p>
            ) : null}

            {!pending && answer && !answer.fellBack ? (
              <div className="rise rounded-lg bg-green-100 p-6">
                <p className="t-display-m italic text-ink">{answer.answer}</p>
                {answer.sourceMemory ? (
                  <>
                    <hr className="my-4 border-0 border-t border-green" />
                    <p className="t-label text-green-700">{demo.sourceLabel}</p>
                    <p className="t-caption mt-2 text-ink-3">
                      {answer.sourceMemory}
                    </p>
                  </>
                ) : null}
              </div>
            ) : null}

            {/* Not an error. This is Nura working correctly. */}
            {!pending && answer && answer.fellBack ? (
              <div className="rise rounded-lg bg-clay-100 p-6">
                <p className="t-display-m italic text-ink">{answer.answer}</p>
                <hr className="my-4 border-0 border-t border-line-strong" />
                <p className="t-caption text-clay">{demo.fallbackNote}</p>
              </div>
            ) : null}

            {!pending && error ? (
              <p className="t-body-s text-ink-2">{error}</p>
            ) : null}
          </div>

          <p className="t-caption mt-6 text-ink-3">{demo.note}</p>
        </section>
      </div>
    </div>
  );
}
