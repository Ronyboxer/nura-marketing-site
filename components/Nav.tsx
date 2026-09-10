"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { LinkButton } from "@/components/ui/Button";
import { nav } from "@/content/site";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-220 ease-nura ${
        scrolled || open ? "border-b border-line bg-canvas" : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Main"
        className="shell flex h-16 items-center justify-between"
      >
        <a
          href="#top"
          className="font-display text-[1.25rem] leading-none text-ink"
        >
          {nav.wordmark}
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {nav.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="t-body-s text-ink-2 transition-colors duration-150 ease-nura hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <LinkButton href="#waitlist" className="hidden md:inline-flex">
            {nav.cta}
          </LinkButton>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
            className="-mr-3 flex h-11 w-11 items-center justify-center rounded-md text-ink transition-colors duration-150 ease-nura hover:bg-sunken md:hidden"
          >
            {open ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      <div
        id="mobile-nav"
        className={`border-t border-line bg-canvas md:hidden ${open ? "" : "hidden"}`}
      >
        <ul className="shell py-2">
          {nav.links.map((link) => (
            <li key={link.href} className="border-b border-line last:border-0">
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="t-body-s flex min-h-11 items-center text-ink-2"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="shell pb-6">
          <LinkButton
            href="#waitlist"
            onClick={() => setOpen(false)}
            className="w-full"
          >
            {nav.cta}
          </LinkButton>
        </div>
      </div>
    </header>
  );
}
