import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import ProjectsGallery from '@/components/ProjectsGallery';

export const metadata = {
  title: 'Наши Проекты · Our Projects — LovieProject',
  description: 'Travel groups, exhibitions, workshops and gatherings by LovieProject members',
};

export default async function ProjectsPage() {
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'approved')
    .order('date_start', { ascending: true });

  return (
    <>
      <style href="projects-page" precedence="default">{`
        .proj-hero {
          background-color: #FAF6F0;
          padding: clamp(3.5rem, 8vw, 5.5rem) 2rem clamp(3rem, 6vw, 4.5rem);
          text-align: center;
          border-bottom: 1px solid #e5e0d8;
          position: relative;
          overflow: hidden;
        }

        .proj-hero-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .proj-hero-inner {
          position: relative;
          max-width: 52rem;
          margin: 0 auto;
          z-index: 1;
        }

        .proj-hero-eyebrow {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #d4a574;
          margin-bottom: 1.25rem;
          font-family: 'Playfair Display', serif;
        }

        .proj-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 900;
          color: #8B1A4A;
          line-height: 1.1;
          margin: 0 0 0.3rem;
          letter-spacing: -0.025em;
        }

        .proj-hero-title-en {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 400;
          font-style: italic;
          color: #b8aea0;
          margin: 0 0 1.5rem;
          letter-spacing: -0.01em;
        }

        .proj-hero-sub {
          font-size: clamp(0.95rem, 1.5vw, 1.1rem);
          color: #6b6159;
          line-height: 1.7;
          max-width: 38rem;
          margin: 0 auto 2rem;
        }

        .proj-hero-sub-en {
          display: block;
          font-size: 0.87em;
          color: #9b9188;
          margin-top: 0.2rem;
        }

        .proj-hero-btn {
          display: inline-block;
          background: #8B1A4A;
          color: #FAF6F0;
          padding: 0.9rem 2.75rem;
          border-radius: 50px;
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 1rem;
          text-decoration: none;
          transition: background 220ms ease, transform 180ms ease, box-shadow 220ms ease;
          box-shadow: 0 8px 28px rgba(139,26,74,0.28);
          letter-spacing: 0.02em;
        }

        .proj-hero-btn:hover {
          background: #c91a52;
          transform: translateY(-2px);
          box-shadow: 0 14px 36px rgba(139,26,74,0.38);
        }
      `}</style>

      <div style={{ backgroundColor: '#FAF6F0', minHeight: '100vh' }}>
        {/* ── Hero ── */}
        <section className="proj-hero">
          {/* Decorative orbs */}
          <div className="proj-hero-orb" style={{
            width: '28rem', height: '28rem',
            top: '-12rem', right: '-10rem',
            background: 'radial-gradient(circle, rgba(139,26,74,0.06) 0%, transparent 70%)',
          }} />
          <div className="proj-hero-orb" style={{
            width: '20rem', height: '20rem',
            bottom: '-8rem', left: '-6rem',
            background: 'radial-gradient(circle, rgba(107,76,154,0.06) 0%, transparent 70%)',
          }} />
          <div className="proj-hero-orb" style={{
            width: '14rem', height: '14rem',
            top: '2rem', left: '8%',
            background: 'radial-gradient(circle, rgba(212,165,116,0.1) 0%, transparent 70%)',
          }} />

          <div className="proj-hero-inner">
            <p className="proj-hero-eyebrow">
              LovieProject · Наши Проекты · Our Projects
            </p>
            <h1 className="proj-hero-title">Наши Проекты</h1>
            <p className="proj-hero-title-en">Our Projects</p>
            <p className="proj-hero-sub">
              Путешествия, выставки, мастер-классы и встречи от участниц LovieProject
              <span className="proj-hero-sub-en">
                Travel groups, exhibitions, workshops and gatherings by LovieProject members
              </span>
            </p>
            <Link href="/projects/submit" className="proj-hero-btn">
              Опубликовать проект · Post a Project
            </Link>
          </div>
        </section>

        {/* ── Gallery with category filter ── */}
        <ProjectsGallery projects={projects || []} fetchError={!!error} />
      </div>
    </>
  );
}
