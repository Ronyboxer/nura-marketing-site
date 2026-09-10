"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Opacity and an 8px rise, once, when the section comes into view. Staggering
 * is the caller's job via `index`, and it stops at five so a long section does
 * not leave the reader waiting.
 */
export function Reveal({
  children,
  index = 0,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  index?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  if (reduced) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{
        duration: 0.4,
        ease: [0.2, 0, 0, 1],
        delay: Math.min(index, 4) * 0.06,
      }}
    >
      {children}
    </Component>
  );
}
