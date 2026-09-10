import type { ReactNode } from "react";

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="t-label text-ink-3">{children}</p>;
}
