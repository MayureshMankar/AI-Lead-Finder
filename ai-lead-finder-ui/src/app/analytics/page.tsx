"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";

interface AnalyticsData {
  total_leads: number;
  active_leads: number;
  pending_leads: number;
  rejected_leads: number;
  response_rate: number;
  leads_by_month: { month: string; count: number }[];
  leads_by_source: { source: string; count: number }[];
  recent_activity: { action: string; timestamp: string; details: string }[];
}

export default function AnalyticsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d, 1y

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics();
    }
  }, [isAuthenticated, timeRange]);

  const gradient = "from-[var(--primary-dark)] via-[var(--muted-dark)] to-[var(--accent-dark)]";
  const borderStyle = "1px solid var(--border-dark)";
  const hoverEffect = "hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out";

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:5001/api/analytics?time_range=${timeRange}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoadingAnalytics(false);
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
            Analytics Dashboard
          </h1>
          <p className="text-lg" style={{ color: "var(--text-muted-dark)" }}>
            Track your job search performance and insights
          </p>
        </div>

        {/* Time Range Selector */}
        <div className={`${hoverEffect} rounded-2xl p-6 mb-8`} style={{ backgroundColor: "var(--card-dark)", border: borderStyle }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>Time Range</h2>
            <div className="flex gap-2">
              {[
                { value: '7d', label: '7 Days' },
                { value: '30d', label: '30 Days' },
                { value: '90d', label: '90 Days' },
                { value: '1y', label: '1 Year' }
              ].map((range) => (
                <button
                  key={range.value}
                  onClick={() => setTimeRange(range.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === range.value 
                      ? 'bg-gradient-to-r from-[var(--accent-dark)] to-[var(--primary-dark)] text-[var(--bg)]' 
                      : 'border hover:bg-[var(--input-dark)]'
                  }`}
                  style={{ 
                    borderColor: timeRange === range.value ? 'transparent' : "var(--border-dark)", 
                    color: timeRange === range.value ? undefined : "var(--text)" 
                  }}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loadingAnalytics ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-dark)]"></div>
          </div>
        ) : analytics ? (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className={`${hoverEffect} rounded-2xl p-6`} style={{ backgroundColor: "var(--card-dark)", border: borderStyle }}>
                <div className="text-center">
                  <p className="text-3xl font-bold" style={{ color: "var(--text)" }}>{analytics.total_leads}</p>
                  <p className="text-sm" style={{ color: "var(--text-muted-dark)" }}>Total Leads</p>
                </div>
              </div>
              <div className={`${hoverEffect} rounded-2xl p-6`} style={{ backgroundColor: "var(--card-dark)", border: borderStyle }}>
                <div className="text-center">
                  <p className="text-3xl font-bold" style={{ color: "var(--text)" }}>{analytics.active_leads}</p>
                  <p className="text-sm" style={{ color: "var(--text-muted-dark)" }}>Active Leads</p>
                </div>
              </div>
              <div className={`${hoverEffect} rounded-2xl p-6`} style={{ backgroundColor: "var(--card-dark)", border: borderStyle }}>
                <div className="text-center">
                  <p className="text-3xl font-bold" style={{ color: "var(--text)" }}>{analytics.response_rate}%</p>
                  <p className="text-sm" style={{ color: "var(--text-muted-dark)" }}>Response Rate</p>
                </div>
              </div>
              <div className={`${hoverEffect} rounded-2xl p-6`} style={{ backgroundColor: "var(--card-dark)", border: borderStyle }}>
                <div className="text-center">
                  <p className="text-3xl font-bold" style={{ color: "var(--text)" }}>{analytics.pending_leads}</p>
                  <p className="text-sm" style={{ color: "var(--text-muted-dark)" }}>Pending</p>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Leads by Month */}
              <div className={`${hoverEffect} rounded-2xl p-6`} style={{ backgroundColor: "var(--card-dark)", border: borderStyle }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text)" }}>Leads by Month</h3>
                <div className="space-y-3">
                  {analytics.leads_by_month.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: "var(--text-muted-dark)" }}>{item.month}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 rounded-full" style={{ backgroundColor: "var(--border-dark)" }}>
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-[var(--accent-dark)] to-[var(--primary-dark)]"
                            style={{ width: `${(item.count / Math.max(...analytics.leads_by_month.map(m => m.count))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leads by Source */}
              <div className={`${hoverEffect} rounded-2xl p-6`} style={{ backgroundColor: "var(--card-dark)", border: borderStyle }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text)" }}>Leads by Source</h3>
                <div className="space-y-3">
                  {analytics.leads_by_source.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: "var(--text-muted-dark)" }}>{item.source}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 rounded-full" style={{ backgroundColor: "var(--border-dark)" }}>
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-[var(--accent-dark)] to-[var(--primary-dark)]"
                            style={{ width: `${(item.count / Math.max(...analytics.leads_by_source.map(s => s.count))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`${hoverEffect} rounded-2xl p-6`} style={{ backgroundColor: "var(--card-dark)", border: borderStyle }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text)" }}>Recent Activity</h3>
              <div className="space-y-3">
                {analytics.recent_activity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg border" style={{ borderColor: "var(--border-dark)" }}>
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: "var(--accent-dark)" }}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{activity.action}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted-dark)" }}>{activity.details}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted-dark)" }}>
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg" style={{ color: "var(--text-muted-dark)" }}>No analytics data available yet.</p>
          </div>
        )}
      </main>
    </div>
  );
} 