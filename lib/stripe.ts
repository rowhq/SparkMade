import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

/**
 * Create a payment intent for a project deposit
 */
export async function createDepositIntent(
  amount: number,
  projectId: string,
  backerId: string
): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    metadata: {
      projectId,
      backerId,
      type: 'deposit',
    },
    capture_method: 'manual', // Hold funds in escrow
  });
}

/**
 * Refund a payment intent
 */
export async function refundPaymentIntent(paymentIntentId: string): Promise<Stripe.Refund> {
  return await stripe.refunds.create({
    payment_intent: paymentIntentId,
  });
}

/**
 * Capture a payment intent (convert from hold to actual charge)
 */
export async function capturePaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.capture(paymentIntentId);
}

/**
 * Create a Stripe Connect account for a manufacturer
 */
export async function createConnectAccount(
  email: string,
  businessName: string
): Promise<Stripe.Account> {
  return await stripe.accounts.create({
    type: 'standard',
    email,
    business_profile: {
      name: businessName,
    },
  });
}

/**
 * Create a transfer to a manufacturer
 */
export async function transferToManufacturer(
  amount: number,
  manufacturerAccountId: string,
  projectId: string
): Promise<Stripe.Transfer> {
  return await stripe.transfers.create({
    amount,
    currency: 'usd',
    destination: manufacturerAccountId,
    metadata: {
      projectId,
    },
  });
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}
