
CREATE OR REPLACE FUNCTION public.enforce_listing_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_plan text;
  sub_status text;
  listing_count int;
  max_listings int;
BEGIN
  -- Get the user's active subscription plan
  SELECT s.plan, s.status INTO current_plan, sub_status
  FROM public.subscriptions s
  WHERE s.user_id = NEW.user_id
    AND s.status = 'active'
  ORDER BY s.created_at DESC
  LIMIT 1;

  -- If user is admin, skip the check
  IF public.has_role(NEW.user_id, 'admin') THEN
    RETURN NEW;
  END IF;

  -- Determine max listings based on plan
  IF sub_status = 'active' AND current_plan = 'unlimited' THEN
    RETURN NEW; -- no limit
  ELSIF sub_status = 'active' AND current_plan = 'pro' THEN
    max_listings := 25;
  ELSE
    max_listings := 2; -- free plan
  END IF;

  -- Count existing listings for this user
  SELECT COUNT(*) INTO listing_count
  FROM public.properties
  WHERE user_id = NEW.user_id;

  IF listing_count >= max_listings THEN
    RAISE EXCEPTION 'Listing limit reached. Your current plan allows % listings. Upgrade your plan to list more properties.', max_listings;
  END IF;

  RETURN NEW;
END;
$$;

-- Create the trigger on INSERT only
CREATE TRIGGER check_listing_limit
  BEFORE INSERT ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_listing_limit();
