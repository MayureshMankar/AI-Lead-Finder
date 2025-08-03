"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function ContactPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [dark, setDark] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    inquiryType: "sales"
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleDarkMode = () => setDark(!dark);
  const isLight = !dark;

  const gradient = isLight
    ? "from-[var(--primary-light)] via-[var(--muted-light)] to-[var(--accent-light)]"
    : "from-[var(--primary-dark)] via-[var(--muted-dark)] to-[var(--accent-dark)]";

  const borderStyle = isLight ? "1px solid #ddd" : "1px solid var(--border-dark)";
  const hoverEffect = "hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true);
      setSubmitting(false);
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${
            isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
          }`}>
            Contact Us
          </h1>
          <p className="text-lg" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
            Get in touch with our team for sales inquiries, support, or partnerships.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className={`rounded-2xl p-[2px] ${hoverEffect}`} style={{ background: isLight ? "#e6e3de" : `linear-gradient(to bottom right, var(--primary-dark), var(--muted-dark), var(--accent-dark))` }}>
            <div className="p-8 rounded-xl" style={{ background: isLight ? "#F8F4F0" : "var(--card-dark)", border: borderStyle }}>
              {!submitted ? (
                <>
                  <h2 className={`text-2xl font-semibold mb-6 ${
                    isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
                  }`}>
                    Send us a Message
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)] transition-all duration-300"
                          style={{ background: isLight ? "#ffffff" : "var(--input-dark)", color: "var(--text)", borderColor: isLight ? "#ccc" : "var(--border-dark)" }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)] transition-all duration-300"
                          style={{ background: isLight ? "#ffffff" : "var(--input-dark)", color: "var(--text)", borderColor: isLight ? "#ccc" : "var(--border-dark)" }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Company</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)] transition-all duration-300"
                        style={{ background: isLight ? "#ffffff" : "var(--input-dark)", color: "var(--text)", borderColor: isLight ? "#ccc" : "var(--border-dark)" }}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Inquiry Type</label>
                      <select
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)] transition-all duration-300"
                        style={{ background: isLight ? "#ffffff" : "var(--input-dark)", color: "var(--text)", borderColor: isLight ? "#ccc" : "var(--border-dark)" }}
                      >
                        <option value="sales">Sales Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="partnership">Partnership</option>
                        <option value="general">General Question</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Message *</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)] transition-all duration-300"
                        style={{ background: isLight ? "#ffffff" : "var(--input-dark)", color: "var(--text)", borderColor: isLight ? "#ccc" : "var(--border-dark)" }}
                        placeholder="Tell us about your needs..."
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full px-6 py-3 bg-[var(--accent-dark)] text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium disabled:opacity-50"
                    >
                      {submitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className={`text-2xl font-semibold mb-4 ${
                    isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
                  }`}>
                    Message Sent!
                  </h3>
                  <p className="text-lg mb-6" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", company: "", message: "", inquiryType: "sales" });
                    }}
                    className="px-6 py-3 bg-[var(--accent-dark)] text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
                  >
                    Send Another Message
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <div className={`rounded-2xl p-[2px] ${hoverEffect}`} style={{ background: isLight ? "#e6e3de" : `linear-gradient(to bottom right, var(--primary-dark), var(--muted-dark), var(--accent-dark))` }}>
              <div className="p-6 rounded-xl" style={{ background: isLight ? "#F8F4F0" : "var(--card-dark)", border: borderStyle }}>
                <h2 className={`text-xl font-semibold mb-4 ${
                  isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
                }`}>
                  Quick Contact
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📧</span>
                    <div>
                      <div className="font-medium">Email</div>
                      <a
                        href="mailto:sales@aileadfinder.com"
                        className="text-[var(--accent-dark)] hover:underline"
                      >
                        sales@aileadfinder.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📞</span>
                    <div>
                      <div className="font-medium">Phone</div>
                      <a
                        href="tel:+1-555-123-4567"
                        className="text-[var(--accent-dark)] hover:underline"
                      >
                        +1 (555) 123-4567
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">💬</span>
                    <div>
                      <div className="font-medium">Live Chat</div>
                      <span className="text-green-600 dark:text-green-400">Available 24/7</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Times */}
            <div className={`rounded-2xl p-[2px] ${hoverEffect}`} style={{ background: isLight ? "#e6e3de" : `linear-gradient(to bottom right, var(--primary-dark), var(--muted-dark), var(--accent-dark))` }}>
              <div className="p-6 rounded-xl" style={{ background: isLight ? "#F8F4F0" : "var(--card-dark)", border: borderStyle }}>
                <h2 className={`text-xl font-semibold mb-4 ${
                  isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
                }`}>
                  Response Times
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Sales Inquiries</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">2-4 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Technical Support</span>
                    <span className="text-yellow-600 dark:text-yellow-400 font-medium">24 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>General Questions</span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">24-48 hours</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Hours */}
            <div className={`rounded-2xl p-[2px] ${hoverEffect}`} style={{ background: isLight ? "#e6e3de" : `linear-gradient(to bottom right, var(--primary-dark), var(--muted-dark), var(--accent-dark))` }}>
              <div className="p-6 rounded-xl" style={{ background: isLight ? "#F8F4F0" : "var(--card-dark)", border: borderStyle }}>
                <h2 className={`text-xl font-semibold mb-4 ${
                  isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
                }`}>
                  Office Hours
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alternative Contact */}
            <div className={`rounded-2xl p-[2px] ${hoverEffect}`} style={{ background: isLight ? "#e6e3de" : `linear-gradient(to bottom right, var(--primary-dark), var(--muted-dark), var(--accent-dark))` }}>
              <div className="p-6 rounded-xl" style={{ background: isLight ? "#F8F4F0" : "var(--card-dark)", border: borderStyle }}>
                <h2 className={`text-xl font-semibold mb-4 ${
                  isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
                }`}>
                  Need Help?
                </h2>
                <div className="space-y-3">
                  <Link
                    href="/help"
                    className="block w-full px-4 py-3 bg-[var(--accent-dark)] text-white rounded-lg hover:bg-opacity-90 transition-colors text-center font-medium"
                  >
                    📚 Help Center
                  </Link>
                  <a
                    href="https://discord.gg/aileadfinder"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-4 py-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center font-medium"
                    style={{ borderColor: isLight ? "#ddd" : "var(--border-dark)" }}
                  >
                    💬 Join Discord
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer dark={dark} />
    </div>
  );
} 