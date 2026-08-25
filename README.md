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
  - Paystack initialize/verify transaction helpers
  - 9% platform fee utility
- Events, end-to-end:
  - Creator: create event (cover image, date/time, location, free or paid), dashboard list + detail view backed by real Supabase data
  - Public: storefront `Events` tab and standalone `/event/[id]` page for buyers
  - Checkout: real Paystack redirect flow for paid tickets, instant RSVP for free events, `/checkout/success` return page that verifies payment status
  - Backend: Paystack webhook (`/api/paystack/webhook`) confirms payment and atomically updates event attendee/revenue counters; shared checkout path also powers Offer purchases
  - Requires running `checkout-setup.sql` in Supabase (after `events-setup.sql`) and setting `PAYSTACK_SECRET_KEY` + `SUPABASE_SERVICE_ROLE_KEY` in the environment

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
- Safe-to-withdraw estimator
- Payout and fee transparency

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
