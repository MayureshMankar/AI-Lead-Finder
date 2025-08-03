import Link from "next/link";
import { useState, useEffect } from "react";

interface FooterProps {
  // Removed dark prop requirement
}

export default function Footer({}: FooterProps) {
  const [isVisible, setIsVisible] = useState(false);
  const gradient = "from-[var(--primary-dark)] via-[var(--muted-dark)] to-[var(--accent-dark)]";

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <footer 
      className={`border-t mt-auto relative overflow-hidden transition-all duration-1000 backdrop-blur-2xl ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ 
        borderColor: "var(--border-dark)", 
        backgroundColor: "rgba(26, 26, 29, 0.85)",
        backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)"
      }}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, var(--accent-dark) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, var(--primary-dark) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'pattern-float 20s linear infinite'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Enhanced Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6 group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden transition-all duration-300 group-hover:scale-110 backdrop-blur-lg" 
                style={{ 
                  background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)"
                }}>
                {/* Glass effect overlays */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent"></div>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                <span className="text-[var(--bg)] font-bold text-xl relative z-10">AI</span>
              </div>
              <div className="backdrop-blur-sm">
                <h3 className={`text-2xl font-bold bg-gradient-to-br ${gradient} bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105`}
                  style={{
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)"
                  }}>
                  Lead Finder
                </h3>
                <p className="text-sm transition-all duration-300" style={{ color: "var(--text-muted-dark)" }}>
                  Professional Job Automation
                </p>
              </div>
            </div>
            <p className="text-sm mb-6 leading-relaxed transition-all duration-300 backdrop-blur-sm" 
              style={{ 
                color: "var(--text-muted-dark)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)"
              }}>
              Automate your job search with AI-powered lead generation, personalized outreach, and comprehensive analytics.
            </p>
            
            {/* Enhanced Social Links */}
            <div className="flex space-x-4">
              {[
                {
                  href: "https://twitter.com/aileadfinder",
                  icon: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                },
                {
                  href: "https://linkedin.com/company/aileadfinder",
                  icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                },
                {
                  href: "https://github.com/aileadfinder",
                  icon: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 relative overflow-hidden group backdrop-blur-lg"
                  style={{ 
                    background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.08))",
                    border: "1px solid rgba(255,255,255,0.15)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)"
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-dark)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"></div>
                  <svg className="w-5 h-5 relative z-10 transition-all duration-300 group-hover:scale-110" 
                    style={{ color: "var(--accent-dark)" }} 
                    fill="currentColor" 
                    viewBox="0 0 24 24">
                    <path d={social.icon}/>
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Enhanced Product Links */}
          <div className="space-y-4 backdrop-blur-sm">
            <h4 className="font-semibold mb-6 text-lg transition-all duration-300 hover:scale-105" 
              style={{ 
                color: "var(--text)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)"
              }}>
              Product
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/pricing", label: "Pricing" },
                { href: "/help", label: "Help & Support" },
                { href: "/health", label: "System Status" },
                { href: "mailto:support@aileadfinder.com", label: "Contact Us" }
              ].map((link, index) => (
                <li key={index} className="transition-all duration-300 hover:translate-x-1">
                  <Link
                    href={link.href}
                    className="text-sm hover:text-[var(--accent-dark)] transition-all duration-300 relative group backdrop-blur-sm"
                    style={{ 
                      color: "var(--text-muted-dark)",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)"
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-dark)]/10 to-transparent opacity-0 group-hover:opacity-100 rounded transition-opacity duration-300 backdrop-blur-sm"></div>
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Enhanced Legal Links */}
          <div className="space-y-4 backdrop-blur-sm">
            <h4 className="font-semibold mb-6 text-lg transition-all duration-300 hover:scale-105" 
              style={{ 
                color: "var(--text)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)"
              }}>
              Legal
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/terms", label: "Terms of Service" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "mailto:legal@aileadfinder.com", label: "Legal Inquiries" }
              ].map((link, index) => (
                <li key={index} className="transition-all duration-300 hover:translate-x-1">
                  <Link
                    href={link.href}
                    className="text-sm hover:text-[var(--accent-dark)] transition-all duration-300 relative group backdrop-blur-sm"
                    style={{ 
                      color: "var(--text-muted-dark)",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)"
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-dark)]/10 to-transparent opacity-0 group-hover:opacity-100 rounded transition-opacity duration-300 backdrop-blur-sm"></div>
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Enhanced Bottom Bar */}
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center relative backdrop-blur-xl" 
          style={{ 
            borderColor: "var(--border-dark)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)"
          }}>
          {/* Glass effect overlay for bottom bar */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent backdrop-blur-sm"></div>
          
          <p className="text-sm transition-all duration-300 relative z-10 backdrop-blur-sm" 
            style={{ 
              color: "var(--text-muted-dark)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)"
            }}>
            © {new Date().getFullYear()} AI Lead Finder. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 relative z-10">
            {[
              { href: "https://status.aileadfinder.com", label: "Status" },
              { href: "https://docs.aileadfinder.com", label: "Documentation" },
              { href: "https://blog.aileadfinder.com", label: "Blog" }
            ].map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-[var(--accent-dark)] transition-all duration-300 relative group backdrop-blur-sm"
                style={{ 
                  color: "var(--text-muted-dark)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-dark)]/10 to-transparent opacity-0 group-hover:opacity-100 rounded transition-opacity duration-300 backdrop-blur-sm"></div>
                <span className="relative z-10">{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pattern-float {
          0% { transform: translate(0, 0); }
          100% { transform: translate(30px, 30px); }
        }
      `}</style>
    </footer>
  );
} 