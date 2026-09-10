"use client";

import { Minus, Plus } from "lucide-react";
import { useId, useState } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { faq } from "@/content/site";

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();

  return (
    <section id="faq" className="section scroll-mt-24">
      <div className="shell">
        <Reveal>
          <h2 className="t-display-l max-w-prose text-ink">{faq.heading}</h2>
        </Reveal>

        <div className="prose-column mt-16">
          {faq.items.map((item, index) => {
            const isOpen = open === index;
            const panelId = `${baseId}-panel-${index}`;
            const buttonId = `${baseId}-button-${index}`;

            return (
              <Reveal
                key={item.question}
                index={index + 1}
                className="border-b border-line first:border-t"
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="t-title flex w-full items-center justify-between gap-6 py-5 text-left text-ink transition-colors duration-150 ease-nura hover:text-green"
                  >
                    {item.question}
                    {isOpen ? (
                      <Minus
                        aria-hidden="true"
                        className="h-5 w-5 shrink-0 text-ink-3"
                      />
                    ) : (
                      <Plus
                        aria-hidden="true"
                        className="h-5 w-5 shrink-0 text-ink-3"
                      />
                    )}
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                >
                  <p className="t-body pb-6 text-ink-2">{item.answer}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
