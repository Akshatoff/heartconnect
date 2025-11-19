// src/app/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import {
  ArrowLeft,
  Save,
  Lock,
  Bell,
  Eye,
  Shield,
  Trash2,
  Mail,
  Loader,
  Check,
  X as XIcon,
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("account");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [accountSettings, setAccountSettings] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    showAge: true,
    showLocation: true,
    allowMessages: "MUTUAL_ONLY", // ALL, MUTUAL_ONLY, NONE
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNewMatch: true,
    emailNewMessage: true,
    emailProfileApproved: true,
    pushNotifications: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/login");
        return;
      }

      setAccountSettings((prev) => ({ ...prev, email: user.email || "" }));

      // Load settings from API (you'll need to create this endpoint)
      // For now, using default values
      setLoading(false);
    } catch (error) {
      console.error("Error loading settings:", error);
      setLoading(false);
    }
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountSettings({
      ...accountSettings,
      [e.target.name]: e.target.value,
    });
  };

  const handlePrivacyChange = (name: string, value: any) => {
    setPrivacySettings({
      ...privacySettings,
      [name]: value,
    });
  };

  const handleNotificationChange = (name: string, checked: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked,
    });
  };

  const handleUpdateEmail = async () => {
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const { error } = await supabase.auth.updateUser({
        email: accountSettings.email,
      });

      if (error) throw error;

      setSuccess("Email updated! Please check your inbox to confirm.");
    } catch (err: any) {
      setError(err.message || "Failed to update email");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    setError("");
    setSuccess("");

    if (accountSettings.newPassword !== accountSettings.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (accountSettings.newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: accountSettings.newPassword,
      });

      if (error) throw error;

      setSuccess("Password updated successfully!");
      setAccountSettings({
        ...accountSettings,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePrivacy = async () => {
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      // Save to database via API
      // await fetch('/api/settings/privacy', {
      //   method: 'PUT',
      //   body: JSON.stringify(privacySettings),
      // });

      setSuccess("Privacy settings updated!");
    } catch (err: any) {
      setError("Failed to update privacy settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      // Save to database via API
      // await fetch('/api/settings/notifications', {
      //   method: 'PUT',
      //   body: JSON.stringify(notificationSettings),
      // });

      setSuccess("Notification settings updated!");
    } catch (err: any) {
      setError("Failed to update notification settings");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    // Implement account deletion
    alert("Account deletion would be implemented here");
    setShowDeleteModal(false);
  };

  const tabs = [
    { id: "account", label: "Account", icon: Lock },
    { id: "privacy", label: "Privacy", icon: Eye },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center pt-20">
          <div className="text-center">
            <Loader className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading settings...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">
              Manage your account preferences
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError("")}>
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
              <span>{success}</span>
              <button onClick={() => setSuccess("")}>
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-4 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-purple-50 text-purple-600 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-md p-8">
                {/* Account Settings */}
                {activeTab === "account" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Account Settings
                      </h2>

                      {/* Email */}
                      <div className="space-y-4 mb-8">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Email Address
                        </h3>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <input
                              type="email"
                              name="email"
                              value={accountSettings.email}
                              onChange={handleAccountChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          <button
                            onClick={handleUpdateEmail}
                            disabled={saving}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                          >
                            Update
                          </button>
                        </div>
                      </div>

                      {/* Password */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Change Password
                        </h3>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            name="currentPassword"
                            value={accountSettings.currentPassword}
                            onChange={handleAccountChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            name="newPassword"
                            value={accountSettings.newPassword}
                            onChange={handleAccountChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={accountSettings.confirmPassword}
                            onChange={handleAccountChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <button
                          onClick={handleUpdatePassword}
                          disabled={saving}
                          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                        >
                          {saving ? "Updating..." : "Update Password"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Settings */}
                {activeTab === "privacy" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Privacy Settings
                    </h2>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Profile Visibility
                          </h3>
                          <p className="text-sm text-gray-600">
                            Make your profile visible to other users
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={privacySettings.profileVisible}
                            onChange={(e) =>
                              handlePrivacyChange(
                                "profileVisible",
                                e.target.checked,
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Show Age
                          </h3>
                          <p className="text-sm text-gray-600">
                            Display your age on your profile
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={privacySettings.showAge}
                            onChange={(e) =>
                              handlePrivacyChange("showAge", e.target.checked)
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Show Location
                          </h3>
                          <p className="text-sm text-gray-600">
                            Display your city and state
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={privacySettings.showLocation}
                            onChange={(e) =>
                              handlePrivacyChange(
                                "showLocation",
                                e.target.checked,
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Who can message you?
                        </h3>
                        <select
                          value={privacySettings.allowMessages}
                          onChange={(e) =>
                            handlePrivacyChange("allowMessages", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="ALL">Everyone</option>
                          <option value="MUTUAL_ONLY">
                            Mutual matches only
                          </option>
                          <option value="NONE">No one</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={handleSavePrivacy}
                      disabled={saving}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save Privacy Settings"}
                    </button>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Notification Settings
                    </h2>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            New Match
                          </h3>
                          <p className="text-sm text-gray-600">
                            Email when you get a new match
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.emailNewMatch}
                            onChange={(e) =>
                              handleNotificationChange(
                                "emailNewMatch",
                                e.target.checked,
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            New Message
                          </h3>
                          <p className="text-sm text-gray-600">
                            Email when you receive a message
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.emailNewMessage}
                            onChange={(e) =>
                              handleNotificationChange(
                                "emailNewMessage",
                                e.target.checked,
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Profile Approved
                          </h3>
                          <p className="text-sm text-gray-600">
                            Email when your profile is approved
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.emailProfileApproved}
                            onChange={(e) =>
                              handleNotificationChange(
                                "emailProfileApproved",
                                e.target.checked,
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Push Notifications
                          </h3>
                          <p className="text-sm text-gray-600">
                            Receive browser push notifications
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.pushNotifications}
                            onChange={(e) =>
                              handleNotificationChange(
                                "pushNotifications",
                                e.target.checked,
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={handleSaveNotifications}
                      disabled={saving}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save Notification Settings"}
                    </button>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === "security" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Security & Data
                    </h2>

                    <div className="space-y-4">
                      <div className="p-6 border border-yellow-200 bg-yellow-50 rounded-lg">
                        <h3 className="font-semibold text-yellow-900 mb-2">
                          Two-Factor Authentication
                        </h3>
                        <p className="text-sm text-yellow-800 mb-4">
                          Add an extra layer of security to your account
                        </p>
                        <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                          Enable 2FA
                        </button>
                      </div>

                      <div className="p-6 border border-red-200 bg-red-50 rounded-lg">
                        <h3 className="font-semibold text-red-900 mb-2">
                          Delete Account
                        </h3>
                        <p className="text-sm text-red-800 mb-4">
                          Permanently delete your account and all associated
                          data
                        </p>
                        <button
                          onClick={() => setShowDeleteModal(true)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Delete Account
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot
              be undone and all your data will be permanently removed.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
