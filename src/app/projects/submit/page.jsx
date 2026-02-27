'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

const CATEGORY_OPTIONS = [
  { value: 'travel',   ru: 'Путешествия',  en: 'Travel'     },
  { value: 'art',      ru: 'Искусство',    en: 'Art'        },
  { value: 'workshop', ru: 'Мастер-класс', en: 'Workshop'   },
  { value: 'wellness', ru: 'Здоровье',     en: 'Wellness'   },
  { value: 'other',    ru: 'Другое',       en: 'Other'      },
];

const INITIAL_FORM = {
  title: '',
  category: '',
  description: '',
  additional_info: '',
  date_start: '',
  date_end: '',
  location_city: '',
  location_country: '',
  contact_name: '',
  contact_email: '',
  contact_instagram: '',
  contact_phone: '',
};

export default function ProjectSubmitPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [step, setStep]           = useState(1);
  const [formData, setFormData]   = useState(INITIAL_FORM);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [nameStatus, setNameStatus]     = useState(null); // null | 'validating' | 'verified' | 'not-found'
  const [profileId, setProfileId]       = useState(null);
  const [submitting, setSubmitting]     = useState(false);
  const [submitted, setSubmitted]       = useState(false);
  const [error, setError]               = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'contact_name') {
      setNameStatus(null);
      setProfileId(null);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Photo must be under 5 MB · Фото не должно превышать 5 МБ');
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleNameBlur = async () => {
    const name = formData.contact_name.trim();
    if (!name) return;
    setNameStatus('validating');
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .ilike('name', name)
      .eq('status', 'approved')
      .limit(1);
    if (data && data.length > 0) {
      setNameStatus('verified');
      setProfileId(data[0].id);
    } else {
      setNameStatus('not-found');
      setProfileId(null);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) { setError('Please enter a project title · Введите название проекта'); return; }
    if (!formData.description.trim()) { setError('Please enter a description · Введите описание'); return; }
    setError('');
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.contact_name.trim()) {
      setError('Please enter your name · Введите ваше имя');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      let photoUrl = null;

      if (photoFile) {
        const ext = photoFile.name.split('.').pop();
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filename, photoFile, { cacheControl: '3600', upsert: false });
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(uploadData.path);
        photoUrl = publicUrl;
      }

      const { error: insertError } = await supabase.from('projects').insert([{
        title:            formData.title.trim(),
        description:      formData.description.trim(),
        category:         formData.category || null,
        date_start:       formData.date_start || null,
        date_end:         formData.date_end   || null,
        location_city:    formData.location_city.trim()    || null,
        location_country: formData.location_country.trim() || null,
        photo_url:        photoUrl,
        contact_name:     formData.contact_name.trim(),
        contact_email:    formData.contact_email.trim()    || null,
        contact_phone:    formData.contact_phone.trim()    || null,
        contact_instagram: formData.contact_instagram.trim() || null,
        additional_info:  formData.additional_info.trim()  || null,
        posted_by_name:   formData.contact_name.trim(),
        profile_id:       profileId,
        status:           'approved',
      }]);

      if (insertError) throw insertError;
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{ backgroundColor: '#FAF6F0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
        <div style={{
          maxWidth: '480px', width: '100%', textAlign: 'center',
          background: 'white', borderRadius: '1.5rem',
          padding: 'clamp(2.5rem, 6vw, 3.5rem) clamp(1.75rem, 4vw, 2.75rem)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem' }}>🌸</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 800, color: '#8B1A4A',
            margin: '0 0 0.75rem', lineHeight: 1.2,
          }}>
            Ваш проект опубликован!
          </h2>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1rem', fontStyle: 'italic',
            color: '#6b6159', margin: '0 0 0.5rem',
          }}>
            Your project is live!
          </p>
          <p style={{ fontSize: '0.9rem', color: '#8b8178', lineHeight: 1.65, margin: '0 0 2rem' }}>
            Он уже виден в разделе Наши Проекты.
            <br />
            <span style={{ fontSize: '0.85em', opacity: 0.8 }}>
              It is now visible in Our Projects.
            </span>
          </p>
          <Link href="/projects" style={{
            display: 'inline-block',
            background: '#8B1A4A', color: '#FAF6F0',
            padding: '0.875rem 2.5rem', borderRadius: '50px',
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700, fontSize: '1rem',
            textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(139,26,74,0.28)',
          }}>
            Наши Проекты · Our Projects
          </Link>
        </div>
      </div>
    );
  }

  // ── Shared input style ──────────────────────────────────────────────────────
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

  return (
    <>
      <style>{`
        .ps-input:focus {
          border-color: #1b7a7b !important;
          box-shadow: 0 0 0 3px rgba(27,122,123,0.14) !important;
        }
        .ps-input::placeholder { color: #c0b8b0; }
        .ps-btn-primary {
          width: 100%;
          padding: 0.9rem 1rem;
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
        .ps-btn-primary:hover:not(:disabled) {
          background: #c91a52;
          transform: translateY(-1px);
        }
        .ps-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .ps-btn-secondary {
          width: 100%;
          padding: 0.9rem 1rem;
          background: transparent;
          color: #8B1A4A;
          border: 2px solid #8B1A4A;
          border-radius: 0.625rem;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          cursor: pointer;
          font-family: 'Playfair Display', Georgia, serif;
          transition: background 200ms ease, color 200ms ease;
        }
        .ps-btn-secondary:hover { background: #8B1A4A; color: #FAF6F0; }
        .ps-photo-drop {
          border: 2px dashed #d4a574;
          border-radius: 0.875rem;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: background 200ms ease, border-color 200ms ease;
          background: #FDFAF6;
        }
        .ps-photo-drop:hover { background: #FDF5EC; border-color: #8B1A4A; }
      `}</style>

      <div style={{ backgroundColor: '#FAF6F0', minHeight: '100vh', paddingBottom: '4rem' }}>

        {/* ── Page header ── */}
        <div style={{
          background: 'linear-gradient(140deg, #8B1A4A 0%, #6b4c9a 48%, #1b7a7b 100%)',
          padding: 'clamp(2.5rem,6vw,4rem) 2rem',
          textAlign: 'center',
          position: 'relative', overflow: 'hidden',
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
              LovieProject · Наши Проекты
            </p>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 900, color: '#FAF6F0',
              margin: '0 0 0.5rem', lineHeight: 1.15,
            }}>
              Опубликовать проект
            </h1>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic', fontWeight: 400,
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'rgba(250,246,240,0.7)', margin: 0,
            }}>
              Post a Project
            </p>
          </div>
        </div>

        {/* ── Step indicator ── */}
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          gap: '0.875rem', padding: '1.75rem 2rem 0',
        }}>
          {[1, 2].map((n) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '2rem', height: '2rem', borderRadius: '50%',
                background: step >= n ? '#8B1A4A' : '#e5e0d8',
                color: step >= n ? 'white' : '#9b9188',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: 700,
                transition: 'background 250ms ease',
              }}>
                {step > n ? '✓' : n}
              </div>
              <span style={{
                fontSize: '0.78rem', fontWeight: 600,
                color: step >= n ? '#4a4238' : '#b8aea0',
                textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>
                {n === 1
                  ? 'О проекте · About'
                  : 'Детали · Details'}
              </span>
              {n < 2 && (
                <div style={{
                  width: '2.5rem', height: '2px',
                  background: step > n ? '#8B1A4A' : '#e5e0d8',
                  borderRadius: '2px', transition: 'background 250ms ease',
                }} />
              )}
            </div>
          ))}
        </div>

        {/* ── Form ── */}
        <div style={{ maxWidth: '600px', margin: '2rem auto 0', padding: '0 1.5rem' }}>
          <div style={{
            background: 'white', borderRadius: '1.25rem',
            padding: 'clamp(2rem,5vw,2.75rem)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
          }}>

            {/* Step 1 */}
            {step === 1 && (
              <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.25rem', fontWeight: 700, color: '#8B1A4A',
                  borderBottom: '1px solid #e5e0d8', paddingBottom: '0.875rem',
                }}>
                  О проекте · About Your Project
                </div>

                {/* Title */}
                <div>
                  <label style={labelStyle}>Название проекта · Project Title *</label>
                  <input
                    name="title" value={formData.title} onChange={handleChange}
                    required className="ps-input" style={inputStyle}
                    placeholder="Watercolor retreat in Lisbon · Акварельный пленэр в Лиссабоне"
                  />
                </div>

                {/* Category */}
                <div>
                  <label style={labelStyle}>Категория · Category</label>
                  <select
                    name="category" value={formData.category} onChange={handleChange}
                    className="ps-input" style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="">— Select / Выберите —</option>
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.en} · {c.ru}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label style={labelStyle}>Описание · Description *</label>
                  <textarea
                    name="description" value={formData.description} onChange={handleChange}
                    required rows={5} className="ps-input"
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.65 }}
                    placeholder="Tell us about your project — who it's for, what to expect… / Расскажите о проекте — для кого он, что ждёт участниц…"
                  />
                </div>

                {/* Additional info */}
                <div>
                  <label style={labelStyle}>Дополнительно · Additional Information <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                  <textarea
                    name="additional_info" value={formData.additional_info} onChange={handleChange}
                    rows={3} className="ps-input"
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.65 }}
                    placeholder="Price, what's included, group size… / Цена, что входит, размер группы…"
                  />
                </div>

                {/* Photo upload */}
                <div>
                  <label style={labelStyle}>Фото проекта · Project Photo <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional, max 5 MB)</span></label>
                  <input
                    ref={fileInputRef} type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    style={{ display: 'none' }}
                  />
                  {photoPreview ? (
                    <div style={{ position: 'relative' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photoPreview} alt="Preview"
                        style={{
                          width: '100%', aspectRatio: '16/9',
                          objectFit: 'cover', borderRadius: '0.75rem',
                          display: 'block',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => { setPhotoFile(null); setPhotoPreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                        style={{
                          position: 'absolute', top: '0.5rem', right: '0.5rem',
                          background: 'rgba(0,0,0,0.55)', color: 'white',
                          border: 'none', borderRadius: '50%',
                          width: '2rem', height: '2rem',
                          cursor: 'pointer', fontSize: '1rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="ps-photo-drop" onClick={() => fileInputRef.current?.click()}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</div>
                      <p style={{ fontSize: '0.875rem', color: '#6b6159', margin: '0 0 0.25rem', fontWeight: 600 }}>
                        Нажмите, чтобы выбрать фото
                      </p>
                      <p style={{ fontSize: '0.78rem', color: '#9b9188', margin: 0 }}>
                        Click to choose a photo · JPEG, PNG or WebP
                      </p>
                    </div>
                  )}
                </div>

                {error && (
                  <div style={{
                    padding: '0.75rem 1rem',
                    background: '#fff0f3', borderLeft: '4px solid #c91a52',
                    borderRadius: '0.5rem', fontSize: '0.85rem', color: '#8B1A4A', fontWeight: 500,
                  }}>{error}</div>
                )}

                <button type="submit" className="ps-btn-primary">
                  Далее · Next →
                </button>
              </form>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.25rem', fontWeight: 700, color: '#8B1A4A',
                  borderBottom: '1px solid #e5e0d8', paddingBottom: '0.875rem',
                }}>
                  Детали и контакт · Details &amp; Contact
                </div>

                {/* Dates */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Начало · Start Date</label>
                    <input
                      type="date" name="date_start"
                      value={formData.date_start} onChange={handleChange}
                      className="ps-input" style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Конец · End Date</label>
                    <input
                      type="date" name="date_end"
                      value={formData.date_end} onChange={handleChange}
                      className="ps-input" style={inputStyle}
                    />
                  </div>
                </div>

                {/* Location */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Город · City</label>
                    <input
                      name="location_city" value={formData.location_city} onChange={handleChange}
                      className="ps-input" style={inputStyle} placeholder="Lisbon"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Страна · Country</label>
                    <input
                      name="location_country" value={formData.location_country} onChange={handleChange}
                      className="ps-input" style={inputStyle} placeholder="Portugal"
                    />
                  </div>
                </div>

                {/* Name with validation */}
                <div>
                  <label style={labelStyle}>Ваше имя · Your Name *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      name="contact_name" value={formData.contact_name}
                      onChange={handleChange} onBlur={handleNameBlur}
                      required className="ps-input"
                      style={{
                        ...inputStyle,
                        borderColor: nameStatus === 'verified' ? '#2d7a50' : nameStatus === 'not-found' ? '#d4a574' : '#e5e0d8',
                        paddingRight: nameStatus ? '2.5rem' : '1rem',
                      }}
                      placeholder="Ваше полное имя · Your full name"
                    />
                    {nameStatus === 'validating' && (
                      <span style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem' }}>⏳</span>
                    )}
                    {nameStatus === 'verified' && (
                      <span style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem' }}>✅</span>
                    )}
                    {nameStatus === 'not-found' && (
                      <span style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem' }}>⚠️</span>
                    )}
                  </div>
                  {nameStatus === 'verified' && (
                    <p style={{ fontSize: '0.8rem', color: '#2d7a50', margin: '0.4rem 0 0', fontWeight: 600 }}>
                      ✅ Профиль подтверждён · Profile verified
                    </p>
                  )}
                  {nameStatus === 'not-found' && (
                    <p style={{ fontSize: '0.8rem', color: '#7a5a20', margin: '0.4rem 0 0', lineHeight: 1.5 }}>
                      ⚠️ Мы не нашли подтверждённый профиль с этим именем. Проверьте написание или{' '}
                      <Link href="/submit" style={{ color: '#8B1A4A', fontWeight: 700 }}>добавьте свой профиль</Link> сначала.
                      <br />
                      <span style={{ opacity: 0.85 }}>
                        We could not find an approved profile with this name. Check the spelling or{' '}
                        <Link href="/submit" style={{ color: '#8B1A4A', fontWeight: 700 }}>submit your profile</Link> first.
                      </span>
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label style={labelStyle}>Email для связи · Contact Email</label>
                  <input
                    type="email" name="contact_email"
                    value={formData.contact_email} onChange={handleChange}
                    className="ps-input" style={inputStyle}
                    placeholder="you@example.com"
                  />
                </div>

                {/* Instagram */}
                <div>
                  <label style={labelStyle}>Instagram</label>
                  <input
                    name="contact_instagram" value={formData.contact_instagram} onChange={handleChange}
                    className="ps-input" style={inputStyle}
                    placeholder="@yourhandle"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label style={labelStyle}>Телефон · Phone <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                  <input
                    name="contact_phone" value={formData.contact_phone} onChange={handleChange}
                    className="ps-input" style={inputStyle}
                    placeholder="+1 234 567 8900"
                  />
                </div>

                {error && (
                  <div style={{
                    padding: '0.75rem 1rem',
                    background: '#fff0f3', borderLeft: '4px solid #c91a52',
                    borderRadius: '0.5rem', fontSize: '0.85rem', color: '#8B1A4A', fontWeight: 500,
                  }}>{error}</div>
                )}

                <div style={{ display: 'flex', gap: '0.875rem', flexDirection: 'column' }}>
                  <button type="submit" className="ps-btn-primary" disabled={submitting}>
                    {submitting ? 'Публикуем… · Publishing…' : 'Опубликовать · Publish Project 🌸'}
                  </button>
                  <button type="button" className="ps-btn-secondary" onClick={handleBack}>
                    ← Назад · Back
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Back to projects */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link href="/projects" style={{
              fontSize: '0.85rem', color: '#8b8178', textDecoration: 'none',
              borderBottom: '1px solid #d4c4bc',
            }}>
              ← Наши Проекты · Our Projects
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
