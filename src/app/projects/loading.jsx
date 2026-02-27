// Shown automatically by Next.js (Suspense) while the projects server component fetches from Supabase

function SkeletonProjectCard() {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '1rem',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    }}>
      {/* 16:9 photo placeholder */}
      <div className="skeleton" style={{ width: '100%', paddingBottom: '56.25%', height: 0 }} />
      {/* Body */}
      <div style={{ padding: '1.4rem 1.5rem 1.6rem' }}>
        <div className="skeleton" style={{ height: '1.1rem', width: '85%', marginBottom: '0.5rem' }} />
        <div className="skeleton" style={{ height: '0.875rem', width: '60%', marginBottom: '0.5rem' }} />
        <div className="skeleton" style={{ height: '0.875rem', width: '45%', marginBottom: '0.875rem' }} />
        <div className="skeleton" style={{ height: '0.82rem', width: '100%', marginBottom: '0.35rem' }} />
        <div className="skeleton" style={{ height: '0.82rem', width: '100%', marginBottom: '0.35rem' }} />
        <div className="skeleton" style={{ height: '0.82rem', width: '65%', marginBottom: '1.25rem' }} />
        <div className="skeleton" style={{ height: '1px', width: '100%', marginBottom: '0.875rem' }} />
        <div className="skeleton" style={{ height: '0.78rem', width: '50%', marginBottom: '1rem' }} />
        <div className="skeleton" style={{ height: '2.1rem', width: '100%', borderRadius: '50px' }} />
      </div>
    </div>
  );
}

export default function ProjectsLoading() {
  return (
    <div style={{ backgroundColor: '#FAF6F0' }}>

      {/* Hero skeleton */}
      <section style={{
        backgroundColor: '#FAF6F0',
        padding: 'clamp(3.5rem, 8vw, 5.5rem) 2rem clamp(3rem, 6vw, 4.5rem)',
        textAlign: 'center',
        borderBottom: '1px solid #e5e0d8',
      }}>
        <div style={{ maxWidth: '52rem', margin: '0 auto' }}>
          <div className="skeleton" style={{ height: '0.75rem', width: '16rem', margin: '0 auto 1.25rem' }} />
          <div className="skeleton" style={{ height: '3.25rem', width: 'min(22rem, 80%)', margin: '0 auto 0.5rem' }} />
          <div className="skeleton" style={{ height: '1.6rem', width: 'min(14rem, 60%)', margin: '0 auto 1.5rem' }} />
          <div className="skeleton" style={{ height: '1rem', width: 'min(36rem, 90%)', margin: '0 auto 0.4rem' }} />
          <div className="skeleton" style={{ height: '0.875rem', width: 'min(28rem, 80%)', margin: '0 auto 2rem' }} />
          <div className="skeleton" style={{ height: '2.8rem', width: '14rem', margin: '0 auto', borderRadius: '50px' }} />
        </div>
      </section>

      {/* Filter bar skeleton */}
      <div style={{
        background: 'rgba(250,246,240,0.96)',
        borderBottom: '1px solid #e5e0d8',
        padding: '1.25rem 2rem',
        display: 'flex',
        justifyContent: 'center',
        gap: '0.625rem',
        flexWrap: 'wrap',
      }}>
        {[80, 95, 68, 108, 80, 72].map((w, i) => (
          <div key={i} className="skeleton" style={{ height: '2.2rem', width: `${w}px`, borderRadius: '50px' }} />
        ))}
      </div>

      {/* Grid skeleton */}
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '3rem 2rem 5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2rem',
        }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonProjectCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
