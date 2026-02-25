# CLAUDE.md — LovieProject Codebase Guide

This file provides essential context for AI assistants (Claude and others) working on this codebase.

---

## Project Overview

**LovieProject** is a bilingual (English/Russian) profile gallery web application celebrating creative women 55+ from around the world. It features:

- Password-protected site access
- Public profile gallery with search and filtering
- Profile submission form (pending admin approval)
- Admin panel for profile management
- Bilingual UI toggling (EN/RU) using CSS

**GitHub:** `doclarisa/lovieproject-`
**Repository URL:** https://github.com/doclarisa/lovieproject-

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | ^16.1.6 |
| UI Library | React | ^19.2.4 |
| Styling | Tailwind CSS | ^4.2.1 |
| Backend/DB | Supabase (PostgreSQL) | ^2.97.0 |
| Language | JavaScript (JSX) — **no TypeScript** | ES2020+ |
| Package Manager | npm | — |
| Linting | ESLint (Next.js config) | ^9.39.3 |

---

## Directory Structure

```
lovieproject-/
├── src/
│   ├── app/                        # Next.js App Router pages & API
│   │   ├── layout.jsx              # Root layout (fonts, global styles)
│   │   ├── page.jsx                # Login page (route: /)
│   │   ├── home/
│   │   │   └── page.jsx            # Gallery view (approved profiles)
│   │   ├── profile/
│   │   │   └── [id]/
│   │   │       └── page.jsx        # Individual profile detail (dynamic route)
│   │   ├── submit/
│   │   │   └── page.jsx            # Profile submission form
│   │   ├── admin/
│   │   │   └── page.jsx            # Admin panel (partially implemented)
│   │   └── api/
│   │       └── auth/
│   │           └── verify/
│   │               └── route.js    # POST: password verification endpoint
│   ├── components/
│   │   ├── Navbar.jsx              # Site header with nav links + language toggle
│   │   ├── Footer.jsx              # Site footer with branding
│   │   ├── LanguageToggle.jsx      # EN/RU language switcher
│   │   └── ProfileCard.jsx         # Reusable profile card for gallery
│   ├── lib/
│   │   └── supabaseClient.js       # Supabase client singleton
│   └── styles/
│       └── globals.css             # Design tokens + Tailwind imports
├── public/
│   └── images/
│       └── homepagewomen.jpg
├── supabase_schema.sql             # Full DB schema (run once in Supabase SQL editor)
├── SUPABASE_SETUP.md               # Backend setup instructions
├── next.config.js                  # Next.js config (reactStrictMode: true)
├── tailwind.config.js              # Tailwind content paths
├── jsconfig.json                   # Path alias: @/* → ./src/*
├── postcss.config.js
└── eslint.config.js
```

---

## Development Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Build production bundle
npm start        # Start production server
npm run lint     # Run ESLint
```

**No test suite is currently configured.** Do not expect `npm test` to work.

---

## Environment Variables

Create `.env.local` in the project root with:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_SITE_PASSWORD=superbabushka
NEXT_PUBLIC_ADMIN_PASSWORD=lovieadmin2025
```

- Variables prefixed `NEXT_PUBLIC_` are exposed to the browser.
- `.env.local` is gitignored — never commit it.
- Refer to `SUPABASE_SETUP.md` for full backend setup instructions.

---

## Routing & Pages

| URL | File | Auth Required | Notes |
|-----|------|---------------|-------|
| `/` | `src/app/page.jsx` | None | Password login page |
| `/home` | `src/app/home/page.jsx` | Site password | Gallery of approved profiles |
| `/submit` | `src/app/submit/page.jsx` | Site password | New profile submission |
| `/profile/[id]` | `src/app/profile/[id]/page.jsx` | Site password | Full profile detail |
| `/admin` | `src/app/admin/page.jsx` | Site + admin password | Admin management panel |
| `POST /api/auth/verify` | `src/app/api/auth/verify/route.js` | None | Verifies site password |

### Route Protection Pattern

All protected pages use a **client-side localStorage check**. There is no Next.js middleware. The pattern is:

```javascript
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem('siteAuthenticated') !== 'true') {
      router.push('/');
    }
  }, []);
  // ...
}
```

Admin pages additionally check `localStorage.getItem('adminAuthenticated') === 'true'`.

---

## Database Schema

**Table: `profiles`**

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key, auto-generated |
| created_at | TIMESTAMP | Auto-set on insert |
| updated_at | TIMESTAMP | Auto-set, should be updated on changes |
| name | TEXT | Required |
| tagline | TEXT | Short description |
| bio | TEXT | Full biography |
| city | TEXT | |
| country | TEXT | |
| email | TEXT | |
| language | TEXT | `'ru'` or `'en'`, defaults to `'ru'` |
| website_url | TEXT | |
| instagram | TEXT | |
| other_social | TEXT | |
| tags | TEXT[] | Array of tags, defaults to `{}` |
| photo_url | TEXT | Main profile image (Supabase Storage URL) |
| gallery_urls | TEXT[] | Additional images, defaults to `{}` |
| status | TEXT | `'pending'`, `'approved'`, `'rejected'` — defaults to `'pending'` |
| rejection_reason | TEXT | Admin notes on rejection |

**Storage:** Supabase bucket `profile-images` (public read access).

**RLS Policies:**
- Public can INSERT (submit profiles)
- Public can SELECT only `status = 'approved'` profiles
- Service role (admin) can SELECT, UPDATE, DELETE all rows

---

## Supabase Client Usage

The client is initialized once in `src/lib/supabaseClient.js` and imported wherever needed:

```javascript
import { supabase } from '@/lib/supabaseClient';

// Query approved profiles
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('status', 'approved')
  .order('created_at', { ascending: false });

// Insert new profile
const { error } = await supabase
  .from('profiles')
  .insert([{ name, tagline, bio, city, country, status: 'pending' }]);
```

**No ORM is used** — all queries use the Supabase JS SDK directly.

---

## Styling Conventions

### Design Tokens (CSS custom properties in `globals.css`)

```css
--color-burgundy: #8b1538   /* Primary brand color */
--color-teal: #1b7a7b       /* Accent */
--color-gold: #d4a574       /* Warm accent */
--color-violet: #6b4c9a     /* Secondary accent */
--color-cream: #f5f1ed      /* Page background */
--color-ivory: #faf7f2      /* Card backgrounds */
```

**Fonts:**
- Headings / brand: `"Playfair Display"` (serif)
- Body text: `"Inter"` (sans-serif)

### Styling Approach

The codebase mixes three styling approaches — maintain the same approach as surrounding code:

1. **Tailwind CSS utility classes** — preferred for layout, spacing, responsive breakpoints
2. **Inline `style` objects** — used heavily in components for branded colors/typography
3. **Global CSS variables** — for design tokens and shared values

### Responsive Breakpoints

| Prefix | Width |
|--------|-------|
| `sm:` | ≥640px |
| `md:` | ≥768px |
| `lg:` | ≥1024px |

---

## Bilingual Support (EN/RU)

Language switching does **not** use an i18n library. It works by toggling a CSS class on `<body>`:

```javascript
// Switch to Russian
document.body.classList.remove('lang-en');
document.body.classList.add('lang-ru');
```

Content for each language is rendered in the DOM simultaneously and shown/hidden via CSS:

```css
/* In globals.css */
body.lang-en [lang="ru"] { display: none; }
body.lang-ru [lang="en"] { display: none; }
```

In JSX, wrap bilingual content with `lang` attributes:

```jsx
<span lang="en">Read more</span>
<span lang="ru">Читать далее</span>
```

---

## Component Conventions

### File Naming
- Components: `PascalCase.jsx` (e.g., `ProfileCard.jsx`)
- Pages: `page.jsx` (Next.js App Router convention)
- API routes: `route.js`

### Component Structure
- All components use `'use client'` directive (no server components currently)
- Props are destructured inline; no PropTypes validation is used
- No TypeScript — use plain JSX

### Path Alias
Use `@/` to import from `src/`:

```javascript
import { supabase } from '@/lib/supabaseClient';
import ProfileCard from '@/components/ProfileCard';
```

---

## Key Conventions & Rules

1. **JavaScript only** — This project does not use TypeScript. Do not add `.ts`/`.tsx` files.
2. **No testing framework** — Do not add test files without first setting up Jest or Vitest.
3. **App Router** — Use Next.js 13+ App Router conventions (not Pages Router). All routes live under `src/app/`.
4. **Client components** — All current components are client-side (`'use client'`). Use server components only when explicitly needed.
5. **Supabase direct queries** — Do not introduce an ORM. Use `supabase.from().select()` patterns.
6. **No i18n library** — Language switching uses the CSS `lang` attribute pattern described above. Do not replace it with next-intl or similar.
7. **Styling** — Prefer Tailwind classes for layout. Use inline styles for branded colors matching the design token values.
8. **Auth is localStorage-based** — Route protection uses `localStorage` checks. Be aware this is intentional for the current MVP scope.
9. **Module type** — The project uses `"type": "module"` in package.json (ESM). Avoid CommonJS `require()`.
10. **No Docker/CI** — No containerization or CI/CD is configured. Deploy to Vercel directly.

---

## Common Tasks

### Add a new page

1. Create `src/app/<route-name>/page.jsx`
2. Add `'use client';` at the top
3. Add the localStorage auth check in a `useEffect`
4. Add a link in `src/components/Navbar.jsx`

### Add a new component

1. Create `src/components/MyComponent.jsx`
2. Export a default function with PascalCase name
3. Use `@/components/MyComponent` to import it

### Modify the database schema

1. Edit `supabase_schema.sql`
2. Run the migration manually in the Supabase SQL editor
3. Update this file if the change affects how AI assistants should interact with the DB

### Add a new API route

1. Create `src/app/api/<path>/route.js`
2. Export named functions for HTTP methods: `GET`, `POST`, etc.
3. Use `import { NextResponse } from 'next/server';` for responses

---

## Known Limitations & Future Work

- **Admin panel** (`/admin`) is partially implemented — the approval workflow UI is a stub
- **No test suite** — needs Jest or Vitest setup before adding tests
- **Client-side auth** — localStorage-based auth is not secure for production; should migrate to server-side sessions or Supabase Auth
- **No deployment config** — add `vercel.json` or similar when deploying
- **Passwords in env vars** — `NEXT_PUBLIC_*` variables are exposed to the browser; review security model before launch
- **No image upload in submit form** — `photo_url` field accepts a URL string; direct file upload to Supabase Storage not yet implemented
