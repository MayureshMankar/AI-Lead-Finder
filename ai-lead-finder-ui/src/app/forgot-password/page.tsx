"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://127.0.0.1:5001/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Password reset instructions have been sent to your email.");
        setEmail("");
      } else {
        setError(data.msg || "Failed to send reset email.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center font-sans relative"
      style={{
        color: "var(--text)",
      }}
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, var(--accent-dark) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, var(--primary-dark) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          animation: 'pattern-float 20s linear infinite'
        }}></div>
      </div>

      <div className={`w-full max-w-6xl mx-auto px-6 relative z-10 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Content */}
          <div className="text-left">
            {/* Enhanced Logo and Title */}
            <div className="mb-8">
              <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text" style={{ 
                background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                Forgot Password?
              </h1>
              
              <p className="text-2xl mb-4" style={{ color: "var(--accent-dark)" }}>
                No worries, we've got you covered
              </p>
              
              <p className="text-xl leading-relaxed" style={{ color: "var(--text-muted-dark)" }}>
                Enter your email address and we'll send you a secure link to reset your password and get back to your AI-powered job search.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-6 mt-10">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[var(--accent-dark)] to-[var(--primary-dark)] rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>Secure Email Link</h3>
                  <p className="text-sm" style={{ color: "var(--text-muted-dark)" }}>We'll send you a secure reset link</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[var(--accent-dark)] to-[var(--primary-dark)] rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>Quick & Easy</h3>
                  <p className="text-sm" style={{ color: "var(--text-muted-dark)" }}>Reset your password in minutes</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[var(--accent-dark)] to-[var(--primary-dark)] rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>Back to Business</h3>
                  <p className="text-sm" style={{ color: "var(--text-muted-dark)" }}>Continue your job search journey</p>
                </div>
              </div>
            </div>

            {/* Enhanced Footer */}
            <div className="mt-10">
              <p className="text-sm" style={{ color: "var(--text-muted-dark)" }}>
                © {new Date().getFullYear()} AI Lead Finder. All rights reserved.
              </p>
              <div className="flex mt-3 space-x-4">
                <div className="w-1 h-1 bg-[var(--accent-dark)] rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-[var(--muted-dark)] rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="w-1 h-1 bg-[var(--primary-dark)] rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
          </div>

          {/* Right Side - Forgot Password Form */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              {/* Enhanced Forgot Password Form */}
              <div className="glass-neumorphic p-8 rounded-3xl relative overflow-hidden">
                {/* Subtle form background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/3 to-transparent"></div>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-dark)] to-transparent"></div>
                
                {error && (
                  <div className="mb-6 p-3 rounded-xl border border-red-500/30 relative overflow-hidden" style={{ 
                    background: "linear-gradient(145deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))",
                    backdropFilter: "blur(10px)"
                  }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent animate-pulse"></div>
                    <span className="relative z-10 text-red-400 font-medium text-sm">{error}</span>
                  </div>
                )}

                {success && (
                  <div className="mb-6 p-3 rounded-xl border border-green-500/30 relative overflow-hidden" style={{ 
                    background: "linear-gradient(145deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))",
                    backdropFilter: "blur(10px)"
                  }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent animate-pulse"></div>
                    <span className="relative z-10 text-green-400 font-medium text-sm">{success}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold mb-2" style={{ color: "var(--accent-dark)" }}>
                      Email Address
                    </label>
                    <div className="relative group">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-4 rounded-xl border-2 focus:outline-none transition-all duration-300 group-hover:scale-105"
                        style={{
                          background: "rgba(42, 42, 45, 0.9)",
                          borderColor: "rgba(146, 163, 120, 0.3)",
                          color: "var(--text)",
                          fontSize: "16px"
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "var(--primary-dark)";
                          e.target.style.boxShadow = "0 0 20px rgba(146, 163, 120, 0.3), 0 0 40px rgba(245, 243, 236, 0.2)";
                          e.target.style.transform = "scale(1.02)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(146, 163, 120, 0.3)";
                          e.target.style.boxShadow = "none";
                          e.target.style.transform = "scale(1)";
                        }}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                  </div>

                  {/* Enhanced Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full p-4 rounded-xl font-bold text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed premium-button relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-dark)] via-[var(--muted-dark)] to-[var(--primary-dark)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">
                      {loading ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="loading-revolutionary w-5 h-5"></div>
                          Sending...
                        </div>
                      ) : (
                        "Send Reset Instructions"
                      )}
                    </span>
                  </button>
                </form>

                {/* Enhanced Login Link */}
                <div className="mt-6 text-center relative z-10">
                  <p className="text-sm" style={{ color: "var(--text-muted-dark)" }}>
                    Remember your password?{" "}
                    <Link
                      href="/login"
                      className="font-semibold transition-all duration-300 hover:scale-105 inline-block"
                      style={{ color: "var(--accent-dark)" }}
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
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
  );
} 