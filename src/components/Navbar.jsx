'use client';

import Link from 'next/link';
import LanguageToggle from './LanguageToggle';

export default function Navbar() {
  return (
    <>
      <style>{`
        .navbar-link {
          color: var(--color-gray-700);
          font-weight: 500;
          transition: color var(--transition-base);
          text-decoration: none;
          cursor: pointer;
        }
        .navbar-link:hover {
          color: var(--color-burgundy-light);
        }
        .navbar-link-admin {
          color: var(--color-gray-700);
          font-weight: 500;
          font-size: var(--font-size-xs);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: color var(--transition-base);
          text-decoration: none;
          cursor: pointer;
        }
        .navbar-link-admin:hover {
          color: var(--color-burgundy-light);
        }
      `}</style>
      <nav
        style={{
          backgroundColor: 'var(--color-ivory)',
          borderBottom: '2px solid var(--color-gold)',
          width: '100%'
        }}
      >
        <div style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Left side: Logo */}
          <Link href="/home" style={{ textDecoration: 'none' }}>
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 700,
              color: 'var(--color-burgundy)',
              margin: 0,
              letterSpacing: '-0.5px'
            }}>
              Lovie<span style={{
                fontWeight: 400,
                fontSize: 'var(--font-size-sm)',
                marginLeft: '8px',
                color: 'var(--color-gray-600)'
              }}>Project</span>
            </h1>
          </Link>

          {/* Right side: Navigation & Language */}
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            {/* Navigation Links */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <Link href="/home" style={{ textDecoration: 'none' }}>
                <span className="navbar-link">Gallery</span>
              </Link>
              <Link href="/submit" style={{ textDecoration: 'none' }}>
                <span className="navbar-link">Submit</span>
              </Link>
              <Link href="/admin" style={{ textDecoration: 'none' }}>
                <span className="navbar-link-admin">Admin</span>
              </Link>
            </div>

            {/* Language Toggle */}
            <LanguageToggle />
          </div>
        </div>
      </nav>
    </>
  );
}
