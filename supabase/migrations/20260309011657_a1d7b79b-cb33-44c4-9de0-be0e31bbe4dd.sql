-- Allow authenticated users to read public profile info of any user (for viewing seller info on listings)
CREATE POLICY "Anyone can view public profile info"
ON public.profiles FOR SELECT
USING (true);