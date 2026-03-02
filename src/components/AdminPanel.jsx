'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const TABS = ['pending', 'approved'];

function fmt(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function truncate(str, n = 200) {
  if (!str) return '';
  return str.length > n ? str.slice(0, n) + '…' : str;
}

function PhotoThumb({ url, name }) {
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={name}
        style={{
          width: '72px', height: '72px',
          objectFit: 'cover',
          borderRadius: '0.5rem',
          flexShrink: 0,
          display: 'block',
        }}
      />
    );
  }
  return (
    <div style={{
      width: '72px', height: '72px', borderRadius: '0.5rem', flexShrink: 0,
      background: 'linear-gradient(135deg, #8B1A4A, #6b4c9a)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontSize: '1.5rem', fontWeight: 700,
      fontFamily: "'Playfair Display', serif",
    }}>
      {name?.trim()?.[0]?.toUpperCase() ?? '?'}
    </div>
  );
}

export default function AdminPanel({ initialProfiles, fetchError }) {
  const [profiles,    setProfiles]    = useState(initialProfiles);
  const [tab,         setTab]         = useState('pending');
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectNotes, setRejectNotes] = useState({});
  const [loadingId,   setLoadingId]   = useState(null);
  const [actionError, setActionError] = useState('');
  const router = useRouter();

  const pending  = profiles.filter(p => p.status === 'pending');
  const approved = profiles.filter(p => p.status === 'approved');
  const counts   = { pending: pending.length, approved: approved.length };
  const visible  = tab === 'pending' ? pending : approved;

  const updateStatus = async (id, status, rejection_note) => {
    setLoadingId(id);
    setActionError('');
    try {
      const res = await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, ...(rejection_note ? { rejection_note } : {}) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Server error ${res.status}`);
      setProfiles(prev => prev.map(p => p.id === id ? { ...p, status } : p));
      setRejectingId(null);
      setRejectNotes(prev => { const n = { ...prev }; delete n[id]; return n; });
      router.refresh(); // Re-fetch server data to confirm DB was updated
    } catch (err) {
      setActionError(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const deleteProfile = async (id) => {
    setLoadingId(id);
    setActionError('');
    try {
      const res = await fetch('/api/admin/delete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Server error ${res.status}`);
      setProfiles(prev => prev.filter(p => p.id !== id));
      setRejectingId(null);
      setRejectNotes(prev => { const n = { ...prev }; delete n[id]; return n; });
    } catch (err) {
      setActionError(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <>
      <style href="admin-panel" precedence="default">{`
        .ap-page   { min-height: 100vh; background: #f4f4f5; font-family: 'Inter', sans-serif; }

        /* Header */
        .ap-header {
          background: white;
          border-bottom: 1px solid #e4e4e7;
          padding: 0.875rem 2rem;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 50;
        }
        .ap-header-left { display: flex; align-items: center; gap: 0.75rem; }
        .ap-header-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem; font-weight: 700; color: #18181b; margin: 0;
        }
        .ap-header-sub { font-size: 0.75rem; color: #a1a1aa; }
        .ap-logout-btn {
          padding: 0.4rem 0.875rem;
          border: 1px solid #e4e4e7; border-radius: 0.375rem;
          background: white; color: #71717a;
          font-size: 0.78rem; font-weight: 600; cursor: pointer;
          transition: all 160ms ease;
        }
        .ap-logout-btn:hover { background: #fee2e2; border-color: #fca5a5; color: #dc2626; }

        /* Stats bar */
        .ap-stats {
          background: white; border-bottom: 1px solid #e4e4e7;
          padding: 0.75rem 2rem;
          display: flex; gap: 2rem; flex-wrap: wrap;
        }
        .ap-stat { display: flex; align-items: baseline; gap: 0.4rem; }
        .ap-stat-n { font-size: 1.25rem; font-weight: 800; }
        .ap-stat-label { font-size: 0.78rem; color: #71717a; font-weight: 500; }
        .ap-stat-pending  .ap-stat-n { color: #d97706; }
        .ap-stat-approved .ap-stat-n { color: #059669; }
        .ap-stat-rejected .ap-stat-n { color: #dc2626; }

        /* Tabs */
        .ap-tabs {
          background: white; border-bottom: 2px solid #e4e4e7;
          padding: 0 2rem; display: flex;
        }
        .ap-tab {
          padding: 0.75rem 1.25rem;
          border: none; border-bottom: 2px solid transparent; margin-bottom: -2px;
          background: transparent; font-size: 0.875rem; font-weight: 600;
          color: #71717a; cursor: pointer;
          display: flex; align-items: center; gap: 0.45rem;
          transition: color 160ms ease, border-color 160ms ease;
        }
        .ap-tab:hover { color: #18181b; }
        .ap-tab.active { color: #8B1A4A; border-bottom-color: #8B1A4A; }
        .ap-tab-badge {
          padding: 0.1rem 0.45rem; border-radius: 50px;
          font-size: 0.68rem; font-weight: 700;
          background: #f4f4f5; color: #71717a;
        }
        .ap-tab.active .ap-tab-badge { background: #8B1A4A; color: white; }
        .ap-tab-badge.has-items { background: #fef3c7; color: #d97706; }
        .ap-tab.active .ap-tab-badge.has-items { background: #8B1A4A; color: white; }

        /* Content */
        .ap-content { max-width: 56rem; margin: 0 auto; padding: 2rem; }

        /* Empty */
        .ap-empty { text-align: center; padding: 5rem 2rem; color: #a1a1aa; }
        .ap-empty-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
        .ap-empty-text { font-size: 0.95rem; }

        /* Error banner */
        .ap-error { background: #fef2f2; border-left: 4px solid #dc2626; padding: 0.875rem 1.25rem; margin-bottom: 1.5rem; border-radius: 0 0.5rem 0.5rem 0; font-size: 0.875rem; color: #dc2626; }

        /* Review card */
        .ap-card {
          background: white; border: 1px solid #e4e4e7; border-radius: 0.75rem;
          padding: 1.25rem; margin-bottom: 0.875rem;
          display: grid; grid-template-columns: 72px 1fr;
          gap: 1.125rem; align-items: start;
          transition: box-shadow 160ms ease;
        }
        .ap-card:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.07); }

        .ap-card-body {}
        .ap-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 0.2rem; gap: 0.75rem; }
        .ap-card-name { font-weight: 700; font-size: 1rem; color: #18181b; margin: 0; }
        .ap-card-date { font-size: 0.72rem; color: #a1a1aa; white-space: nowrap; flex-shrink: 0; margin-top: 2px; }

        .ap-card-meta { font-size: 0.78rem; color: #71717a; margin: 0.2rem 0 0.45rem; }

        .ap-card-tags { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-bottom: 0.45rem; }
        .ap-card-tag {
          background: #f4f4f5; color: #52525b; padding: 0.15rem 0.5rem;
          border-radius: 50px; font-size: 0.68rem; font-weight: 600;
        }

        .ap-card-tagline { font-style: italic; color: #71717a; font-size: 0.82rem; margin: 0 0 0.35rem; }
        .ap-card-bio { font-size: 0.8rem; color: #a1a1aa; margin: 0 0 0.875rem; line-height: 1.5; }

        /* Status badge (for approved/rejected tabs) */
        .ap-status-badge {
          display: inline-flex; align-items: center; gap: 0.3rem;
          padding: 0.2rem 0.6rem; border-radius: 50px;
          font-size: 0.7rem; font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .ap-status-approved { background: #f0fdf4; color: #059669; }
        .ap-status-rejected { background: #fef2f2; color: #dc2626; }
        .ap-status-pending  { background: #fefce8; color: #d97706; }

        /* Actions row */
        .ap-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; }
        .ap-btn {
          padding: 0.35rem 0.75rem; border-radius: 0.375rem;
          font-size: 0.78rem; font-weight: 600; cursor: pointer;
          transition: all 160ms ease; border: 1px solid; white-space: nowrap;
          display: inline-flex; align-items: center; gap: 0.3rem;
        }
        .ap-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .ap-btn-approve { background: #f0fdf4; color: #059669; border-color: #bbf7d0; }
        .ap-btn-approve:hover:not(:disabled) { background: #dcfce7; }
        .ap-btn-reject  { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
        .ap-btn-reject:hover:not(:disabled)  { background: #fee2e2; }
        .ap-btn-pending { background: #fefce8; color: #d97706; border-color: #fde68a; }
        .ap-btn-pending:hover:not(:disabled) { background: #fef9c3; }
        .ap-btn-view    { background: #f0f9ff; color: #0369a1; border-color: #bae6fd; text-decoration: none; }
        .ap-btn-view:hover { background: #e0f2fe; border-bottom: 1px solid #bae6fd; }

        /* Spinner */
        .ap-spinner {
          display: inline-block; width: 12px; height: 12px;
          border: 2px solid currentColor; border-top-color: transparent;
          border-radius: 50%; animation: ap-spin 0.6s linear infinite;
          opacity: 0.6; flex-shrink: 0;
        }
        @keyframes ap-spin { to { transform: rotate(360deg); } }

        /* Rejection note form */
        .ap-reject-form { display: flex; gap: 0.45rem; flex-wrap: wrap; align-items: center; margin-top: 0.5rem; }
        .ap-reject-input {
          flex: 1; min-width: 180px; padding: 0.35rem 0.625rem;
          border: 1.5px solid #fca5a5; border-radius: 0.375rem;
          font-size: 0.8rem; outline: none; color: #18181b;
          transition: border-color 160ms ease;
        }
        .ap-reject-input:focus { border-color: #dc2626; }
        .ap-btn-confirm-reject {
          padding: 0.35rem 0.75rem; background: #dc2626; color: white;
          border: none; border-radius: 0.375rem; font-size: 0.78rem;
          font-weight: 700; cursor: pointer;
        }
        .ap-btn-confirm-reject:hover { background: #b91c1c; }
        .ap-btn-cancel {
          padding: 0.35rem 0.625rem; background: transparent; color: #71717a;
          border: 1px solid #e4e4e7; border-radius: 0.375rem;
          font-size: 0.78rem; font-weight: 600; cursor: pointer;
        }
        .ap-btn-cancel:hover { background: #f4f4f5; }

        @media (max-width: 600px) {
          .ap-header { padding: 0.75rem 1.25rem; }
          .ap-stats   { padding: 0.75rem 1.25rem; gap: 1.25rem; }
          .ap-tabs    { padding: 0 1.25rem; }
          .ap-content { padding: 1.25rem; }
          .ap-card    { grid-template-columns: 56px 1fr; gap: 0.875rem; }
        }
      `}</style>

      <div className="ap-page">
        {/* ── Header ── */}
        <header className="ap-header">
          <div className="ap-header-left">
            <div>
              <h1 className="ap-header-title">Admin Panel</h1>
              <span className="ap-header-sub">LovieProject</span>
            </div>
          </div>
          <button className="ap-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </header>

        {/* ── Stats bar ── */}
        <div className="ap-stats">
          <div className="ap-stat ap-stat-pending">
            <span className="ap-stat-n">{counts.pending}</span>
            <span className="ap-stat-label">Pending</span>
          </div>
          <div className="ap-stat ap-stat-approved">
            <span className="ap-stat-n">{counts.approved}</span>
            <span className="ap-stat-label">Approved</span>
          </div>
          <div className="ap-stat ap-stat-rejected">
            <span className="ap-stat-n">{counts.rejected}</span>
            <span className="ap-stat-label">Rejected</span>
          </div>
          <div className="ap-stat" style={{ marginLeft: 'auto' }}>
            <span className="ap-stat-n" style={{ color: '#a1a1aa' }}>{profiles.length}</span>
            <span className="ap-stat-label">Total</span>
          </div>
        </div>

        {/* ── Tabs ── */}
        <nav className="ap-tabs">
          {TABS.map(t => (
            <button
              key={t}
              className={`ap-tab${tab === t ? ' active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
              <span className={`ap-tab-badge${t === 'pending' && counts.pending > 0 ? ' has-items' : ''}`}>
                {counts[t]}
              </span>
            </button>
          ))}
        </nav>

        {/* ── Content ── */}
        <div className="ap-content">
          {fetchError && (
            <div className="ap-error">
              Could not load profiles — check your Supabase service role key.
            </div>
          )}
          {actionError && (
            <div className="ap-error" style={{ marginBottom: '1.5rem' }}>
              <strong>Action failed:</strong> {actionError}
              {actionError.includes('Unauthorized') && (
                <span> — your admin session may have expired. <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#dc2626', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>Log in again</button></span>
              )}
            </div>
          )}

          {visible.length === 0 ? (
            <div className="ap-empty">
              <div className="ap-empty-icon">
                {tab === 'pending' ? '📭' : '✅'}
              </div>
              <p className="ap-empty-text">
                No {tab} profiles yet.
              </p>
            </div>
          ) : (
            visible.map(profile => {
              const isLoading   = loadingId   === profile.id;
              const isRejecting = rejectingId === profile.id;
              const note        = rejectNotes[profile.id] ?? '';

              return (
                <div key={profile.id} className="ap-card">
                  {/* Thumbnail */}
                  <PhotoThumb url={profile.photo_url} name={profile.name} />

                  {/* Body */}
                  <div className="ap-card-body">
                    <div className="ap-card-top">
                      <h2 className="ap-card-name">{profile.name}</h2>
                      <span className="ap-card-date">{fmt(profile.created_at)}</span>
                    </div>

                    {/* Status badge on approved tab */}
                    {tab === 'approved' && (
                      <span className="ap-status-badge ap-status-approved">
                        ✅ approved
                      </span>
                    )}

                    {/* Meta */}
                    {(profile.city || profile.country) && (
                      <p className="ap-card-meta">
                        📍 {[profile.city, profile.country].filter(Boolean).join(', ')}
                      </p>
                    )}

                    {/* Tags */}
                    {profile.tags?.length > 0 && (
                      <div className="ap-card-tags">
                        {profile.tags.map(t => (
                          <span key={t} className="ap-card-tag">{t}</span>
                        ))}
                      </div>
                    )}

                    {/* Tagline */}
                    {profile.tagline && (
                      <p className="ap-card-tagline">"{profile.tagline}"</p>
                    )}

                    {/* Bio preview */}
                    {profile.bio && (
                      <p className="ap-card-bio">{truncate(profile.bio)}</p>
                    )}

                    {/* ── Actions ── */}
                    <div className="ap-actions">
                      {/* Approve (show on pending / rejected) */}
                      {tab !== 'approved' && (
                        <button
                          className="ap-btn ap-btn-approve"
                          disabled={isLoading}
                          onClick={() => updateStatus(profile.id, 'approved')}
                        >
                          {isLoading ? <span className="ap-spinner" /> : '✅'}
                          Approve
                        </button>
                      )}

                      {/* Reject = delete permanently */}
                      {!isRejecting && (
                        <button
                          className="ap-btn ap-btn-reject"
                          disabled={isLoading}
                          onClick={() => { setRejectingId(profile.id); }}
                        >
                          🗑 Delete
                        </button>
                      )}

                      {/* Move back to pending (show on approved tab only) */}
                      {tab !== 'pending' && (
                        <button
                          className="ap-btn ap-btn-pending"
                          disabled={isLoading}
                          onClick={() => updateStatus(profile.id, 'pending')}
                        >
                          ↩ Pending
                        </button>
                      )}

                      {/* View full profile */}
                      <Link
                        href={`/profile/${profile.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ap-btn ap-btn-view"
                      >
                        👁 View
                      </Link>
                    </div>

                    {/* ── Delete confirmation ── */}
                    {isRejecting && (
                      <div className="ap-reject-form">
                        <span style={{ fontSize: '0.82rem', color: '#dc2626', fontWeight: 600 }}>
                          Delete permanently?
                        </span>
                        <button
                          className="ap-btn-confirm-reject"
                          disabled={isLoading}
                          onClick={() => deleteProfile(profile.id)}
                        >
                          {isLoading ? <span className="ap-spinner" /> : null}
                          Yes, Delete
                        </button>
                        <button
                          className="ap-btn-cancel"
                          onClick={() => { setRejectingId(null); }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
