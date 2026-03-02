import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const CATEGORIES = {
  travel:   { ru: 'Путешествия',  en: 'Travel',     gradient: 'linear-gradient(135deg, #0d4949 0%, #1b7a7b 100%)' },
  art:      { ru: 'Искусство',    en: 'Art',         gradient: 'linear-gradient(135deg, #4a3266 0%, #6b4c9a 100%)' },
  workshop: { ru: 'Мастер-класс', en: 'Workshop',    gradient: 'linear-gradient(135deg, #6b1035 0%, #8B1A4A 100%)' },
  wellness: { ru: 'Здоровье',     en: 'Wellness',    gradient: 'linear-gradient(135deg, #1a4a2e 0%, #2d7a50 100%)' },
  other:    { ru: 'Другое',       en: 'Other',       gradient: 'linear-gradient(135deg, #3d2010 0%, #7a4a20 100%)' },
};

function formatDateRange(start, end) {
  if (!start) return null;
  const RU = ['января','февраля','марта','апреля','мая','июня',
               'июля','августа','сентября','октября','ноября','декабря'];
  const EN = ['January','February','March','April','May','June',
               'July','August','September','October','November','December'];
  const s = new Date(start + 'T12:00:00');
  const e = end ? new Date(end + 'T12:00:00') : null;
  const sD = s.getDate(), sM = s.getMonth(), sY = s.getFullYear();
  if (!e) return { ru: `${sD} ${RU[sM]} ${sY}`, en: `${EN[sM]} ${sD}, ${sY}` };
  const eD = e.getDate(), eM = e.getMonth(), eY = e.getFullYear();
  if (sM === eM && sY === eY) {
    return { ru: `${sD}–${eD} ${RU[sM]} ${sY}`, en: `${EN[sM]} ${sD}–${eD}, ${sY}` };
  }
  return {
    ru: `${sD} ${RU[sM]} – ${eD} ${RU[eM]} ${sY}`,
    en: `${EN[sM]} ${sD} – ${EN[eM]} ${eD}, ${sY}`,
  };
}

function NotFound() {
  return (
    <div style={{
      minHeight: '60vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '4rem 2rem',
      backgroundColor: '#FAF6F0',
    }}>
      <p style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 'clamp(5rem,15vw,8rem)',
        fontWeight: 900, color: '#e5e0d8', lineHeight: 1, margin: '0 0 1rem',
      }}>404</p>
      <h1 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.75rem', fontWeight: 700, color: '#4a4238', margin: '0 0 0.625rem',
      }}>Project not found</h1>
      <p style={{ color: '#8b8178', margin: '0 0 2rem', fontSize: '1rem' }}>
        This project may have been removed or is not yet available.
      </p>
      <Link href="/projects" style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
        color: '#1b7a7b', fontWeight: 700, fontSize: '0.95rem',
        textDecoration: 'none', borderBottom: '2px solid #1b7a7b', paddingBottom: '2px',
      }}>
        ← Back to Projects
      </Link>
    </div>
  );
}

export default async function ProjectDetailPage({ params }) {
  const { id } = await params;

  const { data: project } = await supabaseAdmin
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('status', 'approved')
    .single();

  if (!project) return <NotFound />;

  const cat = CATEGORIES[project.category];
  const gradient = cat?.gradient ?? 'linear-gradient(135deg, #8B1A4A 0%, #6b4c9a 100%)';
  const dateRange = formatDateRange(project.date_start, project.date_end);
  const location = [project.location_city, project.location_country].filter(Boolean).join(', ');
  const hasContact = project.contact_email || project.contact_instagram || project.contact_phone;

  return (
    <>
      <style href="project-detail" precedence="default">{`
        .pd-back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.875rem;
          font-weight: 700;
          color: #1b7a7b;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 180ms ease, color 180ms ease;
        }
        .pd-back-link:hover { border-bottom-color: #1b7a7b; color: #0d4949; }

        .pd-contact-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.7rem 1.4rem;
          border-radius: 50px;
          font-size: 0.875rem;
          font-weight: 700;
          text-decoration: none;
          transition: transform 200ms ease, box-shadow 200ms ease, opacity 200ms ease;
          border: none;
          cursor: pointer;
        }
        .pd-contact-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.18);
          opacity: 0.9;
        }

        .pd-sticky-back {
          display: none;
        }

        @media (max-width: 768px) {
          .pd-sticky-back {
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
          .pd-sticky-back a {
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

      <div style={{ backgroundColor: '#FAF6F0', minHeight: '100vh' }}>

        {/* ── Hero photo ── */}
        <div style={{ position: 'relative', width: '100%', paddingBottom: '42%', maxHeight: '520px', overflow: 'hidden' }}>
          {/* Back link overlay */}
          <div style={{
            position: 'absolute', top: '1.25rem', left: '1.5rem',
            zIndex: 10,
          }}>
            <Link href="/projects" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              color: 'rgba(255,255,255,0.9)',
              fontSize: '0.875rem', fontWeight: 700,
              textDecoration: 'none',
              background: 'rgba(0,0,0,0.35)',
              padding: '0.4rem 1rem',
              borderRadius: '50px',
              backdropFilter: 'blur(6px)',
              transition: 'background 180ms ease',
            }}>
              ← Наши Проекты · Our Projects
            </Link>
          </div>

          {project.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.photo_url}
              alt={project.title}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div style={{
              position: 'absolute', inset: 0,
              background: gradient,
            }} />
          )}

          {/* Gradient overlay at bottom */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.65) 100%)',
          }} />

          {/* Category badge + title over photo */}
          <div style={{
            position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem',
            zIndex: 2,
          }}>
            {cat && (
              <span style={{
                display: 'inline-block',
                background: '#d4a574',
                color: '#1a1612',
                padding: '0.25rem 0.875rem',
                borderRadius: '50px',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '0.75rem',
              }}>
                {cat.en} · {cat.ru}
              </span>
            )}
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.75rem, 4vw, 3rem)',
              fontWeight: 900,
              color: 'white',
              margin: 0,
              lineHeight: 1.15,
              textShadow: '0 2px 12px rgba(0,0,0,0.4)',
              maxWidth: '52rem',
            }}>
              {project.title}
            </h1>
          </div>
        </div>

        {/* ── Content ── */}
        <div style={{ maxWidth: '44rem', margin: '0 auto', padding: 'clamp(2.5rem,5vw,3.5rem) 2rem 5rem' }}>

          {/* Date + Location meta */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '1.5rem',
            marginBottom: '2.5rem',
            paddingBottom: '2rem',
            borderBottom: '1px solid #e5e0d8',
          }}>
            {dateRange && (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.25rem' }}>📅</span>
                <div>
                  <p style={{ fontWeight: 700, color: '#4a4238', margin: 0, fontSize: '0.95rem' }}>
                    {dateRange.ru}
                  </p>
                  <p style={{ color: '#8b8178', margin: '0.1rem 0 0', fontSize: '0.85rem' }}>
                    {dateRange.en}
                  </p>
                </div>
              </div>
            )}
            {location && (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.25rem' }}>📍</span>
                <div>
                  <p style={{ fontWeight: 700, color: '#4a4238', margin: 0, fontSize: '0.95rem' }}>
                    {location}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <section style={{ marginBottom: '2.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid #e5e0d8' }}>
            <span style={{
              display: 'block',
              fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: '#b8aea0', marginBottom: '1.25rem',
            }}>
              О проекте · About this Project
            </span>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
              lineHeight: 1.9, color: '#4a4238',
              margin: 0, whiteSpace: 'pre-wrap',
            }}>
              {project.description}
            </p>
          </section>

          {/* Additional Info */}
          {project.additional_info && (
            <section style={{ marginBottom: '2.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid #e5e0d8' }}>
              <div style={{
                background: '#FDF9F4',
                border: '1px solid #e5e0d8',
                borderRadius: '0.875rem',
                padding: '1.5rem 1.75rem',
              }}>
                <span style={{
                  display: 'block',
                  fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: '#b8aea0', marginBottom: '0.875rem',
                }}>
                  Дополнительно · Additional Info
                </span>
                <p style={{
                  fontSize: '0.95rem', lineHeight: 1.75, color: '#4a4238',
                  margin: 0, whiteSpace: 'pre-wrap',
                }}>
                  {project.additional_info}
                </p>
              </div>
            </section>
          )}

          {/* Contact section */}
          <section style={{ marginBottom: '3rem' }}>
            <span style={{
              display: 'block',
              fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: '#b8aea0', marginBottom: '1.25rem',
            }}>
              Связаться · Get in Touch
            </span>

            {/* Posted by */}
            <div style={{ marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.85rem', color: '#8b8178', margin: '0 0 0.25rem' }}>
                Публикует · Posted by
              </p>
              {project.profile_id ? (
                <Link href={`/profile/${project.profile_id}`} style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.1rem', fontWeight: 700, color: '#8B1A4A',
                  textDecoration: 'none', borderBottom: '2px solid #d4a574',
                }}>
                  {project.contact_name}
                </Link>
              ) : (
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.1rem', fontWeight: 700, color: '#4a4238', margin: 0,
                }}>
                  {project.contact_name}
                </p>
              )}
            </div>

            {hasContact && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {project.contact_email && (
                  <a
                    href={`mailto:${project.contact_email}`}
                    className="pd-contact-btn"
                    style={{ background: '#8B1A4A', color: 'white' }}
                  >
                    ✉️ {project.contact_email}
                  </a>
                )}
                {project.contact_instagram && (
                  <a
                    href={`https://instagram.com/${project.contact_instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pd-contact-btn"
                    style={{ background: '#6b4c9a', color: 'white' }}
                  >
                    🌿 {project.contact_instagram.startsWith('@') ? project.contact_instagram : `@${project.contact_instagram}`}
                  </a>
                )}
                {project.contact_phone && (
                  <a
                    href={`tel:${project.contact_phone}`}
                    className="pd-contact-btn"
                    style={{ background: '#1b7a7b', color: 'white' }}
                  >
                    📞 {project.contact_phone}
                  </a>
                )}
              </div>
            )}
          </section>

          {/* Back link (desktop) */}
          <Link href="/projects" className="pd-back-link">
            ← Наши Проекты · Our Projects
          </Link>
        </div>

        {/* Mobile sticky back */}
        <div className="pd-sticky-back">
          <Link href="/projects">← Наши Проекты · Our Projects</Link>
        </div>
      </div>
    </>
  );
}
