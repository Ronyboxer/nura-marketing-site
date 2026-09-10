import { Reveal } from "@/components/ui/Reveal";
import { refusal } from "@/content/site";

export function Refusal() {
  return (
    <section className="section bg-sunken">
      <div className="shell">
        <Reveal>
          <h2 className="t-display-l max-w-prose text-ink">{refusal.heading}</h2>
        </Reveal>
        <Reveal index={1}>
          <p className="t-body-l prose-column mt-8 text-ink-2">
            {refusal.body}
          </p>
        </Reveal>
        <Reveal index={2}>
          <p className="t-title mt-12 max-w-prose rounded-lg bg-clay-100 p-6 text-ink">
            {refusal.callout}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
