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
          white-space: nowrap;
        }
        .navbar-link:hover { color: #c91a52; }

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
          white-space: nowrap;
        }
        .navbar-link-admin:hover { color: #c91a52; }

        /* "Our Projects" → "Projects" on small screens */
        .navbar-projects-full  { display: inline; }
        .navbar-projects-short { display: none;   }

        .navbar-inner {
          max-width: 80rem;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
        }

        .navbar-right {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .navbar-links {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .navbar-inner  { flex-wrap: wrap; padding: 0.875rem 1.25rem; gap: 0.625rem; }
          .navbar-right  { gap: 1rem; }
          .navbar-links  { gap: 0.875rem; }
          .navbar-link        { font-size: 0.875rem; }
          .navbar-link-admin  { font-size: 0.7rem; }
          .navbar-projects-full  { display: none;   }
          .navbar-projects-short { display: inline; }
        }

        @media (max-width: 400px) {
          .navbar-links { gap: 0.625rem; }
          .navbar-link  { font-size: 0.8rem; }
          .navbar-admin-wrap { display: none; }
        }
      `}</style>

      <nav style={{
        backgroundColor: '#faf7f2',
        borderBottom: '2px solid #d4a574',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <div className="navbar-inner">

          {/* Logo */}
          <Link href="/home" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#8b1538',
              margin: 0,
              letterSpacing: '-0.5px',
            }}>
              Lovie<span style={{ fontWeight: 400, fontSize: '0.875rem', marginLeft: '8px', color: '#6b6159' }}>
                Project
              </span>
            </h1>
          </Link>

          {/* Right: links + language toggle */}
          <div className="navbar-right">
            <div className="navbar-links">
              <Link href="/home" style={{ textDecoration: 'none' }}>
                <span className="navbar-link">Gallery</span>
              </Link>

              <Link href="/projects" style={{ textDecoration: 'none' }}>
                <span className="navbar-link">
                  <span className="navbar-projects-full">Our Projects</span>
                  <span className="navbar-projects-short">Projects</span>
                </span>
              </Link>

              <Link href="/submit" style={{ textDecoration: 'none' }}>
                <span className="navbar-link">Submit</span>
              </Link>

              <span className="navbar-admin-wrap">
                <Link href="/admin" style={{ textDecoration: 'none' }}>
                  <span className="navbar-link-admin">Admin</span>
                </Link>
              </span>
            </div>

            <LanguageToggle />
          </div>
        </div>
      </nav>
    </>
  );
}
