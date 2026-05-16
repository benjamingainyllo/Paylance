"use server";

import { v4 as uuidv4 } from "uuid";

interface CheckoutPayload {
  offer_id: string;
  email: string;
  amountInNaira: number;
}

export async function createCheckoutSession(payload: CheckoutPayload) {
  // Will be fully implemented on Day 4 with Paystack integration
  // For now, return a placeholder response
  try {
    const reference = uuidv4();

    // TODO: Initialize Paystack transaction
    // TODO: Create pending transaction in DB

    return {
      success: false,
      error: "Payments are being set up. Check back soon!",
      authorization_url: null,
      reference,
    };
  } catch (error) {
    return {
      success: false,
      error: "Checkout is not yet configured.",
      authorization_url: null,
    };
  }
}