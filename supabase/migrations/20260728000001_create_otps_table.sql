-- Create the otps table for custom OTP verification
CREATE TABLE public.otps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    phone TEXT NOT NULL,
    otp TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    verified BOOLEAN DEFAULT false NOT NULL
);

-- Enable RLS
ALTER TABLE public.otps ENABLE ROW LEVEL SECURITY;
