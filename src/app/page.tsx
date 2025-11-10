import Link from "next/link";
import {
  Heart,
  Shield,
  Users,
  MessageCircle,
  CheckCircle,
  HeartHandshake,
} from "lucide-react";

export default function Home() {
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
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
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
              <Link
                href="/signup"
                className="px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-lg"
              >
                Create Free Profile
              </Link>
              <Link
                href="#features"
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg"
              >
                Learn More
              </Link>
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
                <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
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
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Find Your Connection?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of people who have found meaningful relationships on
            HeartConnect
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
          >
            Create Your Free Profile
          </Link>
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
