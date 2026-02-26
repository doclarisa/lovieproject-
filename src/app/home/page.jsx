'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfileCard from '@/components/ProfileCard';
import { supabase } from '@/lib/supabaseClient';

export default function GalleryPage() {
  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setProfiles(data || []);
        setError('');
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError('Failed to load profiles. Please try again later.');
        setProfiles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.tagline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <style>{`
        .gallery-wrapper {
          background-color: #FAF6F0;
          min-height: 100vh;
          padding-bottom: 3rem;
        }

        .gallery-container {
          max-width: 80rem;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .gallery-intro {
          text-align: center;
          margin-bottom: 3rem;
          padding-top: 3rem;
        }

        .gallery-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          font-weight: 900;
          color: #8B1A4A;
          margin: 0 0 0.75rem 0;
          line-height: 1.2;
        }

        .gallery-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 1.125rem;
          color: #6b6159;
          margin: 0;
          font-weight: 400;
        }

        .gallery-search-wrapper {
          margin-bottom: 2rem;
          display: flex;
          justify-content: center;
        }

        .gallery-search {
          width: 100%;
          max-width: 600px;
          padding: 0.875rem 1.5rem;
          border: 2px solid #d4a574;
          border-radius: 50px;
          font-size: 1rem;
          outline: none;
          transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
          background-color: white;
          color: #1a1612;
        }

        .gallery-search:focus {
          border-color: #2e9a9b;
          box-shadow: 0 0 0 3px rgba(46, 154, 155, 0.1);
        }

        .gallery-search::placeholder {
          color: #a89f96;
        }

        .gallery-error {
          margin-bottom: 1.5rem;
          padding: 1rem;
          border-radius: 0.5rem;
          background-color: #fee2e2;
          border-left: 4px solid #e74c3c;
          color: #e74c3c;
          font-size: 0.875rem;
        }

        .gallery-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6rem 0;
          font-size: 1.125rem;
          color: #6b6159;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 1024px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .gallery-grid {
            grid-template-columns: 1fr;
          }

          .gallery-title {
            font-size: 1.875rem;
          }
        }

        .gallery-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 0;
          color: #6b6159;
          font-size: 1rem;
        }
      `}</style>

      <div className="gallery-wrapper">
        <div className="gallery-container">
          {/* Intro Section */}
          <div className="gallery-intro">
            <h1 className="gallery-title">
              <span lang="en">Creative Women 55+ From Around the World</span>
              <span lang="ru" style={{ display: 'none' }}>Творческие женщины 55+ со всего мира</span>
            </h1>
            <p className="gallery-subtitle">
              <span lang="en">Artists, travelers, spiritual teachers, healers and so much more</span>
              <span lang="ru" style={{ display: 'none' }}>Художники, путешественницы, духовные учителя, целители и многие другие</span>
            </p>
          </div>

          {/* Search Bar */}
          <div className="gallery-search-wrapper">
            <input
              type="text"
              placeholder="Search by name, location, or tagline..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="gallery-search"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="gallery-error">
              {error}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="gallery-loading">
              <span lang="en">Loading profiles...</span>
              <span lang="ru" style={{ display: 'none' }}>Загрузка профилей...</span>
            </div>
          )}

          {/* Gallery Grid */}
          {!isLoading && (
            <div className="gallery-grid">
              {filteredProfiles.length > 0 ? (
                filteredProfiles.map((profile) => (
                  <div
                    key={profile.id}
                    onClick={() => router.push(`/profile/${profile.id}`)}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 300ms ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(26, 22, 18, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <ProfileCard profile={profile} />
                  </div>
                ))
              ) : (
                <div className="gallery-empty">
                  <span lang="en">
                    {profiles.length === 0
                      ? 'No profiles available yet. Check back soon!'
                      : 'No profiles match your search.'}
                  </span>
                  <span lang="ru" style={{ display: 'none' }}>
                    {profiles.length === 0
                      ? 'Профили еще не добавлены. Проверьте позже!'
                      : 'По вашему запросу нет профилей.'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
