"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import UnifiedSearch from "@/components/UnifiedSearch";

export default function SearchPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  const gradient = "from-[var(--primary-dark)] via-[var(--muted-dark)] to-[var(--accent-dark)]";

  if (loading) {
    return (
              <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "black", color: "var(--text)" }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-dark)]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      className="min-h-screen font-sans transition-colors duration-300"
      style={{
        backgroundColor: "black",
        color: "var(--text)",
      }}
    >
      <Navigation />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>
            API Job Search
          </h1>
          <p className="text-lg" style={{ color: "var(--text-muted-dark)" }}>
            Search across reliable API sources (RemoteOK, Arbeitnow, Remotive) and save leads directly to your dashboard.
          </p>
        </div>

        {/* Search Component */}
        <UnifiedSearch />
      </main>
    </div>
  );
} 