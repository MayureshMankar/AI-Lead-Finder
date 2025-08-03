"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SplashCursor from "@/components/SplashCursor";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const successMessage = searchParams.get("message");

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  const gradient = "from-[var(--primary-dark)] via-[var(--muted-dark)] to-[var(--accent-dark)]";
  const borderStyle = "1px solid var(--border-dark)";
  const hoverEffect = "hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful, call the login function with token and user data
        login(data.access_token, data.user);
        
        // Handle Remember Me functionality
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberMe");
        }
      } else {
        setError(data.msg || "Invalid username or password");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "black", color: "var(--text)" }}>
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[var(--accent-dark)] border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-[var(--primary-dark)] border-b-transparent rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center font-sans relative"
      style={{
        color: "var(--text)",
      }}
    >
      {/* Fluid Splash Background */}
      <SplashCursor
        SIM_RESOLUTION={32}
        DYE_RESOLUTION={256}
        CAPTURE_RESOLUTION={128}
        PRESSURE_ITERATIONS={5}
        SHADING={false}
        SPLAT_FORCE={5000}
        SPLAT_RADIUS={0.07}
        COLOR_UPDATE_SPEED={2}
      />
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="text-left">
            {/* Enhanced Logo and Title */}
            <div className="mb-8">
              <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text" style={{ 
                background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                Welcome Back
              </h1>
              
              <p className="text-2xl mb-4" style={{ color: "var(--accent-dark)" }}>
                Sign in to your account
              </p>
              
              <p className="text-xl leading-relaxed" style={{ color: "var(--text-muted-dark)" }}>
                Continue your AI-powered job search journey with personalized lead generation and automated outreach.
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
                  <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>AI-Powered Discovery</h3>
                  <p className="text-sm" style={{ color: "var(--text-muted-dark)" }}>Find relevant job opportunities automatically</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent-dark)] to-[var(--primary-dark)] rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>Smart Messaging</h3>
                  <p className="text-sm" style={{ color: "var(--text-muted-dark)" }}>GPT-powered personalized outreach</p>
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
          </div>

          {/* Right Side - Login Form */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              {/* Enhanced Login Form */}
              <div className="glass-neumorphic p-10 rounded-3xl relative overflow-hidden">
                {/* Subtle form background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/3 to-transparent"></div>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-dark)] to-transparent"></div>
                {successMessage && (
                  <div className="mb-8 p-4 rounded-xl border border-green-500/30 relative overflow-hidden" style={{
                    background: "linear-gradient(145deg, rgba(34,197,94,0.1), rgba(34,197,94,0.05))",
                    backdropFilter: "blur(10px)"
                  }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent animate-pulse"></div>
                    <span className="relative z-10 text-green-400 font-medium">{successMessage}</span>
                  </div>
                )}

                {error && (
                  <div className="mb-8 p-4 rounded-xl border border-red-500/30 relative overflow-hidden" style={{ 
                    background: "linear-gradient(145deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))",
                    backdropFilter: "blur(10px)"
                  }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent animate-pulse"></div>
                    <span className="relative z-10 text-red-400 font-medium">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <div className="space-y-2">
                    <label htmlFor="username" className="block text-sm font-semibold mb-3" style={{ color: "var(--accent-dark)" }}>
                      Username or Email
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full p-5 rounded-xl border-2 focus:outline-none transition-all duration-300 group-hover:scale-105"
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
                        placeholder="Enter your username or email"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-semibold mb-3" style={{ color: "var(--primary-dark)" }}>
                      Password
                    </label>
                    <div className="relative group">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full p-5 rounded-xl border-2 focus:outline-none transition-all duration-300 group-hover:scale-105 pr-12"
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
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center transition-all duration-300 hover:scale-110"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ color: "var(--accent-dark)" }}
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a10.025 10.025 0 011.563-2.037L5.1 10.9l2.775 2.775L10.9 5.1l2.775 2.775L18.825 3.563A10.025 10.025 0 0121 12c0 4.478-2.943 8.268-7 9.543z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me and Forgot Password */}
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          id="rememberMe"
                          name="rememberMe"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="sr-only"
                        />
                        <div 
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 cursor-pointer ${
                            rememberMe ? 'bg-gradient-to-br from-[var(--accent-dark)] to-[var(--primary-dark)] border-transparent' : 'border-gray-400 hover:border-[var(--accent-dark)]'
                          }`}
                          onClick={() => setRememberMe(!rememberMe)}
                        >
                          {rememberMe && (
                            <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <label 
                        htmlFor="rememberMe" 
                        className="ml-3 text-sm cursor-pointer transition-all duration-300 hover:scale-105" 
                        style={{ color: "var(--text-muted-dark)" }}
                        onClick={() => setRememberMe(!rememberMe)}
                      >
                        Remember me
                      </label>
                    </div>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-semibold transition-all duration-300 hover:scale-105 hover:underline"
                      style={{ color: "var(--accent-dark)" }}
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Enhanced Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full p-5 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed premium-button relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-dark)] via-[var(--muted-dark)] to-[var(--primary-dark)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="loading-revolutionary w-6 h-6"></div>
                          Signing in...
                        </div>
                      ) : (
                        "Sign In"
                      )}
                    </span>
                  </button>
                </form>

                {/* Enhanced Signup Link */}
                <div className="mt-8 text-center relative z-10">
                  <p className="text-base" style={{ color: "var(--text-muted-dark)" }}>
                    Don't have an account?{" "}
                    <Link
                      href="/signup"
                      className="font-semibold transition-all duration-300 hover:scale-105 inline-block"
                      style={{ color: "var(--accent-dark)" }}
                    >
                      Sign up here
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