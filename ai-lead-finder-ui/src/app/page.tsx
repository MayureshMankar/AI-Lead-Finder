"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";

export default function Home() {
  const [hoveredButton, setHoveredButton] = useState(null);
  const [hoveredActionButton, setHoveredActionButton] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const gradient = "from-[var(--primary-dark)] via-[var(--muted-dark)] to-[var(--accent-dark)]";

  const borderStyle = "1px solid var(--border-dark)";
  const hoverEffect = "hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out";
  const buttonBaseStyle = "font-semibold px-6 py-3 rounded shadow-md";
  const buttonHoverEffect = "hover:shadow-lg transition-all duration-300 ease-in-out";

  return (
    <div
      className="min-h-screen font-sans transition-colors duration-300"
      style={{
        backgroundColor: "#000000",
        color: "#ffffff",
      }}
    >
      {/* Professional Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-opacity-20 transition-all duration-500 ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
        style={{ 
          borderColor: "var(--border-dark)",
          backgroundColor: "rgba(14, 14, 16, 0.95)"
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg animate-pulse" style={{ background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))" }}>
                <span className="font-bold text-lg" style={{ color: "#000000" }}>AI</span>
              </div>
              <h1 className="text-xl font-bold transition-all duration-300 hover:scale-105 bg-clip-text text-transparent" style={{ background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))" }}>
                Lead Finder
              </h1>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link
                href="/login"
                className="text-sm font-medium transition-all duration-300 hover:scale-105 hover:text-[var(--accent-dark)]"
                style={{ color: "var(--text)" }}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{ 
                  background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
                  color: "#000000"
                }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Fixed Color Theme */}
      <section className={`relative py-20 px-6 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Subtle Badge */}
              <div className="inline-flex items-center space-x-2">
                <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: "var(--accent-dark)" }}></div>
                <span className="text-sm font-medium" style={{ color: "var(--text-muted-dark)" }}>
                  AI-Powered Platform
                </span>
              </div>

              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight text-transparent bg-clip-text" style={{ 
                  background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
                  Automate Your Job Outreach
                </h1>

                <p className="text-lg leading-relaxed" style={{ color: "white" }}>
                  Transform your job search with AI-powered lead generation and personalized messaging. 
                  Save hours of manual work and increase your response rate.
                </p>
              </div>

              {/* CTA Section */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-xl"
                    style={{ 
                      background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
                      color: "#000000"
                    }}
                  >
                    Start Free Trial
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  
                  <Link
                    href="/demo"
                    className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border hover:bg-gray-800"
                    style={{ 
                      borderColor: "var(--border-dark)",
                      color: "var(--text)"
                    }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    See Demo
                  </Link>
                </div>

                {/* Trust Indicators - Enhanced */}
                <div className="flex items-center space-x-8 pt-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full border-2 transition-all duration-300"
                          style={{ 
                            background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
                            borderColor: "var(--border-dark)"
                          }}
                        ></div>
                      ))}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                        500+ users
                      </span>
                      <span className="text-xs" style={{ color: "var(--text-muted-dark)" }}>
                        Trusted by job seekers
                      </span>
                    </div>
                  </div>
                  <div className="w-px h-8" style={{ backgroundColor: "var(--border-dark)" }}></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))" }}>
                      <svg className="w-4 h-4" style={{ color: "#000000" }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                        Free forever
                      </span>
                      <span className="text-xs" style={{ color: "var(--text-muted-dark)" }}>
                        No credit card required
                      </span>
                    </div>
                  </div>
                  <div className="w-px h-8" style={{ backgroundColor: "var(--border-dark)" }}></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))" }}>
                      <svg className="w-4 h-4" style={{ color: "#000000" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                        3x faster
                      </span>
                      <span className="text-xs" style={{ color: "var(--text-muted-dark)" }}>
                        Than manual outreach
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Simple Visual */}
            <div className="relative">
              <div className="p-[3px] rounded-2xl" style={{ background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))" }}>
                <div className="p-8 rounded-[18px] hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out" style={{ 
                  background: "var(--card-dark)", 
                  border: "1px solid var(--border-dark)" 
                }}>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--accent-dark)" }}></div>
                      <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                        AI Lead Finder
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--text-muted-dark)" }}></div>
                      ))}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="p-[2px] rounded-xl" style={{ background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))" }}>
                      <div className="p-4 rounded-[10px] h-full" style={{ background: "var(--card-dark)" }}>
                        <div className="text-2xl font-bold" style={{ color: "var(--text)" }}>
                          127
                        </div>
                        <div className="text-xs mt-1" style={{ color: "var(--text-muted-dark)" }}>
                          Leads Found
                        </div>
                      </div>
                    </div>
                    <div className="p-[2px] rounded-xl" style={{ background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))" }}>
                      <div className="p-4 rounded-[10px] h-full" style={{ background: "var(--card-dark)" }}>
                        <div className="text-2xl font-bold" style={{ color: "var(--text)" }}>
                          89%
                        </div>
                        <div className="text-xs mt-1" style={{ color: "var(--text-muted-dark)" }}>
                          Response Rate
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activity Feed */}
                  <div className="p-[2px] rounded-xl" style={{ background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))" }}>
                    <div className="p-4 rounded-[10px] h-full" style={{ background: "var(--card-dark)" }}>
                      <div className="text-sm font-medium mb-3" style={{ color: "var(--text)" }}>
                        Recent Activity
                      </div>
                      <div className="space-y-2">
                        {[
                          { platform: "RemoteOK", count: "23", type: "new leads" },
                          { platform: "Reddit", count: "15", type: "opportunities" },
                          { platform: "Remotive", count: "8", type: "remote jobs" }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-xs" style={{ color: "var(--text-muted-dark)" }}>
                            <span>{item.platform}</span>
                            <span className="font-medium" style={{ color: "var(--text)" }}>
                              {item.count} {item.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What It Does Section - Enhanced with Glass Effects */}
      <section className={`py-20 px-6 transition-all duration-1000 delay-300 relative z-10 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="text-center max-w-6xl mx-auto">
          <h2
            className="text-4xl font-bold mb-6 text-glow text-transparent bg-clip-text"
            style={{ 
              background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            What It Does
          </h2>
          <p
            className="text-lg leading-relaxed mb-12 text-transparent bg-clip-text"
            style={{ 
              background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            AI Lead Finder revolutionizes your job search by combining intelligent automation with personalized outreach. 
            It's your AI-powered assistant that works 24/7 to find opportunities and connect you with decision-makers.
          </p>

          {/* Process Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                step: "01",
                title: "Smart Discovery",
                description: "Automatically scans reliable API sources including RemoteOK, Arbeitnow, Remotive, and more to find relevant opportunities that match your criteria.",
                features: ["Real-time monitoring", "Custom filters", "Duplicate detection", "Quality scoring"]
              },
              {
                step: "02", 
                title: "AI-Powered Personalization",
                description: "Uses advanced GPT technology to craft personalized messages that resonate with each recipient, increasing your response rates significantly.",
                features: ["GPT-4 integration", "Context-aware content", "Industry-specific tone", "A/B testing"]
              },
              {
                step: "03",
                title: "Seamless Outreach",
                description: "Sends your messages through email with intelligent scheduling and follow-up automation.",
                features: ["Multi-channel sending", "Smart scheduling", "Auto follow-ups", "Response tracking"]
              }
            ].map((process, index) => (
              <div 
                key={index}
                className={`p-6 rounded-xl transition-all duration-700 delay-${index * 200} hover:scale-105 relative overflow-hidden group ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ 
                  background: "rgba(42, 42, 45, 0.9)", 
                  border: "1px solid rgba(255, 255, 255, 0.67)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 8px 20px rgba(146, 163, 120, 0.2), 0 4px 12px rgba(146, 163, 120, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                }}
              >
                {/* Glass effect overlays */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-dark)] to-transparent"></div>
                
                <div className="flex items-center mb-4 relative z-10">
                  <span className={`text-sm font-bold px-3 py-1 rounded-full transition-all duration-300 group-hover:scale-110 ${
                    "bg-gradient-to-r from-[var(--accent-dark)] to-[var(--primary-dark)] text-black"
                  }`}>
                    {process.step}
                  </span>
                </div>
                <h3 className={`text-xl font-semibold mb-3 ${
                  "bg-gradient-to-br from-[var(--primary-dark)] via-[var(--muted-dark)] to-[var(--accent-dark)] bg-clip-text text-transparent"
                }`}>
                  {process.title}
                </h3>
                <p className={`text-sm mb-4 leading-relaxed ${
                  "text-[var(--text-muted)]"
                }`}>
                  {process.description}
                </p>
                <div className="space-y-2">
                  {process.features.map((feature, i) => (
                    <div key={i} className="flex items-center text-xs">
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        "bg-[var(--accent-dark)]"
                      }`}></span>
                      <span className={`${
                        "text-white"
                      }`}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Key Benefits & Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { metric: "10,000+", label: "Leads Generated", desc: "Successfully scraped and processed" },
              { metric: "500+", label: "Interviews Secured", desc: "Users landed interviews with our help" },
              { metric: "85%", label: "Response Rate", desc: "AI-crafted messages get better results" },
              { metric: "3x", label: "Faster Outreach", desc: "Automated vs manual job search" }
            ].map((benefit, index) => (
              <div 
                key={index}
                className={`text-center p-4 rounded-lg transition-all duration-500 delay-${index * 100} hover:scale-105 relative overflow-hidden group ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
                style={{ 
                  background: "rgba(42, 42, 45, 0.9)", 
                  border: "1px solid var(--border-dark)",
                  backdropFilter: "blur(10px)"
                }}
              >
                {/* Glass effect overlays */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-dark)] to-transparent"></div>
                
                <div className={`text-3xl font-bold mb-2 transition-all duration-300 group-hover:scale-110 ${
                  "bg-gradient-to-br from-[var(--accent-dark)] to-[var(--primary-dark)] bg-clip-text text-transparent"
                }`}>
                  {benefit.metric}
                </div>
                <div className={`font-semibold mb-1 transition-all duration-300 ${
                  "text-[var(--text)]"
                }`}>
                  {benefit.label}
                </div>
                <div className={`text-xs transition-all duration-300 ${
                  "text-[var(--text-muted-dark)]"
                }`}>
                  {benefit.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 px-6 transition-all duration-1000 delay-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <h2 className="text-4xl font-bold text-center text-glow mb-14 text-transparent bg-clip-text" style={{ 
          background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { 
              title: "Multi-Source Scraping", 
              description: "Collect jobs from RemoteOK, Arbeitnow, Remotive, and more",
              backInfo: {
                platforms: ["RemoteOK", "Arbeitnow", "Remotive"],
                benefits: ["Real-time updates", "Multiple sources", "Custom filters"]
              }
            },
            { 
              title: "AI Message Writer", 
              description: "Automatically write personalized outreach using GPT",
              backInfo: {
                features: ["GPT-4 powered", "Personalized content", "Industry-specific"],
                benefits: ["Save 2+ hours", "Higher response rates", "Professional tone"]
              }
            },
            { 
              title: "One-Click Messaging", 
              description: "Send emails or DMs instantly from the dashboard",
              backInfo: {
                channels: ["Email"],
                benefits: ["Bulk sending", "Scheduled messages", "Auto-follow up"]
              }
            },
            { 
              title: "Lead Tracker", 
              description: "See which leads you've contacted and avoid duplicates",
              backInfo: {
                tracking: ["Contact history", "Response status", "Follow-up reminders"],
                benefits: ["No duplicates", "Progress tracking", "Analytics"]
              }
            },
            { 
              title: "CLI & Web Options", 
              description: "Use the CLI for power users or Web App for visual users",
              backInfo: {
                platforms: ["Command Line", "Web Dashboard", "API Access"],
                benefits: ["Developer friendly", "Automation ready", "Visual interface"]
              }
            },
            { 
              title: "Smart Filters & Tags", 
              description: "Segment leads by job role, platform, or response status",
              backInfo: {
                filters: ["Job role", "Location", "Salary range", "Company size"],
                benefits: ["Targeted outreach", "Better organization", "Efficient workflow"]
              }
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className={`flip-card h-62 transition-all duration-700 delay-${index * 150} hover-glow ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
              }`}
            >
              <div className="flip-card-inner relative w-full h-full transition-transform duration-700 transform-style-preserve-3d group">
                {/* Front Side - Your Original Design */}
                <div className={`flip-card-front absolute w-full h-full backface-hidden p-[3px]`} style={{ 
                  background: "var(--primary-dark)",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4), 0 6px 20px rgba(0, 0, 0, 0.3)"
                }}>
                  <div className={`p-6 rounded-[10px] h-full ${hoverEffect} hover:rotate-1 flex flex-col justify-between relative overflow-hidden`} style={{ background: "var(--card-dark)", border: "none" }}>
                    {/* 3D Grid Lighting */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/8 to-transparent"></div>
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                    <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-white/25 to-transparent"></div>
                    
                    <div className="flex-1 flex flex-col justify-center relative z-10">
                      <h3 className={`text-xl font-semibold mb-4 transition-all duration-300 hover:scale-105 ${
                        "bg-gradient-to-br from-[var(--primary-dark)] via-[var(--muted-dark)] to-[var(--accent-dark)] bg-clip-text text-transparent"
                      }`}>
                        {feature.title}
                      </h3>
                      <p className={`leading-relaxed transition-all duration-300 mb-6 ${
                        "text-[var(--text-muted)]"
                      }`}>
                        {feature.description}
                      </p>
                      
                      {/* Minimal feature preview */}
                      <div className="flex justify-center">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          "bg-gradient-to-r from-[var(--accent-dark)] to-[var(--primary-dark)] text-black"
                        }`}>
                          {feature.title.includes("Scraping") && "4 Sources"}
                          {feature.title.includes("Message") && "GPT-4 Powered"}
                          {feature.title.includes("One-Click") && "Instant Send"}
                          {feature.title.includes("Tracker") && "Smart Analytics"}
                          {feature.title.includes("CLI") && "Dual Interface"}
                          {feature.title.includes("Filters") && "Advanced Filters"}
                        </div>
                      </div>
                    </div>
                    

                  </div>
                </div>

                {/* Back Side - Detailed Information */}
                <div className={`flip-card-back absolute w-full h-full backface-hidden p-[3px] rotate-y-180`} style={{ 
                  background: "var(--primary-dark)",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4), 0 6px 20px rgba(0, 0, 0, 0.3)"
                }}>
                  <div 
                    className={`p-6 rounded-[10px] h-full relative overflow-hidden`} 
                    style={{ 
                      background: "var(--card-dark)", 
                      border: "none"
                    }}
                  >
                    {/* 3D Grid Lighting */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/8 to-transparent"></div>
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                    <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-white/25 to-transparent"></div>
                    
                                        <div className="flex flex-col justify-center h-full relative z-10">
                      <h4 className={`text-lg font-semibold mb-4 text-center ${
                        "bg-gradient-to-br from-[var(--primary-dark)] via-[var(--muted-dark)] to-[var(--accent-dark)] bg-clip-text text-transparent"
                      }`}>
                        {feature.title}
                      </h4>
                      
                      {/* Dynamic content based on feature type */}
                      {feature.backInfo.platforms && (
                        <div className="mb-3">
                          <h5 className={`text-sm font-medium mb-2 ${
                            "text-[var(--text-muted)]"
                          }`}>
                            Platforms:
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {feature.backInfo.platforms.map((platform, i) => (
                              <span key={i} className={`text-xs px-2 py-1 rounded ${
                                "bg-gradient-to-r from-[var(--accent-dark)] to-[var(--primary-dark)] text-black"
                              }`}>
                                {platform}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {feature.backInfo.features && (
                        <div className="mb-3">
                          <h5 className={`text-sm font-medium mb-2 ${
                            "text-[var(--text-muted)]"
                          }`}>
                            Features:
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {feature.backInfo.features.map((feat, i) => (
                              <span key={i} className={`text-xs px-2 py-1 rounded ${
                                "bg-gradient-to-r from-[var(--accent-dark)] to-[var(--primary-dark)] text-black"
                              }`}>
                                {feat}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {feature.backInfo.channels && (
                        <div className="mb-3">
                          <h5 className={`text-sm font-medium mb-2 ${
                            "text-[var(--text-muted)]"
                          }`}>
                            Channels:
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {feature.backInfo.channels.map((channel, i) => (
                              <span key={i} className={`text-xs px-2 py-1 rounded ${
                                "bg-gradient-to-r from-[var(--accent-dark)] to-[var(--primary-dark)] text-black"
                              }`}>
                                {channel}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {feature.backInfo.tracking && (
                        <div className="mb-3">
                          <h5 className={`text-sm font-medium mb-2 ${
                            "text-[var(--text-muted)]"
                          }`}>
                            Tracking:
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {feature.backInfo.tracking.map((track, i) => (
                              <span key={i} className={`text-xs px-2 py-1 rounded ${
                                "bg-gradient-to-r from-[var(--accent-dark)] to-[var(--primary-dark)] text-black"
                              }`}>
                                {track}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {feature.backInfo.filters && (
                        <div className="mb-3">
                          <h5 className={`text-sm font-medium mb-2 ${
                            "text-[var(--text-muted)]"
                          }`}>
                            Filters:
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {feature.backInfo.filters.map((filter, i) => (
                              <span key={i} className={`text-xs px-2 py-1 rounded ${
                                "bg-gradient-to-r from-[var(--accent-dark)] to-[var(--primary-dark)] text-black"
                              }`}>
                                {filter}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Benefits section for all cards */}
                      <div>
                        <h5 className={`text-sm font-medium mb-2 ${
                          "text-[var(--text-muted)]"
                        }`}>
                          Benefits:
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {feature.backInfo.benefits.map((benefit, i) => (
                            <span key={i} className={`text-xs px-2 py-1 rounded ${
                              "bg-green-100 text-green-800"
                            }`}>
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases Section */}
      <section className={`py-20 px-6 transition-all duration-1000 delay-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <h2 className="text-4xl font-bold text-center  text-glow mb-12 text-transparent bg-clip-text" style={{ 
          background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Perfect For Every Job Seeker
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Students & Graduates",
              description: "Land your first internship or entry-level position with targeted outreach to companies hiring new talent.",
              features: ["Entry-level job targeting", "Internship opportunities", "Career fair follow-ups"]
            },
            {
              title: "Career Changers",
              description: "Break into new industries by connecting with hiring managers and showcasing transferable skills.",
              features: ["Industry transition support", "Skill highlighting", "Networking outreach"]
            },
            {
              title: "Remote Workers",
              description: "Find remote opportunities worldwide with AI-powered lead generation across global job boards.",
              features: ["Global job search", "Remote-first companies", "Timezone optimization"]
            }
          ].map((useCase, index) => (
            <div 
              key={index} 
              className={`group p-[3px] rounded-xl transition-all duration-700 delay-${index * 200} hover-glow ${
                "bg-gradient-to-br from-[var(--accent-dark)] to-[var(--primary-dark)]"
              } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
            >
              <div className={`p-6 rounded-[10px] h-full transition-all duration-500 ease-out group-hover:bg-opacity-90`} style={{ background: "var(--card-dark)", border: borderStyle }}>
                <h3 className={`text-xl font-semibold mb-3 transition-all duration-500 ease-out group-hover:translate-x-1 ${
                  "bg-gradient-to-br from-[var(--primary-dark)] via-[var(--muted-dark)] to-[var(--accent-dark)] bg-clip-text text-transparent"
                }`}>
                  {useCase.title}
                </h3>
                <p className={`leading-relaxed mb-4 transition-all duration-500 ease-out group-hover:translate-x-1 ${
                  "text-[var(--text-muted)]"
                }`}>
                  {useCase.description}
                </p>
                <ul className="space-y-1">
                  {useCase.features.map((feature, i) => (
                    <li 
                      key={i} 
                      className={`text-sm flex items-center transition-all duration-500 ease-out delay-${i * 100} group-hover:translate-x-2 ${
                        "text-[var(--text-muted)]"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 transition-all duration-300 group-hover:scale-110`} style={{ backgroundColor: "var(--accent-dark)" }}></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className={`py-20 px-6 transition-all duration-1000 delay-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <h2 className="text-4xl font-bold mb-6 text-center  text-glow text-transparent bg-clip-text " style={{ 
          background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          How It Works
        </h2>
        <p className={`text-lg text-center mb-12 transition-all duration-700 delay-200 ${
          "text-white"
        }`}>
          Just three steps to streamline your outreach with AI.
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { title: "Select Keyword & Platform", emoji: "🔍", desc: "Choose your niche, job role, or keywords — then select API sources like RemoteOK, Arbeitnow, or Remotive." },
            { title: "AI Writes the Message", emoji: "✍️", desc: "GPT personalizes your outreach message based on job context, profile data, and your tone." },
            { title: "Send & Track Outreach", emoji: "🚀", desc: "Send messages in one click and view replies, logs, and follow-ups all in one dashboard." },
          ].map((step, i) => (
            <div 
              key={i} 
              className={`p-[3px] rounded-2xl transition-all duration-700 delay-${i * 300} hover-glow ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`} 
              style={{ background: "var(--primary-dark)" }}
            >
              <div className="p-6 rounded-xl transition-all duration-300" style={{ background: "var(--card-dark)", border: borderStyle }}>
                <h3 className={`text-xl font-semibold mb-2 ${
                  "bg-gradient-to-br from-[var(--primary-dark)] via-[var(--muted-dark)] to-[var(--accent-dark)] bg-clip-text text-transparent"
                }`}>
                  <span className="inline-block">{step.emoji}</span> {step.title}
                </h3>
                <p className={`text-[var(--text-muted)]`}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className={`py-20 px-6 transition-all duration-1000 delay-500  ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}>
        <h2 className={`text-4xl font-bold mb-10 text-center text-glow ${
          "bg-gradient-to-br from-[var(--primary-dark)] via-[var(--muted-dark)] to-[var(--accent-dark)] bg-clip-text text-transparent"
        }`}>
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {[
            { q: "What platforms are supported?", a: "RemoteOK, Arbeitnow, Remotive, and more." },
            { q: "Can I customize GPT messages?", a: "Yes, you can preview and edit before sending." },
            { q: "Is it free?", a: "Yes, there's a free tier. Pro features are coming soon." },
          ].map((faq, i) => (
            <div 
              key={i} 
              className={`rounded-xl p-6 transition-all duration-500 delay-${i * 200} hover:scale-105 hover:rotate-1 hover-glow ${hoverEffect} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`} 
              style={{ background: "var(--card-dark)", border: borderStyle }}
            >
              <h3 className={`font-semibold mb-2 transition-all duration-300 hover:scale-105 ${
                "bg-gradient-to-br from-[var(--primary-dark)] via-[var(--muted-dark)] to-[var(--accent-dark)] bg-clip-text text-transparent"
              }`}>{faq.q}</h3>
              <p className={`text-[var(--text-muted)] transition-all duration-300`}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Enhanced Newsletter Signup Section */}
      <section className={`py-20 px-6 transition-all duration-1000 delay-400 relative z-10 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className={`inline-flex items-center space-x-2 mb-6 p-2 rounded-full backdrop-blur-sm border border-white/10 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`} style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))"
          }}>
            <div className={`w-1 h-1 rounded-full ${
              "bg-[var(--accent-dark)]"
            } animate-pulse`}></div>
            <span className={`text-sm font-medium ${
              "text-[var(--text-muted-dark)]"
            }`}>
              Weekly Newsletter
            </span>
          </div>
          
          <h2 className={`text-4xl md:text-5xl font-bold mb-6`}>
            <span className={`text-transparent bg-clip-text text-glow backdrop-blur-sm`} style={{ 
              background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              A Newsletter All About
            </span>
            <br />
            <span className={`text-transparent bg-clip-text text-glow backdrop-blur-sm`} style={{ 
              background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Job Search Success
            </span>
          </h2>
          
          <p className={`text-lg md:text-xl mb-8 transition-all duration-700 delay-200 text-transparent bg-clip-text`} style={{ 
            background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Everything you need to know about AI-powered job search, exclusive tips, and remote job leads. Delivered weekly.
          </p>

          {/* Enhanced Social Proof */}
          <div className="flex items-center justify-center space-x-6 mb-8 p-4 rounded-xl backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-105" style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
          }}>
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full border transition-all duration-300 relative overflow-hidden ${
                      "border-white/20 bg-gradient-to-br from-[var(--accent-dark)] to-[var(--primary-dark)]"
                    }`}
                  ></div>
                ))}
              </div>
              <span className={`text-sm font-medium text-transparent bg-clip-text`} style={{ 
                background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                Trusted by 500+ job seekers
              </span>
            </div>
          </div>

          {/* Enhanced Newsletter Form */}
          <div className={`max-w-md mx-auto transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border focus:outline-none transition-all duration-300 hover:scale-105 focus:scale-105 focus:ring-2 focus:ring-[var(--accent-dark)] relative overflow-hidden"
                style={{ 
                  background: "rgba(42, 42, 45, 0.9)", 
                  color: "var(--text)", 
                  borderColor: "var(--border-dark)",
                  backdropFilter: "blur(10px)"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--primary-dark)";
                  e.target.style.boxShadow = "0 0 20px rgba(146, 163, 120, 0.3), 0 0 40px rgba(245, 243, 236, 0.2)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border-dark)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button 
                type="submit" 
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden group ${
                  "bg-gradient-to-r from-[var(--accent-dark)] to-[var(--primary-dark)] text-black hover:shadow-xl"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Subscribe</span>
              </button>
            </form>
            <p className={`text-xs mt-3 ${
              "text-[var(--text-muted-dark)]"
            }`}>
              No spam, unsubscribe at any time
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Pricing CTA Section */}
       <section className={`py-20 px-6 text-center transition-all duration-1000 delay-300 relative z-10 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-4xl font-bold mb-6 text-glow ${
            "bg-gradient-to-br from-[var(--primary-dark)] via-[var(--muted-dark)] to-[var(--accent-dark)] bg-clip-text text-transparent "
          }`}>
            Start Free Today
          </h2>
          <p className={`text-lg mb-8 transition-all duration-700 delay-200 ${
            "text-[var(--text-muted)]"
          }`}>
            No credit card required. Upgrade when you're ready to scale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/signup"
              className={`${buttonBaseStyle} ${buttonHoverEffect} bg-gradient-to-br ${gradient} text-black hover:scale-110 animate-pulse px-8 py-4 text-lg relative overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">Get Started Free</span>
            </Link>
            <Link
              href="/pricing"
              className={`px-8 py-4 text-lg font-medium transition-all duration-300 hover:scale-105 relative group ${
                "text-[var(--text-muted-dark)] hover:text-[var(--accent-dark)]"
              }`}
            >
              <span className="relative z-10">View All Plans →</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-dark)]/10 to-transparent opacity-0 group-hover:opacity-100 rounded transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className={`py-20 px-6 text-center transition-all duration-1000 delay-600 relative z-10 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}>
        <h2 className={`text-4xl font-bold mb-8 text-glow ${
          "bg-gradient-to-br from-[var(--primary-dark)] via-[var(--muted-dark)] to-[var(--accent-dark)] bg-clip-text text-transparent"
        }`}>
          What Our Users Say
        </h2>
        <blockquote className={`italic text-lg max-w-2xl mx-auto transition-all duration-700 delay-300 hover:scale-105 p-6 rounded-xl backdrop-blur-sm border border-white/10 ${
          "text-[var(--text-muted-dark)]"
        } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))"
        }}>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-dark)] to-transparent"></div>
          <span className="relative z-10">
            "Within days of using AI Lead Finder, I doubled my interview callbacks. It's like having a personal assistant for job hunting."
          </span>
          <footer className={`mt-4 font-semibold transition-all duration-300 hover:scale-105 relative z-10 ${
            "text-[var(--text)]"
          }`}>
            — Verified User, Marketing Analyst
          </footer>
        </blockquote>
      </section>

      <Footer />
      
      <style jsx>{`
        @keyframes pattern-float {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
    </div>
  );
}
