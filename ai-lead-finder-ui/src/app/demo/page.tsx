"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function DemoPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [dark, setDark] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const toggleDarkMode = () => setDark(!dark);
  const isLight = !dark;

  const gradient = isLight
    ? "from-[var(--primary-light)] via-[var(--muted-light)] to-[var(--accent-light)]"
    : "from-[var(--primary-dark)] via-[var(--muted-dark)] to-[var(--accent-dark)]";

  const borderStyle = isLight ? "1px solid #ddd" : "1px solid var(--border-dark)";
  const hoverEffect = "hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out";

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const demoSteps = [
    {
      title: "Search Jobs",
      description: "Find relevant job opportunities across multiple platforms",
      icon: "🔍",
      features: ["API Integration", "Smart Filters", "Real-time Results"]
    },
    {
      title: "AI Message Generation",
      description: "Generate personalized outreach messages using AI",
      icon: "🤖",
      features: ["Context-Aware", "Customizable Tone", "Multiple Templates"]
    },
    {
      title: "Lead Management",
      description: "Track and manage your job search leads effectively",
      icon: "📊",
      features: ["Status Tracking", "Notes & Follow-ups", "Analytics Dashboard"]
    },
    {
      title: "Analytics & Insights",
      description: "Monitor your job search performance and optimize strategy",
      icon: "📈",
      features: ["Response Rates", "Platform Performance", "Trend Analysis"]
    }
  ];

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % demoSteps.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + demoSteps.length) % demoSteps.length);
  };

  if (loading) {
    return (
              <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: isLight ? "transparent" : "black", color: "var(--text)" }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-dark)]"></div>
      </div>
    );
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
        <div className="text-center mb-12">
          <div className={`inline-flex items-center space-x-2 mb-6 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isLight ? "bg-[var(--accent-light)]" : "bg-[var(--accent-dark)]"
            } animate-pulse`}></div>
            <span className={`text-sm font-medium tracking-wide uppercase ${
              isLight ? "text-[var(--text-muted-light)]" : "text-[var(--text-muted-dark)]"
            }`}>
              Interactive Demo
            </span>
          </div>
          
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 animate-pulse leading-tight ${
            isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
          }`}>
            See AI Lead Finder
            <br />
            <span className={`text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-dark)] via-[var(--primary-dark)] to-[var(--accent-dark)]`}>
              In Action
            </span>
          </h1>
          
          <p className={`text-lg md:text-xl mb-8 transition-all duration-700 delay-200 leading-relaxed ${
            isLight ? "text-[var(--text-muted-light)]" : "text-[var(--text-muted-dark)]"
          }`}>
            Experience how our AI-powered platform transforms your job search process
          </p>
        </div>

        {/* Demo Carousel */}
        <div className={`rounded-2xl p-[2px] ${hoverEffect} mb-12`} style={{ background: isLight ? "#e6e3de" : `linear-gradient(to bottom right, var(--primary-dark), var(--muted-dark), var(--accent-dark))` }}>
          <div className="p-8 rounded-xl" style={{ background: isLight ? "#F8F4F0" : "var(--card-dark)", border: borderStyle }}>
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{demoSteps[currentStep].icon}</div>
              <h2 className={`text-3xl font-bold mb-4 ${
                isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
              }`}>
                {demoSteps[currentStep].title}
              </h2>
              <p className={`text-lg mb-6 ${
                isLight ? "text-[var(--text-muted-light)]" : "text-[var(--text-muted-dark)]"
              }`}>
                {demoSteps[currentStep].description}
              </p>
            </div>

            {/* Demo Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {demoSteps[currentStep].features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl transition-all duration-500 hover:scale-105 ${
                    isLight 
                      ? "bg-white/50 border border-white/30 shadow-lg" 
                      : "bg-black/20 border border-white/10 shadow-xl"
                  }`}
                >
                  <div className="text-2xl mb-3">✨</div>
                  <h3 className="font-semibold mb-2">{feature}</h3>
                  <p className={`text-sm ${
                    isLight ? "text-[var(--text-muted-light)]" : "text-[var(--text-muted-dark)]"
                  }`}>
                    Experience the power of AI-driven job search automation
                  </p>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={prevStep}
                className="px-6 py-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                style={{ borderColor: isLight ? "#ddd" : "var(--border-dark)" }}
              >
                ← Previous
              </button>
              
              <div className="flex space-x-2">
                {demoSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? "bg-[var(--accent-dark)]"
                        : isLight ? "bg-gray-300" : "bg-gray-600"
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-[var(--accent-dark)] text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { icon: "🚀", title: "Fast Setup", desc: "Get started in minutes" },
            { icon: "🔒", title: "Secure", desc: "Enterprise-grade security" },
            { icon: "📱", title: "Mobile Ready", desc: "Works on all devices" },
            { icon: "🔄", title: "Real-time", desc: "Live updates and sync" }
          ].map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl text-center transition-all duration-500 hover:scale-105 ${hoverEffect} ${
                isLight 
                  ? "bg-white/50 border border-white/30 shadow-lg" 
                  : "bg-black/20 border border-white/10 shadow-xl"
              }`}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className={`text-sm ${
                isLight ? "text-[var(--text-muted-light)]" : "text-[var(--text-muted-dark)]"
              }`}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className={`rounded-2xl p-[2px] ${hoverEffect}`} style={{ background: isLight ? "#e6e3de" : `linear-gradient(to bottom right, var(--primary-dark), var(--muted-dark), var(--accent-dark))` }}>
          <div className="p-8 rounded-xl text-center" style={{ background: isLight ? "#F8F4F0" : "var(--card-dark)", border: borderStyle }}>
            <h2 className={`text-3xl font-bold mb-4 ${
              isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
            }`}>
              Ready to Get Started?
            </h2>
            <p className={`text-lg mb-8 ${
              isLight ? "text-[var(--text-muted-light)]" : "text-[var(--text-muted-dark)]"
            }`}>
              Join thousands of professionals who are already using AI Lead Finder
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="px-8 py-4 bg-[var(--accent-dark)] text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="px-8 py-4 bg-[var(--accent-dark)] text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
                  >
                    Start Free Trial
                  </Link>
                  <Link
                    href="/pricing"
                    className="px-8 py-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                    style={{ borderColor: isLight ? "#ddd" : "var(--border-dark)" }}
                  >
                    View Pricing
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer dark={dark} />
    </div>
  );
} 