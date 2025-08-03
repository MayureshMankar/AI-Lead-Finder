"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";

export default function LeadsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

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

  const fetchLeads = async () => {
    setLoadingLeads(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5001/api/leads", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log("[Leads Page] API response:", data); // Debug log
        setLeads(data.output || []);
      } else {
        const errorData = await response.json();
        setError(errorData.msg || errorData.error || "Failed to fetch leads.");
        console.error("[Leads Page] API error:", errorData);
      }
    } catch (error) {
      setError("Network or server error fetching leads.");
      console.error("[Leads Page] Fetch error:", error);
    } finally {
      setLoadingLeads(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesFilter = filter === "all" || lead.status === filter;
    const matchesSearch = searchTerm === "" || 
      lead.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.location?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
            Lead Management
          </h1>
          <p className="text-lg" style={{ color: "var(--text-muted-dark)" }}>
            Track and manage all your job leads in one place.
          </p>
        </div>

        {/* Filters and Search */}
        <div className={`${hoverEffect} rounded-2xl p-6 mb-8`} style={{ backgroundColor: "var(--card-dark)", border: borderStyle }}>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex gap-2">
              {["all", "active", "pending", "rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === status 
                      ? 'bg-gradient-to-r from-[var(--accent-dark)] to-[var(--primary-dark)] text-[var(--bg)]' 
                      : 'border hover:bg-[var(--input-dark)]'
                  }`}
                  style={{ 
                    borderColor: filter === status ? 'transparent' : "var(--border-dark)", 
                    color: filter === status ? undefined : "var(--text)" 
                  }}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)]"
              style={{ 
                backgroundColor: "var(--input-dark)", 
                color: "var(--text)", 
                borderColor: "var(--border-dark)" 
              }}
            />
            <button
              onClick={fetchLeads}
              disabled={loadingLeads}
              className="px-4 py-2 rounded-lg border hover:bg-[var(--accent-dark)] hover:text-[var(--bg)] transition-colors disabled:opacity-50"
              style={{ 
                borderColor: "var(--border-dark)", 
                color: "var(--text)" 
              }}
            >
              {loadingLeads ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`${hoverEffect} rounded-2xl p-6`} style={{ backgroundColor: "var(--card-dark)", border: borderStyle }}>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>{leads.length}</p>
              <p className="text-sm" style={{ color: "var(--text-muted-dark)" }}>Total Leads</p>
            </div>
          </div>
          <div className={`${hoverEffect} rounded-2xl p-6`} style={{ backgroundColor: "var(--card-dark)", border: borderStyle }}>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>{leads.filter(l => l.status === 'active').length}</p>
              <p className="text-sm" style={{ color: "var(--text-muted-dark)" }}>Active</p>
            </div>
          </div>
          <div className={`${hoverEffect} rounded-2xl p-6`} style={{ backgroundColor: "var(--card-dark)", border: borderStyle }}>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>{leads.filter(l => l.status === 'pending').length}</p>
              <p className="text-sm" style={{ color: "var(--text-muted-dark)" }}>Pending</p>
            </div>
          </div>
          <div className={`${hoverEffect} rounded-2xl p-6`} style={{ backgroundColor: "var(--card-dark)", border: borderStyle }}>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>{leads.filter(l => l.status === 'rejected').length}</p>
              <p className="text-sm" style={{ color: "var(--text-muted-dark)" }}>Rejected</p>
            </div>
          </div>
        </div>

        {/* Leads List */}
        <div className={`${hoverEffect} rounded-2xl p-6`} style={{ backgroundColor: "var(--card-dark)", border: borderStyle }}>
          {loadingLeads ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-dark)]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>{error}</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg" style={{ color: "var(--text-muted-dark)" }}>
                {searchTerm || filter !== "all" ? "No leads match your criteria." : "No leads yet. Start searching for jobs!"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLeads.map((lead, index) => {
                // Robustly handle tags as string or array
                const tagsArray = Array.isArray(lead.tags)
                  ? lead.tags
                  : typeof lead.tags === "string"
                  ? lead.tags.split(",").map((t) => t.trim()).filter(Boolean)
                  : [];
                return (
                  <div
                    key={lead.id || index}
                    className="flex items-center justify-between p-4 rounded-lg border"
                    style={{ borderColor: "var(--border-dark)" }}
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold" style={{ color: "var(--text)" }}>{lead.position}</h4>
                      <p className="text-sm" style={{ color: "var(--text-muted-dark)" }}>{lead.company} • {lead.location}</p>
                      {tagsArray.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {tagsArray.map((tag: string, tagIndex: number) => (
                            <span
                              key={tagIndex}
                              className="text-xs px-2 py-1 rounded-full"
                              style={{ 
                                backgroundColor: "var(--accent-dark)", 
                                color: "var(--bg)" 
                              }}
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lead.status === 'active' ? 'bg-green-900/20 text-green-400' :
                        lead.status === 'pending' ? 'bg-yellow-900/20 text-yellow-400' :
                        'bg-red-900/20 text-red-400'
                      }`}>
                        {lead.status}
                      </span>
                      {lead.url && (
                        <a
                          href={lead.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:text-[var(--accent-dark)] transition-colors"
                          style={{ color: "var(--text-muted-dark)" }}
                        >
                          View Job
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
