'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

const INITIAL = {
  name: '', tagline: '', bio: '',
  city: '', country: '',
  email: '', website_url: '', instagram: '',
};

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  padding: '0.8rem 1rem',
  border: '2px solid #e5e0d8', borderRadius: '0.625rem',
  fontSize: '0.95rem', color: '#1a1612',
  background: '#fff', outline: 'none',
  fontFamily: 'Inter, sans-serif',
  transition: 'border-color 200ms ease, box-shadow 200ms ease',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.7rem', fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase',
  color: '#4a4238', marginBottom: '0.5rem',
};

const optionalBadge = (
  <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#9b9188' }}>
    {' '}(optional)
  </span>
);

export default function SubmitPage() {
  const [form, setForm]             = useState(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [error, setError]           = useState('');
  const [photoFile, setPhotoFile]   = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const clearPhoto = () => {
    setPhotoFile(null);
    setPhotoPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Please enter your name · Введите ваше имя');
      return;
    }
    if (!form.email.trim()) {
      setError('Please enter your email · Введите ваш email');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (photoFile) fd.append('photo', photoFile);

      const res = await fetch('/api/profiles/submit', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError(
        err.message?.includes('fetch')
          ? 'Could not reach the server. Please check your connection and try again. · Не удалось подключиться к серверу.'
          : `Error: ${err.message}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{
        backgroundColor: '#FAF6F0', minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '3rem 1.5rem',
      }}>
        <div style={{
          maxWidth: '460px', width: '100%', textAlign: 'center',
          background: 'white', borderRadius: '1.5rem',
          padding: 'clamp(2.5rem,6vw,3.5rem) clamp(1.75rem,4vw,2.75rem)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>🌸</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800,
            color: '#8B1A4A', margin: '0 0 0.75rem', lineHeight: 1.2,
          }}>
            Профиль отправлен!
          </h2>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic', color: '#6b6159',
            margin: '0 0 0.5rem', fontSize: '1rem',
          }}>
            Profile submitted!
          </p>
          <p style={{ fontSize: '0.9rem', color: '#8b8178', lineHeight: 1.65, margin: '0 0 2rem' }}>
            Он появится в галерее после проверки нашей командой.
            <br />
            <span style={{ fontSize: '0.85em', opacity: 0.8 }}>
              It will appear in the gallery once approved.
            </span>
          </p>
          <Link href="/home" style={{
            display: 'inline-block',
            background: '#8B1A4A', color: '#FAF6F0',
            padding: '0.875rem 2.5rem', borderRadius: '50px',
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700, fontSize: '1rem',
            textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(139,26,74,0.28)',
          }}>
            ← Галерея · Gallery
          </Link>
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        .sp-input:focus {
          border-color: #1b7a7b !important;
          box-shadow: 0 0 0 3px rgba(27,122,123,0.14) !important;
        }
        .sp-input::placeholder { color: #c0b8b0; }
        .sp-submit {
          width: 100%;
          padding: 0.95rem 1rem;
          background: #8B1A4A;
          color: #FAF6F0;
          border: none;
          border-radius: 0.625rem;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          cursor: pointer;
          font-family: 'Playfair Display', Georgia, serif;
          transition: background 200ms ease, transform 150ms ease;
        }
        .sp-submit:hover:not(:disabled) {
          background: #c91a52;
          transform: translateY(-1px);
        }
        .sp-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .sp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media (max-width: 500px) { .sp-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div style={{ backgroundColor: '#FAF6F0', minHeight: '100vh', paddingBottom: '4rem' }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(140deg, #8B1A4A 0%, #6b4c9a 48%, #1b7a7b 100%)',
          padding: 'clamp(2.5rem,6vw,4rem) 2rem',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '-4rem', right: '-5rem',
            width: '18rem', height: '18rem', borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', maxWidth: '44rem', margin: '0 auto' }}>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '0.75rem', fontWeight: 700,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#d4a574', marginBottom: '1rem',
            }}>
              LovieProject · Галерея
            </p>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 900,
              color: '#FAF6F0', margin: '0 0 0.5rem', lineHeight: 1.15,
            }}>
              Добавить профиль
            </h1>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic', color: 'rgba(250,246,240,0.7)',
              fontSize: 'clamp(1rem,2vw,1.2rem)', margin: 0,
            }}>
              Submit Your Profile
            </p>
          </div>
        </div>

        {/* Form card */}
        <div style={{ maxWidth: '560px', margin: '2.5rem auto 0', padding: '0 1.5rem' }}>
          <div style={{
            background: 'white', borderRadius: '1.25rem',
            padding: 'clamp(2rem,5vw,2.75rem)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>

              {/* Name */}
              <div>
                <label style={labelStyle}>Имя · Name <span style={{ color: '#c91a52' }}>*</span></label>
                <input
                  name="name" value={form.name} onChange={handleChange}
                  required className="sp-input" style={inputStyle}
                  placeholder="Ваше полное имя · Your full name"
                />
              </div>

              {/* Tagline */}
              <div>
                <label style={labelStyle}>Девиз · Tagline {optionalBadge}</label>
                <input
                  name="tagline" value={form.tagline} onChange={handleChange}
                  className="sp-input" style={inputStyle}
                  placeholder="Художник, путешественница, целитель… · Artist, traveler, healer…"
                />
              </div>

              {/* Bio */}
              <div>
                <label style={labelStyle}>О себе · Bio {optionalBadge}</label>
                <textarea
                  name="bio" value={form.bio} onChange={handleChange}
                  rows={4} className="sp-input"
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.65 }}
                  placeholder="Расскажите о себе… · Tell us about yourself…"
                />
              </div>

              {/* City + Country */}
              <div className="sp-grid">
                <div>
                  <label style={labelStyle}>Город · City {optionalBadge}</label>
                  <input
                    name="city" value={form.city} onChange={handleChange}
                    className="sp-input" style={inputStyle} placeholder="Москва"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Страна · Country {optionalBadge}</label>
                  <input
                    name="country" value={form.country} onChange={handleChange}
                    className="sp-input" style={inputStyle} placeholder="Россия"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  required className="sp-input" style={inputStyle}
                  placeholder="you@example.com"
                />
              </div>

              {/* Instagram */}
              <div>
                <label style={labelStyle}>Instagram {optionalBadge}</label>
                <input
                  name="instagram" value={form.instagram} onChange={handleChange}
                  className="sp-input" style={inputStyle}
                  placeholder="@yourhandle"
                />
              </div>

              {/* Website */}
              <div>
                <label style={labelStyle}>Сайт · Website {optionalBadge}</label>
                <input
                  name="website_url" value={form.website_url} onChange={handleChange}
                  className="sp-input" style={inputStyle}
                  placeholder="https://yourwebsite.com"
                />
              </div>

              {/* Photo */}
              <div>
                <label style={labelStyle}>Фото · Photo {optionalBadge}</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
                {!photoPreview ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      padding: '1.5rem 1rem',
                      border: '2px dashed #c8c0b8', borderRadius: '0.625rem',
                      background: '#faf8f5', color: '#9b9188',
                      fontSize: '0.875rem', cursor: 'pointer',
                      textAlign: 'center', lineHeight: 1.5,
                    }}
                  >
                    Нажмите чтобы загрузить фото · Click to upload a photo
                  </button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img
                      src={photoPreview}
                      alt="preview"
                      style={{
                        width: '80px', height: '80px',
                        objectFit: 'cover', borderRadius: '0.5rem',
                        border: '2px solid #e5e0d8',
                      }}
                    />
                    <button
                      type="button"
                      onClick={clearPhoto}
                      style={{
                        padding: '0.45rem 0.9rem',
                        background: '#1b7a7b', color: 'white',
                        border: 'none', borderRadius: '0.375rem',
                        fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                      }}
                    >
                      ✕ Удалить · Clear
                    </button>
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  padding: '0.75rem 1rem',
                  background: '#fff0f3', borderLeft: '4px solid #c91a52',
                  borderRadius: '0.5rem', fontSize: '0.85rem',
                  color: '#8B1A4A', fontWeight: 500, lineHeight: 1.5,
                }}>
                  {error}
                </div>
              )}

              <button type="submit" className="sp-submit" disabled={submitting}>
                {submitting ? 'Отправляем… · Submitting…' : 'Отправить профиль · Submit Profile 🌸'}
              </button>

            </form>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8rem', color: '#9b9188' }}>
            Имя и email обязательны · Name and email are required
          </p>
        </div>
      </div>
    </>
  );
}
