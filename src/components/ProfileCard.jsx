export default function ProfileCard({ profile }) {
  const brandColors = [
    '#8b1538', // burgundy
    '#1b7a7b', // teal
    '#6b4c9a', // violet
    '#d4a574', // gold
  ];

  const getTags = () => {
    return profile.tags?.slice(0, 3) || [];
  };

  const tags = getTags();

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 4px 6px -1px rgba(26, 22, 18, 0.1)',
        overflow: 'hidden',
        transition: 'all 300ms ease-out',
      }}
    >
      {/* Image Area - Aspect Square */}
      <div
        style={{
          position: 'relative',
          paddingBottom: '100%',
          height: 0,
          overflow: 'hidden',
          backgroundColor: `linear-gradient(135deg, ${brandColors[0]} 0%, ${brandColors[2]} 100%)`,
        }}
      >
        {profile.photo_url ? (
          <img
            src={profile.photo_url}
            alt={profile.name}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            No photo
          </div>
        )}
      </div>

      {/* Card Body */}
      <div style={{ padding: '1.5rem' }}>
        {/* Name */}
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#8b1538',
            margin: '0 0 0.5rem 0',
          }}
        >
          {profile.name}
        </h3>

        {/* Location */}
        {profile.city || profile.country ? (
          <p
            style={{
              fontSize: '0.875rem',
              color: '#8b8178',
              margin: '0.25rem 0',
            }}
          >
            📍 {[profile.city, profile.country].filter(Boolean).join(', ')}
          </p>
        ) : null}

        {/* Tags */}
        {tags.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            {tags.map((tag, idx) => (
              <span
                key={tag}
                style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '50px',
                  backgroundColor: brandColors[idx % brandColors.length],
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Tagline */}
        {profile.tagline && (
          <p
            style={{
              fontSize: '0.875rem',
              fontStyle: 'italic',
              color: '#6b6159',
              marginTop: '0.75rem',
              fontWeight: 400,
            }}
          >
            {profile.tagline}
          </p>
        )}

        {/* Read More Button */}
        <button
          style={{
            width: '100%',
            marginTop: '1rem',
            padding: '0.625rem 1.25rem',
            borderRadius: '50px',
            border: '2px solid #8b1538',
            backgroundColor: 'white',
            color: '#8b1538',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 300ms ease-out',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#8b1538';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'white';
            e.target.style.color = '#8b1538';
          }}
        >
          <span lang="en">Read more</span>
          <span lang="ru" style={{ display: 'none' }}>Подробнее</span>
        </button>
      </div>
    </div>
  );
}
