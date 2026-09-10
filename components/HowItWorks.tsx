import { Heart, Mic, NotebookPen } from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";
import { howItWorks } from "@/content/site";

const ICONS = { NotebookPen, Mic, Heart };

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section scroll-mt-24">
      <div className="shell">
        <Reveal>
          <h2 className="t-display-l max-w-prose text-ink">
            {howItWorks.heading}
          </h2>
        </Reveal>

        <ol className="mt-16 grid gap-6 md:grid-cols-3">
          {howItWorks.steps.map((step, index) => {
            const Icon = ICONS[step.icon];
            return (
              <Reveal
                as="li"
                key={step.title}
                index={index + 1}
                className="rounded-lg border border-line bg-surface p-6"
              >
                <Icon aria-hidden="true" className="h-6 w-6 text-green" />
                <h3 className="t-title mt-6 text-ink">{step.title}</h3>
                <p className="t-body mt-3 text-ink-2">{step.body}</p>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
