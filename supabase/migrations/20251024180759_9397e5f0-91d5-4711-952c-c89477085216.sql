-- Delete all existing records from timetable table
DELETE FROM public.timetable;

-- Insert timetable data for all weekdays
-- Monday
INSERT INTO public.timetable (day_name, day_time, course, room, instructor, cycle, sem_group) VALUES
('Montag', '7:30 - 9:00', 'PTI90180 Car-to-Car Communication', '201 (Main Building)', 'Prof. Grimm, F.', 'Weekly', '252035'),
('Montag', '9:15 - 10:45', 'Software Engineering', '305 (Main Building)', 'Prof. Schmidt, M.', 'Weekly', '252035'),
('Montag', '11:00 - 12:30', 'Database Systems', '201 (Main Building)', 'Prof. Weber, A.', 'Weekly', '252035'),
('Montag', '13:00 - 14:30', 'Web Development', '305 (Main Building)', 'Prof. Müller, J.', 'Weekly', '252035');

-- Tuesday
INSERT INTO public.timetable (day_name, day_time, course, room, instructor, cycle, sem_group) VALUES
('Dienstag', '7:30 - 9:00', 'Advanced Programming', '201 (Main Building)', 'Prof. Klein, R.', 'Weekly', '252035'),
('Dienstag', '9:15 - 10:45', 'Computer Networks', '305 (Main Building)', 'Prof. Fischer, T.', 'Weekly', '252035'),
('Dienstag', '11:00 - 12:30', 'Operating Systems', '201 (Main Building)', 'Prof. Wagner, K.', 'Weekly', '252035'),
('Dienstag', '13:00 - 14:30', 'Mobile Development', '305 (Main Building)', 'Prof. Becker, L.', 'Weekly', '252035');

-- Wednesday
INSERT INTO public.timetable (day_name, day_time, course, room, instructor, cycle, sem_group) VALUES
('Mittwoch', '7:30 - 9:00', 'Algorithms & Data Structures', '201 (Main Building)', 'Prof. Schulz, H.', 'Weekly', '252035'),
('Mittwoch', '9:15 - 10:45', 'Artificial Intelligence', '305 (Main Building)', 'Prof. Hoffmann, P.', 'Weekly', '252035'),
('Mittwoch', '11:00 - 12:30', 'Cloud Computing', '201 (Main Building)', 'Prof. Bauer, S.', 'Weekly', '252035');

-- Thursday
INSERT INTO public.timetable (day_name, day_time, course, room, instructor, cycle, sem_group) VALUES
('Donnerstag', '7:30 - 9:00', 'Information Security', '201 (Main Building)', 'Prof. Wolf, D.', 'Weekly', '252035'),
('Donnerstag', '9:15 - 10:45', 'Machine Learning', '305 (Main Building)', 'Prof. Krause, N.', 'Weekly', '252035'),
('Donnerstag', '11:00 - 12:30', 'Project Management', '201 (Main Building)', 'Prof. Meyer, B.', 'Weekly', '252035'),
('Donnerstag', '13:00 - 14:30', 'Software Testing', '305 (Main Building)', 'Prof. Richter, C.', 'Weekly', '252035');

-- Friday
INSERT INTO public.timetable (day_name, day_time, course, room, instructor, cycle, sem_group) VALUES
('Freitag', '7:30 - 9:00', 'Distributed Systems', '201 (Main Building)', 'Prof. Koch, E.', 'Weekly', '252035'),
('Freitag', '9:15 - 10:45', 'DevOps & CI/CD', '305 (Main Building)', 'Prof. Zimmermann, G.', 'Weekly', '252035'),
('Freitag', '11:00 - 12:30', 'Blockchain Technology', '201 (Main Building)', 'Prof. Schmitt, V.', 'Weekly', '252035'),
('Freitag', '13:00 - 14:30', 'IoT Systems', '305 (Main Building)', 'Prof. Lang, W.', 'Weekly', '252035');