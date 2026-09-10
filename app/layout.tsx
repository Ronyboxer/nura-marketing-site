import type { Metadata } from "next";
import { Newsreader, Figtree } from "next/font/google";
import "./globals.css";

// Display face. Newsreader carries the warmth; it is never bolded for
// emphasis, only enlarged.
const display = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
});

// General Sans is the intended UI face, but the woff2 files are not in the
// repo. Figtree is the stand-in: same humanist-geometric temperament, and it
// loads from Google Fonts with no binaries to check in.
const sans = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nura-six-alpha.vercel.app"),
  title: "Nura — the same kind answer, every time they ask.",
  description:
    "Nura is a gentle voice companion for people living with dementia and Alzheimer's. Your family writes the answers. Nura shares them warmly, patiently, and only ever the truth you've given it.",
  openGraph: {
    title: "Nura — the same kind answer, every time they ask.",
    description:
      "A gentle voice companion for people living with dementia. Your family writes the answers. Nura never makes anything up.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <a
          href="#main"
          className="t-body-s sr-only rounded-md focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-surface focus:px-4 focus:py-3 focus:text-ink focus:shadow-panel"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
