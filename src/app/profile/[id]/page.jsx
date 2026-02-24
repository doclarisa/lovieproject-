'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    const auth = localStorage.getItem('siteAuthenticated');
    if (auth !== 'true') {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .eq('status', 'approved')
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setProfile(data);
          setError('');
        } else {
          setError('Profile not found');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Profile not found'}
          </h1>
          <Link href="/home" className="text-blue-600 hover:underline">
            ← Back to gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-cream)' }}>
      {/* Header Bar */}
      <div className="bg-white border-b-2" style={{ borderBottomColor: 'var(--color-gold)' }}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/home"
            className="inline-flex items-center gap-2 text-sm font-semibold transition hover:gap-3"
            style={{ color: 'var(--color-teal-light)' }}
          >
            ← Back to gallery
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Hero Image */}
          {profile.photo_url && (
            <div className="h-96 overflow-hidden bg-gray-100">
              <img
                src={profile.photo_url}
                alt={profile.name}
                className="w-full h-full object-cover hover:scale-105 transition duration-300"
              />
            </div>
          )}

          {/* Profile Content */}
          <div className="p-8 md:p-12">
            {/* Name & Tagline */}
            <div className="mb-6 pb-6 border-b-2" style={{ borderBottomColor: 'var(--color-gold-light)' }}>
              <h1
                className="text-5xl font-serif font-black mb-2"
                style={{ color: 'var(--color-burgundy-light)' }}
              >
                {profile.name}
              </h1>

              {profile.tagline && (
                <p
                  className="text-xl font-light italic"
                  style={{ color: 'var(--color-teal)' }}
                >
                  {profile.tagline}
                </p>
              )}

              {(profile.city || profile.country) && (
                <p className="text-sm mt-3" style={{ color: 'var(--color-gray-500)' }}>
                  📍 {[profile.city, profile.country].filter(Boolean).join(', ')}
                </p>
              )}
            </div>

            {/* Bio */}
            {profile.bio && (
              <div className="mb-8 pb-8 border-b-2" style={{ borderBottomColor: 'var(--color-gold-light)' }}>
                <p className="text-lg leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--color-gray-700)' }}>
                  {profile.bio}
                </p>
              </div>
            )}

            {/* Connect Section */}
            <div className="mb-8 pb-8 border-b-2" style={{ borderBottomColor: 'var(--color-gold-light)' }}>
              <h2 className="text-2xl font-serif font-bold mb-6" style={{ color: 'var(--color-burgundy-light)' }}>
                Connect
              </h2>
              <div className="space-y-3">
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-3 px-4 py-2 rounded-lg transition hover:shadow-md"
                    style={{
                      color: 'var(--color-white)',
                      backgroundColor: 'var(--color-teal-light)',
                    }}
                  >
                    📧 <span>{profile.email}</span>
                  </a>
                )}
                {profile.website_url && (
                  <a
                    href={profile.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-4 py-2 rounded-lg transition hover:shadow-md ml-0 md:ml-3 mt-2 md:mt-0"
                    style={{
                      color: 'var(--color-white)',
                      backgroundColor: 'var(--color-gold)',
                    }}
                  >
                    🌐 <span>Website</span>
                  </a>
                )}
                {profile.instagram && (
                  <a
                    href={`https://instagram.com/${profile.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-4 py-2 rounded-lg transition hover:shadow-md ml-0 md:ml-3 mt-2 md:mt-0"
                    style={{
                      color: 'var(--color-white)',
                      backgroundColor: 'var(--color-violet-light)',
                    }}
                  >
                    📸 <span>{profile.instagram}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Gallery */}
            {profile.gallery_urls && profile.gallery_urls.length > 0 && (
              <div>
                <h2 className="text-2xl font-serif font-bold mb-6" style={{ color: 'var(--color-burgundy-light)' }}>
                  Gallery
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {profile.gallery_urls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Gallery ${idx + 1}`}
                      className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
