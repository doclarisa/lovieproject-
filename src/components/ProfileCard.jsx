export default function ProfileCard({ profile }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {profile.imageUrl && (
        <img
          src={profile.imageUrl}
          alt={profile.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{profile.name}</h3>
        <p className="text-sm text-gray-600">{profile.title}</p>
        {profile.bio && (
          <p className="text-sm text-gray-700 mt-2">{profile.bio}</p>
        )}
      </div>
    </div>
  );
}
