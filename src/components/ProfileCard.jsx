import Image from 'next/image';
import Link from 'next/link';

const BRAND       = ['#8B1A4A', '#1b7a7b', '#6b4c9a', '#d4a574'];
const BRAND_LIGHT = [
  'rgba(139, 26, 74,  0.11)',
  'rgba( 27,122,123,  0.11)',
  'rgba(107, 76,154,  0.11)',
  'rgba(212,165,116,  0.16)',
];
const GRADIENTS = [
  'linear-gradient(135deg, #8B1A4A 0%, #6b4c9a 100%)',
  'linear-gradient(135deg, #1b7a7b 0%, #6b4c9a 100%)',
  'linear-gradient(135deg, #6b4c9a 0%, #8B1A4A 100%)',
  'linear-gradient(135deg, #8B1A4A 0%, #1b7a7b 100%)',
];

function gradientFor(id) {
  if (!id) return GRADIENTS[0];
  const code = typeof id === 'string' ? id.charCodeAt(0) : id;
  return GRADIENTS[code % GRADIENTS.length];
}

function initial(name) {
  return name?.trim()?.[0]?.toUpperCase() ?? '?';
}

export default function ProfileCard({ profile }) {
  const tags = profile.tags?.slice(0, 3) ?? [];

  return (
    <>
      {/* React 19 deduplicates <style> tags with matching href+precedence */}
      <style href="profile-card" precedence="default">{`
        .pc-link {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          border-radius: 1.125rem;
          overflow: hidden;
          background: white;
          box-shadow: 0 2px 14px rgba(26, 22, 18, 0.08);
          transition: transform 280ms ease, box-shadow 280ms ease;
          position: relative;
        }

        /* Jewel-tone top accent line — fades in on hover */
        .pc-link::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #8B1A4A, #6b4c9a, #1b7a7b);
          opacity: 0;
          transition: opacity 280ms ease;
          z-index: 1;
        }

        .pc-link:hover {
          transform: translateY(-7px);
          box-shadow:
            0 22px 44px rgba(26, 22, 18, 0.14),
            0 8px 18px rgba(139, 26, 74, 0.1);
        }

        .pc-link:hover::before { opacity: 1; }

        /* Square photo */
        .pc-photo-wrap {
          position: relative;
          width: 100%;
          padding-bottom: 100%;
          height: 0;
          overflow: hidden;
          flex-shrink: 0;
        }

        .pc-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.5rem, 5vw, 3.75rem);
          font-weight: 700;
          color: rgba(255,255,255,0.88);
          letter-spacing: -0.02em;
        }

        /* Body */
        .pc-body {
          padding: 1.375rem 1.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .pc-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #8B1A4A;
          margin: 0 0 0.3rem 0;
          line-height: 1.25;
        }

        .pc-location {
          font-size: 0.82rem;
          color: #8b8178;
          margin: 0 0 0.8rem 0;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .pc-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 0.875rem;
        }

        .pc-tag {
          display: inline-block;
          padding: 0.2rem 0.65rem;
          border-radius: 50px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          text-transform: lowercase;
        }

        .pc-tagline {
          font-size: 0.875rem;
          font-style: italic;
          color: #6b6159;
          margin: 0 0 1.25rem 0;
          line-height: 1.55;
          flex: 1;
        }

        .pc-btn {
          display: block;
          padding: 0.6rem 1rem;
          border-radius: 50px;
          border: 2px solid #8B1A4A;
          background: transparent;
          color: #8B1A4A;
          font-size: 0.82rem;
          font-weight: 700;
          text-align: center;
          letter-spacing: 0.04em;
          transition: background 220ms ease, color 220ms ease;
        }

        .pc-link:hover .pc-btn {
          background: #8B1A4A;
          color: white;
        }
      `}</style>

      <Link href={`/profile/${profile.id}`} className="pc-link">
        {/* Square photo / gradient placeholder */}
        <div className="pc-photo-wrap">
          {profile.photo_url ? (
            <Image
              src={profile.photo_url}
              alt={profile.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div
              className="pc-placeholder"
              style={{ background: gradientFor(profile.id) }}
            >
              {initial(profile.name)}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="pc-body">
          <h3 className="pc-name">{profile.name}</h3>

          {(profile.city || profile.country) && (
            <p className="pc-location">
              <span aria-hidden="true">📍</span>
              {[profile.city, profile.country].filter(Boolean).join(', ')}
            </p>
          )}

          {tags.length > 0 && (
            <div className="pc-tags">
              {tags.map((tag, idx) => (
                <span
                  key={tag}
                  className="pc-tag"
                  style={{
                    backgroundColor: BRAND_LIGHT[idx % BRAND_LIGHT.length],
                    color: BRAND[idx % BRAND.length],
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {profile.tagline && (
            <p className="pc-tagline">"{profile.tagline}"</p>
          )}

          <span className="pc-btn">Read more · Подробнее</span>
        </div>
      </Link>
    </>
  );
}
