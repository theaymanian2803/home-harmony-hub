
CREATE TABLE public.listing_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  value text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (category, value)
);

ALTER TABLE public.listing_options ENABLE ROW LEVEL SECURITY;

-- Anyone can read options (needed for forms)
CREATE POLICY "Anyone can view listing options"
  ON public.listing_options FOR SELECT
  USING (true);

-- Only admins can manage options
CREATE POLICY "Admins can insert listing options"
  ON public.listing_options FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update listing options"
  ON public.listing_options FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete listing options"
  ON public.listing_options FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed default options
INSERT INTO public.listing_options (category, value, sort_order) VALUES
  ('property_type', 'House', 1),
  ('property_type', 'Apartment', 2),
  ('property_type', 'Condo', 3),
  ('property_type', 'Townhouse', 4),
  ('property_type', 'Villa', 5),
  ('heating', 'Central', 1),
  ('heating', 'Forced Air', 2),
  ('heating', 'Radiant', 3),
  ('heating', 'Heat Pump', 4),
  ('cooling', 'Central AC', 1),
  ('cooling', 'Mini-Split', 2),
  ('cooling', 'Window Unit', 3),
  ('cooling', 'Evaporative', 4),
  ('flooring', 'Hardwood', 1),
  ('flooring', 'Tile', 2),
  ('flooring', 'Carpet', 3),
  ('flooring', 'Laminate', 4),
  ('flooring', 'Vinyl', 5),
  ('roof', 'Shingle', 1),
  ('roof', 'Metal', 2),
  ('roof', 'Tile', 3),
  ('roof', 'Flat', 4),
  ('property_style', 'Colonial', 1),
  ('property_style', 'Modern', 2),
  ('property_style', 'Contemporary', 3),
  ('property_style', 'Ranch', 4),
  ('property_style', 'Victorian', 5),
  ('property_style', 'Mediterranean', 6),
  ('amenity', 'Pool', 1),
  ('amenity', 'Garden', 2),
  ('amenity', 'Garage', 3),
  ('amenity', 'Smart Home', 4),
  ('amenity', 'Gym', 5),
  ('amenity', 'Fireplace', 6),
  ('amenity', 'Laundry', 7),
  ('amenity', 'Security System', 8);
