"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useId, useState } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { faq } from "@/content/site";

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();
  const reduced = useReducedMotion();

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
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={panelId}
                      className="overflow-hidden"
                      initial={reduced ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduced ? { opacity: 1 } : { height: 0, opacity: 0 }}
                      transition={{
                        duration: reduced ? 0 : 0.22,
                        ease: [0.2, 0, 0, 1],
                      }}
                    >
                      <p className="t-body pb-6 text-ink-2">{item.answer}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
