# Paylance

Creator monetization platform built with Next.js 14, Tailwind CSS, Supabase, and Paystack.

This README is the living product and execution document. We will update it continuously as features ship.

## Product Positioning

Paylance is a creator business operating system for Africa.

The goal is to go beyond a simple storefront and help creators run revenue, audience, products, and payouts in one place.

## Current Stack

- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS
- UI: Custom components (Shadcn-ready architecture)
- Database/Auth: Supabase
- Payments: Paystack
- Charts: Recharts

## Current Build Status

- Core folders initialized:
  - `components`
  - `app/(dashboard)`
  - `app/(storefront)`
  - `lib`
- Dashboard screens implemented:
  - `Overview`
  - `Offers`
  - `Audience`
  - `Revenue`
  - `Automations`
  - `Experiments`
  - `Integrations`
  - `Settings`
- Legacy routes redirected for compatibility:
  - `/home` -> `/overview`
  - `/store` -> `/offers`
  - `/income` -> `/revenue`
  - `/customers` -> `/audience`
  - `/analytics` -> `/experiments`
- Theme support added:
  - "Blue Eclipse" Dark theme and Light mode toggle
- Branding updates:
  - Bricolage Grotesque font
  - Sidebar profile section pinned to bottom
  - Custom avatar integrated
  - Currency standardized to Nigerian Naira (₦)
- Utilities:
  - Supabase client bootstrap
  - `lib/money.ts` — integer-kobo conversion, formatting and platform fee calculation
  - `lib/payments/` — provider-agnostic payment interface
- Commerce core (no-custody rail):
  - Payments run on split transactions with per-creator subaccounts — a buyer's payment
    splits at transaction time and the creator's share settles **directly to their own
    bank account**. Paylance never holds creator funds, so there is no wallet, no balance
    and no withdrawal anywhere in the product.
  - Money is stored and computed as integer kobo (`*_kobo`, `bigint`) via `lib/money.ts`
  - Payment logic sits behind a provider interface in `lib/payments/`; no column or module
    outside that folder is named after a processor
  - Shared `orders` ledger across Offers and Events, plus `settlements`, `payout_accounts`
    and `webhook_events` (idempotent webhook handling)
  - Offers and Events are created as **drafts**; publishing a paid item requires a
    connected bank account, enforced in a server action *and* a database trigger
  - Payouts is bank connection + read-only settlement history
  - Requires running `commerce-core.sql` in Supabase after `supabase-schema.sql`
- Events, end-to-end:
  - Creator: create event (cover image, date/time, location, free or paid), dashboard list + detail view backed by real Supabase data
  - Public: storefront `Events` tab and standalone `/event/[id]` page for buyers
  - Checkout: real Paystack redirect flow for paid tickets, instant RSVP for free events, `/checkout/success` return page that verifies payment status
  - Backend: signature-verified webhook at `/api/webhooks/payments` settles orders
    idempotently; event revenue is derived from `orders`, never accumulated on the row
  - Requires `commerce-core.sql` and the `PAYMENTS_PROVIDER_SECRET_KEY` (or legacy
    `PAYSTACK_SECRET_KEY`) + `SUPABASE_SERVICE_ROLE_KEY` environment variables

## Product Roadmap (Suggested)

### 1) Smart Checkout & Conversion

- Order bumps and one-click upsells
- Coupon engine and discount scheduling
- Abandoned checkout recovery

### 2) Memberships & Recurring Revenue

- Monthly/yearly subscriptions
- Tiered access and gated content
- Churn and retention analytics

### 3) Audience CRM

- Buyer and lead tagging
- Segment-based broadcast campaigns
- Email and WhatsApp workflow triggers

### 4) Affiliate & Referrals

- Creator affiliate links
- Commission tracking
- Referral payout management

### 5) Product Protection

- Expiring download links
- Limited download count
- Watermarking for digital assets

### 6) Revenue Intelligence

- Cashflow forecast
- Payout and fee transparency

> Note: anything implying Paylance holds creator funds (wallet, balance,
> withdrawal, "safe-to-withdraw") is out of scope by design — settlement goes
> directly to the creator's bank via split payments.

## UX/Brand Direction (Not a Clone)

To avoid looking like a copy, the app should evolve into a distinct visual identity:

- New information architecture:
  - `Overview`, `Offers`, `Audience`, `Revenue`, `Automations`, `Experiments`
- Unique dashboard personality:
  - Accent packs (Indigo, Emerald, Sunset, Mono)
- Strong micro-interactions:
  - Animated KPI counters, richer hovers, progressive reveal panels
- More dynamic storefront:
  - Featured offers, social proof strips, countdowns, testimonials

## 30-Day Execution Plan

- Week 1: Rebrand UI system + navigation redesign
- Week 1 status: Completed
- Week 2: Offer builder + upsell checkout MVP
- Week 3: CRM tagging + broadcast flows
- Week 4: Membership tiers + analytics v2 + experiment lab MVP

## Development

Install dependencies and run:

```bash
npm install
npm run dev
```

Open:

- `http://localhost:3000/home`
- `http://localhost:3000/overview`

## Update Protocol

When updating this file, keep sections in this order:

1. Product Positioning
2. Current Stack
3. Current Build Status
4. Product Roadmap
5. UX/Brand Direction
6. Execution Plan
7. Development

Every shipped feature should update:

- `Current Build Status`
- The corresponding roadmap item status (if started/completed)
