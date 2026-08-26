import { PaystackProvider } from "./paystack";
import type { PaymentProvider } from "./types";

export * from "./types";

let cached: PaymentProvider | null = null;

/**
 * The active payment provider.
 *
 * Everything outside this folder goes through this — no direct provider
 * imports, so adding or swapping a processor is a change in one place.
 */
export function getPaymentProvider(): PaymentProvider {
  if (!cached) {
    cached = new PaystackProvider();
  }
  return cached;
}
