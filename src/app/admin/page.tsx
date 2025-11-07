"use client";

import { useState, useEffect } from "react";
import { Check, X, Eye, Loader2, Users, UserCheck, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface PendingProfile {
  id: string;
  full_name: string;
  email: string;
  age: number;
  location: string;
  about: string;
  created_at: string;
  is_verified: boolean;
  is_approved: boolean;
}

/**
 * Admin Dashboard
 * Allows admins to verify and approve user profiles
 */
export default function AdminDashboard() {
  const [profiles, setProfiles] = useState<PendingProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_users: 0,
    pending_approval: 0,
    verified_users: 0,
  });
  const [selectedProfile, setSelectedProfile] = useState<PendingProfile | null>(
    null,
  );
  const supabase = createClient();

  useEffect(() => {
    fetchPendingProfiles();
    fetchStats();
  }, []);

  const fetchPendingProfiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("is_approved", false)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProfiles(data || []);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Total users
      const { count: total } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Pending approval
      const { count: pending } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("is_approved", false);

      // Verified users
      const { count: verified } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("is_verified", true);

      setStats({
        total_users: total || 0,
        pending_approval: pending || 0,
        verified_users: verified || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleApprove = async (profileId: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({ is_approved: true, is_verified: true })
        .eq("id", profileId);

      if (error) throw error;

      // Log admin action
      await supabase.from("admin_actions").insert({
        admin_id: user.id,
        action_type: "approve",
        target_user_id: profileId,
      });

      // Update local state
      setProfiles((prev) => prev.filter((p) => p.id !== profileId));
      fetchStats();
      setSelectedProfile(null);
    } catch (error) {
      console.error("Error approving profile:", error);
      alert("Failed to approve profile");
    }
  };

  const handleReject = async (profileId: string, reason?: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const confirmed = window.confirm(
        "Are you sure you want to reject this profile? The user will need to resubmit.",
      );
      if (!confirmed) return;

      const { error } = await supabase
        .from("profiles")
        .update({ is_approved: false, is_active: false })
        .eq("id", profileId);

      if (error) throw error;

      // Log admin action
      await supabase.from("admin_actions").insert({
        admin_id: user.id,
        action_type: "reject",
        target_user_id: profileId,
        reason: reason || "Profile did not meet guidelines",
      });

      // Update local state
      setProfiles((prev) => prev.filter((p) => p.id !== profileId));
      fetchStats();
      setSelectedProfile(null);
    } catch (error) {
      console.error("Error rejecting profile:", error);
      alert("Failed to reject profile");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">Review and approve user profiles</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.total_users}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pending Approval
              </p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {stats.pending_approval}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Shield className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Verified Users
              </p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats.verified_users}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Profiles */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Pending Approvals
          </h2>
        </div>

        {profiles.length === 0 ? (
          <div className="p-12 text-center">
            <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No pending profiles</p>
            <p className="text-gray-500 mt-2">
              All profiles have been reviewed
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {profile.full_name}
                      </h3>
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
                        Pending
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                      <div>
                        <span className="text-gray-600">Email:</span>{" "}
                        <span className="text-gray-900">{profile.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Age:</span>{" "}
                        <span className="text-gray-900">
                          {profile.age} years
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Location:</span>{" "}
                        <span className="text-gray-900">
                          {profile.location}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Joined:</span>{" "}
                        <span className="text-gray-900">
                          {new Date(profile.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {profile.about && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">About:</p>
                        <p className="text-gray-700 line-clamp-2">
                          {profile.about}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedProfile(profile)}
                        className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button
                        onClick={() => handleApprove(profile.id)}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(profile.id)}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile Detail Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Profile Details
              </h3>
              <button
                onClick={() => setSelectedProfile(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">
                  Full Name
                </h4>
                <p className="text-gray-900">{selectedProfile.full_name}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">
                  Email
                </h4>
                <p className="text-gray-900">{selectedProfile.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">
                    Age
                  </h4>
                  <p className="text-gray-900">{selectedProfile.age} years</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">
                    Location
                  </h4>
                  <p className="text-gray-900">{selectedProfile.location}</p>
                </div>
              </div>

              {selectedProfile.about && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">
                    About
                  </h4>
                  <p className="text-gray-900">{selectedProfile.about}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleApprove(selectedProfile.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Check className="w-5 h-5" />
                  Approve Profile
                </button>
                <button
                  onClick={() => handleReject(selectedProfile.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                  Reject Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
