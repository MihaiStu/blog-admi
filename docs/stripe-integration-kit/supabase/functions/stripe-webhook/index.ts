// stripe-webhook – Verifica firma Stripe y actualiza DB en checkout.session.completed y subscription updated/deleted.
// Secrets: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "https://esm.sh/stripe@14?target=denonext";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-11-20.acacia",
});
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
const cryptoProvider = Stripe.createSubtleCryptoProvider();

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {
  const signature = req.headers.get("Stripe-Signature");
  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider
    );
  } catch (e) {
    console.error("Webhook signature verification failed:", e);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orgId = session.metadata?.organization_id;
        const subscriptionId = session.subscription as string;
        if (!orgId || !subscriptionId) break;

        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        const customerId = sub.customer as string;

        await supabase
          .from("organizations")
          .update({
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            plan: "premium",
          })
          .eq("id", orgId);
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const orgId = sub.metadata?.organization_id;
        if (!orgId) break;

        const plan = sub.status === "active" ? "premium" : "free";
        await supabase
          .from("organizations")
          .update({
            stripe_subscription_id: plan === "premium" ? sub.id : null,
            plan,
          })
          .eq("id", orgId);
        break;
      }

      default:
        break;
    }
  } catch (e) {
    console.error("Webhook handler error:", e);
    return new Response("Handler error", { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
