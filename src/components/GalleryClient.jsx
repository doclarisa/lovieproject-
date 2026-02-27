'use client';

import { useState } from 'react';
import ProfileCard from './ProfileCard';

export default function GalleryClient({ profiles, fetchError }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = profiles.filter((p) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.tagline?.toLowerCase().includes(q) ||
      p.city?.toLowerCase().includes(q) ||
      p.country?.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <style>{`
        .gc-search-bar {
          background: rgba(250, 246, 240, 0.95);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid #e5e0d8;
          padding: 1.25rem 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1.25rem;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .gc-search-input {
          width: 100%;
          max-width: 540px;
          padding: 0.7rem 1.4rem;
          border: 2px solid #d4a574;
          border-radius: 50px;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 200ms ease, box-shadow 200ms ease;
          background: white;
          color: #1a1612;
          font-family: 'Inter', sans-serif;
        }

        .gc-search-input:focus {
          border-color: #1b7a7b;
          box-shadow: 0 0 0 3px rgba(27, 122, 123, 0.13);
        }

        .gc-search-input::placeholder { color: #b8afa6; }

        .gc-count {
          font-size: 0.82rem;
          color: #a89f96;
          white-space: nowrap;
          font-variant-numeric: tabular-nums;
        }

        .gc-content {
          max-width: 80rem;
          margin: 0 auto;
          padding: 3rem 2rem 5rem;
        }

        .gc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        @media (max-width: 1024px) {
          .gc-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .gc-grid { grid-template-columns: 1fr; }
          .gc-content { padding: 2rem 1.25rem 4rem; }
          .gc-search-bar { padding: 1rem 1.25rem; }
          .gc-count { display: none; }
        }

        .gc-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 5rem 2rem;
        }

        .gc-empty-icon { font-size: 2.75rem; margin-bottom: 1rem; }

        .gc-empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #4a4238;
          margin: 0 0 0.5rem 0;
        }

        .gc-empty-text { font-size: 0.95rem; color: #8b8178; margin: 0; }

        .gc-error {
          background: #fff0f3;
          border-left: 4px solid #c91a52;
          padding: 1rem 1.5rem;
          margin: 0 2rem;
          border-radius: 0 0.5rem 0.5rem 0;
          font-size: 0.9rem;
          color: #8B1A4A;
          font-weight: 500;
        }
      `}</style>

      {fetchError && (
        <p className="gc-error">
          Could not load profiles — please refresh the page.
        </p>
      )}

      {/* Sticky search bar */}
      <div className="gc-search-bar">
        <input
          type="text"
          className="gc-search-input"
          placeholder="Search by name, city, tag… · Поиск по имени, городу, тегу"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {profiles.length > 0 && (
          <span className="gc-count">
            {filtered.length} / {profiles.length}
          </span>
        )}
      </div>

      <div className="gc-content">
        <div className="gc-grid">
          {filtered.length > 0 ? (
            filtered.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))
          ) : (
            <div className="gc-empty">
              <div className="gc-empty-icon">
                {profiles.length === 0 ? '✨' : '🔍'}
              </div>
              <h3 className="gc-empty-title">
                {profiles.length === 0
                  ? 'Скоро здесь появятся профили'
                  : 'Ничего не найдено'}
              </h3>
              <p className="gc-empty-text">
                {profiles.length === 0
                  ? 'No profiles yet — check back soon!'
                  : 'Try a different search term · Попробуйте другой запрос'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
