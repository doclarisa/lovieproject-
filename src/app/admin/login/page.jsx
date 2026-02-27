'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res  = await fetch('/api/admin/auth', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.success) {
        router.push('/admin');
      } else {
        setError('Invalid admin password');
        setPassword('');
      }
    } catch {
      setError('Server error — please try again');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f4f4f5',
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        background: 'white',
        border: '1px solid #e4e4e7',
        borderRadius: '0.75rem',
        padding: '2.5rem 2.25rem',
        width: '100%',
        maxWidth: '380px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
      }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#18181b',
          margin: '0 0 0.25rem',
        }}>
          Admin Panel
        </h1>
        <p style={{ color: '#71717a', fontSize: '0.875rem', margin: '0 0 2rem' }}>
          LovieProject administration
        </p>

        <form onSubmit={handleSubmit}>
          <label style={{
            display: 'block',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#3f3f46',
            marginBottom: '0.5rem',
          }}>
            Admin Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder="Enter admin password"
            autoFocus
            required
            style={{
              width: '100%',
              padding: '0.7rem 0.875rem',
              border: '1.5px solid #e4e4e7',
              borderRadius: '0.5rem',
              fontSize: '0.95rem',
              outline: 'none',
              color: '#18181b',
              transition: 'border-color 180ms ease',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#8B1A4A'; }}
            onBlur={(e)  => { e.target.style.borderColor = '#e4e4e7'; }}
          />

          {error && (
            <p style={{
              color: '#dc2626',
              fontSize: '0.8rem',
              margin: '0.5rem 0 0',
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '1.25rem',
              padding: '0.75rem',
              background: loading ? '#a1a1aa' : '#8B1A4A',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 180ms ease',
            }}
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
