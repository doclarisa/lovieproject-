'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
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
        // TODO: Fetch profile from Supabase
        // For now, just set a placeholder
        setProfile({
          id,
          name: 'Profile Name',
          title: 'Profile Title',
          bio: 'Profile bio goes here',
          imageUrl: null,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile not found</h1>
          <Link href="/home" className="text-blue-600 hover:underline">
            Back to gallery
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
        {profile.imageUrl && (
          <img
            src={profile.imageUrl}
            alt={profile.name}
            className="w-full h-96 object-cover"
          />
        )}
        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{profile.name}</h1>
          <p className="text-xl text-gray-600 mb-4">{profile.title}</p>
          {profile.bio && (
            <p className="text-gray-700 text-lg leading-relaxed">{profile.bio}</p>
          )}
        </div>
      </div>
    </div>
  );
}
