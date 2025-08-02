-- Create support_inquiries table
CREATE TABLE support_inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT NOT NULL,
    message TEXT NOT NULL,
    budget TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'closed'))
);

-- Create index on email for faster queries
CREATE INDEX idx_support_inquiries_email ON support_inquiries(email);

-- Create index on created_at for sorting
CREATE INDEX idx_support_inquiries_created_at ON support_inquiries(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE support_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for form submissions)
CREATE POLICY "Anyone can submit support inquiries" ON support_inquiries
    FOR INSERT WITH CHECK (true);

-- Only admins can view support inquiries
CREATE POLICY "Only admins can view support inquiries" ON support_inquiries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Only admins can update support inquiries
CREATE POLICY "Only admins can update support inquiries" ON support_inquiries
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );