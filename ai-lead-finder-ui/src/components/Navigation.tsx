"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface NavigationProps {
  // Removed dark and toggleDarkMode props
}

export default function Navigation({}: NavigationProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const gradient = "from-[var(--primary-dark)] via-[var(--muted-dark)] to-[var(--accent-dark)]";

  return (
    <nav className="border-b backdrop-blur-sm fixed top-0 left-0 w-full z-50" style={{ borderColor: "var(--border-dark)", backgroundColor: "rgba(26, 26, 29, 0.95)" }}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--accent-dark)] to-[var(--primary-dark)] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-[var(--bg)] font-bold text-lg">AI</span>
            </div>
            <h1 className={`text-xl font-bold bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>
              Lead Finder
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/dashboard"
              className="text-sm font-medium transition-all duration-200 hover:scale-105 hover:text-[var(--accent-dark)]"
              style={{ color: "var(--text)" }}
            >
              Dashboard
            </Link>
            <Link
              href="/search"
              className="text-sm font-medium transition-all duration-200 hover:scale-105 hover:text-[var(--accent-dark)]"
              style={{ color: "var(--text)" }}
            >
              Search
            </Link>
            <Link
              href="/leads"
              className="text-sm font-medium transition-all duration-200 hover:scale-105 hover:text-[var(--accent-dark)]"
              style={{ color: "var(--text)" }}
            >
              Leads
            </Link>
            <Link
              href="/analytics"
              className="text-sm font-medium transition-all duration-200 hover:scale-105 hover:text-[var(--accent-dark)]"
              style={{ color: "var(--text)" }}
            >
              Analytics
            </Link>
            <Link
              href="/settings"
              className="text-sm font-medium transition-all duration-200 hover:scale-105 hover:text-[var(--accent-dark)]"
              style={{ color: "var(--text)" }}
            >
              Settings
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[var(--accent-dark)] to-[var(--primary-dark)] rounded-full flex items-center justify-center shadow-md">
                <span className="text-[var(--bg)] text-sm font-bold">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm" style={{ color: "var(--text-muted-dark)" }}>
                {user?.username}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="text-sm font-medium transition-all duration-200 hover:scale-105"
              style={{ color: "#ef4444" }}
            >
              Logout
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg transition-all duration-200 hover:scale-105"
              style={{ 
                backgroundColor: "var(--card-dark)",
                border: "1px solid var(--border-dark)",
                color: "var(--text)"
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t" style={{ borderColor: "var(--border-dark)" }}>
            <div className="flex flex-col space-y-3 pt-4">
              <Link
                href="/dashboard"
                className="text-sm font-medium transition-all duration-200 hover:scale-105 hover:text-[var(--accent-dark)]"
                style={{ color: "var(--text)" }}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/search"
                className="text-sm font-medium transition-all duration-200 hover:scale-105 hover:text-[var(--accent-dark)]"
                style={{ color: "var(--text)" }}
                onClick={() => setIsMenuOpen(false)}
              >
                Search
              </Link>
              <Link
                href="/leads"
                className="text-sm font-medium transition-all duration-200 hover:scale-105 hover:text-[var(--accent-dark)]"
                style={{ color: "var(--text)" }}
                onClick={() => setIsMenuOpen(false)}
              >
                Leads
              </Link>
              <Link
                href="/analytics"
                className="text-sm font-medium transition-all duration-200 hover:scale-105 hover:text-[var(--accent-dark)]"
                style={{ color: "var(--text)" }}
                onClick={() => setIsMenuOpen(false)}
              >
                Analytics
              </Link>
              <Link
                href="/settings"
                className="text-sm font-medium transition-all duration-200 hover:scale-105 hover:text-[var(--accent-dark)]"
                style={{ color: "var(--text)" }}
                onClick={() => setIsMenuOpen(false)}
              >
                Settings
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 