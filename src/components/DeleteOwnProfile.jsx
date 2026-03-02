'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteOwnProfile({ profileId }) {
  const [open,    setOpen]    = useState(false);
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const router = useRouter();

  const handleDelete = async () => {
    if (!email.trim()) { setError('Please enter your email · Введите email'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/profiles/self-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: profileId, email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      router.push('/home');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e0d8' }}>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          style={{
            background: 'none', border: 'none', color: '#b8aea0',
            fontSize: '0.8rem', cursor: 'pointer', padding: 0,
            textDecoration: 'underline', textUnderlineOffset: '3px',
          }}
        >
          Delete my profile · Удалить мой профиль
        </button>
      ) : (
        <div style={{ maxWidth: '26rem' }}>
          <p style={{ fontSize: '0.85rem', color: '#6b6159', margin: '0 0 0.75rem', fontWeight: 600 }}>
            Enter the email on your profile to confirm deletion:
          </p>
          <p style={{ fontSize: '0.78rem', color: '#9b9188', margin: '0 0 0.75rem' }}>
            Введите email вашего профиля для подтверждения удаления:
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              autoFocus
              style={{
                flex: 1, minWidth: '180px',
                padding: '0.45rem 0.75rem',
                border: '1.5px solid #e5e0d8', borderRadius: '0.375rem',
                fontSize: '0.875rem', outline: 'none', color: '#3d3530',
              }}
            />
            <button
              onClick={handleDelete}
              disabled={loading}
              style={{
                padding: '0.45rem 1rem', background: '#dc2626', color: 'white',
                border: 'none', borderRadius: '0.375rem',
                fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? '...' : 'Delete · Удалить'}
            </button>
            <button
              onClick={() => { setOpen(false); setEmail(''); setError(''); }}
              style={{
                padding: '0.45rem 0.75rem', background: 'none',
                border: '1px solid #e5e0d8', borderRadius: '0.375rem',
                fontSize: '0.82rem', color: '#9b9188', cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
          {error && (
            <p style={{ color: '#dc2626', fontSize: '0.8rem', margin: '0.5rem 0 0', fontWeight: 600 }}>
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
