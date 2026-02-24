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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/home" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to gallery
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {profile.photo_url && (
          <img
            src={profile.photo_url}
            alt={profile.name}
            className="w-full h-96 object-cover"
          />
        )}
        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 font-serif">
            {profile.name}
          </h1>

          {profile.tagline && (
            <p className="text-xl text-gray-600 mb-4">{profile.tagline}</p>
          )}

          {(profile.city || profile.country) && (
            <p className="text-sm text-gray-500 mb-4">
              📍 {[profile.city, profile.country].filter(Boolean).join(', ')}
            </p>
          )}

          {profile.bio && (
            <p className="text-gray-700 text-lg leading-relaxed mb-6 whitespace-pre-wrap">
              {profile.bio}
            </p>
          )}

          {/* Social Links */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Connect</h2>
            <div className="space-y-2">
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="block text-blue-600 hover:underline"
                >
                  📧 Email: {profile.email}
                </a>
              )}
              {profile.website_url && (
                <a
                  href={profile.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:underline"
                >
                  🌐 Website
                </a>
              )}
              {profile.instagram && (
                <a
                  href={`https://instagram.com/${profile.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:underline"
                >
                  📸 Instagram: {profile.instagram}
                </a>
              )}
            </div>
          </div>

          {/* Gallery */}
          {profile.gallery_urls && profile.gallery_urls.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Gallery</h2>
              <div className="grid grid-cols-2 gap-4">
                {profile.gallery_urls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
