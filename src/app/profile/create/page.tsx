// app/profile/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, User, MapPin, Info, Users, Target, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type FormData = {
  firstName: string;
  lastName: string;
  age: string;
  gender: 'MALE' | 'FEMALE' | 'NON_BINARY' | '';
  about: string;
  city: string;
  state: string;
  country: string;
  disabilityType: string;
  interests: string[];
  lookingForGender: 'MALE' | 'FEMALE' | 'NON_BINARY' | '';
  preferredCities: string[];
  hasCaregiver: boolean;
  caregiverName: string;
  caregiverPhone: string;
  caregiverEmail: string;
};

export default function CreateProfilePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    about: '',
    city: '',
    state: '',
    country: 'India',
    disabilityType: '',
    interests: [],
    lookingForGender: '',
    preferredCities: [],
    hasCaregiver: false,
    caregiverName: '',
    caregiverPhone: '',
    caregiverEmail: '',
  });

  const [interestInput, setInterestInput] = useState('');
  const [cityInput, setCityInput] = useState('');

  const commonInterests = [
    'Reading', 'Music', 'Movies', 'Cooking', 'Traveling',
    'Art', 'Sports', 'Gaming', 'Photography', 'Dancing',
    'Gardening', 'Writing', 'Yoga', 'Meditation', 'Technology'
  ];

  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUserId(user.id);

      // Pre-fill name if available
      if (user.user_metadata?.first_name) {
        setFormData(prev => ({
          ...prev,
          firstName: user.user_metadata.first_name || '',
          lastName: user.user_metadata.last_name || '',
        }));
      }
    };
    getCurrentUser();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addInterest = (interest: string) => {
    if (interest && !formData.interests.includes(interest)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
      setInterestInput('');
    }
  };

  const removeInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const addCity = () => {
    if (cityInput && !formData.preferredCities.includes(cityInput)) {
      setFormData(prev => ({
        ...prev,
        preferredCities: [...prev.preferredCities, cityInput]
      }));
      setCityInput('');
    }
  };

  const removeCity = (city: string) => {
    setFormData(prev => ({
      ...prev,
      preferredCities: prev.preferredCities.filter(c => c !== city)
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.firstName || !formData.lastName || !formData.age || !formData.gender) {
          setError('Please fill in all required fields');
          return false;
        }
        if (parseInt(formData.age) < 18 || parseInt(formData.age) > 100) {
          setError('Age must be between 18 and 100');
          return false;
        }
        break;
      case 2:
        if (!formData.city || !formData.state) {
          setError('Please fill in your location');
          return false;
        }
        break;
      case 3:
        if (formData.interests.length === 0) {
          setError('Please add at least one interest');
          return false;
        }
        break;
    }
    setError('');
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setError('');
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/profile/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
          supabaseId: userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create profile');
      }

      // Success! Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Profile creation error:', err);
      setError(err.message || 'An error occurred while creating your profile');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Info', icon: User },
    { number: 2, title: 'Location', icon: MapPin },
    { number: 3, title: 'Interests', icon: Info },
    { number: 4, title: 'Preferences', icon: Target },
    { number: 5, title: 'Caregiver', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-3xl font-bold text-purple-600">
            <Heart className="w-10 h-10 fill-current" />
            <span>HeartConnect</span>
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="mt-2 text-gray-600">Step {currentStep} of 5</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                    currentStep >= step.number
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.number ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <p className={`text-xs font-medium ${
                    currentStep >= step.number ? 'text-purple-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Basic Information</h2>

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
                      placeholder="Enter your first name"
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
                      placeholder="Enter your last name"
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
                      placeholder="Enter your age"
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
                      <option value="">Select gender</option>
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
                  <p className="mt-2 text-sm text-gray-500">
                    This information helps us provide better matches and accessibility features
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Where are you located?</h2>

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
                      placeholder="Enter your city"
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
                      placeholder="Enter your state"
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
                    placeholder="Enter your country"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Interests */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What are your interests?</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Custom Interest
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest(interestInput))}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Type an interest and press Enter"
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
                  <p className="text-sm font-medium text-gray-700 mb-3">Or select from common interests:</p>
                  <div className="flex flex-wrap gap-2">
                    {commonInterests.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => addInterest(interest)}
                        disabled={formData.interests.includes(interest)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          formData.interests.includes(interest)
                            ? 'bg-purple-100 text-purple-600 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.interests.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Your interests:</p>
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
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Preferences */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Partner Preferences</h2>

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
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCity())}
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
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Caregiver Info */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Caregiver Information</h2>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-purple-800">
                    If you have a caregiver who will help manage your profile, please provide their information below. This is optional.
                  </p>
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
                  <label htmlFor="hasCaregiver" className="ml-3 text-sm font-medium text-gray-700">
                    I have a caregiver who will help manage my profile
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
                        placeholder="Enter caregiver's name"
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
                        placeholder="Enter caregiver's phone"
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
                        placeholder="Enter caregiver's email"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              )}

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Profile...' : 'Complete Profile'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
