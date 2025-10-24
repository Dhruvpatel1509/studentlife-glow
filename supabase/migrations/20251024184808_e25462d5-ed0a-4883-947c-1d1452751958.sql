-- Add new columns to events table for detailed information
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS language text,
ADD COLUMN IF NOT EXISTS registration_info text;

COMMENT ON COLUMN public.events.description IS 'Detailed description of the event';
COMMENT ON COLUMN public.events.language IS 'Language(s) the event will be conducted in';
COMMENT ON COLUMN public.events.registration_info IS 'Registration requirements and mandatory information';