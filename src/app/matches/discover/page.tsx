// src/app/matches/discover/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";

import {
  Heart,
  X,
  ArrowLeft,
  MapPin,
  Calendar,
  Info,
  Sparkles,
  Filter,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";

type Profile = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  about: string | null;
  city: string;
  state: string;
  country: string;
  disabilityType: string | null;
  interests: string[];
  lookingForGender: string | null;
  preferredCities: string[];
};

export default function DiscoverPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    minAge: 18,
    maxAge: 100,
    gender: "",
    city: "",
  });

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `/api/matches/discover?supabaseId=${user.id}`,
      );

      if (response.ok) {
        const data = await response.json();
        setProfiles(data.profiles || []);
      }
    } catch (error) {
      console.error("Error loading profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentProfile = profiles[currentIndex];

  const handleLike = async () => {
    if (animating || !currentProfile) return;

    setAnimating(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await fetch("/api/matches/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supabaseId: user.id,
          targetUserId: currentProfile.userId,
        }),
      });

      setTimeout(() => {
        if (currentIndex < profiles.length - 1) {
          setCurrentIndex(currentIndex + 1);
        }
        setAnimating(false);
      }, 300);
    } catch (error) {
      console.error("Error liking profile:", error);
      setAnimating(false);
    }
  };

  const handlePass = () => {
    if (animating || !currentProfile) return;

    setAnimating(true);

    setTimeout(() => {
      if (currentIndex < profiles.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
      setAnimating(false);
    }, 300);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Finding matches for you...</p>
        </div>
      </div>
    );
  }

  if (profiles.length === 0 || currentIndex >= profiles.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
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
                <h1 className="text-xl font-bold text-gray-900">Discover</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <Sparkles className="w-20 h-20 text-purple-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              You've Seen Everyone!
            </h2>
            <p className="text-gray-600 mb-8">
              You've viewed all available profiles. Check back later for new
              matches!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/matches"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all font-semibold"
              >
                View Your Matches
              </Link>
              <Link
                href="/dashboard"
                className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <Header></Header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Profile Card */}
        <div
          className={`bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
            animating ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          {/* Profile Header */}
          <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 h-48 flex items-center justify-center">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-5xl font-bold text-purple-600 shadow-xl">
              {currentProfile.firstName[0]}
              {currentProfile.lastName[0]}
            </div>
            <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-bold text-gray-900">Featured</span>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            {/* Name and Location */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {currentProfile.firstName} {currentProfile.lastName}
              </h2>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-5 h-5 mr-2" />
                <span>
                  {currentProfile.city}, {currentProfile.state}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{currentProfile.age} years old</span>
              </div>
            </div>

            {/* About */}
            {currentProfile.about && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5 text-purple-600" />
                  About
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {currentProfile.about}
                </p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-purple-50 rounded-xl">
              <div>
                <p className="text-sm text-gray-600 mb-1">Gender</p>
                <p className="font-semibold text-gray-900 capitalize">
                  {currentProfile.gender.toLowerCase().replace("_", " ")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Looking For</p>
                <p className="font-semibold text-gray-900 capitalize">
                  {currentProfile.lookingForGender
                    ? currentProfile.lookingForGender
                        .toLowerCase()
                        .replace("_", " ")
                    : "Anyone"}
                </p>
              </div>
            </div>

            {/* Disability Type */}
            {currentProfile.disabilityType && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h3 className="text-sm font-semibold text-blue-900 mb-1">
                  Disability Type
                </h3>
                <p className="text-blue-800">{currentProfile.disabilityType}</p>
              </div>
            )}

            {/* Interests */}
            {currentProfile.interests.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Preferred Cities */}
            {currentProfile.preferredCities.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  Preferred Locations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.preferredCities.map((city, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handlePass}
                disabled={animating}
                className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2 text-lg"
              >
                <X className="w-6 h-6" />
                Pass
              </button>
              <button
                onClick={handleLike}
                disabled={animating}
                className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 text-white py-4 rounded-xl hover:from-pink-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2 text-lg shadow-lg"
              >
                <Heart className="w-6 h-6 fill-current" />
                Like
              </button>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 text-gray-600 hover:text-purple-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Previous</span>
              </button>
              <Link
                href={`/profile/${currentProfile.userId}`}
                className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
              >
                View Full Profile
              </Link>
              <button
                onClick={handleNext}
                disabled={currentIndex === profiles.length - 1}
                className="flex items-center gap-2 text-gray-600 hover:text-purple-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <span className="text-sm font-medium">Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            💡 Tips for Success
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Be genuine and show interest in shared hobbies</li>
            <li>• Read profiles carefully before making decisions</li>
            <li>• Don't hesitate to reach out when you find a mutual match</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
