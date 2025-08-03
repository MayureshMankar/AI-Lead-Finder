"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function HelpPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [dark, setDark] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleDarkMode = () => setDark(!dark);
  const isLight = !dark;

  const gradient = isLight
    ? "from-[var(--primary-light)] via-[var(--muted-light)] to-[var(--accent-light)]"
    : "from-[var(--primary-dark)] via-[var(--muted-dark)] to-[var(--accent-dark)]";

  const borderStyle = isLight ? "1px solid #ddd" : "1px solid var(--border-dark)";
  const hoverEffect = "hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out";

  const faqs: FAQItem[] = [
    {
      question: "How does AI Lead Finder work?",
      answer: "AI Lead Finder automates your job search by scraping job listings from reliable API sources (RemoteOK, Arbeitnow, Remotive), generating personalized outreach messages using AI, and helping you track your leads and responses. It saves you hours of manual work and increases your chances of getting responses.",
      category: "general"
    },
    {
      question: "Which job platforms are supported?",
      answer: "Currently, we support job scraping from reliable API sources including RemoteOK, Arbeitnow, and Remotive. These platforms provide comprehensive and up-to-date job listings for professional positions. We're working on adding more platforms in the future.",
      category: "platforms"
    },
    {
      question: "How do I set up my credentials?",
answer: "Currently, no additional credentials are needed. The system uses reliable API sources that don't require authentication. Simply start searching for jobs directly from the dashboard.",
      category: "setup"
    },
    {
      question: "How does the AI message generation work?",
      answer: "Our AI analyzes the job description, your profile information, and generates personalized outreach messages that highlight your relevant skills and experience. You can customize the tone and content before sending.",
      category: "ai"
    },
    {
      question: "Can I customize the outreach messages?",
      answer: "Yes! You can edit the AI-generated messages or write your own from scratch. You can also save message templates for future use and customize them for different types of positions.",
      category: "features"
    },
    {
      question: "How do I track my leads?",
      answer: "All your saved leads are automatically tracked in the Leads section. You can update their status (new, contacted, active, pending), add notes, and monitor your response rates.",
      category: "features"
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take security seriously. All data is encrypted, we use JWT authentication, and we never store sensitive credentials. Your personal information is protected.",
      category: "security"
    },
    {
      question: "What if I don't get responses?",
      answer: "Response rates vary, but typically range from 10-30%. To improve your chances, personalize your messages, follow up appropriately, and target positions that match your skills well.",
      category: "tips"
    },
    {
      question: "How many jobs can I scrape at once?",
      answer: "You can scrape up to 50 jobs per search to avoid overwhelming the platforms. We recommend starting with 10-20 jobs and gradually increasing based on your needs.",
      category: "limits"
    },
    {
      question: "Can I export my leads?",
      answer: "Yes, you can export your leads as CSV files for external tracking or backup purposes. This feature is available in the Leads section.",
      category: "features"
    },
    {
      question: "What's the difference between Search and Scrape?",
      answer: "Search Jobs uses our unified search to find jobs across platforms. Scrape & Outreach is for bulk operations where you can scrape multiple jobs and send outreach campaigns.",
      category: "features"
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can manage your subscription in the Billing section. You can upgrade, downgrade, or cancel your plan at any time. Changes take effect at the end of your current billing period.",
      category: "billing"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'general', name: 'General' },
    { id: 'setup', name: 'Setup & Configuration' },
    { id: 'features', name: 'Features' },
    { id: 'ai', name: 'AI & Automation' },
    { id: 'platforms', name: 'Job Platforms' },
    { id: 'security', name: 'Security & Privacy' },
    { id: 'billing', name: 'Billing & Subscriptions' },
    { id: 'tips', name: 'Tips & Best Practices' },
    { id: 'limits', name: 'Limits & Restrictions' }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${
            isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
          }`}>
            Help & Support
          </h1>
          <p className="text-lg" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
            Find answers to common questions and get help with AI Lead Finder.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`p-[3px] rounded-xl ${hoverEffect}`} style={{ background: isLight ? "#f0e8e0" : `linear-gradient(to bottom right, var(--primary-dark), var(--muted-dark), var(--accent-dark))` }}>
            <div className="p-6 rounded-[10px]" style={{ background: isLight ? "#F8F4F0" : "var(--card-dark)", border: borderStyle }}>
              <div className="text-center">
                <div className="text-3xl mb-2">📚</div>
                <h3 className="font-semibold mb-2">Documentation</h3>
                <p className="text-sm mb-4" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                  Detailed guides and tutorials
                </p>
                <Link
                  href="/docs"
                  className="text-sm px-4 py-2 rounded-lg bg-[var(--accent-dark)] text-white hover:bg-opacity-90 transition-colors"
                >
                  View Docs
                </Link>
              </div>
            </div>
          </div>

          <div className={`p-[3px] rounded-xl ${hoverEffect}`} style={{ background: isLight ? "#f0e8e0" : `linear-gradient(to bottom right, var(--primary-dark), var(--muted-dark), var(--accent-dark))` }}>
            <div className="p-6 rounded-[10px]" style={{ background: isLight ? "#F8F4F0" : "var(--card-dark)", border: borderStyle }}>
              <div className="text-center">
                <div className="text-3xl mb-2">💬</div>
                <h3 className="font-semibold mb-2">Contact Support</h3>
                <p className="text-sm mb-4" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                  Get help from our team
                </p>
                <a
                  href="mailto:support@aileadfinder.com"
                  className="text-sm px-4 py-2 rounded-lg bg-[var(--accent-dark)] text-white hover:bg-opacity-90 transition-colors"
                >
                  Email Support
                </a>
              </div>
            </div>
          </div>

          <div className={`p-[3px] rounded-xl ${hoverEffect}`} style={{ background: isLight ? "#f0e8e0" : `linear-gradient(to bottom right, var(--primary-dark), var(--muted-dark), var(--accent-dark))` }}>
            <div className="p-6 rounded-[10px]" style={{ background: isLight ? "#F8F4F0" : "var(--card-dark)", border: borderStyle }}>
              <div className="text-center">
                <div className="text-3xl mb-2">🎥</div>
                <h3 className="font-semibold mb-2">Video Tutorials</h3>
                <p className="text-sm mb-4" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                  Step-by-step video guides
                </p>
                <a
                  href="https://youtube.com/aileadfinder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm px-4 py-2 rounded-lg bg-[var(--accent-dark)] text-white hover:bg-opacity-90 transition-colors"
                >
                  Watch Videos
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)] transition-all duration-300"
                style={{ background: isLight ? "#ffffff" : "var(--input-dark)", color: "var(--text)", borderColor: isLight ? "#ccc" : "var(--border-dark)" }}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    activeCategory === category.id
                      ? "bg-[var(--accent-dark)] text-white"
                      : "border hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  style={{ borderColor: isLight ? "#ddd" : "var(--border-dark)" }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-4">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index) => (
              <div key={index} className={`rounded-xl p-[2px] ${hoverEffect}`} style={{ background: isLight ? "#e6e3de" : `linear-gradient(to bottom right, var(--primary-dark), var(--muted-dark), var(--accent-dark))` }}>
                <div className="p-6 rounded-xl" style={{ background: isLight ? "#F8F4F0" : "var(--card-dark)", border: borderStyle }}>
                  <h3 className={`text-lg font-semibold mb-3 ${
                    isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
                  }`}>
                    {faq.question}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                    {faq.answer}
                  </p>
                  <div className="mt-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {categories.find(c => c.id === faq.category)?.name}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-lg" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                No questions found matching your search.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-4 px-4 py-2 rounded-lg bg-[var(--accent-dark)] text-white hover:bg-opacity-90 transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* Still Need Help */}
        <div className={`mt-12 rounded-2xl p-[2px] ${hoverEffect}`} style={{ background: isLight ? "#e6e3de" : `linear-gradient(to bottom right, var(--primary-dark), var(--muted-dark), var(--accent-dark))` }}>
          <div className="p-8 rounded-xl text-center" style={{ background: isLight ? "#F8F4F0" : "var(--card-dark)", border: borderStyle }}>
            <h2 className={`text-2xl font-bold mb-4 ${
              isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
            }`}>
              Still Need Help?
            </h2>
            <p className="text-lg mb-6" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@aileadfinder.com"
                className="px-6 py-3 rounded-lg bg-[var(--accent-dark)] text-white hover:bg-opacity-90 transition-colors font-medium"
              >
                Email Support
              </a>
              <a
                href="https://discord.gg/aileadfinder"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                style={{ borderColor: isLight ? "#ddd" : "var(--border-dark)" }}
              >
                Join Discord
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 