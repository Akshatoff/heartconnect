// src/app/profile/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import {
  ArrowLeft,
  Save,
  User,
  MapPin,
  Info,
  Target,
  Users,
  Camera,
  X,
  Loader,
} from "lucide-react";

type ProfileData = {
  firstName: string;
  lastName: string;
  age: number;
  gender: "MALE" | "FEMALE" | "NON_BINARY";
  about: string;
  city: string;
  state: string;
  country: string;
  disabilityType: string;
  interests: string[];
  lookingForGender: "MALE" | "FEMALE" | "NON_BINARY" | "";
  preferredCities: string[];
  hasCaregiver: boolean;
  caregiverName: string;
  caregiverPhone: string;
  caregiverEmail: string;
};

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    age: 18,
    gender: "MALE",
    about: "",
    city: "",
    state: "",
    country: "India",
    disabilityType: "",
    interests: [],
    lookingForGender: "",
    preferredCities: [],
    hasCaregiver: false,
    caregiverName: "",
    caregiverPhone: "",
    caregiverEmail: "",
  });

  const [interestInput, setInterestInput] = useState("");
  const [cityInput, setCityInput] = useState("");

  const commonInterests = [
    "Reading",
    "Music",
    "Movies",
    "Cooking",
    "Traveling",
    "Art",
    "Sports",
    "Gaming",
    "Photography",
    "Dancing",
    "Gardening",
    "Writing",
    "Yoga",
    "Meditation",
    "Technology",
  ];

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);

      const response = await fetch(`/api/profile/get?supabaseId=${user.id}`);

      if (response.ok) {
        const data = await response.json();
        const profile = data.profile;

        setFormData({
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          age: profile.age || 18,
          gender: profile.gender || "MALE",
          about: profile.about || "",
          city: profile.city || "",
          state: profile.state || "",
          country: profile.country || "India",
          disabilityType: profile.disabilityType || "",
          interests: profile.interests || [],
          lookingForGender: profile.lookingForGender || "",
          preferredCities: profile.preferredCities || [],
          hasCaregiver: !!(
            profile.caregiverName ||
            profile.caregiverPhone ||
            profile.caregiverEmail
          ),
          caregiverName: profile.caregiverName || "",
          caregiverPhone: profile.caregiverPhone || "",
          caregiverEmail: profile.caregiverEmail || "",
        });
      } else {
        setError("Profile not found");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addInterest = (interest: string) => {
    if (interest && !formData.interests.includes(interest)) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, interest],
      }));
      setInterestInput("");
    }
  };

  const removeInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }));
  };

  const addCity = () => {
    if (cityInput && !formData.preferredCities.includes(cityInput)) {
      setFormData((prev) => ({
        ...prev,
        preferredCities: [...prev.preferredCities, cityInput],
      }));
      setCityInput("");
    }
  };

  const removeCity = (city: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredCities: prev.preferredCities.filter((c) => c !== city),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          supabaseId: userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      console.error("Profile update error:", err);
      setError(err.message || "An error occurred while updating your profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center pt-20">
          <div className="text-center">
            <Loader className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
            <p className="text-gray-600 mt-2">
              Update your profile information
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
                  <span>{error}</span>
                  <button onClick={() => setError("")}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
                  <span>{success}</span>
                  <button onClick={() => setSuccess("")}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Basic Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <User className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Basic Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      required
                      min="18"
                      max="100"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="gender"
                      required
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="NON_BINARY">Non-Binary</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    About You
                  </label>
                  <textarea
                    name="about"
                    rows={4}
                    value={formData.about}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Tell us a bit about yourself..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Disability Type (Optional)
                  </label>
                  <input
                    type="text"
                    name="disabilityType"
                    value={formData.disabilityType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Visual impairment, Hearing impairment, etc."
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-6 pt-8 border-t">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Location</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-6 pt-8 border-t">
                <div className="flex items-center gap-3 mb-4">
                  <Info className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Interests
                  </h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Interest
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addInterest(interestInput))
                      }
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Type an interest"
                    />
                    <button
                      type="button"
                      onClick={() => addInterest(interestInput)}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Common interests:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {commonInterests.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => addInterest(interest)}
                        disabled={formData.interests.includes(interest)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          formData.interests.includes(interest)
                            ? "bg-purple-100 text-purple-600 cursor-not-allowed"
                            : "bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.interests.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Your interests:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.interests.map((interest) => (
                        <span
                          key={interest}
                          className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-medium flex items-center gap-2"
                        >
                          {interest}
                          <button
                            type="button"
                            onClick={() => removeInterest(interest)}
                            className="hover:text-purple-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Preferences */}
              <div className="space-y-6 pt-8 border-t">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Preferences
                  </h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Looking for
                  </label>
                  <select
                    name="lookingForGender"
                    value={formData.lookingForGender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Any gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="NON_BINARY">Non-Binary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Cities
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addCity())
                      }
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Add preferred cities"
                    />
                    <button
                      type="button"
                      onClick={addCity}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {formData.preferredCities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.preferredCities.map((city) => (
                        <span
                          key={city}
                          className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium flex items-center gap-2"
                        >
                          {city}
                          <button
                            type="button"
                            onClick={() => removeCity(city)}
                            className="hover:text-indigo-900"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Caregiver Info */}
              <div className="space-y-6 pt-8 border-t">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Caregiver Information
                  </h2>
                </div>

                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="hasCaregiver"
                    name="hasCaregiver"
                    checked={formData.hasCaregiver}
                    onChange={handleChange}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label
                    htmlFor="hasCaregiver"
                    className="ml-3 text-sm font-medium text-gray-700"
                  >
                    I have a caregiver
                  </label>
                </div>

                {formData.hasCaregiver && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Caregiver Name
                      </label>
                      <input
                        type="text"
                        name="caregiverName"
                        value={formData.caregiverName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Caregiver Phone
                      </label>
                      <input
                        type="tel"
                        name="caregiverPhone"
                        value={formData.caregiverPhone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Caregiver Email
                      </label>
                      <input
                        type="email"
                        name="caregiverEmail"
                        value={formData.caregiverEmail}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-8">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
