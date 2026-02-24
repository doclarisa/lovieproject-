-- ============================================================================
-- LOVIE PROJECT - SUPABASE SCHEMA SETUP
-- ============================================================================
-- Run this SQL in your Supabase SQL Editor
-- https://supabase.com/dashboard/project/[YOUR-PROJECT]/sql/new
--
-- STEPS:
-- 1. Go to Supabase Dashboard
-- 2. Select your project
-- 3. Click "SQL Editor" in the left sidebar
-- 4. Click "New Query"
-- 5. Copy and paste this entire script
-- 6. Click "Run"
-- ============================================================================

-- ============================================================================
-- 1. CREATE PROFILES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,

  -- Basic Info
  name TEXT NOT NULL,
  tagline TEXT,
  bio TEXT,
  city TEXT,
  country TEXT,
  email TEXT,
  language TEXT DEFAULT 'ru' CHECK (language IN ('ru', 'en')),

  -- Social & Links
  website_url TEXT,
  instagram TEXT,
  other_social TEXT,
  tags TEXT[] DEFAULT '{}',

  -- Media
  photo_url TEXT,
  gallery_urls TEXT[] DEFAULT '{}',

  -- Admin Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT
);

-- Create index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. CREATE RLS POLICIES FOR PROFILES TABLE
-- ============================================================================

-- Policy 1: Anyone can INSERT new profiles (for form submissions)
CREATE POLICY "Allow public to insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

-- Policy 2: Only approved profiles are readable by the public
CREATE POLICY "Allow public to read approved profiles"
  ON public.profiles FOR SELECT
  USING (status = 'approved');

-- Policy 3: Service role can read all profiles (for admin)
-- Service role bypasses RLS automatically, so no policy needed
-- But here's one for explicit SELECT if needed:
CREATE POLICY "Allow service role to read all profiles"
  ON public.profiles FOR SELECT
  USING (auth.role() = 'service_role');

-- Policy 4: Service role can update all profiles (for admin approval)
CREATE POLICY "Allow service role to update profiles"
  ON public.profiles FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Policy 5: Service role can delete profiles
CREATE POLICY "Allow service role to delete profiles"
  ON public.profiles FOR DELETE
  USING (auth.role() = 'service_role');

-- ============================================================================
-- 3. CREATE STORAGE BUCKET FOR PROFILE IMAGES
-- ============================================================================
-- NOTE: Storage buckets are created via dashboard or Supabase API.
-- The SQL interface doesn't support bucket creation.
-- AFTER running this SQL, follow these steps in Supabase Dashboard:
--
-- 1. Click "Storage" in the left sidebar
-- 2. Click "New Bucket"
-- 3. Name: profile-images
-- 4. Mark as "Public bucket" ✓
-- 5. Click "Create bucket"
-- 6. Click on the bucket, then "Policies" tab
-- 7. Click "New Policy", then "For full customization"
-- 8. Copy the policy below and paste it
--
-- PASTE THIS INTO STORAGE POLICY (after creating the bucket):
-- {
--   "definition": {
--     "allow": "public",
--     "operation": "select"
--   }
-- }
--
-- For uploads, use authenticated users or public (depending on your needs)
-- ============================================================================

-- ============================================================================
-- 4. VERIFICATION QUERIES (Run these to confirm setup)
-- ============================================================================

-- Check if profiles table was created
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'profiles';

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'profiles';

-- List all RLS policies on profiles table
SELECT * FROM pg_policies
WHERE tablename = 'profiles';
