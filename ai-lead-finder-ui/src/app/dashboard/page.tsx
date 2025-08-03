"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";

export default function Dashboard() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [limit, setLimit] = useState(10);
  const [scraping, setScraping] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
    }
  }, [isAuthenticated]);

  const gradient = "from-[var(--primary-dark)] via-[var(--muted-dark)] to-[var(--accent-dark)]";
  const borderStyle = "1px solid var(--border-dark)";
  const hoverEffect = "hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out";
  const buttonBaseStyle = "font-semibold px-6 py-3 rounded shadow-md";
  const buttonHoverEffect = "hover:shadow-lg transition-all duration-300 ease-in-out";

  const fetchLeads = async () => {
    setLoadingLeads(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5001/api/leads", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched leads data:", data);
        setLeads(data.output || []);
        console.log("Set leads:", data.output || []);
      } else {
        console.error("Failed to fetch leads:", response.status);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoadingLeads(false);
    }
  };

  const handleScrape = async () => {
    if (!keyword.trim()) return;
    
    setScraping(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5001/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          keyword,
          limit,
          source: "api"  // Use API sources only
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Scrape response:", data);
        // Refresh leads after successful scrape
        fetchLeads();
        console.log(`Scraped ${data.count} jobs successfully`);
      } else {
        console.error("Scrape failed:", response.status);
        const errorData = await response.json();
        console.error("Scrape error:", errorData);
      }
    } catch (error) {
      console.error("Error scraping:", error);
    } finally {
      setScraping(false);
    }
  };

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
            Dashboard
          </h1>
          <p className="text-lg" style={{ color: "var(--text-muted-dark)" }}>
            Welcome back, {user?.username}. Here's your job search overview.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`${hoverEffect} rounded-2xl p-6`} style={{ backgroundColor: "var(--card-dark)", border: borderStyle }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: "var(--text-muted-dark)" }}>Total Leads</p>
                <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>{leads.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent-dark)] to-[var(--primary-dark)] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--bg)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`${hoverEffect} rounded-2xl p-6`} style={{ backgroundColor: "var(--card-dark)", border: borderStyle }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: "var(--text-muted-dark)" }}>Active Leads</p>
                <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>{leads.filter(lead => lead.status === 'active').length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent-dark)] to-[var(--primary-dark)] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--bg)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`${hoverEffect} rounded-2xl p-6`} style={{ backgroundColor: "var(--card-dark)", border: borderStyle }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: "var(--text-muted-dark)" }}>This Week</p>
                <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>{leads.filter(lead => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(lead.created_at) > weekAgo;
                }).length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent-dark)] to-[var(--primary-dark)] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--bg)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`${hoverEffect} rounded-2xl p-6`} style={{ backgroundColor: "var(--card-dark)", border: borderStyle }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: "var(--text-muted-dark)" }}>Response Rate</p>
                <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>85%</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent-dark)] to-[var(--primary-dark)] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--bg)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Quick Scrape */}
          <div className={`${hoverEffect} rounded-2xl p-6`} style={{ backgroundColor: "var(--card-dark)", border: borderStyle }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: "var(--text)" }}>Quick Job Search</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Job title or keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)]"
                style={{ 
                  backgroundColor: "var(--input-dark)", 
                  color: "var(--text)", 
                  borderColor: "var(--border-dark)" 
                }}
              />
              <div className="flex gap-4">
                <input
                  type="number"
                  placeholder="Limit"
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="w-24 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)]"
                  style={{ 
                    backgroundColor: "var(--input-dark)", 
                    color: "var(--text)", 
                    borderColor: "var(--border-dark)" 
                  }}
                />
                <button
                  onClick={handleScrape}
                  disabled={scraping || !keyword.trim()}
                  className={`flex-1 ${buttonBaseStyle} ${buttonHoverEffect} bg-gradient-to-r from-[var(--accent-dark)] to-[var(--primary-dark)] text-[var(--bg)] disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {scraping ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--bg)]"></div>
                      Searching...
                    </div>
                  ) : (
                    "Search Jobs"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`${hoverEffect} rounded-2xl p-6`} style={{ backgroundColor: "var(--card-dark)", border: borderStyle }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: "var(--text)" }}>Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/search"
                className={`${buttonBaseStyle} ${buttonHoverEffect} bg-gradient-to-r from-[var(--accent-dark)] to-[var(--primary-dark)] text-[var(--bg)] text-center`}
              >
                Unified Search
              </Link>
              <Link
                href="/leads"
                className={`${buttonBaseStyle} ${buttonHoverEffect} border-2 text-center`}
                style={{
                  borderColor: "var(--accent-dark)",
                  color: "var(--text)",
                  backgroundColor: "transparent"
                }}
              >
                View All Leads
              </Link>
              <Link
                href="/analytics"
                className={`${buttonBaseStyle} ${buttonHoverEffect} border-2 text-center`}
                style={{
                  borderColor: "var(--accent-dark)",
                  color: "var(--text)",
                  backgroundColor: "transparent"
                }}
              >
                Analytics
              </Link>
              <Link
                href="/settings"
                className={`${buttonBaseStyle} ${buttonHoverEffect} border-2 text-center`}
                style={{
                  borderColor: "var(--accent-dark)",
                  color: "var(--text)",
                  backgroundColor: "transparent"
                }}
              >
                Settings
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Leads */}
        <div className={`${hoverEffect} rounded-2xl p-6`} style={{ backgroundColor: "var(--card-dark)", border: borderStyle }}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold" style={{ color: "var(--text)" }}>Recent Leads</h3>
            <Link
              href="/leads"
              className="text-sm hover:text-[var(--accent-dark)] transition-colors"
              style={{ color: "var(--text-muted-dark)" }}
            >
              View All →
            </Link>
          </div>
          
          {loadingLeads ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-dark)]"></div>
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg" style={{ color: "var(--text-muted-dark)" }}>No leads yet. Start searching for jobs!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leads.slice(0, 5).map((lead, index) => (
                <div
                  key={lead.id || index}
                  className="flex items-center justify-between p-4 rounded-lg border"
                  style={{ borderColor: "var(--border-dark)" }}
                >
                  <div className="flex-1">
                    <h4 className="font-semibold" style={{ color: "var(--text)" }}>{lead.position}</h4>
                    <p className="text-sm" style={{ color: "var(--text-muted-dark)" }}>{lead.company}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      lead.status === 'active' 
                        ? 'bg-green-900/20 text-green-400' 
                        : 'bg-gray-900/20 text-gray-400'
                    }`}>
                      {lead.status}
                    </span>
                    <Link
                      href={`/leads/${lead.id}`}
                      className="text-sm hover:text-[var(--accent-dark)] transition-colors"
                      style={{ color: "var(--text-muted-dark)" }}
                    >
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
