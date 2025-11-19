// src/components/Header.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  Heart,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  MessageCircle,
  Users,
  Home,
  Bell,
  Search,
} from 'lucide-react';

type UserProfile = {
  firstName: string;
  lastName: string;
  status: string;
};

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setIsAuthenticated(false);
        setUserProfile(null);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);

      // Fetch user profile
      const response = await fetch(`/api/profile/get?supabaseId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.profile);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserProfile(null);
    router.push('/');
  };

  const getInitials = () => {
    if (!userProfile) return 'U';
    return `${userProfile.firstName?.[0] || ''}${userProfile.lastName?.[0] || ''}`;
  };

  const isActive = (path: string) => pathname === path;

  if (loading) {
    return (
      <header className="fixed top-0 w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white z-50 shadow-lg">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-2 text-2xl font-bold">
              <Heart className="w-8 h-8 fill-current" />
              <span>HeartConnect</span>
            </Link>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="fixed top-0 w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white z-50 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            href={isAuthenticated ? '/dashboard' : '/'}
            className="flex items-center space-x-2 text-2xl font-bold hover:opacity-90 transition-opacity"
          >
            <Heart className="w-8 h-8 fill-current" />
            <span>HeartConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {!isAuthenticated ? (
              <>
                {/* Unauthenticated Menu */}
                <Link
                  href="/#home"
                  className={`hover:text-purple-200 transition-colors ${
                    isActive('/#home') ? 'text-white font-semibold' : ''
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/#features"
                  className="hover:text-purple-200 transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="/#how-it-works"
                  className="hover:text-purple-200 transition-colors"
                >
                  How It Works
                </Link>
                <Link
                  href="/#stories"
                  className="hover:text-purple-200 transition-colors"
                >
                  Stories
                </Link>
                <Link
                  href="/#contact"
                  className="hover:text-purple-200 transition-colors"
                >
                  Contact
                </Link>
                <Link
                  href="/login"
                  className="hover:text-purple-200 transition-colors font-medium"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-purple-50 transition-all shadow-md hover:shadow-lg"
                >
                  Sign Up Free
                </Link>
              </>
            ) : (
              <>
                {/* Authenticated Menu */}
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-2 hover:text-purple-200 transition-colors ${
                    isActive('/dashboard') ? 'text-white font-semibold' : ''
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  href="/matches"
                  className={`flex items-center gap-2 hover:text-purple-200 transition-colors ${
                    isActive('/matches') ? 'text-white font-semibold' : ''
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Matches
                </Link>
                <Link
                  href="/matches/discover"
                  className={`flex items-center gap-2 hover:text-purple-200 transition-colors ${
                    isActive('/matches/discover') ? 'text-white font-semibold' : ''
                  }`}
                >
                  <Search className="w-4 h-4" />
                  Discover
                </Link>
                <Link
                  href="/messages"
                  className={`flex items-center gap-2 hover:text-purple-200 transition-colors relative ${
                    isActive('/messages') ? 'text-white font-semibold' : ''
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  Messages
                  {/* Notification badge - can be made dynamic */}
                  {/* <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span> */}
                </Link>

                {/* Notifications */}
                <button className="relative hover:text-purple-200 transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                    3
                  </span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    onBlur={() => setTimeout(() => setShowProfileMenu(false), 200)}
                    className="flex items-center gap-2 hover:text-purple-200 transition-colors focus:outline-none"
                  >
                    <div className="w-10 h-10 bg-white text-purple-600 rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                      {getInitials()}
                    </div>
                    <span className="font-medium">
                      {userProfile?.firstName || 'Profile'}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 animate-fade-in-up">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {userProfile?.firstName} {userProfile?.lastName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Status: {userProfile?.status || 'Pending'}
                        </p>
                      </div>
                      <Link
                        href="/profile/edit"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm">Edit Profile</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Settings</span>
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3 animate-fade-in-up">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/#home"
                  className="block py-2 hover:text-purple-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/#features"
                  className="block py-2 hover:text-purple-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link
                  href="/#how-it-works"
                  className="block py-2 hover:text-purple-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How It Works
                </Link>
                <Link
                  href="/#stories"
                  className="block py-2 hover:text-purple-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Stories
                </Link>
                <Link
                  href="/#contact"
                  className="block py-2 hover:text-purple-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  href="/login"
                  className="block py-2 hover:text-purple-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="block w-full bg-white text-purple-600 px-6 py-2 rounded-full font-semibold text-center hover:bg-purple-50 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up Free
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 py-2 border-b border-white/20 mb-3">
                  <div className="w-10 h-10 bg-white text-purple-600 rounded-full flex items-center justify-center font-bold text-sm">
                    {getInitials()}
                  </div>
                  <div>
                    <p className="font-semibold">
                      {userProfile?.firstName} {userProfile?.lastName}
                    </p>
                    <p className="text-xs text-purple-200">
                      {userProfile?.status || 'Pending'}
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 py-2 hover:text-purple-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  href="/matches"
                  className="flex items-center gap-3 py-2 hover:text-purple-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Users className="w-4 h-4" />
                  Matches
                </Link>
                <Link
                  href="/matches/discover"
                  className="flex items-center gap-3 py-2 hover:text-purple-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Search className="w-4 h-4" />
                  Discover
                </Link>
                <Link
                  href="/messages"
                  className="flex items-center gap-3 py-2 hover:text-purple-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MessageCircle className="w-4 h-4" />
                  Messages
                </Link>
                <Link
                  href="/profile/edit"
                  className="flex items-center gap-3 py-2 hover:text-purple-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Edit Profile
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 py-2 hover:text-purple-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-3 py-2 text-red-300 hover:text-red-100 transition-colors w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
