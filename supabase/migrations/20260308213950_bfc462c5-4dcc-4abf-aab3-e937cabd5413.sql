
-- Key-value store for landing page content
CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT '',
  section text NOT NULL DEFAULT 'general',
  label text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site content"
  ON public.site_content FOR SELECT USING (true);

CREATE POLICY "Admins can insert site content"
  ON public.site_content FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update site content"
  ON public.site_content FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete site content"
  ON public.site_content FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Testimonials table
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL DEFAULT '',
  quote text NOT NULL,
  rating int NOT NULL DEFAULT 5,
  avatar text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active testimonials"
  ON public.testimonials FOR SELECT USING (true);

CREATE POLICY "Admins can insert testimonials"
  ON public.testimonials FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update testimonials"
  ON public.testimonials FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete testimonials"
  ON public.testimonials FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed default stats
INSERT INTO public.site_content (key, value, section, label, sort_order) VALUES
  ('stat_active_buyers_value', '25,000+', 'stats', 'Active Buyers Value', 1),
  ('stat_active_buyers_label', 'Active Buyers', 'stats', 'Active Buyers Label', 2),
  ('stat_properties_listed_value', '4,800+', 'stats', 'Properties Listed Value', 3),
  ('stat_properties_listed_label', 'Properties Listed', 'stats', 'Properties Listed Label', 4),
  ('stat_trusted_sellers_value', '1,200+', 'stats', 'Trusted Sellers Value', 5),
  ('stat_trusted_sellers_label', 'Trusted Sellers', 'stats', 'Trusted Sellers Label', 6),
  ('stat_successful_sales_value', '3,400+', 'stats', 'Successful Sales Value', 7),
  ('stat_successful_sales_label', 'Successful Sales', 'stats', 'Successful Sales Label', 8),
  ('hero_badge', 'The #1 Marketplace for Premium Properties', 'hero', 'Hero Badge Text', 1),
  ('hero_title_line1', 'Find Your Perfect', 'hero', 'Hero Title Line 1', 2),
  ('hero_title_line2', 'Dream Home', 'hero', 'Hero Title Line 2', 3),
  ('hero_subtitle', 'Discover premium properties curated for you. Buy, sell, or rent with confidence on the most trusted real estate platform.', 'hero', 'Hero Subtitle', 4),
  ('why_badge', 'Why Choose Us', 'why_choose_us', 'Section Badge', 1),
  ('why_title_start', 'Why People ', 'why_choose_us', 'Title Start', 2),
  ('why_title_highlight', 'Choose Us', 'why_choose_us', 'Title Highlight', 3),
  ('why_subtitle', 'We combine cutting-edge technology with deep real estate expertise to give you the best property experience.', 'why_choose_us', 'Subtitle', 4),
  ('how_badge', 'Simple Process', 'how_it_works', 'Section Badge', 1),
  ('how_title_start', 'How It ', 'how_it_works', 'Title Start', 2),
  ('how_title_highlight', 'Works', 'how_it_works', 'Title Highlight', 3),
  ('how_subtitle', 'Three simple steps to find and secure your perfect property.', 'how_it_works', 'Subtitle', 4),
  ('cta_title_line1', 'Ready to Find Your', 'cta', 'CTA Title Line 1', 1),
  ('cta_title_line2', 'Perfect Property?', 'cta', 'CTA Title Line 2', 2),
  ('cta_subtitle', 'Join thousands of satisfied buyers and sellers. Start your real estate journey today.', 'cta', 'CTA Subtitle', 3);

-- Seed default testimonials
INSERT INTO public.testimonials (name, role, quote, rating, avatar, sort_order) VALUES
  ('Sarah & Mark Thompson', 'First-time Buyers', 'EstateHub made finding our dream home effortless. The verified listings gave us confidence, and we closed in just 3 weeks!', 5, 'ST', 1),
  ('David Chen', 'Property Investor', 'As an investor, I need reliable data. EstateHub''s analytics and market insights helped me make smart purchasing decisions.', 5, 'DC', 2),
  ('Emily Rodriguez', 'Home Seller', 'I listed my property and had 3 offers within a week. The dashboard made managing everything incredibly simple.', 5, 'ER', 3);
