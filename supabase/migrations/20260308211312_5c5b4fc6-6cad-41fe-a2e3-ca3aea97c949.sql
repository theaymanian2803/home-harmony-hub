CREATE POLICY "Users can view own properties"
ON public.properties
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);