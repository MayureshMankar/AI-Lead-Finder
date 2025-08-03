"use client";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";

interface Lead {
  id: string;
  position: string;
  company: string;
  email?: string;
}

interface EmailLog {
  id: string;
  to: string;
  subject: string;
  body: string;
  status: string;
  sent_at: string;
}

export default function EmailPage() {
  const { isAuthenticated, loading } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<string>("");
  const [to, setTo] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [permission, setPermission] = useState(false);
  const [emailLog, setEmailLog] = useState<EmailLog[]>([]);
  const [template, setTemplate] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Fetch leads for dropdown
  useEffect(() => {
    const fetchLeads = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:5001/api/leads", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data.output || []);
      }
    };
    if (isAuthenticated) fetchLeads();
  }, [isAuthenticated]);

  // Fetch email log (mock for now)
  useEffect(() => {
    // TODO: Replace with real backend call
    setEmailLog([
      {
        id: "1",
        to: "test@example.com",
        subject: "Welcome!",
        body: "Welcome to AI Lead Finder!",
        status: "sent",
        sent_at: new Date().toISOString(),
      },
    ]);
  }, []);

  // Handle lead selection
  useEffect(() => {
    if (selectedLead) {
      const lead = leads.find((l) => l.id === selectedLead);
      setTo(lead?.email || "");
      setBody(template || "");
    }
  }, [selectedLead, template, leads]);

  // Permission toggle handler
  const handlePermission = () => {
    setPermission((prev) => !prev);
    // Optionally, store in backend or localStorage
  };

  // Send email handler
  const sendEmail = async () => {
    setSending(true);
    setStatus(null);
    try {
      const token = localStorage.getItem("token");
      const leadObj = leads.find((l) => l.id === selectedLead);
      if (!leadObj) {
        setStatus("Please select a valid lead.");
        setSending(false);
        return;
      }
      const res = await fetch("http://127.0.0.1:5001/api/send-outreach", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job: leadObj,
          email: to,
          message: body,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("Email sent successfully!");
        setEmailLog([
          {
            id: Date.now().toString(),
            to,
            subject: data.subject || `Regarding ${leadObj.position} at ${leadObj.company}`,
            body,
            status: "sent",
            sent_at: new Date().toISOString(),
          },
          ...emailLog,
        ]);
      } else {
        setStatus(data.msg || data.error || "Failed to send email.");
      }
    } catch (error) {
      setStatus("Failed to send email.");
    } finally {
      setSending(false);
    }
  };

  // Example templates
  const templates = [
    "Hi, I'm interested in the position. Let's connect!",
    "Hello, I saw your job posting and would love to discuss further.",
    "Greetings, I believe my skills are a great fit for your company.",
  ];

  // Compute draft log entry
  const leadObj = leads.find((l) => l.id === selectedLead);
  const draftLog = to && body ? {
    id: 'draft',
    to,
    subject: `Regarding ${leadObj?.position || ''} at ${leadObj?.company || ''}`,
    body,
    status: 'draft',
    sent_at: new Date().toISOString(),
  } : null;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-dark)]"></div></div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen font-sans relative" style={{ color: "var(--text)" }}>
      <Navigation />
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, var(--accent-dark) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, var(--primary-dark) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          animation: 'pattern-float 20s linear infinite'
        }}></div>
      </div>
      <div className={`w-full max-w-6xl mx-auto px-6 relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start min-h-[80vh] py-10">
          {/* Left Side - Content */}
          <div className="text-left flex flex-col items-start lg:pl-0 pl-2">
            {/* Logo and Title */}
            <div className="mb-8">
              <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text" style={{
                background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>Send Outreach Email</h2>
              <p className="text-xl leading-relaxed" style={{ color: "var(--text-muted-dark)" }}>
                Reach out to your leads with beautiful, personalized emails and track your outreach performance.
              </p>
            </div>
            {/* Feature Highlights */}
            <div className="space-y-6 mt-12">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent-dark)] to-[var(--primary-dark)] rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>AI-Powered Messaging</h3>
                  <p className="text-sm" style={{ color: "var(--text-muted-dark)" }}>Send smart, personalized emails to your leads</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent-dark)] to-[var(--primary-dark)] rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>Templates & Automation</h3>
                  <p className="text-sm" style={{ color: "var(--text-muted-dark)" }}>Use templates or AI to save time</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent-dark)] to-[var(--primary-dark)] rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>Track Results</h3>
                  <p className="text-sm" style={{ color: "var(--text-muted-dark)" }}>Monitor your outreach performance</p>
                </div>
              </div>
            </div>
            {/* Enhanced Footer */}
            <div className="mt-16">
              <p className="text-sm" style={{ color: "var(--text-muted-dark)" }}>
                © {new Date().getFullYear()} AI Lead Finder. All rights reserved.
              </p>
              <div className="flex mt-4 space-x-4">
                <div className="w-1 h-1 bg-[var(--accent-dark)] rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-[var(--muted-dark)] rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="w-1 h-1 bg-[var(--primary-dark)] rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
            {/* Email Log - moved here below content/features */}
            <div className="glass-neumorphic p-8 rounded-3xl relative overflow-hidden mt-10 w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4 text-[var(--text)]">Email Log</h2>
              <div className="space-y-6">
                {/* Draft log entry (live preview) */}
                {draftLog && (
                  <div className="glass-neumorphic p-6 rounded-2xl relative overflow-hidden border-2 border-dashed border-[var(--accent-dark)] bg-opacity-80 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent pointer-events-none"></div>
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-dark)] to-transparent"></div>
                    <div className="relative z-10 space-y-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-[var(--accent-dark)]">To:</span> <span className="font-medium break-all">{draftLog.to}</span>
                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-[var(--accent-dark)] text-white font-semibold">Draft</span>
                      </div>
                      <div><span className="font-semibold text-[var(--primary-dark)]">Subject:</span> <span className="font-medium">{draftLog.subject}</span></div>
                      <div><span className="font-semibold text-[var(--muted-dark)]">Status:</span> <span className="font-medium">Draft</span></div>
                      <div><span className="font-semibold text-[var(--muted-dark)]">Time:</span> <span className="font-medium">{new Date().toLocaleString()}</span></div>
                      <div><span className="font-semibold text-[var(--accent-dark)]">Body:</span>
                        <div className="whitespace-pre-line text-sm mt-1 text-[var(--text)] bg-transparent p-2 rounded-xl">{draftLog.body}</div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Real log entries */}
                {emailLog.length === 0 && !draftLog && <div className="text-gray-500">No emails sent yet.</div>}
                {emailLog.map(log => (
                  <div key={log.id} className="glass-neumorphic p-6 rounded-2xl relative overflow-hidden transition-all duration-300">
                    {/* Subtle card background effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none"></div>
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-dark)] to-transparent"></div>
                    <div className="relative z-10 space-y-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-[var(--accent-dark)]">To:</span> <span className="font-medium break-all">{log.to}</span>
                      </div>
                      <div><span className="font-semibold text-[var(--primary-dark)]">Subject:</span> <span className="font-medium">{log.subject}</span></div>
                      <div><span className="font-semibold text-[var(--muted-dark)]">Status:</span> <span className="font-medium">{log.status}</span></div>
                      <div><span className="font-semibold text-[var(--muted-dark)]">Sent at:</span> <span className="font-medium">{new Date(log.sent_at).toLocaleString()}</span></div>
                      <div><span className="font-semibold text-[var(--accent-dark)]">Body:</span>
                        <div className="whitespace-pre-line text-sm mt-1 text-[var(--text)] bg-transparent p-2 rounded-xl">{log.body}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Right Side - Email Form */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <div className="glass-neumorphic p-8 rounded-3xl relative overflow-hidden">
                {/* Subtle form background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/3 to-transparent"></div>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-dark)] to-transparent"></div>
                {/* Status/Error Message */}
                {status && (
                  <div className="mb-6 p-3 rounded-xl border border-green-500/30 relative overflow-hidden" style={{
                    background: "linear-gradient(145deg, rgba(34,197,94,0.1), rgba(34,197,94,0.05))",
                    backdropFilter: "blur(10px)"
                  }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent animate-pulse"></div>
                    <span className="relative z-10 text-green-400 font-medium text-sm">{status}</span>
                  </div>
                )}
                <form onSubmit={e => { e.preventDefault(); sendEmail(); }} className="space-y-6 relative z-10">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold mb-2" style={{ color: "var(--accent-dark)" }}>Select Lead</label>
                    <div className="relative group">
                      <select
                        value={selectedLead}
                        onChange={e => setSelectedLead(e.target.value)}
                        className="w-full p-4 rounded-xl border-2 focus:outline-none transition-all duration-300 group-hover:scale-105 text-black"
                        style={{
                          background: "rgba(42, 42, 45, 0.9)",
                          borderColor: "rgba(146, 163, 120, 0.3)",
                          color: "var(--text)",
                          fontSize: "16px"
                        }}
                        onFocus={e => {
                          e.target.style.borderColor = "var(--primary-dark)";
                          e.target.style.boxShadow = "0 0 20px rgba(146, 163, 120, 0.3), 0 0 40px rgba(245, 243, 236, 0.2)";
                          e.target.style.transform = "scale(1.02)";
                        }}
                        onBlur={e => {
                          e.target.style.borderColor = "rgba(146, 163, 120, 0.3)";
                          e.target.style.boxShadow = "none";
                          e.target.style.transform = "scale(1)";
                        }}
                        required
                      >
                        <option value="">-- Select a lead --</option>
                        {leads.map(lead => (
                          <option key={lead.id} value={lead.id}>{lead.position} @ {lead.company}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold mb-2" style={{ color: "var(--muted-dark)" }}>To</label>
                    <div className="relative group">
                      <input
                        type="email"
                        value={to}
                        onChange={e => setTo(e.target.value)}
                        className="w-full p-4 rounded-xl border-2 focus:outline-none transition-all duration-300 group-hover:scale-105"
                        style={{
                          background: "rgba(42, 42, 45, 0.9)",
                          borderColor: "rgba(146, 163, 120, 0.3)",
                          color: "var(--text)",
                          fontSize: "16px"
                        }}
                        onFocus={e => {
                          e.target.style.borderColor = "var(--primary-dark)";
                          e.target.style.boxShadow = "0 0 20px rgba(146, 163, 120, 0.3), 0 0 40px rgba(245, 243, 236, 0.2)";
                          e.target.style.transform = "scale(1.02)";
                        }}
                        onBlur={e => {
                          e.target.style.borderColor = "rgba(146, 163, 120, 0.3)";
                          e.target.style.boxShadow = "none";
                          e.target.style.transform = "scale(1)";
                        }}
                        placeholder="Recipient email"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold mb-2" style={{ color: "var(--accent-dark)" }}>Body</label>
                    <div className="relative group">
                      <textarea
                        value={body}
                        onChange={e => setBody(e.target.value)}
                        className="w-full p-4 rounded-xl border-2 focus:outline-none transition-all duration-300 group-hover:scale-105"
                        style={{
                          background: "rgba(42, 42, 45, 0.9)",
                          borderColor: "rgba(146, 163, 120, 0.3)",
                          color: "var(--text)",
                          fontSize: "16px"
                        }}
                        onFocus={e => {
                          e.target.style.borderColor = "var(--primary-dark)";
                          e.target.style.boxShadow = "0 0 20px rgba(146, 163, 120, 0.3), 0 0 40px rgba(245, 243, 236, 0.2)";
                          e.target.style.transform = "scale(1.02)";
                        }}
                        onBlur={e => {
                          e.target.style.borderColor = "rgba(146, 163, 120, 0.3)";
                          e.target.style.boxShadow = "none";
                          e.target.style.transform = "scale(1)";
                        }}
                        rows={6}
                        placeholder="Write your message here..."
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold mb-2" style={{ color: "var(--primary-dark)" }}>Templates</label>
                    <div className="flex flex-wrap gap-2">
                      {templates.map((tpl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setTemplate(tpl)}
                          className="px-3 py-1 bg-gradient-to-br from-[var(--accent-dark)] to-[var(--primary-dark)] text-white rounded-full text-sm hover:scale-105 transition-all font-semibold shadow"
                        >
                          {tpl}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center relative z-10">
                    <div className="flex items-center group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          id="permission-toggle"
                          checked={permission}
                          onChange={handlePermission}
                          className="sr-only"
                        />
                        <div
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-300 cursor-pointer ${
                            permission ? 'bg-gradient-to-br from-[var(--accent-dark)] to-[var(--primary-dark)] border-transparent' : 'border-gray-400 hover:border-[var(--accent-dark)]'
                          }`}
                          onClick={() => setPermission(!permission)}
                        >
                          {permission && (
                            <svg className="w-2.5 h-2.5 text-black" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <label
                        htmlFor="permission-toggle"
                        className="ml-2 text-xs cursor-pointer transition-all duration-300 hover:scale-105"
                        style={{ color: "var(--text-muted-dark)" }}
                        onClick={() => setPermission(!permission)}
                      >
                        Allow automatic sending (grant permission)
                      </label>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={sending || !to || !body}
                    className="w-full p-4 rounded-xl font-bold text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed premium-button relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-dark)] via-[var(--muted-dark)] to-[var(--primary-dark)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">
                      {sending ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="loading-revolutionary w-5 h-5"></div>
                          Sending...
                        </div>
                      ) : (
                        "Send Email"
                      )}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          @keyframes pattern-float {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 50px); }
          }
        `}</style>
      </div>
    </div>
  );
} 