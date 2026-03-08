import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ListingOption {
  id: string;
  category: string;
  value: string;
  sort_order: number;
}

export function useListingOptions() {
  const [options, setOptions] = useState<ListingOption[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOptions = async () => {
    const { data } = await supabase
      .from("listing_options")
      .select("id, category, value, sort_order")
      .order("sort_order", { ascending: true });
    setOptions((data as ListingOption[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchOptions(); }, []);

  const getByCategory = (category: string) =>
    options.filter((o) => o.category === category);

  return { options, loading, getByCategory, refetch: fetchOptions };
}
