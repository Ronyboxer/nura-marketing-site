"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * Opacity and an 8px rise, once, when the element comes into view. Staggering
 * is the caller's job via `index`, and it stops at five so a long section does
 * not leave the reader waiting.
 *
 * The element renders visible and only hides itself once JavaScript has
 * confirmed it is below the fold and that it will be able to show it again.
 * A reader without JavaScript, a browser without IntersectionObserver, and a
 * crawler or screenshot tool with a page-height viewport all see the finished
 * page rather than an empty one.
 */

// useLayoutEffect on the client so the element is hidden before the first
// paint; useEffect on the server, where the warning would be noise.
const useArmingEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function Reveal({
  children,
  index = 0,
  className = "",
  as: Component = "div",
}: {
  children: ReactNode;
  index?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const ref = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useArmingEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    // Already on screen: nothing to reveal, and hiding it now would be a flash.
    if (element.getBoundingClientRect().top < window.innerHeight) return;
    setArmed(true);
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!armed || shown || !element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-64px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [armed, shown]);

  const state = armed ? (shown ? "reveal reveal-shown" : "reveal") : "";

  return (
    <Component
      // One ref type covers div, li and section here.
      ref={ref as React.Ref<never>}
      className={`${state} ${className}`}
      style={{ "--delay": `${Math.min(index, 4) * 60}ms` } as React.CSSProperties}
    >
      {children}
    </Component>
  );
}
