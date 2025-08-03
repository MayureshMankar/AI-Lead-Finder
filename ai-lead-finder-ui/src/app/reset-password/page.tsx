"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
    color: "gray"
  });
  const [token, setToken] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    }
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [searchParams]);

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) score++;
    else feedback.push("At least 8 characters");

    if (/[A-Z]/.test(password)) score++;
    else feedback.push("One uppercase letter");

    if (/[a-z]/.test(password)) score++;
    else feedback.push("One lowercase letter");

    if (/[0-9]/.test(password)) score++;
    else feedback.push("One number");

    if (/[^A-Za-z0-9]/.test(password)) score++;
    else feedback.push("One special character");

    let color = "red";
    if (score >= 4) color = "green";
    else if (score >= 3) color = "yellow";
    else if (score >= 2) color = "orange";

    return {
      score,
      feedback: feedback.join(", "),
      color
    };
  };

  useEffect(() => {
    if (password) {
      setPasswordStrength(checkPasswordStrength(password));
    }
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (passwordStrength.score < 3) {
      setError("Password is too weak. Please choose a stronger password.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5001/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Password has been reset successfully! You can now sign in with your new password.");
        setPassword("");
        setConfirmPassword("");
      } else {
        setError(data.msg || "Failed to reset password.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score === 0) return "Very Weak";
    if (passwordStrength.score === 1) return "Weak";
    if (passwordStrength.score === 2) return "Fair";
    if (passwordStrength.score === 3) return "Good";
    if (passwordStrength.score === 4) return "Strong";
    return "Very Strong";
  };

  if (!token) {
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

        <div className="w-full max-w-md relative z-10">
          <div className="glass-neumorphic p-8 rounded-3xl relative overflow-hidden text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/3 to-transparent"></div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-dark)] to-transparent"></div>
            
            <h1 className="text-3xl font-bold mb-4 text-transparent bg-clip-text" style={{ 
              background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Invalid Reset Link
            </h1>
            <p className="text-lg mb-6" style={{ color: "var(--text-muted-dark)" }}>
              This password reset link is invalid or has expired.
            </p>
            <Link 
              href="/forgot-password" 
              className="inline-block px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 premium-button relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-dark)] via-[var(--muted-dark)] to-[var(--primary-dark)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">Request New Reset Link</span>
            </Link>
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
                Reset Your Password
              </h1>
              
              <p className="text-2xl mb-4" style={{ color: "var(--accent-dark)" }}>
                Create a new secure password
              </p>
              
              <p className="text-xl leading-relaxed" style={{ color: "var(--text-muted-dark)" }}>
                Choose a strong password to keep your account secure and continue your AI-powered job search journey.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-6 mt-10">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[var(--accent-dark)] to-[var(--primary-dark)] rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>Strong Security</h3>
                  <p className="text-sm" style={{ color: "var(--text-muted-dark)" }}>Create a password that's hard to crack</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[var(--accent-dark)] to-[var(--primary-dark)] rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>Instant Access</h3>
                  <p className="text-sm" style={{ color: "var(--text-muted-dark)" }}>Get back to your job search immediately</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[var(--accent-dark)] to-[var(--primary-dark)] rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>AI-Powered Future</h3>
                  <p className="text-sm" style={{ color: "var(--text-muted-dark)" }}>Continue with intelligent job discovery</p>
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

          {/* Right Side - Reset Password Form */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              {/* Enhanced Reset Password Form */}
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
                    <div className="mt-4">
                      <Link 
                        href="/login" 
                        className="inline-block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 premium-button relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-dark)] via-[var(--muted-dark)] to-[var(--primary-dark)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10">Go to Sign In</span>
                      </Link>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-semibold mb-2" style={{ color: "var(--primary-dark)" }}>
                      New Password
                    </label>
                    <div className="relative group">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-4 rounded-xl border-2 focus:outline-none transition-all duration-300 group-hover:scale-105 pr-12"
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
                        placeholder="Enter your new password"
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
                    {password && (
                      <div className="mt-2">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                passwordStrength.color === 'red' ? 'bg-red-500' :
                                passwordStrength.color === 'orange' ? 'bg-orange-500' :
                                passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                            ></div>
                          </div>
                          <span className={`text-sm font-medium ${
                            passwordStrength.color === 'red' ? 'text-red-400' :
                            passwordStrength.color === 'orange' ? 'text-orange-400' :
                            passwordStrength.color === 'yellow' ? 'text-yellow-400' :
                            'text-green-400'
                          }`}>
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                        {passwordStrength.feedback && (
                          <p className="text-xs" style={{ color: "var(--text-muted-dark)" }}>{passwordStrength.feedback}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2" style={{ color: "var(--accent-dark)" }}>
                      Confirm New Password
                    </label>
                    <div className="relative group">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full p-4 rounded-xl border-2 focus:outline-none transition-all duration-300 group-hover:scale-105 pr-12 ${
                          confirmPassword && password !== confirmPassword 
                            ? 'border-red-400' 
                            : ''
                        }`}
                        style={{
                          background: "rgba(42, 42, 45, 0.9)",
                          borderColor: confirmPassword && password !== confirmPassword ? "rgba(239, 68, 68, 0.5)" : "rgba(146, 163, 120, 0.3)",
                          color: "var(--text)",
                          fontSize: "16px"
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "var(--primary-dark)";
                          e.target.style.boxShadow = "0 0 20px rgba(146, 163, 120, 0.3), 0 0 40px rgba(245, 243, 236, 0.2)";
                          e.target.style.transform = "scale(1.02)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = confirmPassword && password !== confirmPassword ? "rgba(239, 68, 68, 0.5)" : "rgba(146, 163, 120, 0.3)";
                          e.target.style.boxShadow = "none";
                          e.target.style.transform = "scale(1)";
                        }}
                        placeholder="Confirm your new password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center transition-all duration-300 hover:scale-110"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{ color: "var(--accent-dark)" }}
                      >
                        {showConfirmPassword ? (
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
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-sm text-red-400 mt-1">Passwords do not match</p>
                    )}
                  </div>

                  {/* Enhanced Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || passwordStrength.score < 3 || password !== confirmPassword}
                    className="w-full p-4 rounded-xl font-bold text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed premium-button relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-dark)] via-[var(--muted-dark)] to-[var(--primary-dark)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">
                      {loading ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="loading-revolutionary w-5 h-5"></div>
                          Resetting Password...
                        </div>
                      ) : (
                        "Reset Password"
                      )}
                    </span>
                  </button>
                </form>
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