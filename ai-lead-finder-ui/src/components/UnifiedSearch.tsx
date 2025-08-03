"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface Job {
  title: string;
  company: string;
  location: string;
  url: string;
  details?: string;
  source_platform?: string;
  saved?: boolean;
}

export default function UnifiedSearch() {
  const { user, isAuthenticated } = useAuth();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [platforms, setPlatforms] = useState<string[]>(["api"]); // API sources only for initial launch
  const [maxResults, setMaxResults] = useState(10);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Job[]>([]);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ remote_only: false });
  const [savingLead, setSavingLead] = useState<number | null>(null);
  const [platformStatus, setPlatformStatus] = useState<{[key: string]: any}>({});

  const handlePlatformChange = (platform: string) => {
    setPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError("Please log in to search for jobs");
      return;
    }
    
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5001/api/search/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          query,
          location,
          platforms,
          max_results: maxResults,
          filters
        })
      });
      const data = await response.json();
      if (data.success) {
        setResults(data.results.combined_results || []);
        setPlatformStatus(data.results.results_by_platform || {});
      } else {
        setError(data.msg || "Search failed");
      }
    } catch (err) {
      setError("Network error - please check your connection");
    } finally {
      setLoading(false);
    }
  };

  const saveAsLead = async (job: Job, index: number) => {
    console.log("Saving job as lead:", job); // Debug log
    setSavingLead(index);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5001/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          position: job.position || job.title || "",
          company: job.company || "",
          location: job.location || job.city || job.region || job.remote || "Remote",
          url: job.url || "",
          tags: [job.source_platform || "unified_search"].join(","),
          status: "active"
        })
      });
      
      if (response.ok) {
        // Update the job to show it's saved
        setResults(prev => prev.map((j, i) => 
          i === index ? { ...j, saved: true } : j
        ));
      } else {
        setError("Failed to save lead");
      }
    } catch (err) {
      setError("Error saving lead");
    } finally {
      setSavingLead(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-10 p-8 rounded-xl shadow-lg" style={{ backgroundColor: "var(--card-dark)" }}>
      <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text)" }}>API Job Search</h2>
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Job title or keyword"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 p-3 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)]"
            style={{ 
              backgroundColor: "var(--input-dark)", 
              color: "var(--text)", 
              borderColor: "var(--border-dark)" 
            }}
            required
          />
          <input
            type="text"
            placeholder="Location (optional)"
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="flex-1 p-3 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)]"
            style={{ 
              backgroundColor: "var(--input-dark)", 
              color: "var(--text)", 
              borderColor: "var(--border-dark)" 
            }}
          />
        </div>
        <div className="flex gap-4 items-center flex-wrap">
          <label className="font-medium" style={{ color: "var(--text)" }}>Platforms:</label>
          {["api"].map(p => ( // API sources only for initial launch
            <label key={p} className="flex items-center gap-1" style={{ color: "var(--text)" }}>
              <input
                type="checkbox"
                checked={platforms.includes(p)}
                onChange={() => handlePlatformChange(p)}
                className="rounded"
              />
              API Sources (RemoteOK, Arbeitnow, Remotive)
            </label>
          ))}
        </div>
        <div className="flex gap-4 items-center flex-wrap">
          <label className="flex items-center gap-2" style={{ color: "var(--text)" }}>
            <input
              type="checkbox"
              checked={filters.remote_only}
              onChange={e => setFilters(f => ({ ...f, remote_only: e.target.checked }))}
              className="rounded"
            />
            Remote only
          </label>
          <label className="flex items-center gap-2" style={{ color: "var(--text)" }}>
            Max Results:
            <input
              type="number"
              min={1}
              max={50}
              value={maxResults}
              onChange={e => setMaxResults(Number(e.target.value))}
              className="w-16 p-1 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)]"
              style={{ 
                backgroundColor: "var(--input-dark)", 
                color: "var(--text)", 
                borderColor: "var(--border-dark)" 
              }}
            />
          </label>
          <button
            type="submit"
            className="ml-auto px-6 py-2 rounded font-semibold hover:bg-[var(--accent-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            style={{ 
              backgroundColor: "var(--accent-dark)", 
              color: "var(--bg)" 
            }}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--bg)]"></div>
                Searching...
              </div>
            ) : (
              "Search Jobs"
            )}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="mt-4 p-3 rounded border" style={{ 
          backgroundColor: "rgba(239, 68, 68, 0.1)", 
          borderColor: "rgba(239, 68, 68, 0.3)", 
          color: "#ef4444" 
        }}>
          {error}
        </div>
      )}
      
      <div className="mt-8">
        {/* Platform Status */}
        {Object.keys(platformStatus).length > 0 && (
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: "var(--input-dark)" }}>
            <h4 className="font-semibold mb-2" style={{ color: "var(--text)" }}>Platform Status:</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(platformStatus).map(([platform, data]: [string, any]) => (
                <div key={platform} className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    data.status === 'success' ? 'bg-green-900/20 text-green-400' :
                    data.status === 'limited' ? 'bg-yellow-900/20 text-yellow-400' :
                    'bg-red-900/20 text-red-400'
                  }`}>
                    {platform}: {data.status}
                  </span>
                  {data.count && (
                    <span className="text-xs" style={{ color: "var(--text-muted-dark)" }}>
                      ({data.count} results)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>
              Found {results.length} jobs
            </h3>
            {results.map((job, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border"
                style={{ 
                  backgroundColor: "var(--input-dark)", 
                  borderColor: "var(--border-dark)" 
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1" style={{ color: "var(--text)" }}>
                      {job.title}
                    </h4>
                    <p className="text-sm mb-2" style={{ color: "var(--text-muted-dark)" }}>
                      {job.company} • {job.location}
                    </p>
                    {job.details && (
                      <p className="text-sm mb-2" style={{ color: "var(--text-muted-dark)" }}>
                        {job.details}
                      </p>
                    )}
                    {job.source_platform && (
                      <span className="inline-block text-xs px-2 py-1 rounded-full mr-2" style={{ 
                        backgroundColor: "var(--accent-dark)", 
                        color: "var(--bg)" 
                      }}>
                        {job.source_platform}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {job.url && (
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm px-3 py-1 rounded border hover:bg-[var(--accent-dark)] hover:text-[var(--bg)] transition-colors"
                        style={{ 
                          borderColor: "var(--border-dark)", 
                          color: "var(--text)" 
                        }}
                      >
                        View Job
                      </a>
                    )}
                    <button
                      onClick={() => saveAsLead(job, index)}
                      disabled={savingLead === index || job.saved}
                      className={`text-sm px-3 py-1 rounded transition-colors ${
                        job.saved 
                          ? 'bg-green-900/20 text-green-400 cursor-not-allowed' 
                          : 'border hover:bg-[var(--accent-dark)] hover:text-[var(--bg)]'
                      }`}
                      style={{ 
                        borderColor: job.saved ? 'transparent' : "var(--border-dark)", 
                        color: job.saved ? undefined : "var(--text)" 
                      }}
                    >
                      {savingLead === index ? (
                        <div className="flex items-center gap-1">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                          Saving...
                        </div>
                      ) : job.saved ? (
                        "Saved ✓"
                      ) : (
                        "Save Lead"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
