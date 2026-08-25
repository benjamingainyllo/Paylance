"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Layers3,
  ArrowRight,
  Store,
  Ticket,
  Users,
  BarChart3,
  Wallet,
  Sparkles,
  Check,
  Menu,
  X,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";

const FEATURES = [
  {
    icon: Store,
    title: "Your own storefront",
    body: "A branded page at paylance.com/yourname where your audience can browse and buy everything you sell — no website needed.",
    accent: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Sparkles,
    title: "Sell digital offers",
    body: "Ebooks, presets, templates, coaching calls. Create an offer in a minute and share the link anywhere.",
    accent: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: Ticket,
    title: "Events & ticketing",
    body: "Host workshops, meetups and virtual sessions. Sell tickets or take free RSVPs, and track who's coming.",
    accent: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    icon: Users,
    title: "Own your audience",
    body: "Every buyer and lead lands in your CRM. Tag them, segment them, and reach them directly — no algorithm in the way.",
    accent: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: BarChart3,
    title: "Revenue intelligence",
    body: "See what actually earns. Track sales, ticket revenue and growth over time in one clean dashboard.",
    accent: "text-sky-400",
    bg: "bg-sky-500/10",
  },
  {
    icon: Wallet,
    title: "Get paid in Naira",
    body: "Payments run on Paystack and settle to your local bank account. Transparent fees, no surprises.",
    accent: "text-amber-400",
    bg: "bg-amber-500/10",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Create your storefront",
    body: "Sign up, pick your handle, and your public page is live in under two minutes.",
  },
  {
    number: "02",
    title: "Add offers and events",
    body: "List a digital product or set up a ticketed event. Set your price in Naira, or make it free.",
  },
  {
    number: "03",
    title: "Share and get paid",
    body: "Drop your link in your bio. Payments land through Paystack and your dashboard updates in real time.",
  },
];

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    cadence: "",
    description: "Everything you need to make your first sale.",
    features: [
      "Branded storefront",
      "Unlimited digital offers",
      "Events & ticketing",
      "Audience CRM",
      "Revenue dashboard",
    ],
    note: "Transaction fee applies on sales",
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    cadence: "/month",
    description: "For creators turning content into steady income.",
    features: [
      "Everything in Starter",
      "Advanced automations",
      "Custom domain",
      "Broadcast campaigns",
      "Priority support",
    ],
    note: "Lower transaction fee",
    cta: "Go Pro",
    highlighted: true,
  },
  {
    name: "Business",
    price: "$49",
    cadence: "/month",
    description: "For creator teams running at scale.",
    features: [
      "Everything in Pro",
      "Multi-member teams",
      "White-label storefront",
      "Deep API integrations",
      "Instant payouts",
    ],
    note: "Lowest transaction fee",
    cta: "Scale up",
    highlighted: false,
  },
];

const FAQS = [
  {
    q: "How do I get paid?",
    a: "Payments are processed through Paystack and settle directly into your Nigerian bank account. You can track every transaction from your Revenue dashboard.",
  },
  {
    q: "What does Paylance cost?",
    a: "Starting is free — we take a small percentage of each sale. If you want advanced automations, a custom domain or team access, Pro and Business plans reduce that percentage and unlock more tools.",
  },
  {
    q: "Do I need a website?",
    a: "No. Your Paylance storefront is your website. You get a shareable link that works in any bio, and you can point a custom domain at it on Pro.",
  },
  {
    q: "Can I sell both products and event tickets?",
    a: "Yes. Digital offers and ticketed events live side by side on the same storefront, and both feed into the same revenue and audience data.",
  },
  {
    q: "Who is Paylance built for?",
    a: "Creators, educators, artists and event hosts in Africa who want to run a real business instead of juggling five different tools.",
  },
];

export default function LandingPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const isSignedIn = mounted && !!user;

  return (
    <main className="min-h-screen bg-background text-text overflow-x-hidden">
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
            <a href="#features" className="text-sm text-subtle transition-colors hover:text-text">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-subtle transition-colors hover:text-text">
              How it works
            </a>
            <a href="#pricing" className="text-sm text-subtle transition-colors hover:text-text">
              Pricing
            </a>
            <a href="#faq" className="text-sm text-subtle transition-colors hover:text-text">
              FAQ
            </a>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {isSignedIn ? (
              <Link
                href="/overview"
                className="flex h-9 items-center gap-2 rounded-lg bg-text px-4 text-xs font-semibold text-background transition-transform hover:scale-[1.03] active:scale-[0.98]"
              >
                Go to dashboard <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-subtle transition-colors hover:text-text">
                  Sign in
                </Link>
                <Link
                  href="/login"
                  className="flex h-9 items-center gap-2 rounded-lg bg-text px-4 text-xs font-semibold text-background transition-transform hover:scale-[1.03] active:scale-[0.98]"
                >
                  Get started <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}
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
              <a href="#features" onClick={() => setMenuOpen(false)} className="text-sm text-subtle">
                Features
              </a>
              <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="text-sm text-subtle">
                How it works
              </a>
              <a href="#pricing" onClick={() => setMenuOpen(false)} className="text-sm text-subtle">
                Pricing
              </a>
              <a href="#faq" onClick={() => setMenuOpen(false)} className="text-sm text-subtle">
                FAQ
              </a>
              <Link
                href={isSignedIn ? "/overview" : "/login"}
                className="flex h-10 items-center justify-center rounded-lg bg-text text-xs font-semibold text-background"
              >
                {isSignedIn ? "Go to dashboard" : "Get started"}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden px-5 pt-20 pb-24 sm:pt-28 sm:pb-32">
        {/* Ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] max-w-[140vw] -translate-x-1/2 rounded-full opacity-30 blur-[110px]"
          style={{ background: "radial-gradient(circle, #3B82F6 0%, transparent 65%)" }}
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-border bg-surface/70 px-4 py-1.5 backdrop-blur-sm">
            <Zap className="h-3.5 w-3.5 fill-current text-blue-500" />
            <span className="text-xs font-medium text-subtle">The creator business OS for Africa</span>
          </div>

          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
            Turn your audience
            <br />
            into a{" "}
            <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
              real business
            </span>
            .
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-subtle sm:text-lg">
            Sell digital products, host paid events, grow your audience and get paid in Naira — all
            from one dashboard. No website, no code, no five separate tools.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={isSignedIn ? "/overview" : "/login"}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-text px-7 text-sm font-bold text-background shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.98] sm:w-auto"
            >
              {isSignedIn ? "Go to dashboard" : "Create your storefront"}
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
              <Check className="h-3.5 w-3.5 text-emerald-500" /> Free to start
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-500" /> No monthly fee to sell
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Secured by Paystack
            </span>
          </div>
        </div>

        {/* Replaces-these strip */}
        <div className="relative mx-auto mt-20 max-w-3xl">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-subtle">
            Replaces the tools you&apos;re duct-taping together
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold text-subtle/60">
            <span>Link in bio</span>
            <span className="text-subtle/30">•</span>
            <span>Digital storefront</span>
            <span className="text-subtle/30">•</span>
            <span>Event ticketing</span>
            <span className="text-subtle/30">•</span>
            <span>Email list</span>
            <span className="text-subtle/30">•</span>
            <span>Payment links</span>
          </div>
        </div>
      </section>

      {/* ---------------- Features ---------------- */}
      <section id="features" className="border-t border-border/60 px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything your business needs
            </h2>
            <p className="mt-4 text-base text-subtle">
              One place to sell, host, track and get paid — instead of stitching together tools that
              were never built for you.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:border-subtle/30"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${feature.bg}`}>
                  <feature.icon className={`h-5 w-5 ${feature.accent}`} />
                </div>
                <h3 className="mt-5 text-base font-bold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-subtle">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section id="how-it-works" className="border-t border-border/60 px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Live in three steps</h2>
            <p className="mt-4 text-base text-subtle">
              You could be taking your first payment before the end of the day.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.number} className="relative rounded-2xl border border-border bg-surface p-7">
                <span className="text-sm font-bold text-blue-500">{step.number}</span>
                <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-subtle">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Pricing ---------------- */}
      <section id="pricing" className="border-t border-border/60 px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Pricing that grows with you</h2>
            <p className="mt-4 text-base text-subtle">
              Start free and only pay a percentage when you actually earn. Upgrade when you want more
              power and lower fees.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-7 ${
                  plan.highlighted
                    ? "border-blue-500/50 bg-surface shadow-xl shadow-blue-500/5"
                    : "border-border bg-surface"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-7 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    Most popular
                  </span>
                )}

                <h3 className="text-sm font-bold uppercase tracking-wider text-subtle">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                  {plan.cadence && <span className="text-sm text-subtle">{plan.cadence}</span>}
                </div>
                <p className="mt-3 text-sm text-subtle">{plan.description}</p>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-text">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <p className="mt-6 text-xs text-subtle">{plan.note}</p>

                <Link
                  href="/login"
                  className={`mt-4 flex h-11 items-center justify-center rounded-xl text-sm font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] ${
                    plan.highlighted
                      ? "bg-blue-600 text-white"
                      : "border border-border bg-muted text-text"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
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
            className="pointer-events-none absolute left-1/2 top-0 h-64 w-[600px] max-w-[120vw] -translate-x-1/2 rounded-full opacity-25 blur-[90px]"
            style={{ background: "radial-gradient(circle, #3B82F6 0%, transparent 65%)" }}
          />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Your audience is ready to buy.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-subtle">
              Set up your storefront in minutes and start earning from the people who already follow
              you.
            </p>
            <Link
              href={isSignedIn ? "/overview" : "/login"}
              className="mx-auto mt-8 flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-text text-sm font-bold text-background shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              {isSignedIn ? "Go to dashboard" : "Get started free"}
              <ArrowRight className="h-4 w-4" />
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
            <a href="#features" className="text-xs text-subtle transition-colors hover:text-text">
              Features
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
            © {new Date().getFullYear()} Paylance. Built for African creators.
          </p>
        </div>
      </footer>
    </main>
  );
}
