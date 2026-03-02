'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteOwnProject({ projectId, hasEmail }) {
  const [open,    setOpen]    = useState(false);
  const [value,   setValue]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const router = useRouter();

  const label = hasEmail ? 'email' : 'name';
  const labelRu = hasEmail ? 'email' : 'имя';
  const placeholder = hasEmail ? 'your@email.com' : 'Your Name';

  const handleDelete = async () => {
    if (!value.trim()) {
      setError(`Please enter your ${label} · Введите ваш ${labelRu}`);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/projects/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: projectId, value: value.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      router.push('/projects');
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
          Delete this project · Удалить проект
        </button>
      ) : (
        <div style={{ maxWidth: '26rem' }}>
          <p style={{ fontSize: '0.85rem', color: '#6b6159', margin: '0 0 0.5rem', fontWeight: 600 }}>
            Enter the {label} you used when submitting to confirm:
            <span style={{ display: 'block', fontWeight: 400, color: '#9b9188', fontSize: '0.78rem', marginTop: '0.2rem' }}>
              Введите {labelRu}, который вы использовали при отправке:
            </span>
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type={hasEmail ? 'email' : 'text'}
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder={placeholder}
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
              onClick={() => { setOpen(false); setValue(''); setError(''); }}
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
