import { PaystackProvider } from "./paystack";
import { MockPaymentProvider } from "./mock";
import type { PaymentProvider } from "./types";

export * from "./types";

let cached: PaymentProvider | null = null;

/**
 * Is a real payment gateway configured?
 *
 * When it isn't, the app runs in demo mode: everything works end to end,
 * but no money moves and nothing talks to a real processor.
 */
export function isDemoPaymentMode(): boolean {
  return !(process.env.PAYMENTS_PROVIDER_SECRET_KEY || process.env.PAYSTACK_SECRET_KEY);
}

/**
 * The active payment provider.
 *
 * Everything outside this folder goes through this — no direct provider
 * imports — so switching from demo to a live gateway is a matter of setting
 * one environment variable, with no other code change anywhere.
 */
export function getPaymentProvider(): PaymentProvider {
  if (!cached) {
    cached = isDemoPaymentMode() ? new MockPaymentProvider() : new PaystackProvider();
  }
  return cached;
}
