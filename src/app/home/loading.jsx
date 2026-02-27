// Shown automatically by Next.js (Suspense) while the gallery server component fetches from Supabase

function SkeletonCard() {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '1.125rem',
      overflow: 'hidden',
      boxShadow: '0 2px 14px rgba(26,22,18,0.08)',
    }}>
      {/* Square photo placeholder */}
      <div className="skeleton" style={{ width: '100%', paddingBottom: '100%', height: 0 }} />
      {/* Body */}
      <div style={{ padding: '1.375rem 1.5rem 1.5rem' }}>
        <div className="skeleton" style={{ height: '1.25rem', width: '70%', marginBottom: '0.6rem' }} />
        <div className="skeleton" style={{ height: '0.75rem', width: '45%', marginBottom: '0.9rem' }} />
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.875rem' }}>
          {[50, 62, 44].map((w, i) => (
            <div key={i} className="skeleton" style={{ height: '1.35rem', width: `${w}px`, borderRadius: '50px' }} />
          ))}
        </div>
        <div className="skeleton" style={{ height: '0.875rem', width: '100%', marginBottom: '0.4rem' }} />
        <div className="skeleton" style={{ height: '0.875rem', width: '80%', marginBottom: '1.25rem' }} />
        <div className="skeleton" style={{ height: '2.2rem', width: '100%', borderRadius: '50px' }} />
      </div>
    </div>
  );
}

export default function GalleryLoading() {
  return (
    <div style={{ backgroundColor: '#FAF6F0' }}>

      {/* Hero skeleton */}
      <section style={{
        background: 'linear-gradient(140deg, #8B1A4A 0%, #6b4c9a 48%, #1b7a7b 100%)',
        padding: 'clamp(3rem, 8vw, 6rem) 2rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '58rem', margin: '0 auto' }}>
          <div className="skeleton" style={{ height: '0.875rem', width: '14rem', margin: '0 auto 1.5rem', opacity: 0.35 }} />
          <div className="skeleton" style={{ height: '3.5rem', width: 'min(28rem, 80%)', margin: '0 auto 1rem', opacity: 0.35 }} />
          <div className="skeleton" style={{ height: '1.1rem', width: 'min(36rem, 90%)', margin: '0 auto 0.4rem', opacity: 0.25 }} />
          <div className="skeleton" style={{ height: '0.875rem', width: 'min(28rem, 75%)', margin: '0 auto', opacity: 0.2 }} />
        </div>
      </section>

      {/* Search bar skeleton */}
      <div style={{
        background: 'rgba(250,246,240,0.95)',
        borderBottom: '1px solid #e5e0d8',
        padding: '1.25rem 2rem',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <div className="skeleton" style={{ height: '2.6rem', width: 'min(540px, 100%)', borderRadius: '50px' }} />
      </div>

      {/* Grid skeleton */}
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '3rem 2rem 5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2rem',
        }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
