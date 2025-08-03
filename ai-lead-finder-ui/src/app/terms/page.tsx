"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Link from "next/link";

export default function TermsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [dark, setDark] = useState(true);

  const toggleDarkMode = () => setDark(!dark);
  const isLight = !dark;

  const gradient = isLight
    ? "from-[var(--primary-light)] via-[var(--muted-light)] to-[var(--accent-light)]"
    : "from-[var(--primary-dark)] via-[var(--muted-dark)] to-[var(--accent-dark)]";

  const borderStyle = isLight ? "1px solid #ddd" : "1px solid var(--border-dark)";
  const hoverEffect = "hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out";

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

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${
            isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
          }`}>
            Terms of Service
          </h1>
          <p className="text-lg" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className={`rounded-2xl p-[2px] ${hoverEffect}`} style={{ background: isLight ? "#e6e3de" : `linear-gradient(to bottom right, var(--primary-dark), var(--muted-dark), var(--accent-dark))` }}>
          <div className="p-8 rounded-xl" style={{ background: isLight ? "#F8F4F0" : "var(--card-dark)", border: borderStyle }}>
            <div className="prose prose-lg max-w-none" style={{ color: "var(--text)" }}>
              <h2 className={`text-2xl font-bold mb-4 ${
                isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
              }`}>
                1. Acceptance of Terms
              </h2>
              <p className="mb-6">
                By accessing and using AI Lead Finder ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>

              <h2 className={`text-2xl font-bold mb-4 ${
                isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
              }`}>
                2. Description of Service
              </h2>
              <p className="mb-6">
                AI Lead Finder is a job search automation platform that helps users find job opportunities, generate personalized outreach messages, and manage their job search process. The service includes web scraping, AI-powered message generation, and lead management features.
              </p>

              <h2 className={`text-2xl font-bold mb-4 ${
                isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
              }`}>
                3. User Accounts
              </h2>
              <p className="mb-6">
                You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account or password. You must be at least 18 years old to use this service.
              </p>

              <h2 className={`text-2xl font-bold mb-4 ${
                isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
              }`}>
                4. Acceptable Use
              </h2>
              <p className="mb-6">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Send spam or unsolicited messages</li>
                <li>Attempt to gain unauthorized access to the Service</li>
                <li>Use the Service for any commercial purpose without authorization</li>
                <li>Scrape or collect data in violation of platform terms of service</li>
              </ul>

              <h2 className={`text-2xl font-bold mb-4 ${
                isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
              }`}>
                5. Privacy and Data
              </h2>
              <p className="mb-6">
                Your privacy is important to us. Please review our <Link href="/privacy" className="text-[var(--accent-dark)] hover:underline">Privacy Policy</Link>, which also governs your use of the Service, to understand our practices regarding the collection and use of your information.
              </p>

              <h2 className={`text-2xl font-bold mb-4 ${
                isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
              }`}>
                6. Subscription and Billing
              </h2>
              <p className="mb-6">
                The Service offers both free and premium subscription plans. Premium features require a paid subscription. All fees are non-refundable except as required by law. We reserve the right to change our pricing with 30 days notice.
              </p>

              <h2 className={`text-2xl font-bold mb-4 ${
                isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
              }`}>
                7. Intellectual Property
              </h2>
              <p className="mb-6">
                The Service and its original content, features, and functionality are and will remain the exclusive property of AI Lead Finder and its licensors. The Service is protected by copyright, trademark, and other laws.
              </p>

              <h2 className={`text-2xl font-bold mb-4 ${
                isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
              }`}>
                8. Disclaimers
              </h2>
              <p className="mb-6">
                The Service is provided "as is" without warranties of any kind. We do not guarantee the accuracy, completeness, or usefulness of any information provided. Job search results and response rates may vary.
              </p>

              <h2 className={`text-2xl font-bold mb-4 ${
                isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
              }`}>
                9. Limitation of Liability
              </h2>
              <p className="mb-6">
                In no event shall AI Lead Finder be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>

              <h2 className={`text-2xl font-bold mb-4 ${
                isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
              }`}>
                10. Termination
              </h2>
              <p className="mb-6">
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation.
              </p>

              <h2 className={`text-2xl font-bold mb-4 ${
                isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
              }`}>
                11. Changes to Terms
              </h2>
              <p className="mb-6">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
              </p>

              <h2 className={`text-2xl font-bold mb-4 ${
                isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
              }`}>
                12. Contact Information
              </h2>
              <p className="mb-6">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <p className="mb-2"><strong>Email:</strong> legal@aileadfinder.com</p>
                <p className="mb-2"><strong>Address:</strong> [Your Business Address]</p>
                <p><strong>Phone:</strong> [Your Phone Number]</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link
            href="/privacy"
            className="text-[var(--accent-dark)] hover:underline"
          >
            View Privacy Policy
          </Link>
        </div>
      </main>
    </div>
  );
} 