// src/app/matches/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  Heart,
  MessageCircle,
  ArrowLeft,
  Filter,
  Search,
  MapPin,
  Calendar,
  Sparkles,
  Users,
  Clock,
  CheckCircle2,
} from "lucide-react";

type Match = {
  id: string;
  user: {
    id: string;
    profile: {
      firstName: string;
      lastName: string;
      age: number;
      gender: string;
      city: string;
      state: string;
      about: string | null;
      interests: string[];
      disabilityType: string | null;
    };
  };
  isMutual: boolean;
  createdAt: string;
};

export default function MatchesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<Match[]>([]);
  const [filter, setFilter] = useState<"all" | "mutual" | "pending">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/login");
        return;
      }

      const response = await fetch(`/api/matches/list?supabaseId=${user.id}`);

      if (response.ok) {
        const data = await response.json();
        setMatches(data.matches || []);
      }
    } catch (error) {
      console.error("Error loading matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = (matchId: string) => {
    router.push(`/messages?userId=${matchId}`);
  };

  const filteredMatches = matches.filter((match) => {
    // Filter by status
    if (filter === "mutual" && !match.isMutual) return false;
    if (filter === "pending" && match.isMutual) return false;

    // Filter by search query
    if (searchQuery) {
      const fullName =
        `${match.user.profile.firstName} ${match.user.profile.lastName}`.toLowerCase();
      const city = match.user.profile.city.toLowerCase();
      const query = searchQuery.toLowerCase();

      return fullName.includes(query) || city.includes(query);
    }

    return true;
  });

  const mutualMatchesCount = matches.filter((m) => m.isMutual).length;
  const pendingMatchesCount = matches.filter((m) => !m.isMutual).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Your Matches</h1>
            </div>
            <Link
              href="/matches/discover"
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Discover More</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Matches
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {matches.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Mutual Matches
                </p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {mutualMatchesCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">
                  {pendingMatchesCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === "all"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All ({matches.length})
              </button>
              <button
                onClick={() => setFilter("mutual")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === "mutual"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Mutual ({mutualMatchesCount})
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === "pending"
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Pending ({pendingMatchesCount})
              </button>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Matches Grid */}
        {filteredMatches.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No matches found
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === "all"
                ? "Start discovering potential matches to build connections!"
                : `You don't have any ${filter} matches yet.`}
            </p>
            <Link
              href="/matches/discover"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              <span>Discover Matches</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((match) => (
              <div
                key={match.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Card Header - Avatar */}
                <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 h-32 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-purple-600">
                    {match.user.profile.firstName[0]}
                    {match.user.profile.lastName[0]}
                  </div>
                  {match.isMutual && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Mutual
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {match.user.profile.firstName} {match.user.profile.lastName}
                  </h3>

                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {match.user.profile.city}, {match.user.profile.state}
                  </div>

                  <div className="flex items-center text-gray-600 text-sm mb-4">
                    <Calendar className="w-4 h-4 mr-1" />
                    {match.user.profile.age} years • {match.user.profile.gender}
                  </div>

                  {match.user.profile.about && (
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                      {match.user.profile.about}
                    </p>
                  )}

                  {/* Interests */}
                  {match.user.profile.interests.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {match.user.profile.interests
                          .slice(0, 3)
                          .map((interest, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                            >
                              {interest}
                            </span>
                          ))}
                        {match.user.profile.interests.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                            +{match.user.profile.interests.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/profile/${match.user.id}`)}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      View Profile
                    </button>
                    {match.isMutual && (
                      <button
                        onClick={() => handleMessage(match.user.id)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all font-medium flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Message
                      </button>
                    )}
                  </div>

                  {/* Match Date */}
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Matched{" "}
                    {new Date(match.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
