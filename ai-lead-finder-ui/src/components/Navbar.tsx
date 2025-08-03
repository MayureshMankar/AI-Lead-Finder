"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface NavbarProps {
  // Removed isLight and toggleDarkMode props
}

export default function Navbar({}: NavbarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const gradient = "from-[var(--primary-dark)] via-[var(--muted-dark)] to-[var(--accent-dark)]";

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Handle scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-opacity-20 transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
      style={{ 
        borderColor: "var(--border-dark)",
        backgroundColor: isScrolled ? "rgba(14, 14, 16, 0.85)" : "rgba(14, 14, 16, 0.7)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)"
      }}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, var(--accent-dark) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, var(--primary-dark) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'pattern-float 15s linear infinite'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-4 relative z-10">
        <div className="flex justify-between items-center">
          {/* Enhanced Logo Section */}
          <div className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg animate-pulse relative overflow-hidden transition-all duration-300 group-hover:scale-110 backdrop-blur-sm" 
              style={{ 
                background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)"
              }}>
              {/* Glass effect overlays */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent"></div>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <span className="font-bold text-lg relative z-10" style={{ color: "#000000" }}>AI</span>
            </div>
            <h1 className={`text-xl font-bold transition-all duration-300 hover:scale-105 bg-clip-text text-transparent group-hover:scale-105 backdrop-blur-sm`} 
              style={{ 
                background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)"
              }}>
              Lead Finder
            </h1>
          </div>
          
          {/* Enhanced Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              href="/login"
              className="text-sm font-medium transition-all duration-300 hover:scale-105 hover:text-[var(--accent-dark)] relative group px-3 py-2 rounded-lg backdrop-blur-sm"
              style={{ 
                color: "var(--text)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-dark)]/10 to-transparent opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300 backdrop-blur-sm"></div>
              <span className="relative z-10">Login</span>
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden group backdrop-blur-sm"
              style={{ 
                background: "linear-gradient(135deg, var(--primary-dark), var(--muted-dark), var(--accent-dark))",
                color: "#000000",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"></div>
              <span className="relative z-10">Get Started</span>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pattern-float {
          0% { transform: translate(0, 0); }
          100% { transform: translate(25px, 25px); }
        }
      `}</style>
    </nav>
  );
}
