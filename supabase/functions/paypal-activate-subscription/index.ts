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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub as string;

    const { subscriptionId } = await req.json();
    if (!subscriptionId) {
      return new Response(JSON.stringify({ error: "subscriptionId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify subscription status with PayPal
    const ppToken = await getPayPalAccessToken();
    const subRes = await fetch(`${PAYPAL_BASE}/v1/billing/subscriptions/${subscriptionId}`, {
      headers: { Authorization: `Bearer ${ppToken}`, "Content-Type": "application/json" },
    });

    if (!subRes.ok) throw new Error("Failed to fetch subscription from PayPal");

    const subscription = await subRes.json();

    // Verify the subscription belongs to this user via custom_id
    const customParts = (subscription.custom_id || "").split("|");
    const subUserId = customParts[0];
    const plan = customParts.length > 1 ? customParts[1] : "pro";

    if (subUserId !== userId) {
      return new Response(JSON.stringify({ error: "Subscription does not belong to this user" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (subscription.status === "ACTIVE") {
      // Use PayPal's billing info for accurate period dates
      const now = new Date();
      let periodEnd: Date;

      if (subscription.billing_info?.next_billing_time) {
        periodEnd = new Date(subscription.billing_info.next_billing_time);
      } else {
        // Fallback: determine from plan name if annual
        const isAnnual = plan.includes("annual") || 
          (subscription.plan_id && subscription.billing_info?.cycle_executions?.some(
            (c: any) => c.frequency?.interval_unit === "YEAR"
          ));
        periodEnd = new Date(now);
        if (isAnnual) {
          periodEnd.setFullYear(periodEnd.getFullYear() + 1);
        } else {
          periodEnd.setMonth(periodEnd.getMonth() + 1);
        }
      }

      // Use service role for DB write
      const adminSupabase = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

      await adminSupabase.from("subscriptions").upsert({
        user_id: userId,
        paypal_subscription_id: subscriptionId,
        status: "active",
        plan: plan.replace("_annual", ""), // store base plan name
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
        updated_at: now.toISOString(),
      }, { onConflict: "user_id" });

      return new Response(JSON.stringify({ status: "active", plan: plan.replace("_annual", "") }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ status: subscription.status }), {
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
