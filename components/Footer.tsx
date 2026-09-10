import { footer } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-line bg-canvas py-16">
      <div className="shell flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <p className="t-body text-ink">{footer.line}</p>
        <ul className="flex flex-wrap gap-6">
          {footer.links.map((link) => (
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
      </div>
      <div className="shell mt-16">
        <p className="t-caption max-w-prose text-ink-3">{footer.smallPrint}</p>
      </div>
    </footer>
  );
}
