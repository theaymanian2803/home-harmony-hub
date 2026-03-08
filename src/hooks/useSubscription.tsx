import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type PlanType = "free" | "pro" | "unlimited";

export interface SubscriptionDetails {
  status: string;
  plan: PlanType;
  currentPeriodEnd: string | null;
  currentPeriodStart: string | null;
}

export function getListingLimit(plan: PlanType): number {
  switch (plan) {
    case "unlimited": return Infinity;
    case "pro": return 25;
    default: return 2;
  }
}

export function useSubscription() {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<SubscriptionDetails | null>(null);

  const fetchSub = async () => {
    if (!user) {
      setIsSubscribed(false);
      setDetails(null);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("subscriptions")
      .select("status, plan, current_period_start, current_period_end")
      .eq("user_id", user.id)
      .maybeSingle();

    const active = data?.status === "active" && (data?.plan === "pro" || data?.plan === "unlimited");
    setIsSubscribed(active);
    // Only show paid plan if subscription is active; otherwise treat as free
    const effectivePlan: PlanType = active ? ((data?.plan as PlanType) || "free") : "free";
    setDetails(
      data
        ? {
            status: data.status,
            plan: effectivePlan,
            currentPeriodStart: data.current_period_start,
            currentPeriodEnd: data.current_period_end,
          }
        : null
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchSub();
  }, [user]);

  const createSubscription = async (plan: "pro" | "unlimited" = "pro") => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");

    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    const res = await fetch(
      `https://${projectId}.supabase.co/functions/v1/paypal-create-subscription`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
          returnUrl: `${window.location.origin}/pricing?status=success`,
          cancelUrl: `${window.location.origin}/pricing?status=cancelled`,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create subscription");
    }

    return res.json();
  };

  const activateSubscription = async (subscriptionId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");

    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    const res = await fetch(
      `https://${projectId}.supabase.co/functions/v1/paypal-activate-subscription`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscriptionId }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to activate subscription");
    }

    const result = await res.json();
    if (result.status === "active") {
      setIsSubscribed(true);
      await fetchSub();
    }
    return result;
  };

  const cancelSubscription = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");

    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    const res = await fetch(
      `https://${projectId}.supabase.co/functions/v1/paypal-cancel-subscription`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to cancel subscription");
    }

    const result = await res.json();
    setIsSubscribed(false);
    await fetchSub();
    return result;
  };

  return { isSubscribed, loading, details, createSubscription, activateSubscription, cancelSubscription, refetch: fetchSub };
}
