"use client";

import { useState, useEffect } from "react";
import { Loader2, Filter, Heart, X, MapPin, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

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

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minAge: 18,
    maxAge: 100,
    location: "",
  });
  const supabase = createClient();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user.id)
        .eq("is_approved", true)
        .eq("is_active", true)
        .limit(20);

      if (error) throw error;

      // Calculate age and format data
      const formattedMatches = (data || []).map((profile) => {
        const age = profile.date_of_birth
          ? new Date().getFullYear() -
            new Date(profile.date_of_birth).getFullYear()
          : 0;

        return {
          id: profile.id,
          full_name: profile.full_name,
          age,
          location: profile.location || "Unknown",
          about: profile.about || "",
          interests: profile.interests || [],
          avatar_url: profile.avatar_url,
          compatibility_score: Math.floor(Math.random() * 30) + 70, // Mock score
        };
      });

      setMatches(formattedMatches);
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (matchId: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("likes").insert({
        from_user_id: user.id,
        to_user_id: matchId,
      });

      // Remove from current matches
      setMatches((prev) => prev.filter((m) => m.id !== matchId));
    } catch (error) {
      console.error("Error liking profile:", error);
    }
  };

  const handleSkip = (matchId: string) => {
    setMatches((prev) => prev.filter((m) => m.id !== matchId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Match
          </h1>
          <p className="text-gray-600">
            Discover compatible people looking for meaningful connections
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No more matches
          </h3>
          <p className="text-gray-600 mb-4">Check back soon for new profiles</p>
          <button
            onClick={fetchMatches}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Refresh Matches
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <div
              key={match.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Avatar */}
              <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 relative">
                {match.avatar_url ? (
                  <img
                    src={match.avatar_url}
                    alt={match.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-primary-600">
                      {match.full_name.charAt(0)}
                    </div>
                  </div>
                )}
                {match.compatibility_score && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {match.compatibility_score}% Match
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {match.full_name}, {match.age}
                </h3>

                <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                  <MapPin className="w-4 h-4" />
                  {match.location}
                </div>

                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {match.about || "No description available"}
                </p>

                {match.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {match.interests.slice(0, 3).map((interest, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                    {match.interests.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{match.interests.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSkip(match.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-5 h-5" />
                    Skip
                  </button>
                  <Link
                    href={`/profile/${match.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={() => handleLike(match.id)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    aria-label="Like profile"
                  >
                    <Heart className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
