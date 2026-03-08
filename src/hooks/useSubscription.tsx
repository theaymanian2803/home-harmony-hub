import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useSubscription() {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsSubscribed(false);
      setLoading(false);
      return;
    }

    const fetchSub = async () => {
      const { data } = await supabase
        .from("subscriptions")
        .select("status, plan")
        .eq("user_id", user.id)
        .maybeSingle();

      setIsSubscribed(data?.status === "active" && data?.plan === "pro");
      setLoading(false);
    };

    fetchSub();
  }, [user]);

  const createSubscription = async () => {
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
    }
    return result;
  };

  return { isSubscribed, loading, createSubscription, activateSubscription };
}
