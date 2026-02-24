'use client';

import Link from 'next/link';
import LanguageToggle from './LanguageToggle';

export default function Navbar() {
  return (
    <>
      <style>{`
        .navbar-link {
          color: #4a4238;
          font-weight: 500;
          transition: color 200ms cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          cursor: pointer;
          display: inline-block;
        }
        .navbar-link:hover {
          color: #c91a52;
        }
        .navbar-link-admin {
          color: #4a4238;
          font-weight: 500;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: color 200ms cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          cursor: pointer;
          display: inline-block;
        }
        .navbar-link-admin:hover {
          color: #c91a52;
        }
      `}</style>
      <nav
        style={{
          backgroundColor: '#faf7f2',
          borderBottom: '2px solid #d4a574',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxSizing: 'border-box'
        }}>
          {/* Left side: Logo */}
          <Link href="/home" style={{ textDecoration: 'none' }}>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#8b1538',
              margin: 0,
              letterSpacing: '-0.5px'
            }}>
              Lovie<span style={{
                fontWeight: 400,
                fontSize: '0.875rem',
                marginLeft: '8px',
                color: '#6b6159'
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
