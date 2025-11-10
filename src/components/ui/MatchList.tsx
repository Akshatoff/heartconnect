import ProfileCard from "./ProfileCard";
import { Heart } from "lucide-react";

interface Match {
  id: string;
  full_name: string;
  age: number;
  location: string;
  about: string;
  interests: string[];
  avatar_url?: string;
  compatibility_score?: number;
}

interface MatchListProps {
  matches: Match[];
  onLike?: (id: string) => void;
  onMessage?: (id: string) => void;
  loading?: boolean;
}

export default function MatchList({
  matches,
  onLike,
  onMessage,
  loading,
}: MatchListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-gray-200 rounded flex-1"></div>
                <div className="h-8 w-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No matches found
        </h3>
        <p className="text-gray-600">Check back soon for new profiles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matches.map((match) => (
        <ProfileCard
          key={match.id}
          profile={match}
          onLike={onLike}
          onMessage={onMessage}
        />
      ))}
    </div>
  );
}
