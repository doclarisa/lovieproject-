'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    bio: '',
    city: '',
    country: '',
    email: '',
    website_url: '',
    instagram: '',
    language: 'en',
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('siteAuthenticated');
    if (auth !== 'true') {
      router.push('/');
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            name: formData.name,
            tagline: formData.tagline,
            bio: formData.bio,
            city: formData.city,
            country: formData.country,
            email: formData.email,
            website_url: formData.website_url || null,
            instagram: formData.instagram || null,
            language: formData.language,
            status: 'pending',
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      setMessageType('success');
      setMessage('Profile submitted successfully! It will appear in the gallery once our team approves it.');
      setFormData({
        name: '',
        tagline: '',
        bio: '',
        city: '',
        country: '',
        email: '',
        website_url: '',
        instagram: '',
        language: 'en',
      });

      // Scroll to message
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Error submitting profile:', error);
      setMessageType('error');
      setMessage(`Error submitting profile: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-cream)' }} className="min-h-screen pb-12">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1
            className="text-5xl font-serif font-black mb-3"
            style={{ color: 'var(--color-burgundy-light)' }}
          >
            Submit Your Profile
          </h1>
          <p className="text-gray-600">Join our gallery of remarkable women</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition"
                style={{ '--tw-ring-color': 'var(--color-teal-light)' }}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition"
                disabled={isLoading}
                placeholder="Short description of yourself"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Website URL
              </label>
              <input
                type="url"
                name="website_url"
                value={formData.website_url}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition"
                disabled={isLoading}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Instagram Handle
              </label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition"
                disabled={isLoading}
                placeholder="@yourhandle"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Language Preference
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none transition"
                disabled={isLoading}
              >
                <option value="en">English</option>
                <option value="ru">Русский</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold text-white transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--color-burgundy-light)' }}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Profile'}
            </button>
          </form>

          {message && (
            <div
              className={`mt-6 p-4 rounded-lg`}
              style={{
                backgroundColor: messageType === 'success' ? '#d5f4e6' : '#fadbd8',
                borderLeft: `4px solid ${messageType === 'success' ? 'var(--color-teal-light)' : '#e74c3c'}`,
                color: messageType === 'success' ? 'var(--color-teal-dark)' : '#c0392b',
              }}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
