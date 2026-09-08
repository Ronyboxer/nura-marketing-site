# Nura, Marketing Site

Marketing landing page for Nura, a voice-first companion for older adults
living with dementia, Alzheimer's, and memory loss. The page is written for the
family caregiver rather than the end user, since they are the one deciding
whether to try it.

Live: https://nura-six-alpha.vercel.app

This is the marketing site only. There is no login and no product here. The one
piece of real backend is the waitlist: `app/api/waitlist/route.ts` inserts the
submitted email into a Supabase `waitlist` table, server-side. It needs
`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` set as environment variables, and
the service role key must never be exposed to the client. Copy
`.env.local.example` to `.env.local` to run it locally. Without those variables
the route fails and the form reports an error.

## Tech stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** (v3, classic `tailwind.config.ts`)
- **Framer Motion** for all animation
- **lucide-react** for icons
- **next/font/google** - Fraunces (display serif) + Inter (body)

## Run it

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # lint
```

## Structure

```
app/
  layout.tsx        # fonts + metadata
  page.tsx          # composes the ten sections + skip link
  globals.css       # base styles, focus rings, reduced-motion
components/
  Navbar.tsx        # sticky nav, transparent → solid on scroll, mobile menu
  Hero.tsx          # headline, CTAs, animated Answer Demo, warm glow
  AnswerDemo.tsx    # looping Q&A device mock (the centerpiece)
  Problem.tsx
  HowItWorks.tsx    # three step cards
  SafetyPromise.tsx # "Nura never makes things up" - the trust anchor
  WhoItsFor.tsx
  Features.tsx      # six feature cards
  Faq.tsx           # accessible accordion
  WaitlistCTA.tsx   # client-side email capture + success state
  Footer.tsx        # wordmark, links, medical disclaimer
  ui/
    Button.tsx      # shared button with hover lift
    Glow.tsx        # reusable warm radial glow
    Reveal.tsx      # scroll-reveal wrapper
    icons.ts        # lucide icon name → component map
content/
  site.ts           # all copy in one place
tailwind.config.ts  # palette (sage/cream/forest/clay) + fonts
```

## Design notes

- **Palette:** warm cream (`#FAF8F3`) + light sage (`#EFF3EC`) with sage-green
  accents (`#5C8268`), deep forest headings (`#1E3A2B`), green-gray body text
  (`#4A5A50`), and a muted clay (`#C77B4F`) secondary accent. Filled buttons use
  a slightly deeper sage (`#52785E`) so white label text clears WCAG AA (~5:1).
- **Type:** Fraunces for headlines, Inter for body/UI.
- **Motion:** transform + opacity only. Hero load-in, scroll reveals, hover
  micro-interactions, a looping Answer Demo, and a gently pulsing hero glow.
- **Accessibility:** semantic landmarks, one `h1`, visible focus rings,
  keyboard-navigable accordion with `aria-expanded`, ≥44px tap targets, and full
  `prefers-reduced-motion` support (loops and entrances are disabled).

## Wiring up the waitlist

The form in `components/WaitlistCTA.tsx` is client-side only. Search for
`// TODO: wire to email service (e.g. Formspree)` to drop in your POST endpoint.

---

Nura is not a medical device and does not provide medical advice.
