-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('ceo', 'developer')),
  avatar_url TEXT
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'image', 'video', 'note')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
-- Everyone can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- CEO can read all profiles
CREATE POLICY "CEO can read all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ceo'
    )
  );

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Submissions policies
-- Developers can read their own submissions
CREATE POLICY "Developers can read own submissions"
  ON submissions FOR SELECT
  USING (auth.uid() = developer_id);

-- CEO can read all submissions
CREATE POLICY "CEO can read all submissions"
  ON submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ceo'
    )
  );

-- Developers can insert their own submissions
CREATE POLICY "Developers can insert own submissions"
  ON submissions FOR INSERT
  WITH CHECK (auth.uid() = developer_id);

-- CEO can update submission status
CREATE POLICY "CEO can update submission status"
  ON submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ceo'
    )
  );

-- Create storage bucket for work evidence
INSERT INTO storage.buckets (id, name, public)
VALUES ('work-evidence', 'work-evidence', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
-- Developers can upload to their own folder
CREATE POLICY "Developers can upload own files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'work-evidence' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Developers can read their own files
CREATE POLICY "Developers can read own files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'work-evidence' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- CEO can read all files in work-evidence bucket
CREATE POLICY "CEO can read all files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'work-evidence' AND
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ceo'
    )
  );
