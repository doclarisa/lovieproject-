'use client';

import { useState } from 'react';
import Link from 'next/link';

const CATEGORIES = {
  travel:   { ru: 'Путешествия',  en: 'Travel',     gradient: 'linear-gradient(135deg, #0d4949 0%, #1b7a7b 100%)' },
  art:      { ru: 'Искусство',    en: 'Art',         gradient: 'linear-gradient(135deg, #4a3266 0%, #6b4c9a 100%)' },
  workshop: { ru: 'Мастер-класс', en: 'Workshop',    gradient: 'linear-gradient(135deg, #6b1035 0%, #8B1A4A 100%)' },
  wellness: { ru: 'Здоровье',     en: 'Wellness',    gradient: 'linear-gradient(135deg, #1a4a2e 0%, #2d7a50 100%)' },
  other:    { ru: 'Другое',       en: 'Other',       gradient: 'linear-gradient(135deg, #3d2010 0%, #7a4a20 100%)' },
};

const FILTER_PILLS = [
  { key: '',         ru: 'Все',             en: 'All'        },
  { key: 'travel',   ru: 'Путешествия',     en: 'Travel'     },
  { key: 'art',      ru: 'Искусство',       en: 'Art'        },
  { key: 'workshop', ru: 'Мастер-классы',   en: 'Workshops'  },
  { key: 'wellness', ru: 'Здоровье',        en: 'Wellness'   },
  { key: 'other',    ru: 'Другое',          en: 'Other'      },
];

function formatDateRange(start, end) {
  if (!start) return null;
  const RU = ['января','февраля','марта','апреля','мая','июня',
               'июля','августа','сентября','октября','ноября','декабря'];
  const EN = ['January','February','March','April','May','June',
               'July','August','September','October','November','December'];
  const s = new Date(start + 'T12:00:00');
  const e = end ? new Date(end + 'T12:00:00') : null;
  const sD = s.getDate(), sM = s.getMonth(), sY = s.getFullYear();
  if (!e) return `${sD} ${RU[sM]} ${sY} · ${EN[sM]} ${sD}, ${sY}`;
  const eD = e.getDate(), eM = e.getMonth(), eY = e.getFullYear();
  if (sM === eM && sY === eY) {
    return `${sD}–${eD} ${RU[sM]} ${sY} · ${EN[sM]} ${sD}–${eD}, ${sY}`;
  }
  return `${sD} ${RU[sM]} – ${eD} ${RU[eM]} ${sY} · ${EN[sM]} ${sD} – ${EN[eM]} ${eD}, ${sY}`;
}

function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false);
  const cat = CATEGORIES[project.category];
  const dateStr = formatDateRange(project.date_start, project.date_end);
  const location = [project.location_city, project.location_country].filter(Boolean).join(', ');
  const gradient = cat?.gradient ?? 'linear-gradient(135deg, #8B1A4A 0%, #6b4c9a 100%)';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: hovered
          ? '0 20px 50px rgba(0,0,0,0.16)'
          : '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'transform 300ms ease, box-shadow 300ms ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Photo / Placeholder */}
      <div style={{ position: 'relative', paddingBottom: '56.25%', flexShrink: 0 }}>
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
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '3.5rem',
              opacity: 0.25,
              color: 'white',
              userSelect: 'none',
            }}>✦</span>
          </div>
        )}
        {/* Category badge */}
        {cat && (
          <span style={{
            position: 'absolute', top: '0.75rem', left: '0.75rem',
            background: '#d4a574',
            color: '#1a1612',
            padding: '0.2rem 0.7rem',
            borderRadius: '50px',
            fontSize: '0.68rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}>
            {cat.en} · {cat.ru}
          </span>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: '1.4rem 1.5rem 1.6rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.1rem',
          fontWeight: 800,
          color: '#8B1A4A',
          margin: '0 0 0.75rem',
          lineHeight: 1.3,
        }}>
          {project.title}
        </h3>

        {dateStr && (
          <p style={{ fontSize: '0.82rem', color: '#6b6159', margin: '0 0 0.35rem', display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
            <span style={{ flexShrink: 0 }}>📅</span>
            <span>{dateStr}</span>
          </p>
        )}

        {location && (
          <p style={{ fontSize: '0.82rem', color: '#8b8178', margin: '0 0 0.875rem', display: 'flex', gap: '0.4rem' }}>
            <span>📍</span>
            <span>{location}</span>
          </p>
        )}

        <p style={{
          fontSize: '0.875rem',
          color: '#4a4238',
          lineHeight: 1.65,
          margin: '0 0 1.25rem',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          flex: 1,
        }}>
          {project.description}
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid #e5e0d8', margin: '0 0 0.875rem' }} />

        <p style={{ fontSize: '0.78rem', color: '#9b9188', fontStyle: 'italic', margin: '0 0 1rem' }}>
          Публикует ·{' '}
          {project.profile_id ? (
            <Link
              href={`/profile/${project.profile_id}`}
              style={{ color: '#1b7a7b', textDecoration: 'none', fontWeight: 600 }}
            >
              {project.posted_by_name}
            </Link>
          ) : (
            <span style={{ color: '#6b6159', fontWeight: 600 }}>{project.posted_by_name}</span>
          )}
        </p>

        <Link
          href={`/projects/${project.id}`}
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '0.6rem 1rem',
            borderRadius: '50px',
            border: '2px solid #8B1A4A',
            color: hovered ? '#FAF6F0' : '#8B1A4A',
            backgroundColor: hovered ? '#8B1A4A' : 'transparent',
            fontSize: '0.82rem',
            fontWeight: 700,
            textDecoration: 'none',
            letterSpacing: '0.04em',
            transition: 'background 250ms ease, color 250ms ease',
          }}
        >
          Подробнее · Learn more
        </Link>
      </div>
    </div>
  );
}

export default function ProjectsGallery({ projects, fetchError }) {
  const [activeFilter, setActiveFilter] = useState('');

  const filtered = activeFilter
    ? projects.filter((p) => p.category === activeFilter)
    : projects;

  return (
    <>
      <style>{`
        .pg-filter-bar {
          background: rgba(250,246,240,0.96);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid #e5e0d8;
          padding: 1.25rem 2rem;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.625rem;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .pg-filter-pill {
          padding: 0.45rem 1.1rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          border: 2px solid #8B1A4A;
          transition: background 200ms ease, color 200ms ease, transform 150ms ease;
          font-family: 'Inter', sans-serif;
          white-space: nowrap;
        }

        .pg-filter-pill:hover {
          transform: translateY(-1px);
        }

        .pg-filter-pill.active {
          background: #8B1A4A;
          color: #FAF6F0;
        }

        .pg-filter-pill.inactive {
          background: white;
          color: #8B1A4A;
        }

        .pg-content {
          max-width: 80rem;
          margin: 0 auto;
          padding: 3rem 2rem 5rem;
        }

        .pg-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        @media (max-width: 1024px) {
          .pg-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .pg-grid { grid-template-columns: 1fr; }
          .pg-content { padding: 2rem 1.25rem 4rem; }
          .pg-filter-bar { padding: 1rem 1.25rem; gap: 0.5rem; }
        }

        .pg-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 5rem 2rem;
        }

        .pg-empty-icon { font-size: 3rem; margin-bottom: 1.25rem; }

        .pg-empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: #4a4238;
          margin: 0 0 0.5rem;
        }

        .pg-empty-text {
          font-size: 0.95rem;
          color: #8b8178;
          margin: 0 0 2rem;
        }

        .pg-empty-btn {
          display: inline-block;
          background: #8B1A4A;
          color: #FAF6F0;
          padding: 0.8rem 2.25rem;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.9rem;
          text-decoration: none;
          font-family: 'Playfair Display', serif;
          transition: background 200ms ease;
        }

        .pg-empty-btn:hover { background: #c91a52; }

        .pg-error {
          background: #fff0f3;
          border-left: 4px solid #c91a52;
          padding: 1rem 1.5rem;
          margin: 1.5rem 2rem 0;
          border-radius: 0 0.5rem 0.5rem 0;
          font-size: 0.9rem;
          color: #8B1A4A;
          font-weight: 500;
        }
      `}</style>

      {fetchError && (
        <p className="pg-error">
          Could not load projects — please refresh the page.
        </p>
      )}

      {/* Sticky filter bar */}
      <div className="pg-filter-bar">
        {FILTER_PILLS.map((pill) => (
          <button
            key={pill.key}
            onClick={() => setActiveFilter(pill.key)}
            className={`pg-filter-pill ${activeFilter === pill.key ? 'active' : 'inactive'}`}
          >
            {pill.en} · {pill.ru}
          </button>
        ))}
      </div>

      <div className="pg-content">
        <div className="pg-grid">
          {filtered.length > 0 ? (
            filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <div className="pg-empty">
              <div className="pg-empty-icon">
                {projects.length === 0 ? '🌸' : '🔍'}
              </div>
              <h3 className="pg-empty-title">
                {projects.length === 0
                  ? 'Пока нет проектов · No projects yet'
                  : 'Ничего не найдено · Nothing found'}
              </h3>
              <p className="pg-empty-text">
                {projects.length === 0
                  ? 'Будьте первой! · Be the first!'
                  : 'Try a different category · Попробуйте другую категорию'}
              </p>
              {projects.length === 0 && (
                <a href="/projects/submit" className="pg-empty-btn">
                  Опубликовать проект · Post a Project
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
