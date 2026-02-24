'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('siteAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
      router.push('/home');
    }
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const correctPassword = process.env.NEXT_PUBLIC_SITE_PASSWORD;

    if (password === correctPassword) {
      localStorage.setItem('siteAuthenticated', 'true');
      setIsAuthenticated(true);
      router.push('/home');
    } else {
      setError('Invalid password');
      setPassword('');
    }
  };

  if (isAuthenticated) {
    return <div className="flex items-center justify-center h-screen">Redirecting...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: 'linear-gradient(135deg, var(--color-burgundy) 0%, var(--color-teal) 100%)' }}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-4xl font-serif font-bold text-center mb-2" style={{ color: 'var(--color-burgundy-light)' }}>
          Lovie
        </h1>
        <p className="text-center text-gray-600 mb-8 font-light">Project</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider">
              Enter Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-2 transition"
              style={{ '--tw-ring-color': 'var(--color-teal-light)' }}
              placeholder="Enter site password"
            />
          </div>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-white transition transform hover:scale-105"
            style={{ backgroundColor: 'var(--color-burgundy-light)' }}
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
