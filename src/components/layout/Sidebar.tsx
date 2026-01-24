"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  MessageCircle,
  User,
  Users,
  Settings,
  HeartHandshake,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/matches",
      icon: Heart,
      label: "Find Matches",
      description: "Discover compatible people",
    },
    {
      href: "/chat",
      icon: MessageCircle,
      label: "Messages",
      description: "Your conversations",
    },
    {
      href: "/profile",
      icon: User,
      label: "My Profile",
      description: "View and edit profile",
    },
    {
      href: "/caregiver",
      icon: HeartHandshake,
      label: "Caregiver Portal",
      description: "Caregiver assistance",
    },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-200 p-4">
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname?.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-start gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-primary-50 text-primary-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon
                className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isActive ? "text-primary-600" : "text-gray-500"}`}
              />
              <div>
                <div
                  className={`font-medium text-sm ${isActive ? "text-gray-900" : "text-gray-900"}`}
                >
                  {item.label}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {item.description}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="mt-4 p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          Your Activity
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-700">Profile Views</span>
            <span className="font-semibold text-primary-900">24</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Matches</span>
            <span className="font-semibold text-primary-900">12</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Messages</span>
            <span className="font-semibold text-primary-900">8</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
