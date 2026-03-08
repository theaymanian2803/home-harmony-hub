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

interface PlanConfig {
  productId: string;
  productName: string;
  planName: string;
  description: string;
  price: string;
}

const PLAN_CONFIGS: Record<string, PlanConfig> = {
  pro: {
    productId: "SELLER_PRO",
    productName: "Seller Pro Subscription",
    planName: "Seller Pro Monthly",
    description: "$10/month for up to 25 listings",
    price: "10",
  },
  unlimited: {
    productId: "SELLER_UNLIMITED",
    productName: "Seller Unlimited Subscription",
    planName: "Seller Unlimited Monthly",
    description: "$90/month for unlimited listings",
    price: "90",
  },
};

async function ensurePlan(token: string, plan: string): Promise<string> {
  const config = PLAN_CONFIGS[plan];
  if (!config) throw new Error(`Unknown plan: ${plan}`);

  // Try to find existing plan
  const listRes = await fetch(
    `${PAYPAL_BASE}/v1/billing/plans?product_id=${config.productId}&page_size=1&total_required=true`,
    { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
  );

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
      "PayPal-Request-Id": `${config.productId}_PRODUCT`,
    },
    body: JSON.stringify({
      id: config.productId,
      name: config.productName,
      description: config.description,
      type: "SERVICE",
      category: "SOFTWARE",
    }),
  });

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
      product_id: config.productId,
      name: config.planName,
      description: config.description,
      billing_cycles: [
        {
          frequency: { interval_unit: "MONTH", interval_count: 1 },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: { value: config.price, currency_code: "USD" },
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

  const planData = await planRes.json();
  return planData.id;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    const { returnUrl, cancelUrl, plan = "pro" } = await req.json();

    const ppToken = await getPayPalAccessToken();
    const planId = await ensurePlan(ppToken, plan);

    // Create subscription
    const subRes = await fetch(`${PAYPAL_BASE}/v1/billing/subscriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ppToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan_id: planId,
        custom_id: `${user.id}|${plan}`,
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
      plan: plan,
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
