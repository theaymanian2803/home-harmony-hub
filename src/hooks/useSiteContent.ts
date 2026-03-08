import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteContentItem {
  id: string;
  key: string;
  value: string;
  section: string;
  label: string;
  sort_order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatar: string;
  sort_order: number;
  is_active: boolean;
}

export function useSiteContent() {
  const [content, setContent] = useState<SiteContentItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    const [contentRes, testimonialsRes] = await Promise.all([
      supabase.from("site_content").select("*").order("sort_order"),
      supabase.from("testimonials").select("*").order("sort_order"),
    ]);
    setContent((contentRes.data as SiteContentItem[]) || []);
    setTestimonials((testimonialsRes.data as Testimonial[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const getValue = useCallback((key: string, fallback = "") => {
    const item = content.find((c) => c.key === key);
    return item?.value || fallback;
  }, [content]);

  const getBySection = useCallback((section: string) => {
    return content.filter((c) => c.section === section).sort((a, b) => a.sort_order - b.sort_order);
  }, [content]);

  const activeTestimonials = testimonials.filter((t) => t.is_active);

  return { content, testimonials, activeTestimonials, loading, getValue, getBySection, refetch: fetchAll };
}
