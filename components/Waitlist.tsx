"use client";

import { useId, useState } from "react";

import { Button } from "@/components/ui/Button";
import { waitlist } from "@/content/site";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (state === "sending") return;

    setState("sending");
    setError(null);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = await response.json().catch(() => ({}));

      // The route reports a missing Supabase configuration as a 500. That is a
      // problem for us, not for the visitor, so the form still thanks them.
      const notConfigured =
        response.status === 500 && body?.error === "Waitlist is not configured yet.";

      if (response.ok || notConfigured) {
        if (notConfigured) {
          console.warn("Supabase is not configured; the email was not stored.");
        }
        setState("done");
        return;
      }

      setError(body?.error ?? "Something went wrong. Please try again.");
      setState("idle");
    } catch {
      setError("Something went wrong. Please try again.");
      setState("idle");
    }
  }

  return (
    <section id="waitlist" className="section scroll-mt-24 bg-sunken">
      <div className="shell">
        <h2 className="t-display-l max-w-prose text-ink">{waitlist.heading}</h2>
        <p className="t-body-l prose-column mt-6 text-ink-2">
          {waitlist.subhead}
        </p>

        <div className="mt-12" aria-live="polite">
          {state === "done" ? (
            <p className="t-title rise max-w-prose rounded-lg bg-green-100 p-6 text-ink">
              {waitlist.success}
            </p>
          ) : (
            <form onSubmit={submit} className="max-w-prose">
              <label htmlFor={inputId} className="t-label text-ink-3">
                {waitlist.label}
              </label>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  id={inputId}
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={waitlist.placeholder}
                  autoComplete="email"
                  className="t-body min-h-11 flex-1 rounded-sm border border-line-strong bg-surface px-4 py-3 text-ink transition-colors duration-150 ease-nura placeholder:text-ink-3 focus:border-green"
                />
                <Button type="submit" disabled={state === "sending"}>
                  {waitlist.button}
                </Button>
              </div>
              {error ? (
                <p className="t-body-s mt-3 text-ink-2">{error}</p>
              ) : null}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
