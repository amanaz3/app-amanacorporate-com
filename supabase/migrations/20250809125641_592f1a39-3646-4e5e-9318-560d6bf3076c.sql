-- Create logs table for application logging
CREATE TABLE public.logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  component TEXT,
  level TEXT DEFAULT 'info' CHECK (level IN ('debug', 'info', 'warning', 'error', 'fatal')),
  user_email TEXT,
  user_id UUID REFERENCES auth.users(id),
  stack_trace TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for logs
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for logs
CREATE POLICY "Authenticated users can insert logs" ON public.logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can view all logs" ON public.logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete logs" ON public.logs FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);