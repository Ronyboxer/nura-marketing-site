import { Reveal } from "@/components/ui/Reveal";
import { whoItsFor } from "@/content/site";

export function WhoItsFor() {
  return (
    <section className="section bg-sunken">
      <div className="shell">
        <Reveal>
          <h2 className="t-display-l max-w-prose text-ink">
            {whoItsFor.heading}
          </h2>
        </Reveal>
        <Reveal index={1}>
          <p className="t-body-l prose-column mt-8 text-ink-2">
            {whoItsFor.body}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
