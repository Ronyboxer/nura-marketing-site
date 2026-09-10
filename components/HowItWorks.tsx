import { Reveal } from "@/components/ui/Reveal";
import { howItWorks } from "@/content/site";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section scroll-mt-24">
      <div className="shell">
        <Reveal>
          <h2 className="t-display-l max-w-prose text-ink">
            {howItWorks.heading}
          </h2>
        </Reveal>

        {/* Three steps in sequence, so they are numbered and ruled rather than
            boxed. The rule is the same hairline the rest of the page uses, and
            the numeral carries the accent the icons used to. role="list" keeps
            the ordering announced once the list marker is styled away. */}
        <ol role="list" className="mt-16 grid gap-x-8 gap-y-12 md:grid-cols-3">
          {howItWorks.steps.map((step, index) => (
            <Reveal
              as="li"
              key={step.title}
              index={index + 1}
              className="border-t border-line-strong pt-6"
            >
              <p aria-hidden="true" className="t-display-m text-green">
                {index + 1}
              </p>
              <h3 className="t-title mt-4 text-ink">{step.title}</h3>
              <p className="t-body prose-column mt-3 text-ink-2">{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
