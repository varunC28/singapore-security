-- Create the enquiries table
CREATE TABLE public.enquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    total_value DECIMAL(10, 2) NOT NULL,
    items JSONB NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow service role to do everything (Edge functions use service role)
-- Do not allow public anon access to read/write enquiries directly from the frontend
CREATE POLICY "Enable insert for authenticated users only" ON "public"."enquiries"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (true);

-- The Edge Function uses the Service Role key, which bypasses RLS, so it can insert records safely.
