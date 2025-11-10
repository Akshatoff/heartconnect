"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Edit,
  MapPin,
  Calendar,
  Heart,
  User,
  Phone,
  Mail,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Profile not found</p>
        <button
          onClick={() => router.push("/profile/edit")}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Create Profile
        </button>
      </div>
    );
  }

  const age = profile.date_of_birth
    ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear()
    : "N/A";

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="h-48 bg-gradient-to-r from-primary-500 to-primary-600"></div>

          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center text-4xl font-bold text-primary-600">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    profile.full_name?.charAt(0) || "U"
                  )}
                </div>
                {profile.is_verified && (
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Name and Actions */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4 md:mt-0">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {profile.full_name}
                    </h1>
                    <div className="flex items-center gap-4 mt-2 text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {age} years old
                      </span>
                      {profile.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {profile.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => router.push("/profile/edit")}
                    className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Status */}
        {!profile.is_approved && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              ⏳ Your profile is pending approval. You'll be notified once it's
              reviewed.
            </p>
          </div>
        )}

        {/* About Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About Me</h2>
          <p className="text-gray-700 whitespace-pre-line">
            {profile.about || "No description provided"}
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Personal Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Personal Details
            </h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Gender</span>
                <p className="font-medium text-gray-900 capitalize">
                  {profile.gender || "Not specified"}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Date of Birth</span>
                <p className="font-medium text-gray-900">
                  {profile.date_of_birth
                    ? format(new Date(profile.date_of_birth), "MMMM d, yyyy")
                    : "Not specified"}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Email</span>
                <p className="font-medium text-gray-900">{profile.email}</p>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Interests & Hobbies
            </h2>
            {profile.interests && profile.interests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No interests added yet</p>
            )}
          </div>
        </div>

        {/* Additional Information */}
        {(profile.disability_type || profile.disability_description) && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Additional Information
            </h2>
            <div className="space-y-3">
              {profile.disability_type && (
                <div>
                  <span className="text-sm text-gray-600">Type</span>
                  <p className="font-medium text-gray-900">
                    {profile.disability_type}
                  </p>
                </div>
              )}
              {profile.disability_description && (
                <div>
                  <span className="text-sm text-gray-600">Description</span>
                  <p className="text-gray-700">
                    {profile.disability_description}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Caregiver Information */}
        {profile.has_caregiver && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Caregiver Information
            </h2>
            <div className="space-y-3">
              {profile.caregiver_name && (
                <div>
                  <span className="text-sm text-gray-600">Name</span>
                  <p className="font-medium text-gray-900">
                    {profile.caregiver_name}
                  </p>
                </div>
              )}
              {profile.caregiver_relationship && (
                <div>
                  <span className="text-sm text-gray-600">Relationship</span>
                  <p className="font-medium text-gray-900">
                    {profile.caregiver_relationship}
                  </p>
                </div>
              )}
              {profile.caregiver_contact && (
                <div>
                  <span className="text-sm text-gray-600">Contact</span>
                  <p className="font-medium text-gray-900">
                    {profile.caregiver_contact}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
