-- Fix search_path for verify_admin_code function
CREATE OR REPLACE FUNCTION public.verify_admin_code(_code TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT _code = '1509'
$$;