export default function ProfileCard({ profile }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {profile.photo_url && (
        <img
          src={profile.photo_url}
          alt={profile.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{profile.name}</h3>
        {profile.tagline && (
          <p className="text-sm text-gray-600">{profile.tagline}</p>
        )}
        {profile.city || profile.country ? (
          <p className="text-xs text-gray-500 mt-1">
            {[profile.city, profile.country].filter(Boolean).join(', ')}
          </p>
        ) : null}
        {profile.bio && (
          <p className="text-sm text-gray-700 mt-2 line-clamp-2">{profile.bio}</p>
        )}
      </div>
    </div>
  );
}
