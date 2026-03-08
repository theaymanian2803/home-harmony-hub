
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS sqft integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS lot_size integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS year_built integer,
  ADD COLUMN IF NOT EXISTS parking integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS stories integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS heating text,
  ADD COLUMN IF NOT EXISTS cooling text,
  ADD COLUMN IF NOT EXISTS flooring text,
  ADD COLUMN IF NOT EXISTS roof text,
  ADD COLUMN IF NOT EXISTS neighborhood text,
  ADD COLUMN IF NOT EXISTS zip_code text,
  ADD COLUMN IF NOT EXISTS latitude double precision,
  ADD COLUMN IF NOT EXISTS longitude double precision,
  ADD COLUMN IF NOT EXISTS hoa_fee numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS property_style text;
