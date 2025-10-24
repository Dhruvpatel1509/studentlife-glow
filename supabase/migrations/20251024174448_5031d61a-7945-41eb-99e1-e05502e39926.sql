-- Create timetable table for storing schedule data
CREATE TABLE public.timetable (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_name TEXT NOT NULL,
  day_time TEXT NOT NULL,
  course TEXT NOT NULL,
  room TEXT,
  instructor TEXT,
  cycle TEXT,
  sem_group TEXT NOT NULL DEFAULT '252035',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.timetable ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view timetable (public data)
CREATE POLICY "Anyone can view timetable"
ON public.timetable
FOR SELECT
USING (true);

-- Only admins can insert timetable entries
CREATE POLICY "Admins can insert timetable"
ON public.timetable
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update timetable entries
CREATE POLICY "Admins can update timetable"
ON public.timetable
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete timetable entries
CREATE POLICY "Admins can delete timetable"
ON public.timetable
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at trigger
CREATE TRIGGER update_timetable_updated_at
  BEFORE UPDATE ON public.timetable
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample timetable data for different days
INSERT INTO public.timetable (day_name, day_time, course, room, instructor, cycle, sem_group) VALUES
  -- Monday
  ('Montag', '7:30 - 9:00', 'PTI90180 Car-to-Car Communication', '201 (Main Building)', 'Prof. Grimm, F.', 'Weekly', '252035'),
  ('Montag', '9:15 - 10:45', 'WIW64000 Business Information Systems', '165 (MHG)', 'Prof. Schumann, C.', 'Weekly', '252035'),
  ('Montag', '11:00 - 12:30', 'PTI90220 Advanced Computer Graphics', '305 (Lab)', 'Prof. Hellbach', 'Weekly', '252035'),
  
  -- Tuesday
  ('Dienstag', '8:00 - 9:30', 'Database Systems', '220 (PKB)', 'Prof. Mueller, K.', 'Weekly', '252035'),
  ('Dienstag', '10:00 - 11:30', 'Software Engineering', '165 (MHG)', 'Prof. Weber, S.', 'Weekly', '252035'),
  ('Dienstag', '13:00 - 14:30', 'Network Security', '305 (Lab)', 'Prof. Schmidt, T.', 'Weekly', '252035'),
  
  -- Wednesday
  ('Mittwoch', '7:30 - 9:00', 'Mobile Application Development', '201 (Main Building)', 'Prof. Fischer, M.', 'Weekly', '252035'),
  ('Mittwoch', '9:15 - 10:45', 'Artificial Intelligence', '165 (MHG)', 'Prof. Wagner, A.', 'Weekly', '252035'),
  ('Mittwoch', '11:00 - 12:30', 'Cloud Computing', '305 (Lab)', 'Prof. Becker, L.', 'Weekly', '252035'),
  
  -- Thursday
  ('Donnerstag', '8:00 - 9:30', 'Web Technologies', '220 (PKB)', 'Prof. Hoffmann, J.', 'Weekly', '252035'),
  ('Donnerstag', '10:00 - 11:30', 'Data Analytics', '165 (MHG)', 'Prof. Klein, R.', 'Weekly', '252035'),
  ('Donnerstag', '13:00 - 14:30', 'Internet of Things', '305 (Lab)', 'Prof. Neumann, P.', 'Weekly', '252035'),
  
  -- Friday
  ('Freitag', '7:30 - 10:50', 'PTI90220 Advanced Computer Graphics - Project Work', '305 (Lab)', 'Prof. Hellbach', 'Weekly', '252035'),
  ('Freitag', '11:00 - 12:30', 'Software Quality Assurance', '165 (MHG)', 'Prof. Richter, H.', 'Weekly', '252035'),
  ('Freitag', '13:00 - 14:30', 'Distributed Systems', '201 (Main Building)', 'Prof. Koch, E.', 'Weekly', '252035');