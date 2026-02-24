export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1A1A2E', color: 'white', paddingTop: '3rem', paddingBottom: '3rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center' }}>
          {/* Wordmark */}
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.875rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
            Lovie<span style={{ fontWeight: 400, fontSize: '0.875rem', marginLeft: '4px', color: '#b8aea0' }}>Project</span>
          </h2>

          {/* Tagline - Bilingual */}
          <p style={{ fontSize: '0.875rem', color: '#b8aea0', margin: '0 0 1.5rem 0', fontWeight: 400 }}>
            <span lang="en">Celebrating creative women 55+ from around the world</span>
            <span lang="ru" style={{ display: 'none' }}>Отмечаем творческих женщин 55+ со всего мира</span>
          </p>

          {/* Copyright */}
          <p style={{ fontSize: '0.875rem', color: '#8b8178', margin: '0.5rem 0' }}>
            &copy; {new Date().getFullYear()} Lovie Project. All rights reserved.
          </p>

          {/* Built with */}
          <p style={{ fontSize: '0.75rem', color: '#8b8178', marginTop: '0.75rem' }}>
            Built with Next.js and Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}
