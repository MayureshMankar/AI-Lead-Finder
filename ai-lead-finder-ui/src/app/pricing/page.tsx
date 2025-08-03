"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function PricingPage() {
  const [isLight, setIsLight] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly');

  const gradient = "from-[var(--primary-dark)] via-[var(--muted-dark)] to-[var(--accent-dark)]";
  const hoverEffect = "hover:shadow-2xl hover:shadow-[var(--accent-dark)]/10";
  const buttonBaseStyle = "inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform";
  const buttonHoverEffect = "hover:scale-105 hover:rotate-1";

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleDarkMode = () => setIsLight(!isLight);

  interface PricingPlan {
    name: string;
    price: { [key: string]: number | string };
    description: string;
    badge: string;
    badgeColor: string;
    features: { text: string; included: boolean }[];
    cta: string;
    ctaLink: string;
    popular: boolean;
    disabled?: boolean;
  }

  const pricingPlans: PricingPlan[] = [
    {
      name: "Starter",
      price: { monthly: 0, yearly: 0 },
      description: "Perfect for getting started with AI-powered job search",
      badge: "Free Forever",
      badgeColor: "bg-gradient-to-r from-[var(--accent-dark)] to-[var(--primary-dark)] text-black",
      features: [
        { text: "10 GPT Messages Per Day", included: true },
        { text: "API Job Scraping (RemoteOK, Arbeitnow, Remotive)", included: true },
        { text: "Basic Lead Tracking", included: true },
        { text: "Email Support", included: true },
        { text: "Advanced Analytics", included: false },
        { text: "Unlimited Messages", included: false },
        { text: "Priority Support", included: false },
        { text: "Custom Templates", included: false }
      ],
      cta: "Start for Free",
      ctaLink: "/signup",
      popular: false
    },
    {
      name: "Pro",
      price: { monthly: 29, yearly: 23 },
      description: "For serious job seekers who want to scale their outreach",
      badge: "Most Popular",
      badgeColor: "bg-gradient-to-r from-yellow-400 to-orange-500 text-black",
      features: [
        { text: "Unlimited GPT Messages", included: true },
        { text: "All Platform Scraping", included: true },
        { text: "Advanced Lead Tracking", included: true },
        { text: "Priority Support", included: true },
        { text: "Analytics Dashboard", included: true },
        { text: "AI Resume Matching", included: true },
        { text: "Custom Templates", included: true },
        { text: "API Access", included: true }
      ],
      cta: "Coming Soon",
      ctaLink: "#",
      popular: true,
      disabled: true
    },
    {
      name: "Business",
      price: { monthly: 79, yearly: 63 },
      description: "For professionals and small teams managing multiple campaigns",
      badge: "Business",
      badgeColor: "bg-gradient-to-r from-blue-400 to-purple-500 text-white",
      features: [
        { text: "Everything in Pro", included: true },
        { text: "Team Collaboration", included: true },
        { text: "Advanced Analytics", included: true },
        { text: "Custom Integrations", included: true },
        { text: "Priority Support", included: true },
        { text: "White-label Options", included: true },
        { text: "Advanced Reporting", included: true },
        { text: "Dedicated Account Manager", included: false }
      ],
      cta: "Contact Sales",
      ctaLink: "/contact",
      popular: false
    },
    {
      name: "Enterprise",
      price: { monthly: "Custom" as string, yearly: "Custom" as string },
      description: "For teams and agencies managing multiple job searches",
      badge: "Enterprise",
      badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
      features: [
        { text: "Everything in Business", included: true },
        { text: "Unlimited Team Members", included: true },
        { text: "Custom Integrations", included: true },
        { text: "Dedicated Support", included: true },
        { text: "White-label Options", included: true },
        { text: "SLA Guarantee", included: true },
        { text: "Custom Training", included: true },
        { text: "On-premise Deployment", included: true }
      ],
      cta: "Contact Sales",
      ctaLink: "/contact",
      popular: false
    }
  ];

  return (
    <div className={`min-h-screen transition-all duration-1000 ${
      isLight ? "bg-[var(--bg-light)]" : "bg-black"
    }`}>
      <Navbar isLight={isLight} toggleDarkMode={toggleDarkMode} />
      
      {/* Hero Section - Fits Screen */}
      <section className={`h-screen flex items-center justify-center px-6 transition-all duration-1000 delay-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className={`inline-flex items-center space-x-2 mb-6 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isLight ? "bg-[var(--accent-light)]" : "bg-[var(--accent-dark)]"
            } animate-pulse`}></div>
            <span className={`text-sm font-medium tracking-wide uppercase ${
              isLight ? "text-[var(--text-muted-light)]" : "text-[var(--text-muted-dark)]"
            }`}>
              Premium Pricing
            </span>
          </div>
          
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 animate-pulse leading-tight ${
            isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
          }`}>
            Choose Your
            <br />
            <span className={`text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-dark)] via-[var(--primary-dark)] to-[var(--accent-dark)]`}>
              Growth Plan
            </span>
          </h1>
          
          <p className={`text-lg md:text-xl mb-8 transition-all duration-700 delay-200 leading-relaxed ${
            isLight ? "text-[var(--text-muted-light)]" : "text-[var(--text-muted-dark)]"
          }`}>
            Start free and scale as you grow. No hidden fees, no surprises.
          </p>

          {/* Premium Pricing Toggle */}
          <div className={`inline-flex items-center p-2 rounded-2xl backdrop-blur-xl ${
            isLight 
              ? "bg-white/20 border border-white/30 shadow-xl" 
              : "bg-black/20 border border-white/10 shadow-2xl"
          }`}>
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-500 ${
                billingCycle === 'monthly'
                  ? (isLight 
                      ? "bg-white text-[var(--text)] shadow-lg transform scale-105" 
                      : "bg-gradient-to-r from-[var(--accent-dark)] to-[var(--primary-dark)] text-black shadow-lg transform scale-105")
                  : (isLight 
                      ? "text-[var(--text-muted-light)] hover:text-[var(--text)] hover:bg-white/10" 
                      : "text-[var(--text-muted-dark)] hover:text-[var(--text)] hover:bg-white/10")
              }`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-500 ${
                billingCycle === 'yearly'
                  ? (isLight 
                      ? "bg-white text-[var(--text)] shadow-lg transform scale-105" 
                      : "bg-gradient-to-r from-[var(--accent-dark)] to-[var(--primary-dark)] text-black shadow-lg transform scale-105")
                  : (isLight 
                      ? "text-[var(--text-muted-light)] hover:text-[var(--text)] hover:bg-white/10" 
                      : "text-[var(--text-muted-dark)] hover:text-[var(--text)] hover:bg-white/10")
              }`}
            >
              Yearly
              <span className={`ml-2 px-3 py-1 text-xs rounded-full font-bold ${
                isLight ? "bg-green-500 text-white" : "bg-green-400 text-black"
              }`}>
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards Section - Fits Screen */}
      <section className={`min-h-screen flex items-center justify-center py-16 px-6 transition-all duration-1000 delay-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index}
              className={`group relative transition-all duration-700 delay-${(index + 3) * 100} hover:scale-102 hover:-translate-y-2 h-full ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`} 
            >
              {/* Subtle Background Effects */}
              <div className="absolute inset-0 rounded-[24px] opacity-15 group-hover:opacity-25 transition-all duration-700"
                style={{
                  background: plan.popular
                    ? "conic-gradient(from 0deg at 50% 50%, #fbbf24 0deg, #f59e0b 120deg, #d97706 240deg, #fbbf24 360deg)"
                    : "conic-gradient(from 0deg at 50% 50%, var(--primary-dark) 0deg, var(--muted-dark) 120deg, var(--accent-dark) 240deg, var(--primary-dark) 360deg)",
                  transform: "translateZ(-20px) rotateX(10deg)",
                  filter: "blur(15px)",
                }}
              ></div>
              
              <div className="absolute inset-0 rounded-[24px] opacity-10 group-hover:opacity-20 transition-all duration-700"
                style={{
                  background: plan.popular
                    ? "radial-gradient(circle at 30% 20%, #fbbf24 0%, transparent 50%), radial-gradient(circle at 70% 80%, #f59e0b 0%, transparent 50%)"
                    : "radial-gradient(circle at 30% 20%, var(--primary-dark) 0%, transparent 50%), radial-gradient(circle at 70% 80%, var(--accent-dark) 0%, transparent 50%)",
                  transform: "translateZ(-15px) rotateY(-3deg)",
                }}
              ></div>

              {/* Main Card Container */}
              <div 
                className={`relative rounded-[24px] p-[1px] transition-all duration-700 group-hover:shadow-xl h-full flex flex-col min-h-[600px] ${
                  plan.popular ? 'shadow-xl' : 'shadow-lg'
                }`}
                style={{
                  background: plan.popular
                    ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 25%, #d97706 50%, #f59e0b 75%, #fbbf24 100%)"
                    : "linear-gradient(135deg, var(--primary-dark) 0%, var(--muted-dark) 25%, var(--accent-dark) 50%, var(--muted-dark) 75%, var(--primary-dark) 100%)",
                  boxShadow: plan.popular
                    ? (isLight
                        ? "0 20px 40px -8px rgba(251, 191, 36, 0.3), 0 0 0 1px rgba(251, 191, 36, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                        : "0 20px 40px -8px rgba(251, 191, 36, 0.4), 0 0 0 1px rgba(251, 191, 36, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)")
                    : (isLight
                        ? "0 15px 30px -8px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
                        : "0 15px 30px -8px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.03)"),
                }}
              >
                {/* Premium Badge */}
                {plan.popular && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-30">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full blur-md opacity-30"
                        style={{
                          background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)",
                        }}
                      ></div>
                      <span className={`relative px-6 py-2 rounded-full text-sm font-bold shadow-lg ${plan.badgeColor} backdrop-blur-xl`}>
                        {plan.badge}
                      </span>
                    </div>
                  </div>
                )}
                {!plan.popular && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-30">
                    <span className={`px-4 py-1 rounded-full text-xs font-medium shadow-md ${plan.badgeColor} backdrop-blur-xl`}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Innovative Glassmorphism Content */}
                <div
                  className="rounded-[23px] p-6 h-full relative overflow-hidden flex flex-col justify-between"
                  style={{
                    background: plan.popular 
                      ? (isLight 
                          ? "rgba(255, 255, 255, 0.98)" 
                          : "rgba(26, 26, 29, 0.98)")
                      : (isLight 
                          ? "rgba(255, 255, 255, 0.95)" 
                          : "rgba(26, 26, 29, 0.95)"),
                    backdropFilter: "blur(20px)",
                    border: plan.popular
                      ? (isLight 
                          ? "1px solid rgba(255, 255, 255, 0.4)" 
                          : "1px solid rgba(251, 191, 36, 0.3)")
                      : (isLight 
                          ? "1px solid rgba(255, 255, 255, 0.2)" 
                          : "1px solid rgba(255, 255, 255, 0.1)"),
                  }}
                >
                  {/* Subtle Background Pattern */}
                  <div className="absolute inset-0 opacity-5 group-hover:opacity-8 transition-all duration-700">
                    <div className="absolute top-4 right-4 w-12 h-12 rounded-full animate-pulse" 
                      style={{ 
                        background: isLight ? "var(--accent-light)" : "var(--accent-dark)",
                        animation: "pulse 4s infinite"
                      }}></div>
                    <div className="absolute bottom-6 left-6 w-8 h-8 rounded-full animate-pulse delay-1000" 
                      style={{ 
                        background: isLight ? "var(--primary-light)" : "var(--primary-dark)",
                        animation: "pulse 4s infinite 1s"
                      }}></div>
                    <div className="absolute top-1/2 right-6 w-4 h-4 rounded-full animate-pulse delay-2000" 
                      style={{ 
                        background: isLight ? "var(--muted-light)" : "var(--muted-dark)",
                        animation: "pulse 4s infinite 2s"
                      }}></div>
                    <div className="absolute bottom-1/2 left-8 w-3 h-3 rounded-full animate-pulse delay-1500" 
                      style={{ 
                        background: isLight ? "var(--accent-light)" : "var(--accent-dark)",
                        animation: "pulse 4s infinite 1.5s"
                      }}></div>
                  </div>

                  {/* Innovative Content Layout */}
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Header Section */}
                    <div className="text-center mb-6">
                      <h3 className={`text-2xl font-bold mb-3 transition-all duration-500 group-hover:scale-105 ${
                        isLight ? "text-[var(--text)]" : "text-[var(--text)]"
                      }`}>
                        {plan.name}
                      </h3>
                      
                      {/* Innovative Pricing Display */}
                      <div className="mb-4 relative">
                        <div className={`text-4xl font-black ${
                          isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
                        }`}>
                          {typeof plan.price[billingCycle] === 'number' ? `$${plan.price[billingCycle]}` : plan.price[billingCycle]}
                        </div>
                        {typeof plan.price[billingCycle] === 'number' && (
                          <div className={`text-base font-medium ${
                            isLight ? "text-[var(--text-muted-light)]" : "text-[var(--text-muted-dark)]"
                          }`}>
                            /month
                          </div>
                        )}
                        {/* Subtle Price Indicator */}
                        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-ping"
                          style={{
                            background: plan.popular ? "#fbbf24" : "var(--accent-dark)",
                            animation: "ping 3s infinite"
                          }}
                        ></div>
                      </div>
                      
                      <p className={`text-sm mb-6 leading-relaxed ${
                        isLight ? "text-[var(--text-muted-light)]" : "text-[var(--text-muted-dark)]"
                      }`}>
                        {plan.description}
                      </p>
                    </div>

                    {/* Innovative Feature List */}
                    <div className="space-y-3 mb-8 flex-1 min-h-0">
                      {plan.features.map((item, i) => (
                        <div 
                          key={i} 
                          className={`group/item flex items-center space-x-3 p-2 rounded-lg transition-all duration-500 delay-${i * 100} hover:translate-x-1 hover:bg-white/3 ${
                            item.included ? 'opacity-100' : 'opacity-60'
                          }`}
                        >
                          {/* Innovative Check Icon */}
                          <div className={`relative w-5 h-5 rounded-full flex items-center justify-center shadow-md transition-all duration-300 group-hover/item:scale-105 ${
                            item.included 
                              ? (isLight ? "bg-gradient-to-r from-green-500 to-emerald-500" : "bg-gradient-to-r from-green-400 to-emerald-400")
                              : (isLight ? "bg-gradient-to-r from-gray-300 to-gray-400" : "bg-gradient-to-r from-gray-600 to-gray-700")
                          }`}>
                            {item.included ? (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            )}
                            {/* Subtle Glow Effect */}
                            <div className={`absolute inset-0 rounded-full blur-sm opacity-30 ${
                              item.included 
                                ? (isLight ? "bg-green-500" : "bg-green-400")
                                : (isLight ? "bg-gray-300" : "bg-gray-600")
                            }`}></div>
                          </div>
                          <span className={`text-sm font-medium ${
                            item.included 
                              ? (isLight ? "text-[var(--text)]" : "text-[var(--text)]")
                              : (isLight ? "text-[var(--text-muted-light)]" : "text-[var(--text-muted-dark)]")
                          }`}>
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Innovative CTA Button */}
                    <div className="relative">
                      {plan.disabled ? (
                        <button
                          disabled
                          className={`w-full py-3 px-6 rounded-xl font-bold text-base transition-all duration-300 opacity-50 cursor-not-allowed relative overflow-hidden ${
                            isLight 
                              ? "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600" 
                              : "bg-gradient-to-r from-gray-600 to-gray-700 text-gray-400"
                          }`}
                        >
                          <span className="relative z-10">{plan.cta}</span>
                        </button>
                      ) : (
                        <Link
                          href={plan.ctaLink}
                          className={`group/btn w-full py-3 px-6 rounded-xl font-bold text-base transition-all duration-500 relative overflow-hidden ${
                            plan.popular
                              ? "bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 text-black shadow-lg hover:shadow-yellow-400/20"
                              : `bg-gradient-to-r ${gradient} text-black shadow-md hover:shadow-[var(--accent-dark)]/20`
                          } hover:scale-102 hover:-translate-y-1`}
                        >
                          {/* Button Background Animation */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                          <span className="relative z-10">{plan.cta}</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Indicators Section - Fits Screen */}
      <section className={`min-h-screen flex items-center justify-center py-20 px-6 transition-all duration-1000 delay-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="max-w-5xl mx-auto text-center">
          <div className={`text-center mb-12 ${
            isLight ? "text-[var(--text-muted-light)]" : "text-[var(--text-muted-dark)]"
          }`}>
            <h3 className={`text-3xl font-bold mb-6 ${
              isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
            }`}>
              Trusted by Job Seekers Worldwide
            </h3>
            <p className="text-xl mb-8">Join thousands of professionals who trust AI Lead Finder</p>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[
              { number: "10K+", label: "Active Users" },
              { number: "50K+", label: "Leads Generated" },
              { number: "95%", label: "Success Rate" },
              { number: "24/7", label: "Support" }
            ].map((stat, index) => (
              <div 
                key={index}
                className={`p-6 rounded-2xl backdrop-blur-xl transition-all duration-500 hover:scale-110 ${
                  isLight 
                    ? "bg-white/20 border border-white/30 shadow-lg" 
                    : "bg-black/20 border border-white/10 shadow-xl"
                }`}
              >
                <div className={`text-3xl font-bold mb-2 ${
                  isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
                }`}>
                  {stat.number}
                </div>
                <div className={`text-sm ${
                  isLight ? "text-[var(--text-muted-light)]" : "text-[var(--text-muted-dark)]"
                }`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Trust Logos */}
          <div className="flex items-center justify-center space-x-12 opacity-80">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i}
                className={`w-20 h-12 rounded-xl backdrop-blur-xl transition-all duration-300 hover:scale-110 ${
                  isLight 
                    ? "bg-white/20 border border-white/30 shadow-lg" 
                    : "bg-black/20 border border-white/10 shadow-xl"
                }`}
              ></div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Fits Screen */}
      <section className={`min-h-screen flex items-center justify-center py-20 px-6 transition-all duration-1000 delay-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-6 ${
              isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
            }`}>
              Frequently Asked Questions
            </h2>
            <p className={`text-xl ${
              isLight ? "text-[var(--text-muted-light)]" : "text-[var(--text-muted-dark)]"
            }`}>
              Everything you need to know about our pricing and plans
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                question: "Can I cancel anytime?",
                answer: "Yes, you can cancel your subscription at any time. No long-term contracts or hidden fees."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and bank transfers for enterprise plans."
              },
              {
                question: "Is there a free trial?",
                answer: "Yes! Our Starter plan is completely free forever. No credit card required to get started."
              },
              {
                question: "Do you offer refunds?",
                answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll refund you."
              },
              {
                question: "How does the AI work?",
                answer: "Our AI analyzes job postings and your profile to generate personalized outreach messages that increase response rates."
              },
              {
                question: "Is my data secure?",
                answer: "Absolutely. We use enterprise-grade encryption and never share your personal information with third parties."
              }
            ].map((faq, index) => (
              <div 
                key={index}
                className={`group p-6 rounded-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${hoverEffect} relative overflow-hidden`}
                style={{
                  background: isLight 
                    ? "rgba(255, 255, 255, 0.9)" 
                    : "rgba(26, 26, 29, 0.9)",
                  backdropFilter: "blur(20px)",
                  border: isLight 
                    ? "1px solid rgba(255, 255, 255, 0.3)" 
                    : "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: isLight
                    ? "0 20px 40px -12px rgba(0, 0, 0, 0.1)"
                    : "0 20px 40px -12px rgba(0, 0, 0, 0.3)",
                }}
              >
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-all duration-500">
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full" 
                    style={{ background: isLight ? "var(--accent-light)" : "var(--accent-dark)" }}></div>
                  <div className="absolute bottom-4 left-4 w-4 h-4 rounded-full" 
                    style={{ background: isLight ? "var(--primary-light)" : "var(--primary-dark)" }}></div>
                </div>

                <div className="relative z-10">
                  <h3 className={`text-lg font-bold mb-3 transition-all duration-300 group-hover:scale-105 ${
                    isLight ? "text-[var(--text)]" : "text-[var(--text)]"
                  }`}>
                    {faq.question}
                  </h3>
                  <p className={`text-sm leading-relaxed ${
                    isLight ? "text-[var(--text-muted-light)]" : "text-[var(--text-muted-dark)]"
                  }`}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Fits Screen */}
      <section className={`min-h-screen flex items-center justify-center py-20 px-6 transition-all duration-1000 delay-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-4xl md:text-5xl font-bold mb-8 ${
            isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
          }`}>
            Ready to Transform Your Job Search?
          </h2>
          <p className={`text-xl mb-12 ${
            isLight ? "text-[var(--text-muted-light)]" : "text-[var(--text-muted-dark)]"
          }`}>
            Join thousands of professionals who are already using AI Lead Finder to land their dream jobs
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/signup"
              className={`${buttonBaseStyle} ${buttonHoverEffect} bg-gradient-to-br ${gradient} text-black hover:scale-110 transition-all duration-300 px-8 py-4 text-lg font-bold rounded-2xl shadow-lg`}
            >
              Start Free Today
            </Link>
            <Link
              href="/contact"
              className={`${buttonBaseStyle} ${
                isLight 
                  ? "bg-white/20 border border-white/30 text-[var(--text)] hover:bg-white/30" 
                  : "bg-black/20 border border-white/10 text-[var(--text)] hover:bg-black/30"
              } hover:scale-110 transition-all duration-300 px-8 py-4 text-lg font-bold rounded-2xl backdrop-blur-xl`}
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      <Footer dark={!isLight} />
    </div>
  );
} 