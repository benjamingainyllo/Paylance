"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Layers3,
  ArrowRight,
  Check,
  X,
  Menu,
  Store,
  Ticket,
  Video,
  Users,
  BarChart3,
  Landmark,
  Link2,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";

/**
 * Paylance is a creator OS: offers, events, audience, revenue, payouts on one
 * shared rail. Events are the most vivid thing you can sell with it, not the
 * definition of the product — so they get a prominent slot here, not the
 * headline.
 */

const SELLABLE = [
  {
    icon: Store,
    title: "Digital products",
    body: "Ebooks, presets, templates, courses. Upload once, sell it as many times as you like.",
  },
  {
    icon: Ticket,
    title: "Events & tickets",
    body: "Workshops, meetups, classes, parties. Sell tickets or take free RSVPs, and see exactly who's coming.",
  },
  {
    icon: Video,
    title: "Sessions & services",
    body: "Coaching calls, consulting, custom work. Set your price and let people book and pay in one step.",
  },
];

const DASHBOARD = [
  {
    icon: Users,
    title: "Audience",
    body: "Everyone who buys becomes a contact you own — not a follower on a platform that can change the rules.",
  },
  {
    icon: BarChart3,
    title: "Revenue",
    body: "One ledger across everything you sell. Gross, fees, and exactly what landed in your account.",
  },
  {
    icon: Landmark,
    title: "Payouts",
    body: "Connect your bank once. Every settlement is listed, and nothing is held in between.",
  },
  {
    icon: Link2,
    title: "Storefront",
    body: "One public page with everything you're selling. Put it in your bio and stop rewriting link lists.",
  },
];

const BEFORE = [
  "Payment links scattered across four different tools",
  "“Send me your account details”",
  "Screenshots to match against a list by hand",
  "Chasing the people who never paid",
  "No single place that says what you actually earned",
];

const AFTER = [
  "One link for everything you sell",
  "Buyers pay by card or bank transfer",
  "Every sale recorded the moment it happens",
  "Money settled straight to your bank",
  "One dashboard with the real numbers",
];

const STEPS = [
  {
    number: "01",
    title: "Create what you're selling",
    body: "A product, a ticketed event, a session. Set a price, or make it free.",
  },
  {
    number: "02",
    title: "Share your link",
    body: "Your storefront, or a direct link to one thing. Works in a bio, a chat, a story — anywhere.",
  },
  {
    number: "03",
    title: "Get paid",
    body: "Buyers pay however they like. Your money settles directly to your bank — it never sits with us.",
  },
];

const BUYER_TRUST = [
  {
    icon: X,
    title: "No account, no app",
    body: "Buyers tap the link and pay. No sign-up, no download, no password between them and checkout.",
  },
  {
    icon: Users,
    title: "They see who's already in",
    body: "Real names of people who've bought or RSVP'd — the clearest signal that a link is genuine.",
  },
  {
    icon: ShieldCheck,
    title: "Your name on the page",
    body: "Your photo and profile are front and centre. People are trusting you, not an unfamiliar logo.",
  },
  {
    icon: MessageCircle,
    title: "Looks right when shared",
    body: "Cover art, title, date and price appear in the link preview before the page even loads.",
  },
];

const FAQS = [
  {
    q: "What can I actually sell?",
    a: "Digital products, event tickets, and services or sessions — all from the same account, the same link and the same checkout.",
  },
  {
    q: "Do my buyers need an account?",
    a: "No. They tap your link, enter their name and email, and pay. No sign-up, no app.",
  },
  {
    q: "How do I get my money?",
    a: "Straight to your own bank account. Payments are split at the moment someone pays, so your share settles directly to you — Paylance never holds it.",
  },
  {
    q: "Can I run something for free?",
    a: "Yes. Free events and free products work the same way — you just collect sign-ups instead of payments, and you still see exactly who came through.",
  },
  {
    q: "What does it cost?",
    a: "Nothing to start and no monthly fee. We take a small percentage when you actually get paid, so if you don't sell anything, you don't pay anything.",
  },
  {
    q: "Do I need a website?",
    a: "No. Your storefront is the website. You get one shareable link with everything you sell on it.",
  },
];

export default function LandingPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);
  const isSignedIn = mounted && !!user;

  const primaryHref = isSignedIn ? "/overview" : "/login";
  const primaryLabel = isSignedIn ? "Go to dashboard" : "Start selling free";

  const NAV = [
    ["#sell", "What you can sell"],
    ["#how-it-works", "How it works"],
    ["#dashboard", "Your dashboard"],
    ["#faq", "FAQ"],
  ] as const;

  return (
    <main className="theme-light min-h-screen overflow-x-hidden bg-background text-text">
      {/* ---------------- Nav ---------------- */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Layers3 className="h-4 w-4 text-white" />
            </span>
            <span className="text-base font-bold tracking-tight">Paylance</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {NAV.map(([href, label]) => (
              <a key={href} href={href} className="text-sm text-subtle transition-colors hover:text-text">
                {label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {!isSignedIn && (
              <Link href="/login" className="text-sm font-medium text-subtle transition-colors hover:text-text">
                Sign in
              </Link>
            )}
            <Link
              href={primaryHref}
              className="flex h-9 items-center gap-2 rounded-lg bg-text px-4 text-xs font-semibold text-background transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              {isSignedIn ? "Dashboard" : "Get started"} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text md:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </nav>

        {menuOpen && (
          <div className="border-t border-border bg-background px-5 py-4 md:hidden">
            <div className="flex flex-col gap-4">
              {NAV.map(([href, label]) => (
                <a key={href} href={href} onClick={() => setMenuOpen(false)} className="text-sm text-subtle">
                  {label}
                </a>
              ))}
              <Link
                href={primaryHref}
                className="flex h-10 items-center justify-center rounded-lg bg-text text-xs font-semibold text-background"
              >
                {isSignedIn ? "Dashboard" : "Get started"}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden px-5 pb-20 pt-20 sm:pt-28">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] max-w-[140vw] -translate-x-1/2 rounded-full opacity-[0.16] blur-[110px]"
          style={{ background: "radial-gradient(circle, #3B82F6 0%, transparent 65%)" }}
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-border bg-surface/70 px-4 py-1.5 backdrop-blur-sm">
            <span className="text-xs font-medium text-subtle">The operating system for creator businesses</span>
          </div>

          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
            Run your whole business
            <br />
            from{" "}
            <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-emerald-600 bg-clip-text text-transparent">
              one link
            </span>
            .
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-subtle sm:text-lg">
            Sell digital products, run paid events, book sessions, know who your buyers are, and get
            paid straight to your bank — all from a single dashboard.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={primaryHref}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-text px-7 text-sm font-bold text-background shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.98] sm:w-auto"
            >
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              className="flex h-12 w-full items-center justify-center rounded-xl border border-border bg-surface px-7 text-sm font-semibold text-text transition-colors hover:bg-muted sm:w-auto"
            >
              See how it works
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-subtle">
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-600" /> Free to start
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-600" /> No monthly fee
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-600" /> Paid straight to your bank
            </span>
          </div>
        </div>
      </section>

      {/* ---------------- What you can sell ---------------- */}
      <section id="sell" className="border-t border-border/60 px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you sell, in one place
            </h2>
            <p className="mt-4 text-base text-subtle">
              Products, events and services sit side by side — same checkout, same buyer list, same
              bank account.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {SELLABLE.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-surface p-7 transition-all hover:-translate-y-1 hover:border-subtle/30"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                  <item.icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="mt-5 text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-subtle">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Before / after ---------------- */}
      <section className="border-t border-border/60 px-5 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Stop running your business out of a chat thread
            </h2>
            <p className="mt-4 text-base text-subtle">
              Every time money is involved, a good idea turns into admin work.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface p-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-subtle">Before</p>
              <ul className="mt-6 space-y-4">
                {BEFORE.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-subtle">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-blue-500/40 bg-surface p-7 shadow-xl shadow-blue-500/5">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">
                With Paylance
              </p>
              <ul className="mt-6 space-y-4">
                {AFTER.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm font-medium text-text">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section id="how-it-works" className="border-t border-border/60 px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Three steps to your first sale</h2>
            <p className="mt-4 text-base text-subtle">
              You could be taking payments before the end of the day.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.number} className="rounded-2xl border border-border bg-surface p-7">
                <span className="text-sm font-bold text-blue-600">{step.number}</span>
                <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-subtle">{step.body}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-12 flex max-w-2xl items-center gap-3 rounded-2xl border border-border bg-muted/50 px-5 py-4">
            <Link2 className="h-4 w-4 shrink-0 text-blue-600" />
            <p className="text-sm text-subtle">
              Your storefront lives at{" "}
              <span className="font-semibold text-text">paylance.me/yourname</span> — short enough to
              read out loud.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- Buyer trust ---------------- */}
      <section className="border-t border-border/60 px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Built so buyers actually go through with it
            </h2>
            <p className="mt-4 text-base text-subtle">
              Nobody taps a payment link without thinking twice. Every page is designed to answer
              that hesitation before it costs you a sale.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {BUYER_TRUST.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-surface p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                  <item.icon className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="mt-5 text-base font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-subtle">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- The dashboard ---------------- */}
      <section id="dashboard" className="border-t border-border/60 px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              The part that makes it a business
            </h2>
            <p className="mt-4 text-base text-subtle">
              Selling is the easy half. Knowing who bought, what earned, and where the money went is
              what turns it into something you can run.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {DASHBOARD.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-border bg-surface p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                  <feature.icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="mt-5 text-base font-bold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-subtle">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Pricing ---------------- */}
      <section id="pricing" className="border-t border-border/60 px-5 py-24">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-border bg-surface p-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              You only pay when you get paid
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-subtle">
              Nothing to sign up. No monthly fee. We take a small percentage of each sale — so if
              nobody buys, it costs you nothing.
            </p>

            <div className="mx-auto mt-8 grid max-w-lg gap-3 text-left sm:grid-cols-2">
              {["No subscription", "No setup fee", "Unlimited products & events", "Free items stay free"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                    {item}
                  </div>
                )
              )}
            </div>

            <Link
              href={primaryHref}
              className="mx-auto mt-9 flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-text text-sm font-bold text-background transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              {primaryLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section id="faq" className="border-t border-border/60 px-5 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Questions, answered
          </h2>

          <div className="mt-12 divide-y divide-border rounded-2xl border border-border bg-surface">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
                  {faq.q}
                  <span className="shrink-0 text-subtle transition-transform group-open:rotate-45">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-subtle">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Final CTA ---------------- */}
      <section className="border-t border-border/60 px-5 py-24">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border bg-surface px-6 py-16 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-64 w-[600px] max-w-[120vw] -translate-x-1/2 rounded-full opacity-[0.14] blur-[90px]"
            style={{ background: "radial-gradient(circle, #3B82F6 0%, transparent 65%)" }}
          />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              What are you selling?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-subtle">
              Set it up now, share your link today, and let people pay you properly.
            </p>
            <Link
              href={primaryHref}
              className="mx-auto mt-8 flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-text text-sm font-bold text-background shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              {primaryLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="border-t border-border/60 px-5 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
              <Layers3 className="h-3.5 w-3.5 text-white" />
            </span>
            <span className="text-sm font-bold tracking-tight">Paylance</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
            <a href="#sell" className="text-xs text-subtle transition-colors hover:text-text">
              What you can sell
            </a>
            <a href="#pricing" className="text-xs text-subtle transition-colors hover:text-text">
              Pricing
            </a>
            <a href="#faq" className="text-xs text-subtle transition-colors hover:text-text">
              FAQ
            </a>
            <Link href="/login" className="text-xs text-subtle transition-colors hover:text-text">
              Sign in
            </Link>
          </div>

          <p className="text-xs text-subtle">© {new Date().getFullYear()} Paylance</p>
        </div>
      </footer>
    </main>
  );
}
