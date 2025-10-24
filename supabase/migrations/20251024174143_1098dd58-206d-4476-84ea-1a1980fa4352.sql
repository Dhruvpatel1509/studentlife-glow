-- Create updated_at function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create exams table for storing exam schedule data
CREATE TABLE public.exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course TEXT NOT NULL,
  space TEXT,
  lecturer TEXT,
  date TEXT NOT NULL,
  period TEXT,
  sem_group TEXT NOT NULL DEFAULT '252035',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view exams (public data)
CREATE POLICY "Anyone can view exams"
ON public.exams
FOR SELECT
USING (true);

-- Only admins can insert exams
CREATE POLICY "Admins can insert exams"
ON public.exams
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update exams
CREATE POLICY "Admins can update exams"
ON public.exams
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete exams
CREATE POLICY "Admins can delete exams"
ON public.exams
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at trigger
CREATE TRIGGER update_exams_updated_at
  BEFORE UPDATE ON public.exams
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the fallback exam data
INSERT INTO public.exams (course, space, lecturer, date, period, sem_group) VALUES
  ('WIW64000 Business Information Systems - 252035', '165 (MHG)', 'Prof.Schumann,C.', '02.02.2026', '10:00 a.m. to 11:30 a.m.', '252035'),
  ('PTI90220 Advanced Computer Graphics_GAB216 - 252035', '', 'Prof.Hellbach', '04.02.2026', '9:00 a.m. to 5:00 p.m.', '252035'),
  ('PTI90180 Car-to-Car Communication - 252035', '370 (PKB Building 2)', 'Prof.Grimm,F.', '11.02.2026', '9:00 a.m. to 5:00 p.m.', '252035');