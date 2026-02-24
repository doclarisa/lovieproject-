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
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, var(--color-burgundy) 0%, var(--color-teal) 100%)' }}
    >
      <div
        className="w-full max-w-md p-10 rounded-2xl shadow-2xl"
        style={{ backgroundColor: 'var(--color-ivory)' }}
      >
        {/* Logo */}
        <h1
          className="text-center font-serif font-bold mb-1"
          style={{
            fontSize: 'var(--font-size-4xl)',
            color: 'var(--color-burgundy)'
          }}
        >
          Lovie<span style={{ fontWeight: 400, fontSize: 'var(--font-size-sm)', marginLeft: '4px', color: 'var(--color-gray-600)' }}>Project</span>
        </h1>

        {/* Tagline */}
        <p
          className="text-center mb-8"
          style={{
            color: 'var(--color-gray-500)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 400
          }}
        >
          <span lang="en">Enter to explore</span>
          <span lang="ru" style={{ display: 'none' }}>Войдите для исследования</span>
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="block mb-2 uppercase tracking-wider"
              style={{
                fontSize: 'var(--font-size-xs)',
                fontWeight: 600,
                color: 'var(--color-gray-700)'
              }}
            >
              <span lang="en">Enter Password</span>
              <span lang="ru" style={{ display: 'none' }}>Введите пароль</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="●●●●●●●●"
              className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition"
              style={{
                borderColor: 'var(--color-gray-200)',
                color: 'var(--color-gray-900)',
                fontSize: 'var(--font-size-base)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-teal-light)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-gray-200)'}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="p-3 rounded-lg text-sm"
              style={{
                backgroundColor: '#fee2e2',
                borderLeft: '4px solid var(--color-error)',
                color: 'var(--color-error)'
              }}
            >
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-white transition transform"
            style={{
              backgroundColor: 'var(--color-burgundy-light)',
              fontSize: 'var(--font-size-base)'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            <span lang="en">Enter</span>
            <span lang="ru" style={{ display: 'none' }}>Войти</span>
          </button>
        </form>
      </div>
    </div>
  );
}
