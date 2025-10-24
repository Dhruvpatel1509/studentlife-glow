-- Create email campaigns table
CREATE TABLE public.email_campaigns (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  sent_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create email analytics table
CREATE TABLE public.email_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id uuid REFERENCES public.email_campaigns(id) ON DELETE CASCADE,
  user_id uuid,
  opened_at timestamp with time zone,
  clicked_at timestamp with time zone,
  bounced boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create event attendance table
CREATE TABLE public.event_attendance (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
  user_id uuid,
  attended_at timestamp with time zone NOT NULL DEFAULT now(),
  tracking_link text
);

-- Enable RLS
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email_campaigns
CREATE POLICY "Admins can manage email campaigns"
  ON public.email_campaigns
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for email_analytics
CREATE POLICY "Admins can view email analytics"
  ON public.email_analytics
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can track email opens/clicks"
  ON public.email_analytics
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update email analytics"
  ON public.email_analytics
  FOR UPDATE
  USING (true);

-- RLS Policies for event_attendance
CREATE POLICY "Admins can view event attendance"
  ON public.event_attendance
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can record attendance"
  ON public.event_attendance
  FOR INSERT
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_email_analytics_campaign_id ON public.email_analytics(campaign_id);
CREATE INDEX idx_email_analytics_opened_at ON public.email_analytics(opened_at) WHERE opened_at IS NOT NULL;
CREATE INDEX idx_email_analytics_clicked_at ON public.email_analytics(clicked_at) WHERE clicked_at IS NOT NULL;
CREATE INDEX idx_event_attendance_event_id ON public.event_attendance(event_id);

-- Trigger for updating updated_at on email_campaigns
CREATE TRIGGER update_email_campaigns_updated_at
  BEFORE UPDATE ON public.email_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();