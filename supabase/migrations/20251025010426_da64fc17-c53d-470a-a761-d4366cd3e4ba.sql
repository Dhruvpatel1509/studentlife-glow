-- Create table for German culture interactions
CREATE TABLE public.german_culture_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  situation TEXT NOT NULL,
  culture_background TEXT NOT NULL,
  german_behavior TEXT NOT NULL,
  interpretation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.german_culture_interactions ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can view culture interactions" 
ON public.german_culture_interactions 
FOR SELECT 
USING (true);

-- Create policy for admins to manage data
CREATE POLICY "Admins can manage culture interactions" 
ON public.german_culture_interactions 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert the data
INSERT INTO public.german_culture_interactions (situation, culture_background, german_behavior, interpretation) VALUES
('People staring on trams or in public', 'China, India, Azerbaijan', 'Germans often make direct eye contact or look around without smiling', 'Not rude — just normal observation; Germans are less expressive in public'),
('Short or blunt replies (e.g., "Nein." "Geht nicht.")', 'India, East Asia', 'Germans communicate directly and value efficiency', 'It''s not anger — just clarity; they skip polite small talk'),
('No small talk with strangers (e.g., cashier or neighbor)', 'South Asia, China', 'Germans usually separate private and social spheres', 'Silence doesn''t mean unfriendliness'),
('Invitations are rare and planned early', 'India, China, Middle East', 'Germans schedule hangouts days/weeks ahead', 'It''s about planning, not rejection'),
('Group work: everyone sticks to their task', 'India, East Europe', 'Germans divide work clearly, less informal chatter', 'Respect for time and individual responsibility'),
('Professors asking for opinions', 'China, India', 'German professors expect critical thinking, not memorization', 'Saying "I don''t agree" is encouraged'),
('No touching or hugging easily', 'South Asia, Middle East', 'Physical boundaries are stronger', 'Respect for personal space'),
('Punctuality taken seriously', 'South Asia, China', '5 minutes late can be seen as disrespect', 'Time = respect'),
('Separate bills ("Getrennt zahlen")', 'India, Azerbaijan', 'Each pays their part; not splitting equally', 'Independence and fairness culture'),
('Few compliments or smiles at strangers', 'China, India', 'Compliments are reserved for meaning, not casual', 'They value sincerity'),
('Formal communication with professors (emails, greetings)', 'India, East Asia', '"Sehr geehrte/r" and titles are expected', 'Professional distance'),
('Weekends are quiet (shops closed Sundays)', 'Asia, Middle East', 'Sunday = rest day, even malls closed', 'Family and rest priority'),
('Roommates not sharing food', 'South Asia', 'Germans buy and label their own groceries', 'Privacy and budgeting'),
('Direct feedback (even criticism)', 'Asia', 'Honest, precise feedback in class/work', 'Not personal; meant to help'),
('Public transport silence', 'India, Azerbaijan', 'People speak quietly, no loud calls', 'Respect for shared space'),
('Formal greetings to bus drivers or shopkeepers ("Hallo", "Danke")', 'China, India', 'Saying hello/thanks is expected', 'Shows respect and politeness');