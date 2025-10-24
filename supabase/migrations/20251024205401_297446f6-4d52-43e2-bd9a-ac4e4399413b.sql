-- Create mensa_menu table
CREATE TABLE public.mensa_menu (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_station TEXT NOT NULL,
  dish_description TEXT NOT NULL,
  price_s TEXT,
  price_m TEXT,
  price_g TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mensa_menu ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view mensa menu
CREATE POLICY "Anyone can view mensa menu"
ON public.mensa_menu
FOR SELECT
USING (true);

-- Admins can manage mensa menu
CREATE POLICY "Admins can manage mensa menu"
ON public.mensa_menu
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert data from WHZ_Mensa_Week44_Monday
INSERT INTO public.mensa_menu (meal_station, dish_description, price_s, price_m, price_g, notes) VALUES
('Pasta Zwickau', 'Spirelli (81) with Sauce All Arrabiata (6) and grated Gouda (19) or Reiberei (1). Also available as small portion.', '2,30 €', '5,30 €', '6,60 €', '81, 6, 19, 1'),
('Campusteller Zwickau', 'Gnocchi-pan with/without chicken strips, fresh arugula and red pepper (15), plus cream cheese sauce (19,81)', '4,40 €', '6,90 €', '8,50 €', '15, 19, 81'),
('Heiße Theke Zwickau', 'Broccoli-Nut corner (71,72,81,84) and salsa dip (9) with bean-quinoa-couscous (49,81)', '3,90 €', '6,30 €', '7,60 €', '71,72,81,84; 9; 49,81');

-- Create whz_news table
CREATE TABLE public.whz_news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.whz_news ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view news
CREATE POLICY "Anyone can view whz news"
ON public.whz_news
FOR SELECT
USING (true);

-- Admins can manage news
CREATE POLICY "Admins can manage whz news"
ON public.whz_news
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert data from whz_news
INSERT INTO public.whz_news (title, description) VALUES
('WHZ-Forscher stellen kühlbaren Pavillon vor', 'Der Pavillon soll im Sommer nicht nur Schatten spenden, sondern auch die Luft darunter kühlen. Ein erster Prototyp konnte Anfang September der Ostdeutschen Motorrad-Trial-Meisterschaft 2025 in Oelsnitz/V. getestet werden.'),
('Aktionstag klärt über Demenz auf und gibt Tipps für den Alltag', 'Wie fühlt es sich an, wenn sich die eigene Wahrnehmung verändert? Dieser Frage widmete sich der Aktionstag „Demenz und Sinne", den die Lokale Allianz für Menschen mit Demenz Zwickau am 24. September im Innenhof des Schloss Osterstein veranstaltet wurde.'),
('FTZ gestaltet erneut GMM-Fachtagung „EMV in der Kraftfahrzeugtechnik"', 'Unter dem Motto „Herausforderungen und Lösungen zur Sicherstellung der EMV in modernen Automobilen" fand am 8. und 9. Oktober 2025 im Forschungs- und Innovationszentrum (FIZ) der BMW Group in München die 9. GMM-Fachtagung „Elektromagnetische Verträglichkeit (EMV) in der Kfz-Technik" statt.'),
('Forschungsforum der WHZ beleuchtet Facetten der Mobilität', 'Am 6. November findet das Forschungsforum der WHZ statt. Wissenschaftler der Hochschule zeigen dabei, dass Mobilität mehr ist als ein reines Verkehrsthema.'),
('FerienUni 2025 bringt Schüler und Studierende zusammen', 'Unter dem Motto „Studieren checken, Campus entdecken" fand vom 13. bis 17. Oktober 2025 an der WHZ die diesjährige FerienUni statt.'),
('Maschinenbau-Studierende erfolgreich mit regionalen Firmen vernetzt', 'Nur wenige Wochen nach Beginn des Wintersemesters zeigten sich die Studierenden neugierig auf neue Herausforderungen und möchten frühzeitig wichtige Kontakte für ihre berufliche Zukunft knüpfen.');