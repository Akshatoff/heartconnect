"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Heart, Bell, Menu, X, LogOut, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [notifications, setNotifications] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    fetchUser();
    fetchNotifications();
  }, []);

  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setUserEmail(user.email || "");
    }
  };

  const fetchNotifications = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { count } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("read", false);

    setNotifications(count || 0);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 py-3 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/matches" className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-black fill-primary-600" />
            <span className="text-xl font-bold text-gray-900 hidden sm:inline">
              HeartConnect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/matches"
              className={`text-sm font-medium transition-colors ${
                pathname === "/matches"
                  ? "text-gray-900"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Matches
            </Link>
            <Link
              href="/chat"
              className={`text-sm font-medium transition-colors ${
                pathname?.startsWith("/chat")
                  ? "text-gray-900"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Messages
            </Link>
            <Link
              href="/profile"
              className={`text-sm font-medium transition-colors ${
                pathname?.startsWith("/profile")
                  ? "text-gray-900"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Profile
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button
              className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-6 h-6" />
              {notifications > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            {/* User Menu - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">{userEmail}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
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
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <nav className="flex flex-col gap-3">
              <Link
                href="/matches"
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  pathname === "/matches"
                    ? "bg-primary-50 text-primary-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Matches
              </Link>
              <Link
                href="/chat"
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  pathname?.startsWith("/chat")
                    ? "bg-primary-50 text-primary-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Messages
              </Link>
              <Link
                href="/profile"
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  pathname?.startsWith("/profile")
                    ? "bg-primary-50 text-primary-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="px-4 py-2 text-left rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
