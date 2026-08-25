const PAYSTACK_BASE_URL = "https://api.paystack.co";

export interface InitializeTransactionPayload {
  email: string;
  amountInNaira: number;
  reference: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
}

export async function initializePaystackTransaction(payload: InitializeTransactionPayload) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Missing PAYSTACK_SECRET_KEY");
  }

  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secretKey}`
    },
    body: JSON.stringify({
      email: payload.email,
      amount: Math.round(payload.amountInNaira * 100),
      currency: "NGN",
      reference: payload.reference,
      callback_url: payload.callbackUrl,
      metadata: payload.metadata
    })
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.message || "Could not initialize Paystack transaction.");
  }

  return json;
}

export async function verifyPaystackTransaction(reference: string) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Missing PAYSTACK_SECRET_KEY");
  }

  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: {
      Authorization: `Bearer ${secretKey}`
    },
    cache: "no-store"
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.message || "Could not verify Paystack transaction.");
  }

  return json;
}

export function calculatePlatformFee(amountInNaira: number) {
  const fee = amountInNaira * 0.09;
  return Number(fee.toFixed(2));
}
