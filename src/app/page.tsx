// app/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Heart,
  Shield,
  Users,
  Target,
  MessageCircle,
  Lock,
  CheckCircle,
} from "lucide-react";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Safe & Verified",
      description:
        "All profiles are manually verified to ensure authenticity and safety. Your security is our top priority.",
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Fully Accessible",
      description:
        "Our platform is designed with accessibility in mind, featuring screen reader support and easy navigation.",
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: "Supportive Community",
      description:
        "Connect with understanding individuals and families who share similar experiences and values.",
    },
    {
      icon: <Target className="w-12 h-12" />,
      title: "Smart Matching",
      description:
        "Our advanced algorithm considers compatibility factors specific to special needs relationships.",
    },
    {
      icon: <MessageCircle className="w-12 h-12" />,
      title: "Guided Communication",
      description:
        "Professional counselors available to help facilitate conversations and provide relationship guidance.",
    },
    {
      icon: <Lock className="w-12 h-12" />,
      title: "Privacy First",
      description:
        "Control who sees your profile and personal information. Your privacy matters to us.",
    },
  ];

  const stats = [
    { number: "5,000+", label: "Active Members" },
    { number: "1,200+", label: "Success Stories" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Support Available" },
  ];

  const steps = [
    {
      number: 1,
      title: "Create Your Profile",
      description:
        "Sign up and create a detailed profile that highlights your personality, interests, and preferences.",
    },
    {
      number: 2,
      title: "Browse Matches",
      description:
        "Explore compatible profiles suggested by our smart matching system based on your preferences.",
    },
    {
      number: 3,
      title: "Connect & Chat",
      description:
        "Express interest and start meaningful conversations with potential matches in a safe environment.",
    },
    {
      number: 4,
      title: "Find Your Match",
      description:
        "Build a genuine connection with guidance from our support team and take the next step together.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white z-50 shadow-lg">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 text-2xl font-bold"
            >
              <Heart className="w-8 h-8 fill-current" />
              <span>HeartConnect</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#home"
                className="hover:text-purple-200 transition-colors"
              >
                Home
              </Link>
              <Link
                href="#features"
                className="hover:text-purple-200 transition-colors"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="hover:text-purple-200 transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="#stories"
                className="hover:text-purple-200 transition-colors"
              >
                Stories
              </Link>
              <Link
                href="#contact"
                className="hover:text-purple-200 transition-colors"
              >
                Contact
              </Link>
              <Link
                href="signup"
                className="hover:text-purple-200 transition-colors"
              >
                Sign Up Free
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-3">
              <Link href="#home" className="block py-2 hover:text-purple-200">
                Home
              </Link>
              <Link
                href="#features"
                className="block py-2 hover:text-purple-200"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="block py-2 hover:text-purple-200"
              >
                How It Works
              </Link>
              <Link
                href="#stories"
                className="block py-2 hover:text-purple-200"
              >
                Stories
              </Link>
              <Link
                href="#contact"
                className="block py-2 hover:text-purple-200"
              >
                Contact
              </Link>
              <button className="w-full bg-white text-purple-600 px-6 py-2 rounded-full font-semibold">
                Sign Up Free
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="pt-32 pb-20 px-4 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTAgMTAgTDYwIDMwIEw4MCAzMCBMNjUgNDUgTDcwIDY1IEw1MCA1MCBMM0AgNjUgTDM1IDQ1IEwyMCAzMCBMNDAgMzAgWiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvc3ZnPg==')] opacity-50"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            Where Every Heart Finds Its Match
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-purple-100 animate-fade-in-up animation-delay-200">
            An inclusive matrimony platform designed specifically for
            individuals with special needs. Because everyone deserves love and
            companionship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
            <button className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-50 transition-all hover:-translate-y-1 hover:shadow-xl">
              Get Started Today
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-purple-600 transition-all">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose HeartConnect?
            </h2>
            <p className="text-xl text-gray-600">
              We provide a safe, supportive, and accessible platform for
              meaningful connections
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className="text-purple-600 mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-lg text-purple-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Your journey to finding love starts here
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-white p-8 rounded-2xl shadow-md relative"
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  {step.number}
                </div>
                <div className="mt-8 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* About */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-purple-400">
                About HeartConnect
              </h3>
              <p className="text-gray-400 mb-4">
                HeartConnect is dedicated to creating meaningful connections for
                individuals with special needs. We believe everyone deserves
                love, respect, and companionship.
              </p>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
                >
                  f
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
                >
                  t
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
                >
                  in
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-purple-400">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Safety Guidelines
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-purple-400">
                Support
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Report an Issue
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Accessibility
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-purple-400">
                Contact
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li>📧 support@heartconnect.com</li>
                <li>📞 +1 (800) 123-4567</li>
                <li>📍 123 Love Street, Care City</li>
                <li>🕐 24/7 Support Available</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 HeartConnect. All rights reserved. |
              <Link href="#" className="hover:text-white ml-2">
                Privacy Policy
              </Link>{" "}
              |
              <Link href="#" className="hover:text-white ml-2">
                Terms of Service
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
