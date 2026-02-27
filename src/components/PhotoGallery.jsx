'use client';

import { useState, useEffect, useCallback } from 'react';

export default function PhotoGallery({ images, name }) {
  const [open, setOpen]   = useState(false);
  const [idx,  setIdx]    = useState(0);

  const close = useCallback(() => setOpen(false), []);
  const prev  = useCallback(() => setIdx(i => Math.max(0, i - 1)), []);
  const next  = useCallback(
    () => setIdx(i => Math.min(images.length - 1, i + 1)),
    [images.length],
  );

  // Keyboard nav
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close, prev, next]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <style href="photo-gallery" precedence="default">{`
        /* ── Horizontal strip ── */
        .pg-strip {
          display: flex;
          gap: 0.875rem;
          overflow-x: auto;
          padding-bottom: 0.75rem;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: #d3cbc0 transparent;
        }
        .pg-strip::-webkit-scrollbar { height: 4px; }
        .pg-strip::-webkit-scrollbar-thumb { background: #d3cbc0; border-radius: 2px; }

        .pg-thumb {
          flex-shrink: 0;
          width: 190px;
          height: 190px;
          border: none;
          padding: 0;
          background: #e5e0d8;
          cursor: pointer;
          border-radius: 0.75rem;
          overflow: hidden;
          transition: transform 220ms ease, box-shadow 220ms ease;
        }
        .pg-thumb:hover {
          transform: scale(1.04);
          box-shadow: 0 10px 28px rgba(0,0,0,0.2);
        }
        .pg-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          pointer-events: none;
        }

        /* ── Lightbox ── */
        .pg-lightbox {
          position: fixed;
          inset: 0;
          z-index: 9000;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(8, 6, 4, 0.93);
          cursor: zoom-out;
          animation: lb-fade-in 180ms ease;
        }
        @keyframes lb-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .pg-lb-img-wrap {
          position: relative;
          cursor: default;
          border-radius: 0.625rem;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(0,0,0,0.7);
          max-width: min(88vw, 1100px);
          max-height: 88vh;
        }
        .pg-lb-img-wrap img {
          display: block;
          max-width: min(88vw, 1100px);
          max-height: 88vh;
          width: auto;
          height: auto;
          object-fit: contain;
        }

        .pg-lb-close {
          position: fixed;
          top: 1.25rem;
          right: 1.5rem;
          z-index: 9010;
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.22);
          color: rgba(255,255,255,0.9);
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 180ms ease;
        }
        .pg-lb-close:hover { background: rgba(255,255,255,0.28); }

        .pg-lb-arrow {
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          z-index: 9010;
          width: 3.25rem;
          height: 3.25rem;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.9);
          font-size: 1.75rem;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 180ms ease;
        }
        .pg-lb-arrow:hover { background: rgba(255,255,255,0.25); }
        .pg-lb-prev { left: 1.25rem; }
        .pg-lb-next { right: 1.25rem; }

        .pg-lb-counter {
          position: fixed;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255,255,255,0.55);
          font-size: 0.8rem;
          letter-spacing: 0.12em;
          font-weight: 500;
          z-index: 9010;
          pointer-events: none;
        }
      `}</style>

      {/* ── Scrollable thumbnail strip ── */}
      <div className="pg-strip" role="list">
        {images.map((url, i) => (
          <button
            key={i}
            className="pg-thumb"
            role="listitem"
            aria-label={`Open photo ${i + 1} of ${images.length}`}
            onClick={() => { setIdx(i); setOpen(true); }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`${name} — photo ${i + 1}`} loading="lazy" />
          </button>
        ))}
      </div>

      {/* ── Lightbox overlay ── */}
      {open && (
        <div
          className="pg-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox"
          onClick={close}
        >
          {/* Close */}
          <button className="pg-lb-close" onClick={close} aria-label="Close lightbox">
            ✕
          </button>

          {/* Prev */}
          {idx > 0 && (
            <button
              className="pg-lb-arrow pg-lb-prev"
              aria-label="Previous photo"
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >
              ‹
            </button>
          )}

          {/* Image */}
          <div className="pg-lb-img-wrap" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[idx]}
              alt={`${name} — photo ${idx + 1}`}
            />
          </div>

          {/* Next */}
          {idx < images.length - 1 && (
            <button
              className="pg-lb-arrow pg-lb-next"
              aria-label="Next photo"
              onClick={(e) => { e.stopPropagation(); next(); }}
            >
              ›
            </button>
          )}

          {/* Counter */}
          {images.length > 1 && (
            <p className="pg-lb-counter">
              {idx + 1} / {images.length}
            </p>
          )}
        </div>
      )}
    </>
  );
}
