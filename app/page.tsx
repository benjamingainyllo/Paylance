"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X, Check } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { ArrowCurve, Circled, Sparkle, Squiggle, Star, Underline } from "@/components/marketing/doodles";
import { EventCardMock, LinkMock, OrdersMock, PayoutMock } from "@/components/marketing/mockups";

/** Highlighter stroke behind a word. */
function Mark({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="lp-mark" style={color ? ({ ["--mark-color" as any]: color }) : undefined}>
      <span>{children}</span>
    </span>
  );
}

const WHO_ITS_FOR = [
  { tone: "#FFB3C7", title: "First-timers", body: "Selling one thing for the first time and not sure where to start. This is the whole setup — no site to build." },
  { tone: "#FFDE59", title: "People who make things", body: "Presets, templates, ebooks, courses. Upload once, sell it as many times as you like." },
  { tone: "#9BE3C0", title: "Hosts", body: "Workshops, classes, listening parties. Sell tickets or take free RSVPs and see who's actually coming." },
  { tone: "#B7C4FF", title: "Bookers", body: "Coaching, consulting, custom work. Set your rate, let people book and pay in one step." },
  { tone: "#DDBBF5", title: "Anyone tired of DMs", body: "No more “send me your account details” and counting transfer screenshots by hand." },
  { tone: "#FFC9A8", title: "People who want the receipts", body: "Every sale recorded, every buyer kept, every naira accounted for. Yours to take anywhere." },
];

export default function LandingPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => setMounted(true), []);

  const signedIn = mounted && !!user;
  const href = signedIn ? "/overview" : "/login";
  const cta = signedIn ? "Go to dashboard" : "Start selling — it's free";

  const NAV = [
    ["#sell", "What you sell"],
    ["#how", "How it works"],
    ["#money", "The money"],
    ["#faq", "Questions"],
  ] as const;

  return (
    <main className="lp min-h-screen overflow-x-hidden font-[family-name:var(--font-bricolage-grotesque)]">
      {/* ══════════════ Nav ══════════════ */}
      <header className="sticky top-0 z-50 border-b-2 border-[var(--ink)] bg-[var(--paper)]">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 rotate-[-4deg] items-center justify-center rounded-lg border-2 border-[var(--ink)] bg-[var(--coral)] text-[13px] font-black text-white">
              P
            </span>
            <span className="text-[17px] font-extrabold tracking-tight">Paylance</span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {NAV.map(([h, label]) => (
              <a key={h} href={h} className="text-[13px] font-semibold text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]">
                {label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-4 md:flex">
            {!signedIn && (
              <Link href="/login" className="text-[13px] font-semibold text-[var(--ink-soft)] hover:text-[var(--ink)]">
                Sign in
              </Link>
            )}
            <Link
              href={href}
              className="lp-block-soft rounded-xl bg-[var(--ink)] px-4 py-2 text-[12px] font-bold text-[var(--paper)] transition-transform hover:-translate-y-0.5"
            >
              {signedIn ? "Dashboard" : "Get started"}
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-[var(--ink)] md:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </nav>

        {menuOpen && (
          <div className="border-t-2 border-[var(--ink)] px-6 sm:px-10 lg:px-16 py-4 md:hidden">
            <div className="flex flex-col gap-4">
              {NAV.map(([h, label]) => (
                <a key={h} href={h} onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-[var(--ink-soft)]">
                  {label}
                </a>
              ))}
              <Link href={href} className="lp-block-soft rounded-xl bg-[var(--ink)] px-4 py-3 text-center text-xs font-bold text-[var(--paper)]">
                {signedIn ? "Dashboard" : "Get started"}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ══════════════ Hero — the saturated moment ══════════════ */}
      <section className="relative overflow-hidden border-b-2 border-[var(--ink)] bg-gradient-to-br from-[#FF6A45] via-[#F5568E] to-[#8B5CF6] px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
        <Sparkle className="absolute left-[8%] top-[14%] hidden h-7 w-7 text-white/70 sm:block" />
        <Sparkle className="absolute right-[12%] top-[22%] hidden h-4 w-4 text-white/50 sm:block" />
        <Star className="absolute bottom-[18%] left-[16%] hidden h-6 w-6 text-white/40 sm:block" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div>
            <span className="lp-block-soft inline-block rotate-[-1.5deg] rounded-full bg-[var(--paper)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider">
              Sell anything · one link
            </span>

            <h1 className="mt-6 text-[46px] font-extrabold leading-[0.95] tracking-[-0.03em] text-white sm:text-[68px]">
              Get paid
              <br />
              properly
              <br />
              <span className="font-[family-name:var(--font-instrument-serif)] font-normal italic">
                for what you make.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-white/90">
              Products, events, sessions — one link, one checkout, one dashboard. The money
              lands in your bank, not in a group chat.
            </p>

            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link
                href={href}
                className="lp-block inline-flex items-center gap-2 rounded-2xl bg-[var(--paper)] px-7 py-4 text-[15px] font-extrabold text-[var(--ink)] transition-transform hover:-translate-y-1"
              >
                {cta} <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="flex items-center gap-2 text-[13px] font-semibold text-white/85">
                <Check className="h-4 w-4" /> No monthly fee, ever
              </div>
            </div>
          </div>

          {/* Product, not a description of it. */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="lp-tilt-2">
              <LinkMock />
            </div>
            <div className="lp-tilt-1 absolute -bottom-10 -left-2 hidden sm:block">
              <div className="lp-block-soft rounded-2xl bg-[#FFDE59] px-4 py-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--ink)]">
                  Paid today
                </p>
                <p className="text-[20px] font-extrabold text-[var(--ink)]">₦62,000</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ The problem, in their words ══════════════ */}
      <section className="border-b-2 border-[var(--ink)] px-6 sm:px-10 lg:px-16 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--ink-soft)]">
            You already know how this goes
          </p>
          <h2 className="mt-5 text-[32px] font-extrabold leading-[1.1] tracking-tight sm:text-[44px]">
            Selling is easy. <Mark color="var(--marker-pink)">Getting paid</Mark> is the mess.
          </h2>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {[
              "“Send me your account”",
              "17 transfer screenshots",
              "Ticking names off by hand",
              "Chasing the four who never paid",
              "No idea what you actually made",
            ].map((t, i) => (
              <span
                key={t}
                className={`lp-block-soft rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-[var(--ink-soft)] lp-tilt-${(i % 4) + 1}`}
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Squiggle className="h-4 w-28 text-[var(--coral)]" />
          </div>
        </div>
      </section>

      {/* ══════════════ Who it's for — pastel grid ══════════════ */}
      <section id="sell" className="border-b-2 border-[var(--ink)] bg-[var(--paper-deep)] px-6 sm:px-10 lg:px-16 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <h2 className="text-[32px] font-extrabold leading-[1.05] tracking-tight sm:text-[44px]">
              Built for whatever
              <br />
              you&apos;re <Mark>actually selling</Mark>
            </h2>
            <p className="mt-5 max-w-md text-[16px] leading-relaxed text-[var(--ink-soft)]">
              Products, tickets and time all sit on the same rails — same checkout, same buyer
              list, same bank account.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WHO_ITS_FOR.map((c, i) => (
              <div
                key={c.title}
                className={`lp-block rounded-2xl p-6 lp-tilt-${(i % 4) + 1}`}
                style={{ background: c.tone }}
              >
                <h3 className="text-[19px] font-extrabold tracking-tight text-[var(--ink)]">
                  {c.title}
                </h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-[var(--ink-muted)]">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ The dark band — money honesty ══════════════ */}
      <section id="money" className="relative overflow-hidden border-b-2 border-[var(--ink)] bg-[var(--plum)] px-6 sm:px-10 lg:px-16 py-24">
        <Sparkle className="absolute right-[10%] top-[18%] hidden h-5 w-5 text-[#FFDE59]/60 sm:block" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <h2 className="text-[34px] font-extrabold leading-[1.05] tracking-tight text-[var(--paper)] sm:text-[46px]">
              We never{" "}
              <span className="font-[family-name:var(--font-instrument-serif)] font-normal italic text-[#FFDE59]">
                hold
              </span>{" "}
              your money.
            </h2>

            <p className="mt-6 max-w-md text-[16px] leading-relaxed text-[var(--paper-muted)]">
              When someone pays, the payment splits at that exact moment. Your share goes
              straight to your own bank account — it never sits in ours, not even overnight.
            </p>

            <p className="mt-4 max-w-md text-[16px] leading-relaxed text-[var(--paper-muted)]">
              That&apos;s why there&apos;s no wallet here, no balance, and nothing to withdraw.
              There&apos;s nothing to withdraw <em className="font-[family-name:var(--font-instrument-serif)] not-italic">because it&apos;s already yours</em>.
            </p>

            <div className="mt-8 inline-flex items-center gap-2.5 rounded-full border-2 border-[#FFDE59] px-5 py-2.5">
              <span className="h-2 w-2 rounded-full bg-[#FFDE59]" />
              <span className="text-[13px] font-bold text-[#FFDE59]">
                No monthly fee. A small cut per sale.
              </span>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="lp-tilt-3">
              <PayoutMock />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ How it works ══════════════ */}
      <section id="how" className="border-b-2 border-[var(--ink)] px-6 sm:px-10 lg:px-16 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="relative max-w-2xl">
            <h2 className="text-[32px] font-extrabold leading-[1.05] tracking-tight sm:text-[44px]">
              Three steps. Then you&apos;re selling.
            </h2>
            <Underline className="mt-2 h-3 w-56 text-[var(--coral)]" />
          </div>

          <div className="mt-14 space-y-16">
            {[
              {
                n: "01",
                title: "Put up what you're selling",
                body: "A product, a ticketed event, a session. Name it, price it, or make it free. It saves as a draft, so nothing goes public before you say so.",
                art: <EventCardMock />,
              },
              {
                n: "02",
                title: "Share one link",
                body: "Your storefront, or a direct link to one thing. It goes in a bio, a status, a group chat — anywhere you'd have pasted your account number.",
                art: <LinkMock />,
              },
              {
                n: "03",
                title: "Watch it land",
                body: "Card or transfer, buyers choose. Every sale is recorded the second it happens, every buyer joins your list, and the money settles to your bank.",
                art: <OrdersMock />,
              },
            ].map((s, i) => (
              <div
                key={s.n}
                className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
              >
                <div>
                  <div className="relative inline-block">
                    <span className="text-[13px] font-extrabold tracking-widest text-[var(--coral)]">
                      STEP {s.n}
                    </span>
                    <Circled className="absolute -left-5 -top-3 h-14 w-24 text-[var(--coral-faint)]" />
                  </div>
                  <h3 className="mt-4 text-[26px] font-extrabold leading-tight tracking-tight sm:text-[32px]">
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[var(--ink-soft)]">
                    {s.body}
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className={`lp-tilt-${(i % 3) + 1}`}>{s.art}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ Buyer trust ══════════════ */}
      <section className="border-b-2 border-[var(--ink)] bg-[var(--paper-deep)] px-6 sm:px-10 lg:px-16 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[30px] font-extrabold leading-[1.1] tracking-tight sm:text-[40px]">
              Nobody taps a payment link <Mark color="var(--peri)">without thinking twice</Mark>
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-[var(--ink-soft)]">
              So every page is built to answer that hesitation before it costs you the sale.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {[
              { t: "No account. No app.", b: "They tap the link and pay. Nothing to sign up for, nothing to download, no password between them and checkout." },
              { t: "They see who's already in", b: "Real names of people who've already bought or RSVP'd — the clearest possible signal that a link is genuine." },
              { t: "Your face is on it", b: "Your name, photo and profile sit at the top. People are trusting you, not an unfamiliar logo." },
              { t: "It looks right when shared", b: "Cover art, title, date and price all show up in the preview, before the page even loads." },
            ].map((f, i) => (
              <div key={f.t} className={`lp-block rounded-2xl bg-white p-6 lp-tilt-${(i % 4) + 1}`}>
                <h3 className="text-[18px] font-extrabold tracking-tight">{f.t}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--ink-soft)]">{f.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FAQ ══════════════ */}
      <section id="faq" className="border-b-2 border-[var(--ink)] px-6 sm:px-10 lg:px-16 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-[32px] font-extrabold tracking-tight sm:text-[42px]">
            Fair questions
          </h2>

          <div className="mt-12 space-y-3">
            {[
              { q: "What can I actually sell?", a: "Digital products, event tickets, and sessions or services — all from one account, one link and one checkout." },
              { q: "Do my buyers need an account?", a: "No. They tap your link, enter their name and email, and pay. That's the whole thing." },
              { q: "How do I get my money?", a: "Straight to your own bank account. The payment splits at the moment someone pays, so your share settles directly to you. We never hold it." },
              { q: "Can I run something for free?", a: "Yes. Free events and free products work exactly the same way — you collect sign-ups instead of payments, and still see everyone who came through." },
              { q: "What does it cost?", a: "Nothing to start, and no monthly fee. We take a small percentage when you actually get paid — so if you don't sell, you don't pay." },
              { q: "Do I need a website?", a: "No. Your storefront is the website. One shareable link with everything you sell on it." },
            ].map((f, i) => (
              <details key={f.q} className={`lp-block-soft group rounded-2xl bg-white px-6 py-5 lp-tilt-${(i % 2) + 3}`}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-bold">
                  {f.q}
                  <span className="shrink-0 text-[var(--coral)] transition-transform group-open:rotate-45">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                      <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-[14px] leading-relaxed text-[var(--ink-soft)]">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ Final CTA ══════════════ */}
      <section className="relative overflow-hidden border-b-2 border-[var(--ink)] bg-gradient-to-br from-[#8B5CF6] via-[#F5568E] to-[#FF6A45] px-6 sm:px-10 lg:px-16 py-24 text-center">
        <Sparkle className="absolute left-[14%] top-[22%] hidden h-6 w-6 text-white/60 sm:block" />
        <Star className="absolute bottom-[22%] right-[16%] hidden h-5 w-5 text-white/40 sm:block" />

        <div className="relative mx-auto max-w-xl">
          <h2 className="text-[36px] font-extrabold leading-[1.02] tracking-tight text-white sm:text-[52px]">
            So — what are you
            <br />
            <span className="font-[family-name:var(--font-instrument-serif)] font-normal italic">
              selling?
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-sm text-[16px] leading-relaxed text-white/90">
            Set it up now, share your link today, and let people pay you like a business.
          </p>

          <div className="relative mt-10 inline-block">
            <Link
              href={href}
              className="lp-block inline-flex items-center gap-2 rounded-2xl bg-[var(--paper)] px-8 py-4 text-[15px] font-extrabold text-[var(--ink)] transition-transform hover:-translate-y-1"
            >
              {cta} <ArrowRight className="h-4 w-4" />
            </Link>
            <ArrowCurve className="absolute -right-20 -top-8 hidden h-16 w-20 text-white/60 sm:block" />
          </div>
        </div>
      </section>

      {/* ══════════════ Footer ══════════════ */}
      <footer className="px-6 sm:px-10 lg:px-16 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 rotate-[-4deg] items-center justify-center rounded-lg border-2 border-[var(--ink)] bg-[var(--coral)] text-[11px] font-black text-white">
              P
            </span>
            <span className="text-[15px] font-extrabold tracking-tight">Paylance</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {NAV.map(([h, label]) => (
              <a key={h} href={h} className="text-[12px] font-semibold text-[var(--ink-soft)] hover:text-[var(--ink)]">
                {label}
              </a>
            ))}
            <Link href="/login" className="text-[12px] font-semibold text-[var(--ink-soft)] hover:text-[var(--ink)]">
              Sign in
            </Link>
          </div>

          <p className="text-[12px] text-[var(--ink-soft)]">© {new Date().getFullYear()} Paylance</p>
        </div>
      </footer>
    </main>
  );
}
