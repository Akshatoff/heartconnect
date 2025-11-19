// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";

import {
  Heart,
  User,
  MessageCircle,
  Settings,
  LogOut,
  Search,
  Bell,
  CheckCircle,
  Clock,
  XCircle,
  Menu,
  X,
  MapPin,
  Calendar,
  Sparkles,
} from "lucide-react";

type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  about: string | null;
  city: string;
  state: string;
  interests: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  isVerified: boolean;
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/login");
        return;
      }

      setUserEmail(user.email || "");

      // Fetch user profile from API
      const response = await fetch(`/api/profile/get?supabaseId=${user.id}`);

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      } else {
        // No profile found, redirect to create profile
        router.push("/profile/create");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const getStatusBadge = () => {
    if (!profile) return null;

    switch (profile.status) {
      case "APPROVED":
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Approved
          </div>
        );
      case "PENDING":
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            <Clock className="w-4 h-4" />
            Pending Review
          </div>
        );
      case "REJECTED":
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            <XCircle className="w-4 h-4" />
            Rejected
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <Header></Header>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-64 bg-white shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col space-y-4">
              <Link
                href="/dashboard"
                className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/matches"
                className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition-colors"
              >
                <Heart className="w-5 h-5" />
                <span>Matches</span>
              </Link>
              <Link
                href="/messages"
                className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Messages</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 text-red-600 hover:text-red-700 transition-colors mt-4"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.firstName}! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your profile today.
          </p>
        </div>

        {/* Profile Status Alert */}
        {profile?.status === "PENDING" && (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <Clock className="w-6 h-6 text-yellow-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-900 mb-1">
                  Profile Under Review
                </h3>
                <p className="text-yellow-800">
                  Your profile is currently being reviewed by our team. This
                  usually takes 24-48 hours. You'll be notified via email once
                  your profile is approved.
                </p>
              </div>
            </div>
          </div>
        )}

        {profile?.status === "APPROVED" && !profile?.isVerified && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <Sparkles className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-1">
                  Profile Approved! 🎉
                </h3>
                <p className="text-blue-800">
                  Your profile has been approved. Complete your verification to
                  start connecting with matches!
                </p>
                <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Complete Verification
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">12</span>
            </div>
            <h3 className="text-gray-600 font-medium">New Matches</h3>
            <p className="text-sm text-gray-500 mt-1">+3 this week</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">5</span>
            </div>
            <h3 className="text-gray-600 font-medium">Unread Messages</h3>
            <p className="text-sm text-gray-500 mt-1">Reply now!</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">48</span>
            </div>
            <h3 className="text-gray-600 font-medium">Profile Views</h3>
            <p className="text-sm text-gray-500 mt-1">Last 7 days</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-pink-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">85%</span>
            </div>
            <h3 className="text-gray-600 font-medium">Profile Score</h3>
            <p className="text-sm text-gray-500 mt-1">Great job!</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                  {profile?.firstName?.[0]}
                  {profile?.lastName?.[0]}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {profile?.firstName} {profile?.lastName}
                </h2>
                <p className="text-gray-600 flex items-center justify-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {profile?.city}, {profile?.state}
                </p>
                <div className="mt-3 flex justify-center">
                  {getStatusBadge()}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Age:</span>
                  <span className="font-medium text-gray-900">
                    {profile?.age} years
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Gender:</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {profile?.gender.toLowerCase().replace("_", " ")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Verified:</span>
                  <span
                    className={`font-medium ${profile?.isVerified ? "text-green-600" : "text-gray-900"}`}
                  >
                    {profile?.isVerified ? "Yes ✓" : "No"}
                  </span>
                </div>
              </div>

              {profile?.interests && profile.interests.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.slice(0, 6).map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <Link
                href="/profile/edit"
                className="w-full block text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all"
              >
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/matches/discover"
                  className="flex items-center space-x-3 p-4 border-2 border-purple-200 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition-all"
                >
                  <Search className="w-6 h-6 text-purple-600" />
                  <span className="font-medium text-gray-900">Discover</span>
                </Link>
                <Link
                  href="/messages"
                  className="flex items-center space-x-3 p-4 border-2 border-indigo-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition-all"
                >
                  <MessageCircle className="w-6 h-6 text-indigo-600" />
                  <span className="font-medium text-gray-900">Messages</span>
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-gray-600 hover:bg-gray-50 transition-all"
                >
                  <Settings className="w-6 h-6 text-gray-600" />
                  <span className="font-medium text-gray-900">Settings</span>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">
                      New match with Sarah K.
                    </p>
                    <p className="text-sm text-gray-600">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-indigo-50 rounded-lg">
                  <div className="w-10 h-10 bg-indigo-200 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">
                      Message from Alex M.
                    </p>
                    <p className="text-sm text-gray-600">5 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">
                      Profile viewed by 5 people
                    </p>
                    <p className="text-sm text-gray-600">Today</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Suggested Matches Preview */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Suggested For You
                </h2>
                <Link
                  href="/matches"
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  View All
                </Link>
              </div>
              <div className="text-center py-8 text-gray-500">
                <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Start browsing to see potential matches!</p>
                <Link
                  href="/matches/discover"
                  className="inline-block mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Discover Matches
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
