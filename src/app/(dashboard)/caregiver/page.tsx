"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  MessageCircle,
  Eye,
  Bell,
  Heart,
  Users,
  Calendar,
  Activity,
  Settings,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";

interface CareRecipient {
  id: string;
  full_name: string;
  avatar_url?: string;
  profile_completion: number;
  active_matches: number;
  pending_messages: number;
}

interface Activity {
  id: string;
  type: "match" | "message" | "profile_view" | "like";
  description: string;
  timestamp: string;
  user_name: string;
}

interface Alert {
  id: string;
  type: "warning" | "info" | "success";
  message: string;
  timestamp: string;
  read: boolean;
}

export default function CaregiverPage() {
  const [careRecipients, setCareRecipients] = useState<CareRecipient[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "activity" | "settings"
  >("overview");
  const supabase = createClient();

  useEffect(() => {
    fetchCaregiverData();
  }, []);

  const fetchCaregiverData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch users where current user is listed as caregiver
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .eq("caregiver_contact", user.email)
        .eq("is_active", true);

      if (profiles) {
        const recipients = await Promise.all(
          profiles.map(async (profile) => {
            // Get match count
            const { count: matchCount } = await supabase
              .from("likes")
              .select("*", { count: "exact", head: true })
              .eq("from_user_id", profile.id);

            // Get pending messages count
            const { count: messageCount } = await supabase
              .from("messages")
              .select("*", { count: "exact", head: true })
              .eq("receiver_id", profile.id)
              .eq("read", false);

            return {
              id: profile.id,
              full_name: profile.full_name,
              avatar_url: profile.avatar_url,
              profile_completion: calculateProfileCompletion(profile),
              active_matches: matchCount || 0,
              pending_messages: messageCount || 0,
            };
          }),
        );

        setCareRecipients(recipients);
        if (recipients.length > 0) {
          setSelectedUser(recipients[0].id);
        }
      }

      // Fetch recent activities
      fetchActivities();

      // Fetch alerts
      fetchAlerts();
    } catch (error) {
      console.error("Error fetching caregiver data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompletion = (profile: any): number => {
    let completed = 0;
    const fields = [
      "full_name",
      "date_of_birth",
      "location",
      "about",
      "interests",
      "gender",
    ];
    fields.forEach((field) => {
      if (
        profile[field] &&
        (Array.isArray(profile[field]) ? profile[field].length > 0 : true)
      ) {
        completed++;
      }
    });
    return Math.round((completed / fields.length) * 100);
  };

  const fetchActivities = async () => {
    // Mock activities - replace with actual data fetching
    setActivities([
      {
        id: "1",
        type: "match",
        description: "New match with Sarah Johnson",
        timestamp: new Date().toISOString(),
        user_name: "John Doe",
      },
      {
        id: "2",
        type: "message",
        description: "Received a message from Mike Wilson",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        user_name: "John Doe",
      },
      {
        id: "3",
        type: "profile_view",
        description: "Profile viewed by Emma Davis",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        user_name: "John Doe",
      },
    ]);
  };

  const fetchAlerts = async () => {
    // Mock alerts - replace with actual data fetching
    setAlerts([
      {
        id: "1",
        type: "warning",
        message: "Profile completion is below 80%. Consider updating.",
        timestamp: new Date().toISOString(),
        read: false,
      },
      {
        id: "2",
        type: "info",
        message: "New safety features available. Review settings.",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        read: false,
      },
    ]);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "match":
        return <Heart className="w-5 h-5 text-red-500" />;
      case "message":
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case "profile_view":
        return <Eye className="w-5 h-5 text-green-500" />;
      case "like":
        return <Heart className="w-5 h-5 text-pink-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (careRecipients.length === 0) {
    return (
      <div className="py-12 text-center">
        <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          No Care Recipients
        </h2>
        <p className="text-gray-600 mb-6">
          You're not currently listed as a caregiver for any profiles.
        </p>
        <p className="text-sm text-gray-500">
          Users can add you as their caregiver in their profile settings.
        </p>
      </div>
    );
  }

  const selectedRecipient = careRecipients.find((r) => r.id === selectedUser);

  return (
    <div className="py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Caregiver Portal</h1>
        </div>
        <p className="text-gray-600">
          Monitor and support your care recipients
        </p>
      </div>

      {/* Alerts Banner */}
      {alerts.some((a) => !a.read) && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-900 mb-1">
              Attention Required
            </h3>
            <p className="text-sm text-yellow-800">
              You have {alerts.filter((a) => !a.read).length} unread alert
              {alerts.filter((a) => !a.read).length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Care Recipients */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="font-semibold text-gray-900 mb-4">
              Care Recipients
            </h2>
            <div className="space-y-2">
              {careRecipients.map((recipient) => (
                <button
                  key={recipient.id}
                  onClick={() => setSelectedUser(recipient.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedUser === recipient.id
                      ? "bg-primary-50 border-2 border-primary-200"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold">
                      {recipient.avatar_url ? (
                        <img
                          src={recipient.avatar_url}
                          alt={recipient.full_name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        recipient.full_name.charAt(0)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {recipient.full_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {recipient.pending_messages} new messages
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === "overview"
                      ? "text-primary-600 border-b-2 border-primary-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("activity")}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === "activity"
                      ? "text-primary-600 border-b-2 border-primary-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Activity Log
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === "settings"
                      ? "text-primary-600 border-b-2 border-primary-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Settings
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "overview" && selectedRecipient && (
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-blue-700 font-medium">
                          Profile
                        </span>
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-blue-900">
                        {selectedRecipient.profile_completion}%
                      </p>
                      <p className="text-xs text-blue-700 mt-1">Complete</p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-green-700 font-medium">
                          Matches
                        </span>
                        <Heart className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="text-2xl font-bold text-green-900">
                        {selectedRecipient.active_matches}
                      </p>
                      <p className="text-xs text-green-700 mt-1">Active</p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-purple-700 font-medium">
                          Messages
                        </span>
                        <MessageCircle className="w-5 h-5 text-purple-600" />
                      </div>
                      <p className="text-2xl font-bold text-purple-900">
                        {selectedRecipient.pending_messages}
                      </p>
                      <p className="text-xs text-purple-700 mt-1">Unread</p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Link
                        href={`/profile/${selectedUser}`}
                        className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-5 h-5 text-primary-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            View Profile
                          </p>
                          <p className="text-xs text-gray-500">
                            See their public profile
                          </p>
                        </div>
                      </Link>

                      <Link
                        href={`/chat`}
                        className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <MessageCircle className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            View Messages
                          </p>
                          <p className="text-xs text-gray-500">
                            Monitor conversations
                          </p>
                        </div>
                      </Link>

                      <Link
                        href={`/matches`}
                        className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Heart className="w-5 h-5 text-red-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            View Matches
                          </p>
                          <p className="text-xs text-gray-500">
                            See potential matches
                          </p>
                        </div>
                      </Link>

                      <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <Settings className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">Settings</p>
                          <p className="text-xs text-gray-500">
                            Manage preferences
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Alerts */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Active Alerts
                    </h3>
                    <div className="space-y-3">
                      {alerts.map((alert) => (
                        <div
                          key={alert.id}
                          className={`p-4 rounded-lg border ${
                            alert.type === "warning"
                              ? "bg-yellow-50 border-yellow-200"
                              : alert.type === "success"
                                ? "bg-green-50 border-green-200"
                                : "bg-blue-50 border-blue-200"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {alert.type === "warning" && (
                              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            )}
                            {alert.type === "success" && (
                              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            )}
                            {alert.type === "info" && (
                              <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">
                                {alert.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {format(
                                  new Date(alert.timestamp),
                                  "MMM d, h:mm a",
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "activity" && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                      >
                        {getActivityIcon(activity.type)}
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {format(
                              new Date(activity.timestamp),
                              "MMM d, h:mm a",
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Notification Settings
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-900">
                          New match notifications
                        </span>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="toggle"
                        />
                      </label>
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-900">
                          New message alerts
                        </span>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="toggle"
                        />
                      </label>
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-900">
                          Profile view notifications
                        </span>
                        <input type="checkbox" className="toggle" />
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Privacy Settings
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-900">
                          Review messages before sending
                        </span>
                        <input type="checkbox" className="toggle" />
                      </label>
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-900">
                          Approve new matches
                        </span>
                        <input type="checkbox" className="toggle" />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
