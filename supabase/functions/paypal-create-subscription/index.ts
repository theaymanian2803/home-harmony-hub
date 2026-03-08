import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PAYPAL_BASE = Deno.env.get("PAYPAL_CLIENT_ID")?.startsWith("sb-")
  ? "https://api-m.sandbox.paypal.com"
  : "https://api-m.paypal.com";

async function getPayPalAccessToken(): Promise<string> {
  const clientId = Deno.env.get("PAYPAL_CLIENT_ID");
  const clientSecret = Deno.env.get("PAYPAL_CLIENT_SECRET");
  if (!clientId || !clientSecret) throw new Error("PayPal credentials not configured");

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) throw new Error(`PayPal auth failed: ${res.status}`);
  const data = await res.json();
  return data.access_token;
}

// Ensure a PayPal product + plan exist (idempotent)
async function ensurePlan(token: string): Promise<string> {
  // Try to find existing plan by listing
  const listRes = await fetch(`${PAYPAL_BASE}/v1/billing/plans?product_id=SELLER_PRO&page_size=1&total_required=true`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });

  if (listRes.ok) {
    const listData = await listRes.json();
    if (listData.plans && listData.plans.length > 0) {
      return listData.plans[0].id;
    }
  }

  // Create product
  const productRes = await fetch(`${PAYPAL_BASE}/v1/catalogs/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": "SELLER_PRO_PRODUCT",
    },
    body: JSON.stringify({
      id: "SELLER_PRO",
      name: "Seller Pro Subscription",
      description: "Unlimited property listings, analytics & priority support",
      type: "SERVICE",
      category: "SOFTWARE",
    }),
  });

  // Product may already exist (409), that's fine
  if (!productRes.ok && productRes.status !== 409) {
    const err = await productRes.text();
    console.error("Product creation error:", err);
  }

  // Create plan
  const planRes = await fetch(`${PAYPAL_BASE}/v1/billing/plans`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_id: "SELLER_PRO",
      name: "Seller Pro Monthly",
      description: "$10/month for unlimited listings",
      billing_cycles: [
        {
          frequency: { interval_unit: "MONTH", interval_count: 1 },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: { value: "10", currency_code: "USD" },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        payment_failure_threshold: 3,
      },
    }),
  });

  if (!planRes.ok) {
    const err = await planRes.text();
    throw new Error(`Plan creation failed: ${err}`);
  }

  const plan = await planRes.json();
  return plan.id;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify user
    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const token = authHeader?.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { returnUrl, cancelUrl } = await req.json();

    const ppToken = await getPayPalAccessToken();
    const planId = await ensurePlan(ppToken);

    // Create subscription
    const subRes = await fetch(`${PAYPAL_BASE}/v1/billing/subscriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ppToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan_id: planId,
        custom_id: user.id,
        application_context: {
          brand_name: "EstateHub",
          return_url: returnUrl,
          cancel_url: cancelUrl,
          user_action: "SUBSCRIBE_NOW",
        },
      }),
    });

    if (!subRes.ok) {
      const err = await subRes.text();
      throw new Error(`Subscription creation failed: ${err}`);
    }

    const subscription = await subRes.json();
    const approvalLink = subscription.links.find((l: any) => l.rel === "approve")?.href;

    // Store pending subscription
    await supabase.from("subscriptions").upsert({
      user_id: user.id,
      paypal_subscription_id: subscription.id,
      status: "pending",
      plan: "pro",
    }, { onConflict: "user_id" });

    return new Response(JSON.stringify({ approvalUrl: approvalLink, subscriptionId: subscription.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
