'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function PasswordPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shaking, setShaking] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/home');
      } else {
        setError('Неверный пароль · Invalid password');
        setPassword('');
        setShaking(true);
        setTimeout(() => setShaking(false), 650);
      }
    } catch {
      setError('Ошибка сервера · Server error');
      setPassword('');
    }
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .gate-wrapper {
          display: flex;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
        }

        /* ── Left column: image + welcome text ── */
        .gate-image-side {
          flex: 0 0 58%;
          display: flex;
          flex-direction: column;
        }

        .gate-image-container {
          flex: 1;
          position: relative;
          overflow: hidden;
        }

        .gate-welcome {
          flex-shrink: 0;
          padding: 1.5rem 2rem 1.75rem;
          background: linear-gradient(to bottom, #5a0f27, #1a1212);
        }

        .gate-welcome-text {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.35rem, 2.2vw, 2rem);
          font-style: italic;
          font-weight: 600;
          color: #FAF6F0;
          line-height: 1.35;
          letter-spacing: -0.01em;
        }

        /* ── Right column: gradient + card ── */
        .gate-form-side {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: linear-gradient(155deg, #8B1A4A 0%, #6b4c9a 48%, #1b7a7b 100%);
        }

        /* ── Card ── */
        .gate-card {
          width: 100%;
          max-width: 370px;
          background: rgba(250, 246, 240, 0.97);
          border-radius: 1.25rem;
          padding: 2.5rem 2.25rem;
          box-shadow:
            0 30px 70px rgba(0, 0, 0, 0.4),
            0 10px 28px rgba(139, 26, 74, 0.25);
        }

        .gate-wordmark {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 2.5rem;
          font-weight: 800;
          color: #8B1A4A;
          text-align: center;
          letter-spacing: -0.025em;
          line-height: 1;
          margin-bottom: 0.35rem;
        }

        .gate-wordmark span {
          font-weight: 400;
          font-size: 1rem;
          color: #6b6159;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-left: 3px;
          vertical-align: middle;
        }

        .gate-tagline {
          text-align: center;
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .gate-tagline-ru {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 0.95rem;
          font-style: italic;
          color: #4a4238;
        }

        .gate-tagline-en {
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #8b8178;
          font-weight: 500;
        }

        .gate-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .gate-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #4a4238;
          margin-bottom: 0.5rem;
        }

        .gate-input {
          width: 100%;
          padding: 0.8rem 1rem;
          border: 2px solid #e5e0d8;
          border-radius: 0.625rem;
          font-size: 1rem;
          color: #1a1612;
          background: #fff;
          outline: none;
          transition: border-color 200ms ease, box-shadow 200ms ease;
        }

        .gate-input:focus {
          border-color: #1b7a7b;
          box-shadow: 0 0 0 3px rgba(27, 122, 123, 0.15);
        }

        .gate-error {
          padding: 0.7rem 1rem;
          background: #fff0f3;
          border-left: 4px solid #c91a52;
          border-radius: 0.5rem;
          font-size: 0.85rem;
          color: #8B1A4A;
          font-weight: 500;
        }

        .gate-button {
          width: 100%;
          padding: 0.875rem 1rem;
          background: #8B1A4A;
          color: #FAF6F0;
          border: none;
          border-radius: 0.625rem;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: background 200ms ease, transform 150ms ease, box-shadow 200ms ease;
          font-family: 'Playfair Display', Georgia, serif;
        }

        .gate-button:hover {
          background: #c91a52;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(139, 26, 74, 0.4);
        }

        .gate-button:active {
          transform: translateY(0);
        }

        /* ── Shake animation ── */
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          12%  { transform: translateX(-9px); }
          25%  { transform: translateX(9px); }
          37%  { transform: translateX(-7px); }
          50%  { transform: translateX(7px); }
          62%  { transform: translateX(-4px); }
          75%  { transform: translateX(4px); }
          87%  { transform: translateX(-2px); }
        }

        .shake {
          animation: shake 0.65s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .gate-wrapper {
            flex-direction: column;
          }

          .gate-image-side {
            flex: 0 0 auto;
          }

          .gate-image-container {
            height: 42vh;
          }

          .gate-welcome {
            padding: 1rem 1.25rem 1.25rem;
          }

          .gate-welcome-text {
            font-size: 1.2rem;
          }

          .gate-form-side {
            flex: 1;
            padding: 1.5rem 1.25rem;
          }

          .gate-card {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>

      <div className="gate-wrapper">
        {/* ── Left: Hero image + welcome text ── */}
        <div className="gate-image-side">
          <div className="gate-image-container">
            <Image
              src="/images/homepagewomen.jpg"
              alt="LovieProject — Women of the world"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center top' }}
              priority
            />
          </div>
          <div className="gate-welcome">
            <p className="gate-welcome-text">
              Добро пожаловать в наш Бабушатник!
            </p>
          </div>
        </div>

        {/* ── Right: Form card on gradient ── */}
        <div className="gate-form-side">
          <div className={`gate-card${shaking ? ' shake' : ''}`}>
            <h1 className="gate-wordmark">
              Lovie<span>Project</span>
            </h1>

            <div className="gate-tagline">
              <span className="gate-tagline-ru">Место, где женщины сияют</span>
              <span className="gate-tagline-en">Where women shine</span>
            </div>

            <form onSubmit={handleSubmit} className="gate-form">
              <div>
                <label className="gate-label">Пароль · Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="●●●●●●●●"
                  className="gate-input"
                  autoFocus
                />
              </div>

              {error && <div className="gate-error">{error}</div>}

              <button type="submit" className="gate-button">
                Enter / Войти
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
