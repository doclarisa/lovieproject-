import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import PhotoGallery from '@/components/PhotoGallery';

// Map a tag string to one of the four jewel-tone hero palettes
const PALETTES = [
  { bg: '#6b1035', mid: '#8B1A4A', accent: '#e8c4a0' }, // burgundy
  { bg: '#0d4949', mid: '#1b7a7b', accent: '#FAF6F0'  }, // teal
  { bg: '#4a3266', mid: '#6b4c9a', accent: '#e8c4a0' }, // violet
  { bg: '#3d2010', mid: '#7a4a20', accent: '#FAF6F0'  }, // amber
];

function palette(tag) {
  if (!tag) return PALETTES[0];
  const n = [...tag].reduce((a, c) => a + c.charCodeAt(0), 0);
  return PALETTES[n % PALETTES.length];
}

// ── Dynamic OG metadata ─────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { id } = await params;
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, tagline, photo_url')
    .eq('id', id)
    .eq('status', 'approved')
    .single();
  if (!profile) return { title: 'Profile not found' };
  return {
    title: profile.name,
    description: profile.tagline || `Meet ${profile.name} on LovieProject`,
    openGraph: {
      title: `${profile.name} — LovieProject`,
      description: profile.tagline || `Meet ${profile.name} on LovieProject`,
      images: profile.photo_url
        ? [{ url: profile.photo_url, alt: profile.name }]
        : [{ url: '/images/homepagewomen.jpg', alt: 'LovieProject' }],
    },
  };
}

// ── 404 state ───────────────────────────────────────────────────────────────
function NotFound() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '4rem 2rem',
      backgroundColor: '#FAF6F0',
    }}>
      <p style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 'clamp(5rem, 15vw, 8rem)',
        fontWeight: 900,
        color: '#e5e0d8',
        lineHeight: 1,
        margin: '0 0 1rem',
      }}>404</p>
      <h1 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.75rem',
        fontWeight: 700,
        color: '#4a4238',
        margin: '0 0 0.625rem',
      }}>Profile not found</h1>
      <p style={{ color: '#8b8178', margin: '0 0 2.25rem', fontSize: '1rem' }}>
        This profile may have been removed or is not yet approved.
      </p>
      <Link href="/home" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        color: '#1b7a7b',
        fontWeight: 700,
        fontSize: '0.95rem',
        textDecoration: 'none',
        borderBottom: '2px solid #1b7a7b',
        paddingBottom: '2px',
      }}>
        ← Back to Gallery
      </Link>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export default async function ProfilePage({ params }) {
  const { id } = await params;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .eq('status', 'approved')
    .single();

  if (!profile) return <NotFound />;

  const pal       = palette(profile.tags?.[0]);
  const tags      = profile.tags?.slice(0, 5) ?? [];
  const location  = [profile.city, profile.country].filter(Boolean).join(', ');
  const hasLinks  = profile.website_url || profile.instagram;
  const hasGallery = Array.isArray(profile.gallery_urls) && profile.gallery_urls.length > 0;

  return (
    <>
      <style href="profile-page" precedence="default">{`
        /* ── Hero ─────────────────────────────── */
        .pp-hero {
          padding: clamp(3rem, 8vw, 5rem) 2rem clamp(3rem, 6vw, 4.5rem);
          position: relative;
          overflow: hidden;
        }
        .pp-hero::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0; right: 0;
          height: 80px;
          background: linear-gradient(to bottom, transparent, #FAF6F0);
          pointer-events: none;
        }

        /* Decorative bg circle */
        .pp-hero-orb {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          pointer-events: none;
        }

        .pp-hero-inner {
          position: relative;
          max-width: 62rem;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 3.5rem;
          align-items: center;
          z-index: 1;
        }

        /* Photo */
        .pp-photo-wrap {
          width: 280px;
          height: 280px;
          border-radius: 1.5rem;
          overflow: hidden;
          position: relative;
          flex-shrink: 0;
          box-shadow:
            0 0 0 5px rgba(255,255,255,0.2),
            0 24px 50px rgba(0,0,0,0.35);
        }
        .pp-photo-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 5rem;
          font-weight: 700;
          color: rgba(255,255,255,0.8);
          background: rgba(0,0,0,0.2);
        }

        /* Hero text */
        .pp-hero-info { min-width: 0; }

        .pp-hero-eyebrow {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          margin-bottom: 0.75rem;
        }

        .pp-name {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.5rem, 5.5vw, 4.25rem);
          font-weight: 900;
          color: #FAF6F0;
          line-height: 1.05;
          margin: 0 0 0.75rem;
          letter-spacing: -0.025em;
          word-break: break-word;
        }

        .pp-hero-tagline {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(1rem, 2vw, 1.25rem);
          color: rgba(250,246,240,0.78);
          margin: 0 0 1.25rem;
          line-height: 1.45;
        }

        .pp-hero-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
          font-size: 0.9rem;
          color: rgba(250,246,240,0.72);
          font-weight: 500;
        }
        .pp-hero-meta-divider {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: rgba(255,255,255,0.35);
          display: inline-block;
        }

        .pp-hero-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .pp-hero-tag {
          display: inline-block;
          padding: 0.3rem 0.875rem;
          border-radius: 50px;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          color: rgba(255,255,255,0.92);
          backdrop-filter: blur(4px);
        }

        /* ── Content area ──────────────────────── */
        .pp-content {
          max-width: 44rem;
          margin: 0 auto;
          padding: 3rem 2rem 7rem;
        }

        .pp-section {
          margin-bottom: 3.5rem;
          padding-bottom: 3.5rem;
          border-bottom: 1px solid #e5e0d8;
        }
        .pp-section:last-of-type { border-bottom: none; }

        .pp-section-label {
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #b8aea0;
          margin: 0 0 1.5rem;
          display: block;
        }

        /* Bio */
        .pp-bio {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.05rem, 1.5vw, 1.2rem);
          line-height: 1.9;
          color: #4a4238;
          white-space: pre-wrap;
          margin: 0;
        }

        /* Links */
        .pp-links {
          display: flex;
          flex-wrap: wrap;
          gap: 0.875rem;
        }
        .pp-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          font-size: 0.875rem;
          font-weight: 700;
          text-decoration: none;
          transition: transform 200ms ease, box-shadow 200ms ease;
          border: none;
        }
        .pp-link-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.18);
          border-bottom: none;
        }
        .pp-link-website   { background: #1b7a7b; color: white; }
        .pp-link-instagram { background: #6b4c9a; color: white; }
        .pp-link-other     { background: #8B1A4A; color: white; }

        /* Contact */
        .pp-contact-wrap { text-align: center; }
        .pp-contact-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.1rem 2.75rem;
          background: #8B1A4A;
          color: #FAF6F0;
          border-radius: 50px;
          font-family: 'Playfair Display', serif;
          font-size: 1.125rem;
          font-weight: 700;
          text-decoration: none;
          transition: background 220ms ease, transform 220ms ease, box-shadow 220ms ease;
          box-shadow: 0 8px 28px rgba(139, 26, 74, 0.32);
        }
        .pp-contact-btn:hover {
          background: #c91a52;
          transform: translateY(-2px);
          box-shadow: 0 14px 36px rgba(139, 26, 74, 0.42);
          border-bottom: none;
          color: white;
        }

        /* Back link (desktop) */
        .pp-back {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.875rem;
          font-weight: 700;
          color: #1b7a7b;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 180ms ease, color 180ms ease;
          margin-top: 2.5rem;
        }
        .pp-back:hover { border-bottom-color: #1b7a7b; color: #0d4949; }

        /* ── Mobile sticky back bar ────────────── */
        .pp-sticky-back {
          display: none;
        }

        /* ── Responsive ──────────────────────── */
        @media (max-width: 768px) {
          .pp-hero-inner {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 2rem;
            justify-items: center;
          }
          .pp-photo-wrap { width: 220px; height: 220px; }
          .pp-hero-meta { justify-content: center; }
          .pp-hero-tags { justify-content: center; }
          .pp-content   { padding: 2.5rem 1.25rem 6rem; }
          .pp-links     { justify-content: center; }
          .pp-sticky-back {
            display: block;
            position: fixed;
            bottom: 0; left: 0; right: 0;
            padding: 0.875rem 1.5rem;
            background: rgba(250,246,240,0.96);
            backdrop-filter: blur(10px);
            border-top: 1px solid #e5e0d8;
            z-index: 100;
            text-align: center;
          }
          .pp-sticky-back a {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            font-size: 0.9rem;
            font-weight: 700;
            color: #1b7a7b;
            text-decoration: none;
          }
        }
      `}</style>

      {/* ── Hero ── */}
      <section
        className="pp-hero"
        style={{ background: `linear-gradient(145deg, ${pal.bg} 0%, ${pal.mid} 100%)` }}
      >
        {/* Decorative orbs */}
        <div className="pp-hero-orb" style={{ width: '22rem', height: '22rem', top: '-6rem', right: '-6rem' }} />
        <div className="pp-hero-orb" style={{ width: '10rem', height: '10rem', bottom: '2rem', left: '3%' }} />

        <div className="pp-hero-inner">
          {/* Photo */}
          <div className="pp-photo-wrap">
            {profile.photo_url ? (
              <Image
                src={profile.photo_url}
                alt={profile.name}
                fill
                sizes="(max-width: 768px) 220px, 280px"
                style={{ objectFit: 'cover' }}
                priority
              />
            ) : (
              <div
                className="pp-photo-placeholder"
                style={{ background: `linear-gradient(135deg, ${pal.mid}99, ${pal.bg})` }}
              >
                {profile.name?.trim()?.[0]?.toUpperCase() ?? '?'}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="pp-hero-info">
            {/* Eyebrow */}
            <span className="pp-hero-eyebrow">LovieProject</span>

            {/* Name */}
            <h1 className="pp-name">{profile.name}</h1>

            {/* Tagline */}
            {profile.tagline && (
              <p className="pp-hero-tagline">"{profile.tagline}"</p>
            )}

            {/* Location + age */}
            {(location || profile.age) && (
              <div className="pp-hero-meta">
                {location && <span>📍 {location}</span>}
                {location && profile.age && <span className="pp-hero-meta-divider" />}
                {profile.age && <span>{profile.age} years</span>}
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="pp-hero-tags">
                {tags.map((tag) => (
                  <span key={tag} className="pp-hero-tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Editorial content ── */}
      <div className="pp-content">

        {/* Bio */}
        {profile.bio && (
          <section className="pp-section">
            <span className="pp-section-label">
              <span lang="en">Her Story</span>
              <span lang="ru">Её история</span>
            </span>
            <p className="pp-bio">{profile.bio}</p>
          </section>
        )}

        {/* Links */}
        {hasLinks && (
          <section className="pp-section">
            <span className="pp-section-label">
              <span lang="en">Find Her Online</span>
              <span lang="ru">В интернете</span>
            </span>
            <div className="pp-links">
              {profile.website_url && (
                <a
                  href={profile.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pp-link-btn pp-link-website"
                >
                  🌐 <span lang="en">Website</span><span lang="ru">Сайт</span>
                </a>
              )}
              {profile.instagram && (
                <a
                  href={`https://instagram.com/${profile.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pp-link-btn pp-link-instagram"
                >
                  🌿 Instagram
                </a>
              )}
              {profile.other_social && (
                <a
                  href={profile.other_social}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pp-link-btn pp-link-other"
                >
                  ✨ <span lang="en">More</span><span lang="ru">Ещё</span>
                </a>
              )}
            </div>
          </section>
        )}

        {/* Photo gallery */}
        {hasGallery && (
          <section className="pp-section">
            <span className="pp-section-label">
              <span lang="en">Gallery</span>
              <span lang="ru">Галерея</span>
            </span>
            <PhotoGallery images={profile.gallery_urls} name={profile.name} />
          </section>
        )}

        {/* Contact */}
        {profile.email && (
          <section className="pp-section pp-contact-wrap">
            <a href={`mailto:${profile.email}`} className="pp-contact-btn">
              ✉️&nbsp;
              <span lang="en">Write to me</span>
              <span lang="ru">Написать мне</span>
            </a>
          </section>
        )}

        {/* Back link (desktop) */}
        <Link href="/home" className="pp-back">
          ←&nbsp;
          <span lang="en">Back to Gallery</span>
          <span lang="ru">Назад в галерею</span>
        </Link>
      </div>

      {/* ── Mobile sticky back bar ── */}
      <div className="pp-sticky-back">
        <Link href="/home">
          ←&nbsp;
          <span lang="en">Back to Gallery</span>
          <span lang="ru">Назад</span>
        </Link>
      </div>
    </>
  );
}
