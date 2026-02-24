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
    return null;
  }

  return (
    <>
      <style>{`
        .login-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #8b1538 0%, #1b7a7b 100%);
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          padding: 2.5rem;
          border-radius: 1rem;
          box-shadow: 0 25px 50px -12px rgba(26, 22, 18, 0.25);
          background-color: #faf7f2;
        }

        .login-logo {
          text-align: center;
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          margin: 0 0 0.5rem0;
          font-size: 2.25rem;
          color: #8b1538;
        }

        .login-logo-project {
          font-weight: 400;
          font-size: 0.875rem;
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
      `}</style>

      <div className="login-container">
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
    </>
  );
}
