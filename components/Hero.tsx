import { Demo } from "@/components/Demo";
import { demo, hero } from "@/content/site";

export function Hero() {
  return (
    <section id="try-it" className="scroll-mt-24 pb-24 pt-32 lg:pb-40 lg:pt-40">
      <div className="shell">
        {/* The only centred text on the page. */}
        <div className="mx-auto flex max-w-prose flex-col items-center text-center">
          <p className="t-label rise text-ink-3">{hero.eyebrow}</p>
          <h1
            className="t-display-xl rise mt-6 text-ink"
            style={{ "--delay": "60ms" } as React.CSSProperties}
          >
            {hero.headline}
          </h1>
          <p
            className="t-body-l rise mt-6 text-ink-2"
            style={{ "--delay": "120ms" } as React.CSSProperties}
          >
            {hero.subhead}
          </p>
        </div>

        <div
          className="rise mt-16"
          style={{ "--delay": "180ms" } as React.CSSProperties}
        >
          <Demo />
        </div>
      </div>
    </section>
  );
}
