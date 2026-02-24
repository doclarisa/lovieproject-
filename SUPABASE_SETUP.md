# Supabase Setup Guide for Lovie Project

## Prerequisites
- A Supabase account (free at https://supabase.com)
- A Supabase project created
- Your Supabase project URL and API keys

---

## Step 1: Get Your Supabase Credentials

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Settings** (bottom left) → **API**
4. Copy and save these three values to your `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc... (long key)
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (another long key)
   ```

---

## Step 2: Run the SQL Schema

1. In Supabase Dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query** (top right)
3. Open `supabase_schema.sql` from this project
4. Copy the **entire** SQL script (from "CREATE TABLE" to the end)
5. Paste it into the Supabase SQL Editor
6. Click **Run** (blue button)
7. Wait for completion - you should see ✓ "Query executed successfully"

You'll see output like:
```
CREATE TABLE
CREATE INDEX
CREATE INDEX
ALTER TABLE
CREATE POLICY
CREATE POLICY
CREATE POLICY
CREATE POLICY
CREATE POLICY
SELECT 1
SELECT 1
SELECT 1
```

---

## Step 3: Create Storage Bucket

The SQL script can't create storage buckets. Do this manually:

1. In Supabase Dashboard, click **Storage** (left sidebar)
2. Click **New Bucket** (top right)
3. Fill in:
   - **Name**: `profile-images`
   - **Public bucket**: Toggle ✓ ON
   - Click **Create bucket**

4. Inside the bucket, click **Policies** tab
5. Click **New Policy** → **For full customization**
6. In the policy editor, paste:
   ```json
   {
     "definition": {
       "allow": "public",
       "operation": "select"
     }
   }
   ```
7. Click **Save**

---

## Step 4: Verify Everything

Still in SQL Editor, run these verification queries to confirm:

```sql
-- Check table exists
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'profiles';

-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'profiles';

-- List RLS policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

Expected results:
- First query: returns `profiles` in table_name
- Second query: returns `rowsecurity = true`
- Third query: returns 5 policies

---

## Step 5: Update .env.local

Make sure your `.env.local` has all credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
ADMIN_PASSWORD=lovieadmin2025
NEXT_PUBLIC_SITE_PASSWORD=superbabushka
```

---

## Understanding the Database Schema

### profiles table
- **id**: Unique identifier (UUID)
- **created_at / updated_at**: Timestamps
- **name**: Profile name (required)
- **tagline**: Short description
- **bio**: Full biography
- **city / country**: Location
- **email**: Contact email
- **language**: 'ru' or 'en'
- **website_url / instagram / other_social**: Social links
- **tags**: Array of tags (e.g., `['artist', 'musician']`)
- **photo_url**: Main profile image URL
- **gallery_urls**: Array of additional image URLs
- **status**: 'pending' | 'approved' | 'rejected'
- **rejection_reason**: Admin notes if rejected

### RLS Policies Explained

| Policy | Who | Action | Condition |
|--------|-----|--------|-----------|
| Public Insert | Anyone | INSERT | Always allowed |
| Public Read | Anyone | SELECT | Only `status = 'approved'` |
| Service Read | Admin | SELECT | All profiles |
| Service Update | Admin | UPDATE | All profiles |
| Service Delete | Admin | DELETE | All profiles |

---

## Testing the Setup

Once everything is live:

1. Your site at `http://localhost:3000` will be able to:
   - Insert profiles via the `/submit` form
   - See only approved profiles on `/home`
   - Admin panel can see and approve all submissions

2. Try submitting a profile at `/submit`
3. Go to Supabase Dashboard → **Table Editor**
4. You should see your new profile with `status = 'pending'`
5. Change status to `'approved'` → refresh gallery and you'll see it!

---

## Troubleshooting

**"Module not found" for Supabase?**
- Run: `npm install @supabase/supabase-js`

**Images not uploading?**
- Check bucket name is exactly `profile-images`
- Confirm bucket is set to "Public"

**Profiles not showing?**
- Verify `status = 'approved'` in Supabase Table Editor
- Check browser console for errors

**"Permission denied" errors?**
- Verify RLS policies are created (check SQL Editor output)
- Make sure service role key is in `.env.local`
