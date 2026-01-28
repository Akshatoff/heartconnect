"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  Shield,
  Users,
  MessageCircle,
  CheckCircle,
  HeartHandshake,
  Bell,
  Menu,
  X,
  LogOut,
  User,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setIsAuthenticated(true);
        setUserEmail(user.email || "");
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserEmail("");
    setMenuOpen(false);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-primary-600 fill-primary-600" />
              <span className="text-2xl font-bold text-gray-900">
                HeartConnect
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {loading ? (
                <div className="w-24 h-10 bg-gray-200 animate-pulse rounded-lg"></div>
              ) : isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <button
                    onClick={() => router.push("/matches")}
                    className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="w-6 h-6" />
                  </button>

                  {/* User Menu */}
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-700">{userEmail}</span>
                  </Link>

                  <Link
                    href="/matches"
                    className="px-6 py-2 bg-black text-white rounded-lg border-2 border-gray-600 outline-none hover:bg-transparent hover:text-black transition-colors font-medium"
                  >
                    Go to Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    aria-label="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-6 py-2 bg-black text-white rounded-lg border-2 border-gray-600 outline-none hover:bg-transparent hover:text-black transition-colors font-medium"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-600"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-10 bg-gray-200 animate-pulse rounded-lg"></div>
                  <div className="h-10 bg-gray-200 animate-pulse rounded-lg"></div>
                </div>
              ) : isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg"
                    onClick={() => setMenuOpen(false)}
                  >
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-700">{userEmail}</span>
                  </Link>
                  <Link
                    href="/matches"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-left rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 text-center bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Meaningful Connections
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              A compassionate matrimony platform designed specifically for
              people with special needs. Connect with understanding individuals
              in a safe, supportive environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/matches"
                    className="px-8 py-4 transition-all bg-black text-white rounded-lg border-2 border-gray-600 outline-none hover:bg-transparent hover:text-black transition-colors font-semibold text-lg"
                  >
                    Find Matches
                  </Link>
                  <Link
                    href="/profile/edit"
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg"
                  >
                    Complete Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="px-8 py-4 transition-all bg-black text-white rounded-lg border-2 border-gray-600 outline-none hover:bg-transparent hover:text-black transition-colors font-semibold text-lg"
                  >
                    Create Free Profile
                  </Link>
                  <Link
                    href="#features"
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg"
                  >
                    Learn More
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose HeartConnect?
            </h2>
            <p className="text-xl text-gray-600">
              Built with understanding, designed for inclusion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Safe & Verified
              </h3>
              <p className="text-gray-600">
                All profiles are manually reviewed and verified. Your safety and
                privacy are our top priorities.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Smart Matching
              </h3>
              <p className="text-gray-600">
                Our algorithm considers interests, location, and compatibility
                to suggest meaningful matches.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <HeartHandshake className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Caregiver Support
              </h3>
              <p className="text-gray-600">
                Caregivers can monitor and assist throughout the journey,
                ensuring peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to find your perfect match
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                num: "1",
                title: "Create Profile",
                desc: "Share your story and preferences",
              },
              {
                num: "2",
                title: "Get Verified",
                desc: "Quick approval process",
              },
              {
                num: "3",
                title: "Find Matches",
                desc: "Browse compatible profiles",
              },
              {
                num: "4",
                title: "Connect",
                desc: "Start meaningful conversations",
              },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="bg-primary-600 text-black w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-black mb-6">
            Ready to Find Your Connection?
          </h2>
          <p className="text-xl text-gray-900 mb-8">
            Join thousands of people who have found meaningful relationships on
            HeartConnect
          </p>
          {isAuthenticated ? (
            <Link
              href="/matches"
              className="inline-block px-8 py-4 bg-gray-900 text-primary-600 border-2 border-gray-900 rounded-2xl rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors font-semibold text-lg"
            >
              Start Finding Matches
            </Link>
          ) : (
            <Link
              href="/signup"
              className="inline-block px-8 py-4 bg-gray-900 text-primary-600 border-2 border-gray-900 rounded-2xl rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors font-semibold text-lg"
            >
              Create Your Free Profile
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-primary-500 fill-primary-500" />
            <span className="text-2xl font-bold text-white">HeartConnect</span>
          </div>
          <p className="text-gray-400 mb-6">
            A compassionate matrimony platform for people with special needs
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <Link href="#" className="hover:text-primary-500 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary-500 transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-primary-500 transition-colors">
              Contact Us
            </Link>
          </div>
          <p className="text-gray-500 text-sm mt-8">
            © {new Date().getFullYear()} HeartConnect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
