-- Create event_proposals table for student submissions
CREATE TABLE public.event_proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  registration_info TEXT,
  language TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.event_proposals ENABLE ROW LEVEL SECURITY;

-- Students can submit their own proposals
CREATE POLICY "Students can submit proposals"
ON public.event_proposals
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Students can view their own proposals
CREATE POLICY "Students can view their own proposals"
ON public.event_proposals
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all proposals
CREATE POLICY "Admins can view all proposals"
ON public.event_proposals
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update proposals (for approval/decline)
CREATE POLICY "Admins can update proposals"
ON public.event_proposals
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete proposals
CREATE POLICY "Admins can delete proposals"
ON public.event_proposals
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_event_proposals_updated_at
BEFORE UPDATE ON public.event_proposals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();