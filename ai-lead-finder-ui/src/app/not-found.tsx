"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Link from "next/link";

export default function NotFound() {
  const { user, isAuthenticated, loading } = useAuth();
  const [dark, setDark] = useState(true);

  const toggleDarkMode = () => setDark(!dark);
  const isLight = !dark;

  const gradient = isLight
    ? "from-[var(--primary-light)] via-[var(--muted-light)] to-[var(--accent-light)]"
    : "from-[var(--primary-dark)] via-[var(--muted-dark)] to-[var(--accent-dark)]";

  const borderStyle = isLight ? "1px solid #ddd" : "1px solid var(--border-dark)";
  const hoverEffect = "hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out";

  if (loading) {
    return (
              <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: isLight ? "transparent" : "black", color: "var(--text)" }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-dark)]"></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 ${
        isLight ? "backdrop-blur-sm" : ""
      }`}
      style={{
        backgroundColor: isLight ? "transparent" : "black",
        color: "var(--text)",
      }}
    >
      <Navigation dark={dark} toggleDarkMode={toggleDarkMode} />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className={`text-9xl font-bold mb-4 ${
              isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
            }`}>
              404
            </h1>
            <div className="text-6xl mb-4">🔍</div>
          </div>

          {/* Error Message */}
          <div className={`rounded-2xl p-[2px] ${hoverEffect} mb-8`} style={{ background: isLight ? "#e6e3de" : `linear-gradient(to bottom right, var(--primary-dark), var(--muted-dark), var(--accent-dark))` }}>
            <div className="p-8 rounded-xl" style={{ background: isLight ? "#F8F4F0" : "var(--card-dark)", border: borderStyle }}>
              <h2 className={`text-3xl font-bold mb-4 ${
                isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
              }`}>
                Page Not Found
              </h2>
              <p className="text-lg mb-6" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href={isAuthenticated ? "/dashboard" : "/"}
              className="px-8 py-3 rounded-lg bg-[var(--accent-dark)] text-white hover:bg-opacity-90 transition-colors font-medium"
            >
              {isAuthenticated ? "Go to Dashboard" : "Go Home"}
            </Link>
            <button
              onClick={() => window.history.back()}
              className="px-8 py-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
              style={{ borderColor: isLight ? "#ddd" : "var(--border-dark)" }}
            >
              Go Back
            </button>
          </div>

          {/* Helpful Links */}
          <div className={`rounded-2xl p-[2px] ${hoverEffect}`} style={{ background: isLight ? "#e6e3de" : `linear-gradient(to bottom right, var(--primary-dark), var(--muted-dark), var(--accent-dark))` }}>
            <div className="p-6 rounded-xl" style={{ background: isLight ? "#F8F4F0" : "var(--card-dark)", border: borderStyle }}>
              <h3 className={`text-xl font-semibold mb-4 ${
                isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
              }`}>
                Looking for something specific?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/search"
                      className="p-4 rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-200"
                    >
                      <div className="text-2xl mb-2">🔍</div>
                      <div className="font-medium">Search Jobs</div>
                      <div className="text-sm" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                        Find new opportunities
                      </div>
                    </Link>
                    <Link
                      href="/leads"
                      className="p-4 rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-200"
                    >
                      <div className="text-2xl mb-2">📊</div>
                      <div className="font-medium">My Leads</div>
                      <div className="text-sm" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                        Manage your leads
                      </div>
                    </Link>
                    <Link
                      href="/help"
                      className="p-4 rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-200"
                    >
                      <div className="text-2xl mb-2">❓</div>
                      <div className="font-medium">Help Center</div>
                      <div className="text-sm" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                        Get support
                      </div>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/pricing"
                      className="p-4 rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-200"
                    >
                      <div className="text-2xl mb-2">💰</div>
                      <div className="font-medium">Pricing</div>
                      <div className="text-sm" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                        View our plans
                      </div>
                    </Link>
                    <Link
                      href="/help"
                      className="p-4 rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-200"
                    >
                      <div className="text-2xl mb-2">❓</div>
                      <div className="font-medium">Help Center</div>
                      <div className="text-sm" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                        Get support
                      </div>
                    </Link>
                    <Link
                      href="/login"
                      className="p-4 rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-200"
                    >
                      <div className="text-2xl mb-2">🔐</div>
                      <div className="font-medium">Login</div>
                      <div className="text-sm" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                        Access your account
                      </div>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="mt-8">
            <p className="text-sm" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
              Still can't find what you're looking for?{" "}
              <a
                href="mailto:support@aileadfinder.com"
                className="text-[var(--accent-dark)] hover:underline"
              >
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 