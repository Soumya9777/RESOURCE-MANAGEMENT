"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/rooms", label: "Rooms" },
  { href: "/bookings", label: "Bookings" },
  { href: "/schedule", label: "Schedule" },
  { href: "/admin", label: "Admin" },
];

export default function Navbar({ role }: { role?: string }) {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold text-indigo-600">
              ResourceMgmt
            </Link>
            <div className="hidden md:flex gap-1">
              {navLinks.map((link) => {
                if (link.href === "/admin" && role !== "admin") return null;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {role && (
              <span className="text-sm text-gray-500 capitalize">{role}</span>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
