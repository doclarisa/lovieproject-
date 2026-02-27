import { supabase } from '@/lib/supabaseClient';
import GalleryClient from '@/components/GalleryClient';

export const metadata = {
  title: 'Gallery — Women Who Inspire',
  description: 'Artists, travelers, spiritual teachers and healers 55+ from around the world · Художники, путешественницы, духовные учителя и целители 55+ со всего мира',
  openGraph: {
    title: 'Gallery — LovieProject',
    description: 'Artists, travelers, spiritual teachers and healers 55+ from around the world',
    images: [{ url: '/images/homepagewomen.jpg', width: 1200, height: 800, alt: 'LovieProject Gallery' }],
  },
};

export default async function GalleryPage() {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  return (
    <div style={{ backgroundColor: '#FAF6F0', minHeight: '100vh' }}>

      {/* ── Bold Hero ── */}
      <section style={{
        background: 'linear-gradient(140deg, #8B1A4A 0%, #6b4c9a 48%, #1b7a7b 100%)',
        padding: 'clamp(3rem, 8vw, 6rem) 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-5rem', right: '-5rem',
          width: '20rem', height: '20rem', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-3rem', left: '-4rem',
          width: '14rem', height: '14rem', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '2rem', left: '8%',
          width: '6rem', height: '6rem', borderRadius: '50%',
          background: 'rgba(212,165,116,0.12)', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: '58rem', margin: '0 auto' }}>
          <p style={{
            display: 'inline-block',
            fontFamily: "'Playfair Display', serif",
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#d4a574',
            marginBottom: '1.5rem',
          }}>
            LovieProject · Галерея · Gallery
          </p>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2.25rem, 5.5vw, 4rem)',
            fontWeight: 900,
            color: '#FAF6F0',
            lineHeight: 1.15,
            margin: '0 0 1.25rem 0',
            letterSpacing: '-0.025em',
          }}>
            <span style={{ display: 'block' }}>Женщины, которые вдохновляют</span>
            <span style={{
              display: 'block',
              fontStyle: 'italic',
              fontWeight: 600,
              color: '#e8c4a0',
              fontSize: '0.85em',
              marginTop: '0.2em',
            }}>
              Women Who Inspire
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
            color: 'rgba(250,246,240,0.82)',
            maxWidth: '38rem',
            margin: '0 auto',
            lineHeight: 1.7,
            fontWeight: 400,
          }}>
            Художники, путешественницы, духовные учителя и целители 55+ со всего мира
            <br />
            <span style={{ fontSize: '0.88em', opacity: 0.7 }}>
              Artists, travelers, spiritual teachers &amp; healers 55+ from around the world
            </span>
          </p>
        </div>
      </section>

      {/* ── Gallery (client — handles search + grid) ── */}
      <GalleryClient profiles={profiles || []} fetchError={!!error} />

    </div>
  );
}
