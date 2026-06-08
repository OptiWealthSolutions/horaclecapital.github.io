-- Create the leads table for marketing and prospecting
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  source text NOT NULL,
  status text DEFAULT 'new',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow service role (Edge Functions) to manage leads
-- (No specific policy needed for service_role as it bypasses RLS)

-- Allow public to insert leads (optional, but safer to do via Edge Function)
-- For now, we only use the Edge Function which uses service_role.
