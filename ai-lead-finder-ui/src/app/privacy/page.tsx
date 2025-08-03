"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Link from "next/link";

export default function PrivacyPage() {
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
            Privacy Policy
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
                1. Information We Collect
              </h2>
              <p className="mb-4">We collect information you provide directly to us, such as when you:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Create an account</li>
                <li>Update your profile</li>
                <li>Use our job search features</li>
                <li>Contact our support team</li>
                <li>Subscribe to our services</li>
              </ul>
              <p className="mb-6">This may include your name, email address, LinkedIn credentials, job preferences, and other profile information.</p>

              <h2 className={`text-2xl font-bold mb-4 ${
                isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
              }`}>
                2. How We Use Your Information
              </h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Provide and maintain our services</li>
                <li>Process your job searches and generate leads</li>
                <li>Create personalized outreach messages</li>
                <li>Send you important updates about our service</li>
                <li>Improve our platform and user experience</li>
                <li>Provide customer support</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className={`text-2xl font-bold mb-4 ${
                isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
              }`}>
                3. Information Sharing
              </h2>
              <p className="mb-6">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information with:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Service providers who help us operate our platform</li>
                <li>Legal authorities when required by law</li>
                <li>Business partners with your explicit consent</li>
              </ul>

              <h2 className={`text-2xl font-bold mb-4 ${
                isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
              }`}>
                4. Data Security
              </h2>
              <p className="mb-6">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security assessments.
              </p>

              <h2 className={`text-2xl font-bold mb-4 ${
                isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
              }`}>
                5. Data Retention
              </h2>
              <p className="mb-6">
                We retain your personal information for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your account and associated data at any time.
              </p>

              <h2 className={`text-2xl font-bold mb-4 ${
                isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
              }`}>
                6. Your Rights
              </h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data</li>
                <li>Lodge a complaint with supervisory authorities</li>
              </ul>

              <h2 className={`text-2xl font-bold mb-4 ${
                isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
              }`}>
                7. Cookies and Tracking
              </h2>
              <p className="mb-6">
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie settings through your browser preferences.
              </p>

              <h2 className={`text-2xl font-bold mb-4 ${
                isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
              }`}>
                8. Third-Party Services
              </h2>
              <p className="mb-6">
                Our service may integrate with third-party platforms like LinkedIn. These services have their own privacy policies, and we encourage you to review them. We are not responsible for the privacy practices of third-party services.
              </p>

              <h2 className={`text-2xl font-bold mb-4 ${
                isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
              }`}>
                9. Children's Privacy
              </h2>
              <p className="mb-6">
                Our service is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If you believe we have collected such information, please contact us immediately.
              </p>

              <h2 className={`text-2xl font-bold mb-4 ${
                isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
              }`}>
                10. International Transfers
              </h2>
              <p className="mb-6">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this policy.
              </p>

              <h2 className={`text-2xl font-bold mb-4 ${
                isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
              }`}>
                11. Changes to This Policy
              </h2>
              <p className="mb-6">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
              </p>

              <h2 className={`text-2xl font-bold mb-4 ${
                isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
              }`}>
                12. Contact Us
              </h2>
              <p className="mb-6">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <p className="mb-2"><strong>Email:</strong> privacy@aileadfinder.com</p>
                <p className="mb-2"><strong>Address:</strong> [Your Business Address]</p>
                <p><strong>Phone:</strong> [Your Phone Number]</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link
            href="/terms"
            className="text-[var(--accent-dark)] hover:underline"
          >
            View Terms of Service
          </Link>
        </div>
      </main>
    </div>
  );
} 