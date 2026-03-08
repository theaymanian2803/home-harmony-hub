CREATE OR REPLACE FUNCTION public.increment_property_views(_property_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE properties SET views = COALESCE(views, 0) + 1 WHERE id = _property_id;
$$;