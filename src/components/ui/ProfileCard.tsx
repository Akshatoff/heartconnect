import Link from "next/link";
import { MapPin, Heart, MessageCircle } from "lucide-react";

interface ProfileCardProps {
  profile: {
    id: string;
    full_name: string;
    age: number;
    location: string;
    about: string;
    interests: string[];
    avatar_url?: string;
    compatibility_score?: number;
  };
  onLike?: (id: string) => void;
  onMessage?: (id: string) => void;
}

export default function ProfileCard({
  profile,
  onLike,
  onMessage,
}: ProfileCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Avatar Section */}
      <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.full_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-primary-600">
              {profile.full_name.charAt(0)}
            </div>
          </div>
        )}
        {profile.compatibility_score && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {profile.compatibility_score}% Match
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        <Link href={`/profile/${profile.id}`}>
          <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600 mb-2 transition-colors">
            {profile.full_name}, {profile.age}
          </h3>
        </Link>

        <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
          <MapPin className="w-4 h-4" />
          {profile.location}
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {profile.about || "No description available"}
        </p>

        {profile.interests && profile.interests.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.interests.slice(0, 3).map((interest, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
              >
                {interest}
              </span>
            ))}
            {profile.interests.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{profile.interests.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href={`/profile/${profile.id}`}
            className="flex-1 text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View Profile
          </Link>
          {onMessage && (
            <button
              onClick={() => onMessage(profile.id)}
              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              aria-label="Send message"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          )}
          {onLike && (
            <button
              onClick={() => onLike(profile.id)}
              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              aria-label="Like profile"
            >
              <Heart className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
