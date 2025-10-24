-- Insert dummy events
INSERT INTO public.events (title, location, event_date, event_time, image_url, category) VALUES
('Tech Career Fair 2024', 'Main Campus Hall', '2024-11-15', '10:00 AM', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop', 'Career'),
('AI & Machine Learning Workshop', 'Innovation Lab', '2024-11-20', '2:00 PM', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop', 'Tech'),
('Campus Football Tournament', 'Sports Complex', '2024-11-18', '5:00 PM', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop', 'Sports'),
('International Food Festival', 'Student Center Plaza', '2024-11-22', '12:00 PM', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop', 'Cultural'),
('Study Skills Seminar', 'Library Auditorium', '2024-11-25', '3:00 PM', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop', 'Academic'),
('Startup Pitch Night', 'Entrepreneurship Center', '2024-11-28', '6:00 PM', 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop', 'Career'),
('Cybersecurity Bootcamp', 'Computer Science Building', '2024-12-01', '9:00 AM', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop', 'Tech'),
('Basketball Championship', 'Main Arena', '2024-12-03', '7:00 PM', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop', 'Sports'),
('Cultural Dance Performance', 'Theater Hall', '2024-12-05', '8:00 PM', 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&auto=format&fit=crop', 'Cultural'),
('Research Methodology Workshop', 'Research Center', '2024-12-08', '1:00 PM', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop', 'Academic')
ON CONFLICT DO NOTHING;

-- Update wallet balances for existing profiles (if any exist)
-- This will add dummy balances to any profiles that already exist
UPDATE public.profiles 
SET wallet_balance = CASE 
  WHEN random() < 0.3 THEN 15.50
  WHEN random() < 0.6 THEN 42.75
  ELSE 78.20
END
WHERE wallet_balance = 0.00;