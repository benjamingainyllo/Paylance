import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { markTransactionSuccessful } from "@/lib/transactions";

// Paystack signs the raw request body with the secret key (HMAC-SHA512) and
// sends it as `x-paystack-signature`. We must verify against the raw bytes
// before parsing JSON, or the signature check is meaningless.
export async function POST(request: NextRequest) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    console.error("Paystack webhook: missing PAYSTACK_SECRET_KEY");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  const expectedSignature = crypto.createHmac("sha512", secretKey).update(rawBody).digest("hex");
  const signatureBuffer = signature ? Buffer.from(signature) : null;
  const expectedBuffer = Buffer.from(expectedSignature);

  const isValid =
    signatureBuffer !== null &&
    signatureBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(signatureBuffer, expectedBuffer);

  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (event?.event === "charge.success") {
    const reference = event?.data?.reference;
    if (reference) {
      const result = await markTransactionSuccessful(reference);
      if (!result.success) {
        console.error("Paystack webhook: failed to settle transaction", reference, result.error);
      }
    }
  }

  // Always 200 so Paystack doesn't keep retrying events we've already handled.
  return NextResponse.json({ received: true });
}
