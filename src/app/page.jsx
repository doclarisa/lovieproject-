'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('siteAuthenticated');
    if (auth === 'true') {
      // User already authenticated, redirect immediately (don't render anything)
      router.push('/home');
    } else {
      // Not authenticated, show password page
      setIsLoading(false);
    }
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const correctPassword = process.env.NEXT_PUBLIC_SITE_PASSWORD;

    if (password === correctPassword) {
      localStorage.setItem('siteAuthenticated', 'true');
      router.push('/home');
    } else {
      setError('Invalid password');
      setPassword('');
    }
  };

  // Don't render anything while checking authentication
  if (isLoading) {
    return null;
  }

  return (
    <>
      <style>{`
        .login-wrapper {
          display: flex;
          min-height: 100vh;
          background: #f5f1ed;
        }

        .login-image-column {
          flex: 0 0 60%;
          position: relative;
          overflow: hidden;
        }

        .login-image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 200px;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
          z-index: 10;
          display: flex;
          align-items: flex-end;
          padding: 2rem;
        }

        .login-image-quote {
          color: white;
          font-family: 'Playfair Display', serif;
          font-size: 1.875rem;
          font-style: italic;
          font-weight: 700;
          line-height: 1.4;
          max-width: 400px;
        }

        .login-form-column {
          flex: 0 0 40%;
          background-color: #faf7f2;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .login-card {
          width: 100%;
          max-width: 350px;
        }

        .login-logo {
          text-align: center;
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          font-size: 2rem;
          color: #8b1538;
        }

        .login-logo-project {
          font-weight: 400;
          font-size: 0.75rem;
          margin-left: 4px;
          color: #6b6159;
        }

        .login-tagline {
          text-align: center;
          margin-bottom: 2rem;
          color: #8b8178;
          font-size: 0.875rem;
          font-weight: 400;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .login-label {
          display: block;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.75rem;
          font-weight: 600;
          color: #4a4238;
        }

        .login-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e0d8;
          border-radius: 0.5rem;
          outline: none;
          transition: border-color 200ms cubic-bezier(0.4, 0, 0.2, 1);
          color: #1a1612;
          font-size: 1rem;
          box-sizing: border-box;
        }

        .login-input:focus {
          border-color: #2e9a9b;
        }

        .login-error {
          padding: 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          background-color: #fee2e2;
          border-left: 4px solid #e74c3c;
          color: #e74c3c;
        }

        .login-button {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.5rem;
          font-weight: 600;
          color: white;
          transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
          background-color: #c91a52;
          font-size: 1rem;
          border: none;
          cursor: pointer;
        }

        .login-button:hover {
          transform: scale(1.02);
        }

        @media (max-width: 768px) {
          .login-wrapper {
            flex-direction: column;
          }

          .login-image-column {
            flex: 0 0 250px;
            height: 250px;
          }

          .login-form-column {
            flex: 1;
          }

          .login-image-quote {
            font-size: 1.25rem;
          }
        }
      `}</style>

      <div className="login-wrapper">
        {/* Left: Hero Image */}
        <div className="login-image-column">
          <Image
            src="/images/homepagewomen.jpg"
            alt="Creative women of LovieProject"
            fill
            style={{ objectFit: 'cover' }}
            priority={true}
          />
          <div className="login-image-overlay">
            <div className="login-image-quote">
              <span lang="en">We have something to say to the world</span>
              <span lang="ru" style={{ display: 'none' }}>Нам есть что сказать миру</span>
            </div>
          </div>
        </div>

        {/* Right: Password Form */}
        <div className="login-form-column">
          <div className="login-card">
            <h1 className="login-logo">
              Lovie<span className="login-logo-project">Project</span>
            </h1>

            <p className="login-tagline">
              <span lang="en">Enter to explore</span>
              <span lang="ru" style={{ display: 'none' }}>Войдите для исследования</span>
            </p>

            <form onSubmit={handleSubmit} className="login-form">
              <div>
                <label className="login-label">
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
                  className="login-input"
                />
              </div>

              {error && (
                <div className="login-error">{error}</div>
              )}

              <button type="submit" className="login-button">
                <span lang="en">Enter</span>
                <span lang="ru" style={{ display: 'none' }}>Войти</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
