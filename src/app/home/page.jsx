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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Profile Gallery</h1>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by name, location, or tagline..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-600">Loading profiles...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.length > 0 ? (
            filteredProfiles.map((profile) => (
              <div
                key={profile.id}
                onClick={() => router.push(`/profile/${profile.id}`)}
                className="cursor-pointer"
              >
                <ProfileCard profile={profile} />
              </div>
            ))
          ) : (
            <div className="text-gray-600 col-span-full text-center py-8">
              {profiles.length === 0
                ? 'No profiles available yet. Check back soon!'
                : 'No profiles match your search.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
