"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Plus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { profileSchema } from "@/lib/validations/profile";
import { ZodError } from "zod";
/**
 * Profile Edit Page
 * Allows users to create and update their profile
 */
export default function ProfileEditPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    full_name: "",
    gender: "",
    date_of_birth: "",
    location: "",
    city: "",
    state: "",
    disability_type: "",
    disability_description: "",
    interests: [] as string[],
    about: "",
    caregiver_name: "",
    caregiver_contact: "",
    caregiver_relationship: "",
    has_caregiver: false,
  });
  const [newInterest, setNewInterest] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const { validateImage, validateImageDimensions } =
      await import("@/lib/utils/image-validation");

    const validation = validateImage(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    const dimensionValidation = await validateImageDimensions(file);
    if (!dimensionValidation.valid) {
      alert(dimensionValidation.error);
      return;
    }

    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      alert("Avatar uploaded successfully!");
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(error.message || "Failed to upload avatar");
      setAvatarPreview(null);
    } finally {
      setUploading(false);
    }
  };

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

      if (data) {
        setProfile({
          full_name: data.full_name || "",
          gender: data.gender || "",
          date_of_birth: data.date_of_birth || "",
          location: data.location || "",
          city: data.city || "",
          state: data.state || "",
          disability_type: data.disability_type || "",
          disability_description: data.disability_description || "",
          interests: data.interests || [],
          about: data.about || "",
          caregiver_name: data.caregiver_name || "",
          caregiver_contact: data.caregiver_contact || "",
          caregiver_relationship: data.caregiver_relationship || "",
          has_caregiver: data.has_caregiver || false,
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // ✅ Step 1: Validate profile data
      const validatedData = profileSchema.parse({
        full_name: profile.full_name,
        gender: profile.gender,
        date_of_birth: profile.date_of_birth,
        city: profile.city,
        state: profile.state,
        about: profile.about,
        interests: profile.interests,
        disability_type: profile.disability_type,
        disability_description: profile.disability_description,
        has_caregiver: profile.has_caregiver,
        caregiver_name: profile.caregiver_name,
        caregiver_contact: profile.caregiver_contact,
        caregiver_relationship: profile.caregiver_relationship,
      });

      // ✅ Step 2: Get authenticated user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("No authenticated user found.");
        return;
      }

      console.log("User Id:", user.id);

      // ✅ Step 3: Save profile
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        ...validatedData, // use validated data
        location: `${profile.city}, ${profile.state}`,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Upsert error:", error);
        throw error;
      }

      console.log("Profile saved successfully. Redirecting to /profile.");
      router.push("/profile");
    } catch (error) {
      // ✅ Zod validation errors
      if (error instanceof ZodError) {
        const firstError = error.errors[0];
        alert(`Validation error: ${firstError.message}`);
        return;
      }

      // ❌ Other errors (Supabase, auth, etc.)
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const addInterest = () => {
    if (newInterest.trim() && !profile.interests.includes(newInterest.trim())) {
      setProfile((prev) => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()],
      }));
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }));
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
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Edit Your Profile
        </h1>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Profile Picture
          </h2>

          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
                {avatarPreview || profile.avatar_url ? (
                  <img
                    src={avatarPreview || profile.avatar_url}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-primary-600" />
                )}
              </div>
              {uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="avatar" className="cursor-pointer">
                <div className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors inline-block">
                  {uploading ? "Uploading..." : "Upload Photo"}
                </div>
                <input
                  id="avatar"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-500 mt-2">
                JPG, PNG, WebP or GIF. Max 5MB. Max 2000x2000px.
              </p>
            </div>
          </div>
        </section>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6 space-y-6"
        >
          {/* Personal Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="full_name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name *
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  value={profile.full_name}
                  onChange={handleChange}
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  value={profile.gender}
                  onChange={handleChange}
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="date_of_birth"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Date of Birth *
                </label>
                <input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  required
                  value={profile.date_of_birth}
                  onChange={handleChange}
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </section>

          {/* Location */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Location
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  City *
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={profile.city}
                  onChange={handleChange}
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  State *
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  required
                  value={profile.state}
                  onChange={handleChange}
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </section>

          {/* Disability Information (Optional) */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Additional Information (Optional)
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="disability_type"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Disability Type
                </label>
                <input
                  id="disability_type"
                  name="disability_type"
                  type="text"
                  value={profile.disability_type}
                  onChange={handleChange}
                  placeholder="e.g., Visual impairment, Hearing impairment"
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="disability_description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="disability_description"
                  name="disability_description"
                  rows={3}
                  value={profile.disability_description}
                  onChange={handleChange}
                  placeholder="Share any details you'd like potential matches to know"
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </section>

          {/* Interests */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Interests & Hobbies
            </h2>

            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addInterest())
                  }
                  placeholder="Add an interest"
                  className="text-black flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addInterest}
                  className="px-4 py-2 bg-primary-600 text-black rounded-lg hover:bg-primary-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              {profile.interests.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="text-black inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-800 rounded-full"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeInterest(interest)}
                        className="hover:text-primary-900"
                        aria-label={`Remove ${interest}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* About */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              About You
            </h2>

            <div>
              <label
                htmlFor="about"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tell us about yourself *
              </label>
              <textarea
                id="about"
                name="about"
                rows={5}
                required
                value={profile.about}
                onChange={handleChange}
                placeholder="Share your story, what you're looking for, and what makes you unique..."
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="mt-1 text-sm text-gray-500">
                {profile.about.length} characters (minimum 50 recommended)
              </p>
            </div>
          </section>

          {/* Caregiver Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Caregiver Information
            </h2>

            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="has_caregiver"
                  checked={profile.has_caregiver}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  I have a caregiver who assists me
                </span>
              </label>

              {profile.has_caregiver && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                  <div>
                    <label
                      htmlFor="caregiver_name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Caregiver Name
                    </label>
                    <input
                      id="caregiver_name"
                      name="caregiver_name"
                      type="text"
                      value={profile.caregiver_name}
                      onChange={handleChange}
                      className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="caregiver_contact"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Caregiver Contact
                    </label>
                    <input
                      id="caregiver_contact"
                      name="caregiver_contact"
                      type="text"
                      value={profile.caregiver_contact}
                      onChange={handleChange}
                      placeholder="Phone or email"
                      className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="caregiver_relationship"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Relationship
                    </label>
                    <input
                      id="caregiver_relationship"
                      name="caregiver_relationship"
                      type="text"
                      value={profile.caregiver_relationship}
                      onChange={handleChange}
                      placeholder="e.g., Parent, Sibling, Friend"
                      className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="cursor-pointer text-black flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Profile
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
