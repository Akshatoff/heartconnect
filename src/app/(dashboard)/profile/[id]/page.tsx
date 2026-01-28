"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  MapPin,
  Calendar,
  Users,
  Flag,
  Share2,
  MoreVertical,
  Check,
  X,
  Loader2,
  Shield,
  Verified,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";

interface ProfileData {
  id: string;
  full_name: string;
  email: string;
  gender: string;
  date_of_birth: string;
  location: string;
  city: string;
  state: string;
  avatar_url?: string;
  about: string;
  interests: string[];
  disability_type?: string;
  disability_description?: string;
  has_caregiver: boolean;
  caregiver_name?: string;
  caregiver_relationship?: string;
  is_verified: boolean;
  is_approved: boolean;
  created_at: string;
}

export default function ViewProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [matched, setMatched] = useState(false);
  const [compatibilityScore, setCompatibilityScore] = useState<number | null>(
    null,
  );
  const [showReportModal, setShowReportModal] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchProfile();
    checkLikeStatus();
    recordProfileView();
  }, [params.id]);

  const fetchProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setIsOwnProfile(user?.id === params.id);

      // Calculate compatibility if not own profile
      if (user && user.id !== params.id) {
        const { data: score } = await supabase.rpc("get_compatibility_score", {
          user1_id: user.id,
          user2_id: params.id,
        });
        setCompatibilityScore(score);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkLikeStatus = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user has liked this profile
      const { data: likeData } = await supabase
        .from("likes")
        .select("id")
        .eq("from_user_id", user.id)
        .eq("to_user_id", params.id)
        .single();

      setLiked(!!likeData);

      // Check if they're matched
      const { data: matchData } = await supabase
        .from("matches")
        .select("id")
        .or(
          `and(user1_id.eq.${user.id},user2_id.eq.${params.id}),and(user1_id.eq.${params.id},user2_id.eq.${user.id})`,
        )
        .single();

      setMatched(!!matchData);
    } catch (error) {
      console.error("Error checking like status:", error);
    }
  };

  const recordProfileView = async () => {
    try {
      if (!currentUserId || currentUserId === params.id) return;

      await fetch("/api/profile/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ viewed_id: params.id }),
      });
    } catch (error) {
      console.error("Error recording profile view:", error);
      // Silently fail - don't disrupt user experience
    }
  };

  const handleLike = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      if (liked) {
        // Unlike
        await supabase
          .from("likes")
          .delete()
          .eq("from_user_id", user.id)
          .eq("to_user_id", params.id);
        setLiked(false);
      } else {
        // Like
        await supabase.from("likes").insert({
          from_user_id: user.id,
          to_user_id: params.id,
        });
        setLiked(true);

        // Create notification
        await supabase.rpc("create_notification", {
          p_user_id: params.id,
          p_type: "like",
          p_title: "New Like",
          p_content: "Someone liked your profile",
          p_related_user_id: user.id,
        });

        // Check if it's a match
        const { data: reverselike } = await supabase
          .from("likes")
          .select("id")
          .eq("from_user_id", params.id)
          .eq("to_user_id", user.id)
          .single();

        if (reverselike) {
          setMatched(true);
          alert("🎉 It's a match! You can now chat with each other.");
        }
      }
    } catch (error) {
      console.error("Error liking profile:", error);
    }
  };

  const handleMessage = () => {
    router.push(`/chat/${params.id}`);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${profile?.full_name}'s Profile`,
        text: `Check out ${profile?.full_name} on HeartConnect`,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback to copy link
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleReport = async (reason: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("reports").insert({
        reporter_id: user.id,
        reported_user_id: params.id,
        reason: reason,
        status: "pending",
      });

      alert("Report submitted. We'll review it shortly.");
      setShowReportModal(false);
    } catch (error) {
      console.error("Error reporting profile:", error);
      alert("Failed to submit report");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600 mb-4">Profile not found</p>
        <button
          onClick={() => router.push("/matches")}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Back to Matches
        </button>
      </div>
    );
  }

  const age = profile.date_of_birth
    ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear()
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
            {!isOwnProfile && (
              <button
                onClick={() => setShowReportModal(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Flag className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Cover & Avatar */}
          <div className="relative h-64 bg-gradient-to-br from-primary-400 to-primary-600">
            {compatibilityScore !== null && (
              <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                {compatibilityScore}% Match
              </div>
            )}
          </div>

          <div className="relative px-8 pb-8">
            {/* Avatar */}
            <div className="flex items-end gap-6 -mt-20 mb-6">
              <div className="relative">
                <div className="w-40 h-40 bg-white rounded-full border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl font-bold text-primary-600">
                      {profile.full_name.charAt(0)}
                    </span>
                  )}
                </div>
                {profile.is_verified && (
                  <div className="absolute bottom-2 right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white">
                    <Verified className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>

              {/* Name & Actions */}
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      {profile.full_name}
                      {age && <span className="text-gray-600">, {age}</span>}
                    </h1>
                    <div className="flex items-center gap-4 text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {profile.location ||
                          `${profile.city}, ${profile.state}`}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Joined{" "}
                        {format(new Date(profile.created_at), "MMM yyyy")}
                      </span>
                    </div>
                  </div>

                  {!isOwnProfile && (
                    <div className="flex gap-3">
                      {matched ? (
                        <button
                          onClick={handleMessage}
                          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        >
                          <MessageCircle className="w-5 h-5" />
                          Message
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${
                              liked
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-red-600 text-white hover:bg-red-700"
                            }`}
                          >
                            <Heart
                              className={`w-5 h-5 ${liked ? "fill-current" : ""}`}
                            />
                            {liked ? "Liked" : "Like"}
                          </button>
                          <button
                            onClick={handleMessage}
                            className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                          >
                            <MessageCircle className="w-5 h-5" />
                            Message
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {isOwnProfile && (
                    <button
                      onClick={() => router.push("/profile/edit")}
                      className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* About */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    About Me
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {profile.about || "No description provided"}
                  </p>
                </div>

                {/* Interests */}
                {profile.interests && profile.interests.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Interests & Hobbies
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-primary-100 text-primary-800 rounded-full font-medium"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                {(profile.disability_type ||
                  profile.disability_description) && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Additional Information
                    </h2>
                    <div className="bg-gray-50 p-6 rounded-lg space-y-3">
                      {profile.disability_type && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">
                            Type:
                          </span>
                          <p className="text-gray-900 mt-1">
                            {profile.disability_type}
                          </p>
                        </div>
                      )}
                      {profile.disability_description && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">
                            Description:
                          </span>
                          <p className="text-gray-900 mt-1">
                            {profile.disability_description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-4">
                    Basic Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Gender</span>
                      <p className="font-medium text-gray-900 capitalize">
                        {profile.gender}
                      </p>
                    </div>
                    {age && (
                      <div>
                        <span className="text-sm text-gray-600">Age</span>
                        <p className="font-medium text-gray-900">{age} years</p>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-gray-600">Location</span>
                      <p className="font-medium text-gray-900">
                        {profile.city}, {profile.state}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Caregiver Info */}
                {profile.has_caregiver && (
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-blue-900">
                        Caregiver Support
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      {profile.caregiver_name && (
                        <div>
                          <span className="text-blue-700">Name:</span>
                          <p className="font-medium text-blue-900">
                            {profile.caregiver_name}
                          </p>
                        </div>
                      )}
                      {profile.caregiver_relationship && (
                        <div>
                          <span className="text-blue-700">Relationship:</span>
                          <p className="font-medium text-blue-900">
                            {profile.caregiver_relationship}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Verification Badge */}
                {profile.is_verified && (
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
                    <Check className="w-12 h-12 text-green-600 mx-auto mb-2" />
                    <h3 className="font-bold text-green-900 mb-1">
                      Verified Profile
                    </h3>
                    <p className="text-sm text-green-700">
                      This profile has been verified by our team
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Report Profile
            </h3>
            <p className="text-gray-600 mb-4">
              Why are you reporting this profile?
            </p>
            <div className="space-y-2 mb-6">
              {[
                "Inappropriate content",
                "Fake profile",
                "Harassment",
                "Spam",
                "Other",
              ].map((reason) => (
                <button
                  key={reason}
                  onClick={() => handleReport(reason)}
                  className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  {reason}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowReportModal(false)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
