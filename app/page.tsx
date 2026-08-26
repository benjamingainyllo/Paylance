"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Layers3,
  ArrowRight,
  Check,
  X,
  Menu,
  Link2,
  Users,
  Landmark,
  Store,
  BarChart3,
  Sparkles,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";

/**
 * The events wedge, not the OS pitch.
 *
 * "Sell your digital products online" is a sentence competitors already own.
 * "Collect money for your event without the screenshot wahala" is unowned, so
 * the page leads with that and introduces the wider product further down.
 */

const BEFORE = [
  "“Send me your account details”",
  "17 transfer screenshots in the group chat",
  "Ticking names off a list by hand",
  "Chasing the four people who never paid",
  "No idea what you actually made",
];

const AFTER = [
  "One link you share anywhere",
  "Guests pay by card or bank transfer",
  "A live list of who's paid",
  "Money straight into your bank account",
  "Exact totals, the moment they land",
];

const STEPS = [
  {
    number: "01",
    title: "Set up your event",
    body: "Name it, pick the date and place, set a price — or make it free. Takes about two minutes.",
  },
  {
    number: "02",
    title: "Share one link",
    body: "WhatsApp status, IG bio, the group chat. Anywhere you'd normally paste your account number.",
  },
  {
    number: "03",
    title: "Get paid",
    body: "Guests pay however they like. Your money settles directly to your bank — it never sits with us.",
  },
];

const GUEST_TRUST = [
  {
    icon: X,
    title: "No account, no app",
    body: "Your guests tap the link and pay. No sign-up, no download, no password to forget.",
  },
  {
    icon: Users,
    title: "They see who's coming",
    body: "Real names of people who already paid. The strongest signal a link is legit, not a scam.",
  },
  {
    icon: ShieldCheck,
    title: "Your face on the page",
    body: "Your name, photo and profile are front and centre. Guests are trusting you, not a logo.",
  },
  {
    icon: MessageCircle,
    title: "Looks right in WhatsApp",
    body: "Cover art, title, date and price show up in the preview before the page even loads.",
  },
];

const OS_FEATURES = [
  {
    icon: Store,
    title: "Sell more than tickets",
    body: "Ebooks, presets, courses, consulting sessions — same link, same checkout, same bank account.",
  },
  {
    icon: Users,
    title: "Keep your buyers",
    body: "Everyone who pays becomes a contact you own. Not a follower on someone else's platform.",
  },
  {
    icon: BarChart3,
    title: "See what actually earns",
    body: "Every ticket and every sale in one ledger. Gross, fees, and exactly what hit your account.",
  },
  {
    icon: Landmark,
    title: "Money you can trace",
    body: "Connect your bank once. Every payout is listed, with nothing held in between.",
  },
];

const FAQS = [
  {
    q: "Do my guests need to create an account?",
    a: "No. They tap your link, enter their name and email, and pay. That's the whole thing — no sign-up, no app.",
  },
  {
    q: "How do I get my money?",
    a: "It goes straight to your own bank account. Payments are split at the moment someone pays, so your share settles directly to you — Paylance never holds it.",
  },
  {
    q: "How can guests pay?",
    a: "Card or bank transfer, whichever they prefer. Everything runs on Paystack.",
  },
  {
    q: "Can I run a free event?",
    a: "Yes. Free events work the same way — you just get RSVPs instead of payments, and you still see exactly who's coming.",
  },
  {
    q: "What does it cost?",
    a: "Nothing to start and no monthly fee. We take a small percentage when you actually get paid, so if you don't sell anything, you don't pay anything.",
  },
  {
    q: "Is this only for parties?",
    a: "That's where most people start, but the same link works for workshops, classes, listening parties, game nights — anything where money changes hands.",
  },
];

export default function LandingPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);
  const isSignedIn = mounted && !!user;

  const primaryHref = isSignedIn ? "/events" : "/login";
  const primaryLabel = isSignedIn ? "Go to dashboard" : "Create your event";

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
            <a href="#how-it-works" className="text-sm text-subtle transition-colors hover:text-text">
              How it works
            </a>
            <a href="#guests" className="text-sm text-subtle transition-colors hover:text-text">
              For your guests
            </a>
            <a href="#more" className="text-sm text-subtle transition-colors hover:text-text">
              Beyond tickets
            </a>
            <a href="#faq" className="text-sm text-subtle transition-colors hover:text-text">
              FAQ
            </a>
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
              {[
                ["#how-it-works", "How it works"],
                ["#guests", "For your guests"],
                ["#more", "Beyond tickets"],
                ["#faq", "FAQ"],
              ].map(([href, label]) => (
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
            <span className="text-xs font-medium text-subtle">Built for Nigeria 🇳🇬</span>
          </div>

          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
            Stop chasing transfers
            <br />
            in your{" "}
            <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-emerald-600 bg-clip-text text-transparent">
              group chat
            </span>
            .
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-subtle sm:text-lg">
            Share one link for your event. Guests pay by card or transfer, you see exactly who&apos;s
            coming and who&apos;s paid, and the money lands straight in your bank account.
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
              <Check className="h-3.5 w-3.5 text-emerald-600" /> Guests need no account
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-600" /> Paid straight to your bank
            </span>
          </div>
        </div>
      </section>

      {/* ---------------- Before / after ---------------- */}
      <section className="border-t border-border/60 px-5 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">You know the wahala</h2>
            <p className="mt-4 text-base text-subtle">
              Every time money is involved, a good idea turns into admin work.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface p-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-subtle">
                The usual way
              </p>
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
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Three steps, one link</h2>
            <p className="mt-4 text-base text-subtle">
              You could be collecting money for your next event before the end of the day.
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
              Your link looks like <span className="font-semibold text-text">paylance.me/yourname</span> —
              short enough to read out loud.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- Guest experience / trust ---------------- */}
      <section id="guests" className="border-t border-border/60 px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Your guests won&apos;t think it&apos;s a scam
            </h2>
            <p className="mt-4 text-base text-subtle">
              Nobody in Nigeria taps a payment link without thinking twice. Every event page is built
              to answer that hesitation before it costs you a guest.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {GUEST_TRUST.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:border-subtle/30"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                  <item.icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="mt-5 text-base font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-subtle">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- The rest of the product ---------------- */}
      <section id="more" className="border-t border-border/60 px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span className="text-xs font-medium text-subtle">When you&apos;re ready</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">It doesn&apos;t stop at tickets</h2>
            <p className="mt-4 text-base text-subtle">
              Once your bank is connected and money is moving, selling anything else is one click —
              not a whole new setup.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {OS_FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-border bg-surface p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                  <feature.icon className="h-5 w-5 text-emerald-600" />
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
              {[
                "No subscription",
                "No setup fee",
                "Unlimited events",
                "Free events stay free",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm">
                  <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                  {item}
                </div>
              ))}
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
              What are you planning?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-subtle">
              Set it up now, share the link tonight, and let people pay you properly.
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
            <a href="#how-it-works" className="text-xs text-subtle transition-colors hover:text-text">
              How it works
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

          <p className="text-xs text-subtle">
            © {new Date().getFullYear()} Paylance. Made for Nigerian creators.
          </p>
        </div>
      </footer>
    </main>
  );
}
