"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";

interface Job {
  position: string;
  company: string;
  location: string;
  tags: string[];
  url: string;
  description?: string;
  source?: string;
}

interface ScrapingConfig {
  keyword: string;
  location: string;
  limit: number;
  source: string;
}

interface UserCredentials {
  name: string;
  skills: string;
  experience: string;
  location: string;
  linkedin: string;
  portfolio: string;
}

export default function ScrapePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [dark, setDark] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [scrapingConfig, setScrapingConfig] = useState<ScrapingConfig>({
    keyword: "developer",
    location: "Remote",
    limit: 10,
    source: "all"
  });
  const [isScraping, setIsScraping] = useState(false);
  const [scrapingProgress, setScrapingProgress] = useState("");
  const [selectedJobs, setSelectedJobs] = useState<Set<number>>(new Set());
  const [outreachMessage, setOutreachMessage] = useState("");
  const [isSendingOutreach, setIsSendingOutreach] = useState(false);
  const [outreachResults, setOutreachResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [userCredentials, setUserCredentials] = useState<UserCredentials>({
    name: "",
    skills: "",
    experience: "",
    location: "",
    linkedin: "",
    portfolio: ""
  });
  const [showCredentials, setShowCredentials] = useState(false);

  const toggleDarkMode = () => setDark(!dark);
  const isLight = !dark;

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  const gradient = isLight
    ? "from-[var(--primary-light)] via-[var(--muted-light)] to-[var(--accent-light)]"
    : "from-[var(--primary-dark)] via-[var(--muted-dark)] to-[var(--accent-dark)]";

  const borderStyle = isLight ? "1px solid #ddd" : "1px solid var(--border-dark)";
  const hoverEffect = "hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out";

  const scrapeJobs = async () => {
    setIsScraping(true);
    setScrapingProgress("Starting job scraping...");
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5001/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(scrapingConfig)
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
        setScrapingProgress(`Successfully scraped ${data.count} jobs!`);
        setSelectedJobs(new Set());
      } else {
        const error = await response.json();
        setScrapingProgress(`Error: ${error.error || 'Failed to scrape jobs'}`);
      }
    } catch (error) {
      setScrapingProgress(`Network error: ${error}`);
    } finally {
      setIsScraping(false);
    }
  };

  const generateMessage = async (job: Job) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5001/api/generate-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          job,
          user_credentials: userCredentials
        })
      });

      if (response.ok) {
        const data = await response.json();
        setOutreachMessage(data.message);
      }
    } catch (error) {
      console.error("Error generating message:", error);
    }
  };

  const sendBulkOutreach = async () => {
    if (selectedJobs.size === 0) return;

    setIsSendingOutreach(true);
    setShowResults(false);

    try {
      const selectedJobsList = Array.from(selectedJobs).map(index => jobs[index]);
      const token = localStorage.getItem("token");
      
      const response = await fetch("http://127.0.0.1:5001/api/bulk-outreach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          jobs: selectedJobsList,
          message: outreachMessage,
          user_credentials: userCredentials
        })
      });

      if (response.ok) {
        const data = await response.json();
        setOutreachResults(data.results);
        setShowResults(true);
      }
    } catch (error) {
      console.error("Error sending outreach:", error);
    } finally {
      setIsSendingOutreach(false);
    }
  };

  const toggleJobSelection = (index: number) => {
    const newSelection = new Set(selectedJobs);
    if (newSelection.has(index)) {
      newSelection.delete(index);
    } else {
      newSelection.add(index);
    }
    setSelectedJobs(newSelection);
  };

  const selectAllJobs = () => {
    setSelectedJobs(new Set(jobs.map((_, index) => index)));
  };

  const deselectAllJobs = () => {
    setSelectedJobs(new Set());
  };

  if (loading) {
    return (
              <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: isLight ? "transparent" : "black", color: "var(--text)" }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-dark)]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
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

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${
            isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
          }`}>
            Job Scraping & Outreach
          </h1>
          <p className="text-lg" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
            Find jobs from reliable API sources and send automated outreach emails
          </p>
        </div>

        {/* Scraping Configuration */}
        <div className={`rounded-2xl p-[2px] mb-8 ${hoverEffect}`} style={{ background: isLight ? "#e6e3de" : `linear-gradient(to bottom right, var(--primary-dark), var(--muted-dark), var(--accent-dark))` }}>
          <div className="p-6 rounded-xl" style={{ background: isLight ? "#F8F4F0" : "var(--card-dark)", border: borderStyle }}>
            <h2 className="text-xl font-semibold mb-4">Scraping Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <input
                type="text"
                placeholder="Keyword (e.g., developer, designer)"
                value={scrapingConfig.keyword}
                onChange={(e) => setScrapingConfig({...scrapingConfig, keyword: e.target.value})}
                className="p-3 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)] transition-all duration-300"
                style={{ background: isLight ? "#ffffff" : "var(--input-dark)", color: "var(--text)", borderColor: isLight ? "#ccc" : "var(--border-dark)" }}
              />
              <input
                type="text"
                placeholder="Location (e.g., Remote, New York)"
                value={scrapingConfig.location}
                onChange={(e) => setScrapingConfig({...scrapingConfig, location: e.target.value})}
                className="p-3 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)] transition-all duration-300"
                style={{ background: isLight ? "#ffffff" : "var(--input-dark)", color: "var(--text)", borderColor: isLight ? "#ccc" : "var(--border-dark)" }}
              />
              <input
                type="number"
                placeholder="Limit (max jobs)"
                value={scrapingConfig.limit}
                onChange={(e) => setScrapingConfig({...scrapingConfig, limit: parseInt(e.target.value) || 10})}
                className="p-3 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)] transition-all duration-300"
                style={{ background: isLight ? "#ffffff" : "var(--input-dark)", color: "var(--text)", borderColor: isLight ? "#ccc" : "var(--border-dark)" }}
              />
              <select
                value={scrapingConfig.source}
                onChange={(e) => setScrapingConfig({...scrapingConfig, source: e.target.value})}
                className="p-3 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)] transition-all duration-300"
                style={{ background: isLight ? "#ffffff" : "var(--input-dark)", color: "var(--text)", borderColor: isLight ? "#ccc" : "var(--border-dark)" }}
              >
                <option value="all">All API Sources</option>
                <option value="api">API Sources Only</option>
              </select>
            </div>
            <button
              onClick={scrapeJobs}
              disabled={isScraping}
              className="w-full p-3 rounded-lg font-medium hover:bg-[var(--accent-dark)] hover:text-white focus:ring-2 focus:ring-[var(--accent-dark)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ borderColor: isLight ? "#ccc" : "var(--border-dark)" }}
            >
              {isScraping ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Scraping Jobs...
                </div>
              ) : (
                "Scrape Jobs"
              )}
            </button>
            {scrapingProgress && (
              <p className="mt-2 text-sm" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                {scrapingProgress}
              </p>
            )}
          </div>
        </div>

        {/* User Credentials Section */}
        <div className={`rounded-2xl p-[2px] mb-8 ${hoverEffect}`} style={{ background: isLight ? "#e6e3de" : `linear-gradient(to bottom right, var(--primary-dark), var(--muted-dark), var(--accent-dark))` }}>
          <div className="p-6 rounded-xl" style={{ background: isLight ? "#F8F4F0" : "var(--card-dark)", border: borderStyle }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Profile (for AI Email Generation)</h2>
              <button
                onClick={() => setShowCredentials(!showCredentials)}
                className="text-sm px-3 py-1 rounded border hover:bg-[var(--accent-dark)] hover:text-white transition-colors"
                style={{ borderColor: isLight ? "#ccc" : "var(--border-dark)" }}
              >
                {showCredentials ? "Hide" : "Show"} Profile
              </button>
            </div>
            
            {showCredentials && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Full Name"
                  value={userCredentials.name}
                  onChange={(e) => setUserCredentials({...userCredentials, name: e.target.value})}
                  className="p-3 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)] transition-all duration-300"
                  style={{ background: isLight ? "#ffffff" : "var(--input-dark)", color: "var(--text)", borderColor: isLight ? "#ccc" : "var(--border-dark)" }}
                />
                <input
                  type="text"
                  placeholder="Your Location"
                  value={userCredentials.location}
                  onChange={(e) => setUserCredentials({...userCredentials, location: e.target.value})}
                  className="p-3 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)] transition-all duration-300"
                  style={{ background: isLight ? "#ffffff" : "var(--input-dark)", color: "var(--text)", borderColor: isLight ? "#ccc" : "var(--border-dark)" }}
                />
                <input
                  type="text"
                  placeholder="Your Skills (e.g., React, Python, Marketing)"
                  value={userCredentials.skills}
                  onChange={(e) => setUserCredentials({...userCredentials, skills: e.target.value})}
                  className="p-3 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)] transition-all duration-300"
                  style={{ background: isLight ? "#ffffff" : "var(--input-dark)", color: "var(--text)", borderColor: isLight ? "#ccc" : "var(--border-dark)" }}
                />
                <input
                  type="text"
                  placeholder="Years of Experience"
                  value={userCredentials.experience}
                  onChange={(e) => setUserCredentials({...userCredentials, experience: e.target.value})}
                  className="p-3 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)] transition-all duration-300"
                  style={{ background: isLight ? "#ffffff" : "var(--input-dark)", color: "var(--text)", borderColor: isLight ? "#ccc" : "var(--border-dark)" }}
                />
                <input
                  type="url"
                  placeholder="LinkedIn Profile URL"
                  value={userCredentials.linkedin}
                  onChange={(e) => setUserCredentials({...userCredentials, linkedin: e.target.value})}
                  className="p-3 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)] transition-all duration-300"
                  style={{ background: isLight ? "#ffffff" : "var(--input-dark)", color: "var(--text)", borderColor: isLight ? "#ccc" : "var(--border-dark)" }}
                />
                <input
                  type="url"
                  placeholder="Portfolio/Website URL"
                  value={userCredentials.portfolio}
                  onChange={(e) => setUserCredentials({...userCredentials, portfolio: e.target.value})}
                  className="p-3 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)] transition-all duration-300"
                  style={{ background: isLight ? "#ffffff" : "var(--input-dark)", color: "var(--text)", borderColor: isLight ? "#ccc" : "var(--border-dark)" }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Jobs List */}
        {jobs.length > 0 && (
          <div className={`rounded-2xl p-[2px] mb-8 ${hoverEffect}`} style={{ background: isLight ? "#e6e3de" : `linear-gradient(to bottom right, var(--primary-dark), var(--muted-dark), var(--accent-dark))` }}>
            <div className="p-6 rounded-xl" style={{ background: isLight ? "#F8F4F0" : "var(--card-dark)", border: borderStyle }}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Found Jobs ({jobs.length})</h2>
                <div className="flex gap-2">
                  <button
                    onClick={selectAllJobs}
                    className="px-3 py-1 text-sm rounded border hover:bg-[var(--accent-dark)] hover:text-white transition-colors"
                    style={{ borderColor: isLight ? "#ccc" : "var(--border-dark)" }}
                  >
                    Select All
                  </button>
                  <button
                    onClick={deselectAllJobs}
                    className="px-3 py-1 text-sm rounded border hover:bg-[var(--accent-dark)] hover:text-white transition-colors"
                    style={{ borderColor: isLight ? "#ccc" : "var(--border-dark)" }}
                  >
                    Deselect All
                  </button>
                </div>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {jobs.map((job, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border transition-all duration-300 ${
                      selectedJobs.has(index) ? 'ring-2 ring-[var(--accent-dark)]' : ''
                    }`}
                    style={{ 
                      background: isLight ? "#ffffff" : "var(--input-dark)", 
                      borderColor: isLight ? "#ddd" : "var(--border-dark)" 
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedJobs.has(index)}
                        onChange={() => toggleJobSelection(index)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{job.position}</h3>
                        <p className="text-sm" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                          {job.company} • {job.location}
                        </p>
                        {job.tags && job.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {job.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                        >
                          View Job
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Outreach Section */}
        {selectedJobs.size > 0 && (
          <div className={`rounded-2xl p-[2px] mb-8 ${hoverEffect}`} style={{ background: isLight ? "#e6e3de" : `linear-gradient(to bottom right, var(--primary-dark), var(--muted-dark), var(--accent-dark))` }}>
            <div className="p-6 rounded-xl" style={{ background: isLight ? "#F8F4F0" : "var(--card-dark)", border: borderStyle }}>
              <h2 className="text-xl font-semibold mb-4">
                Outreach Campaign ({selectedJobs.size} jobs selected)
              </h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Outreach Message</label>
                <textarea
                  value={outreachMessage}
                  onChange={(e) => setOutreachMessage(e.target.value)}
                  placeholder="Enter your outreach message or let AI generate one..."
                  rows={6}
                  className="w-full p-3 rounded border focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)] transition-all duration-300"
                  style={{ background: isLight ? "#ffffff" : "var(--input-dark)", color: "var(--text)", borderColor: isLight ? "#ccc" : "var(--border-dark)" }}
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => generateMessage(jobs[Array.from(selectedJobs)[0]])}
                  className="px-4 py-2 rounded border hover:bg-[var(--accent-dark)] hover:text-white transition-colors"
                  style={{ borderColor: isLight ? "#ccc" : "var(--border-dark)" }}
                >
                  Generate AI Message
                </button>
                {!userCredentials.name && (
                  <span className="text-sm text-orange-600 flex items-center">
                    Fill in your profile above for personalized emails
                  </span>
                )}
                <button
                  onClick={sendBulkOutreach}
                  disabled={isSendingOutreach}
                  className="px-6 py-2 rounded-lg font-medium bg-[var(--accent-dark)] text-white hover:bg-opacity-80 focus:ring-2 focus:ring-[var(--accent-dark)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSendingOutreach ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    "Send Outreach"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {showResults && outreachResults.length > 0 && (
          <div className={`rounded-2xl p-[2px] ${hoverEffect}`} style={{ background: isLight ? "#e6e3de" : `linear-gradient(to bottom right, var(--primary-dark), var(--muted-dark), var(--accent-dark))` }}>
            <div className="p-6 rounded-xl" style={{ background: isLight ? "#F8F4F0" : "var(--card-dark)", border: borderStyle }}>
              <h2 className="text-xl font-semibold mb-4">Outreach Results</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {outreachResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      result.status === 'sent' ? 'border-green-200 bg-green-50' :
                      result.status === 'no_email_found' ? 'border-yellow-200 bg-yellow-50' :
                      'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{result.job}</p>
                        <p className="text-sm text-gray-600">{result.company}</p>
                        {result.email && <p className="text-sm text-gray-500">{result.email}</p>}
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        result.status === 'sent' ? 'bg-green-100 text-green-800' :
                        result.status === 'no_email_found' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {result.status}
                      </span>
                    </div>
                    {result.error && (
                      <p className="text-sm text-red-600 mt-1">{result.error}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 