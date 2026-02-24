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
    const auth = localStorage.getItem('siteAuthenticated');
    if (auth !== 'true') {
      router.push('/');
    }
  }, [router]);

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
    <div style={{ backgroundColor: 'var(--color-cream)' }} className="min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1
            className="text-6xl font-serif font-black mb-3"
            style={{ color: 'var(--color-burgundy-light)' }}
          >
            Profile Gallery
          </h1>
          <p className="text-gray-600 text-lg" style={{ color: 'var(--color-gray-600)' }}>
            Discover remarkable women from around the world
          </p>
        </div>

        <div className="mb-10">
          <input
            type="text"
            placeholder="Search by name, location, or tagline..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-3 border-2 rounded-lg focus:outline-none transition text-lg"
            style={{
              borderColor: 'var(--color-gold)',
              '--tw-ring-color': 'var(--color-teal-light)',
            }}
          />
        </div>

        {error && (
          <div
            className="mb-4 p-4 border rounded-lg text-white"
            style={{
              backgroundColor: '#e74c3c',
              borderColor: '#c0392b',
            }}
          >
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <p className="text-gray-600 text-lg">Loading profiles...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.length > 0 ? (
              filteredProfiles.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => router.push(`/profile/${profile.id}`)}
                  className="cursor-pointer hover:scale-105 transition duration-300"
                >
                  <ProfileCard profile={profile} />
                </div>
              ))
            ) : (
              <div className="text-gray-600 col-span-full text-center py-16">
                <p className="text-lg">
                  {profiles.length === 0
                    ? 'No profiles available yet. Check back soon!'
                    : 'No profiles match your search.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
