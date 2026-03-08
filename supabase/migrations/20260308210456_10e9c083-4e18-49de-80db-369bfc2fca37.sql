CREATE OR REPLACE FUNCTION public.get_property_saves_count(_user_id uuid)
RETURNS TABLE(property_id uuid, saves_count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT sp.property_id, COUNT(*) as saves_count
  FROM saved_properties sp
  INNER JOIN properties p ON p.id = sp.property_id
  WHERE p.user_id = _user_id
  GROUP BY sp.property_id;
$$;