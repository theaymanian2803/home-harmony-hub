import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function useSaveProperty(propertyId: string) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const isValidUuid = UUID_REGEX.test(propertyId);

  useEffect(() => {
    if (!user || !isValidUuid) { setSaved(false); return; }
    supabase
      .from("saved_properties")
      .select("id")
      .eq("user_id", user.id)
      .eq("property_id", propertyId)
      .maybeSingle()
      .then(({ data }) => setSaved(!!data));
  }, [user, propertyId]);

  const toggle = useCallback(async () => {
    if (!user || loading || !isValidUuid) return false;
    setLoading(true);
    try {
      if (saved) {
        await supabase.from("saved_properties").delete().eq("user_id", user.id).eq("property_id", propertyId);
        setSaved(false);
        return false;
      } else {
        await supabase.from("saved_properties").insert({ user_id: user.id, property_id: propertyId });
        setSaved(true);
        return true;
      }
    } finally {
      setLoading(false);
    }
  }, [user, propertyId, saved, loading, isValidUuid]);

  return { saved, toggle, isLoggedIn: !!user };
}
