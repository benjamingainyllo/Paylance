# Paylance: The Creator OS Business Model

## 1. Overview
Paylance is a vertically integrated "Business-in-a-Box" platform designed for high-growth digital creators. It centralizes audience management, monetization, and growth analytics into a single, high-fidelity interface.

---

## 2. Revenue Streams (How We Make Money)

### A. Transaction Fees (the only revenue stream)
The platform is the financial infrastructure for creator transactions. We take a
cut of each sale at the moment it happens — collected as the platform's share of
a split payment, never as a bill or a subscription.

*   **Ticket Sales**: a percentage of every event ticket sold.
*   **Offer Sales**: a percentage of digital products, consulting sessions and other offers.
*   **Storefront Purchases**: same rate, same rail.

Creators pay nothing to sign up, nothing monthly, and nothing when they don't sell.

**Open decision — the actual rate.** The schema carries `platform_fee_type` and
`platform_fee_value` per creator so this can change without a migration. The code
currently defaults to 9% (900 basis points). For reference, Tix.Africa charges
8% + ₦100 per ticket. This number needs to be settled before launch, and the
landing page deliberately does not quote a figure until it is.

### B. Explicitly NOT revenue streams

These are ruled out by the no-custody constraint, not by preference. Paylance
never holds creator funds — the payment provider splits at transaction time and
settles the creator's share directly to their own bank account. Anything that
requires us to sit on money in between is off the table:

*   ~~Payout / withdrawal fees~~ — there is no withdrawal; money never reaches us.
*   ~~Instant payout premiums~~ — same reason.
*   ~~SaaS subscription tiers~~ — decided against. No monthly plans.

---

## 3. Value Proposition (Why Creators Choose Us)

### 🚀 Consolidation
Replaces multiple fragmented tools (Linktree, Eventbrite, Gumroad, Mailchimp) with a single unified dashboard.

### 📈 Revenue Optimization
Deep analytics (like the Event Revenue Analysis) help creators identify high-performing content and monetization channels, allowing them to focus on what actually pays.

### ✨ Professional Branding
Provides a stunning, premium "Storefront" that elevates the creator's brand identity far beyond standard social media links.

### 🛠️ Audience Ownership
Unlike social platforms, Paylance gives creators direct access to their "Audience" data, ensuring they own their business independently of algorithm changes.

---

## 4. Target Market
*   **High-Growth Creators**: Influencers, educators, and artists with active audiences looking to professionalize their monetization.
*   **Event Hosts**: Creators who primarily engage their audience through meetups, workshops, and virtual sessions.
*   **Anyone selling to an audience**: not limited to one country or region. Payment
    rails determine where we can operate first, not the positioning.

---

## 5. Strategic Goal
To become the **default operating system** for the creator economy, moving creators from "content makers" to "sustainable business owners."
