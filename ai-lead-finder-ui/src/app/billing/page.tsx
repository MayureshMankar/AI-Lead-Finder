"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function BillingPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [dark, setDark] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [usage, setUsage] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [canceling, setCanceling] = useState(false);

  const toggleDarkMode = () => setDark(!dark);
  const isLight = !dark;

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBillingData();
    }
  }, [isAuthenticated]);

  const fetchBillingData = async () => {
    setLoadingData(true);
    try {
      const token = localStorage.getItem("token");
      
      // Fetch subscription
      const subResponse = await fetch("http://127.0.0.1:5001/api/billing/subscription", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (subResponse.ok) {
        const subData = await subResponse.json();
        setSubscription(subData.subscription);
      }

      // Fetch usage
      const usageResponse = await fetch("http://127.0.0.1:5001/api/billing/usage", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (usageResponse.ok) {
        const usageData = await usageResponse.json();
        setUsage(usageData);
      }

      // Fetch invoices
      const invoicesResponse = await fetch("http://127.0.0.1:5001/api/billing/invoices", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (invoicesResponse.ok) {
        const invoicesData = await invoicesResponse.json();
        setInvoices(invoicesData.invoices || []);
      }
    } catch (error) {
      console.error("Error fetching billing data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleUpgrade = async (planType: string, billingCycle: string) => {
    setUpgrading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5001/api/billing/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          plan_type: planType,
          billing_cycle: billingCycle
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.client_secret) {
          const stripe = await stripePromise;
          if (stripe) {
            const { error } = await stripe.confirmCardPayment(data.client_secret);
            if (error) {
              console.error("Payment failed:", error);
            } else {
              await fetchBillingData();
            }
          }
        } else {
          await fetchBillingData();
        }
      }
    } catch (error) {
      console.error("Error upgrading subscription:", error);
    } finally {
      setUpgrading(false);
    }
  };

  const handleCancel = async () => {
    setCanceling(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5001/api/billing/subscription/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ at_period_end: true })
      });

      if (response.ok) {
        await fetchBillingData();
      }
    } catch (error) {
      console.error("Error canceling subscription:", error);
    } finally {
      setCanceling(false);
    }
  };

  const gradient = isLight
    ? "from-[var(--primary-light)] via-[var(--muted-light)] to-[var(--accent-light)]"
    : "from-[var(--primary-dark)] via-[var(--muted-dark)] to-[var(--accent-dark)]";

  if (loading || !isAuthenticated) {
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
            Billing & Subscription
          </h1>
          <p className="text-lg" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
            Manage your subscription, view usage, and handle payments.
          </p>
        </div>

        {loadingData ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-dark)]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Current Subscription */}
            <div className="lg:col-span-2">
              <div className={`rounded-2xl p-[2px] mb-6`} style={{ background: isLight ? "#e6e3de" : `linear-gradient(to bottom right, var(--primary-dark), var(--muted-dark), var(--accent-dark))` }}>
                <div className="p-6 rounded-xl" style={{ background: isLight ? "#F8F4F0" : "var(--card-dark)", border: isLight ? "1px solid #ddd" : "1px solid var(--border-dark)" }}>
                  <h2 className={`text-xl font-semibold mb-4 ${
                    isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
                  }`}>
                    Current Plan
                  </h2>
                  
                  {subscription ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold capitalize">{subscription.plan_type} Plan</h3>
                          <p className="text-sm" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                            {subscription.billing_cycle} billing
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">
                            ${subscription.amount}
                            <span className="text-sm font-normal">/{subscription.billing_cycle === 'monthly' ? 'mo' : 'year'}</span>
                          </p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                            subscription.status === 'trial' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {subscription.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4" style={{ borderColor: isLight ? "#ddd" : "var(--border-dark)" }}>
                        <h4 className="font-medium mb-2">Features:</h4>
                        <ul className="space-y-1">
                          {subscription.features?.slice(0, 5).map((feature: string, index: number) => (
                            <li key={index} className="text-sm flex items-center">
                              <span className="text-green-500 mr-2">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex space-x-3 pt-4">
                        <button
                          onClick={() => handleUpgrade('pro', subscription.billing_cycle)}
                          disabled={upgrading || subscription.plan_type === 'pro'}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {upgrading ? 'Upgrading...' : 'Upgrade'}
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={canceling}
                          className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {canceling ? 'Canceling...' : 'Cancel'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-lg mb-4">No active subscription</p>
                      <button
                        onClick={() => router.push('/pricing')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Choose a Plan
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Usage Statistics */}
              {usage && (
                <div className={`rounded-2xl p-[2px] mb-6`} style={{ background: isLight ? "#e6e3de" : `linear-gradient(to bottom right, var(--primary-dark), var(--muted-dark), var(--accent-dark))` }}>
                  <div className="p-6 rounded-xl" style={{ background: isLight ? "#F8F4F0" : "var(--card-dark)", border: isLight ? "1px solid #ddd" : "1px solid var(--border-dark)" }}>
                    <h2 className={`text-xl font-semibold mb-4 ${
                      isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
                    }`}>
                      Usage This Period
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(usage.usage || {}).map(([feature, count]) => (
                        <div key={feature} className="text-center p-4 rounded-lg" style={{ background: isLight ? "#ffffff" : "var(--input-dark)" }}>
                          <p className="text-2xl font-bold">{count as number}</p>
                          <p className="text-sm capitalize" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                            {feature}
                          </p>
                          {usage.limits && usage.limits[`max_${feature}_per_day`] && (
                            <p className="text-xs mt-1" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                              Limit: {usage.limits[`max_${feature}_per_day`] === -1 ? 'Unlimited' : usage.limits[`max_${feature}_per_day`]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Invoices */}
              <div className={`rounded-2xl p-[2px]`} style={{ background: isLight ? "#e6e3de" : `linear-gradient(to bottom right, var(--primary-dark), var(--muted-dark), var(--accent-dark))` }}>
                <div className="p-6 rounded-xl" style={{ background: isLight ? "#F8F4F0" : "var(--card-dark)", border: isLight ? "1px solid #ddd" : "1px solid var(--border-dark)" }}>
                  <h2 className={`text-xl font-semibold mb-4 ${
                    isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
                  }`}>
                    Recent Invoices
                  </h2>
                  
                  {invoices.length > 0 ? (
                    <div className="space-y-3">
                      {invoices.map((invoice) => (
                        <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: isLight ? "#ffffff" : "var(--input-dark)" }}>
                          <div>
                            <p className="font-medium">{invoice.invoice_number}</p>
                            <p className="text-sm" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                              {new Date(invoice.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${invoice.amount}</p>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                              invoice.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {invoice.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                      No invoices yet
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              {/* Plan Comparison */}
              <div className={`rounded-2xl p-[2px]`} style={{ background: isLight ? "#e6e3de" : `linear-gradient(to bottom right, var(--primary-dark), var(--muted-dark), var(--accent-dark))` }}>
                <div className="p-6 rounded-xl" style={{ background: isLight ? "#F8F4F0" : "var(--card-dark)", border: isLight ? "1px solid #ddd" : "1px solid var(--border-dark)" }}>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
                  }`}>
                    Available Plans
                  </h3>
                  
                  <div className="space-y-3">
                    {['starter', 'pro', 'business'].map((plan) => (
                      <div key={plan} className="p-3 rounded-lg" style={{ background: isLight ? "#ffffff" : "var(--input-dark)" }}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium capitalize">{plan}</h4>
                          <span className="text-sm font-medium">
                            ${plan === 'starter' ? '0' : plan === 'pro' ? '29' : '79'}/mo
                          </span>
                        </div>
                        <button
                          onClick={() => handleUpgrade(plan, 'monthly')}
                          disabled={upgrading || subscription?.plan_type === plan}
                          className="w-full px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {subscription?.plan_type === plan ? 'Current Plan' : 'Upgrade'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Billing Period */}
              {subscription && (
                <div className={`rounded-2xl p-[2px]`} style={{ background: isLight ? "#e6e3de" : `linear-gradient(to bottom right, var(--primary-dark), var(--muted-dark), var(--accent-dark))` }}>
                  <div className="p-6 rounded-xl" style={{ background: isLight ? "#F8F4F0" : "var(--card-dark)", border: isLight ? "1px solid #ddd" : "1px solid var(--border-dark)" }}>
                    <h3 className={`text-lg font-semibold mb-4 ${
                      isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
                    }`}>
                      Billing Period
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                          Current period:
                        </span>
                        <span className="text-sm font-medium">
                          {new Date(subscription.current_period_start).toLocaleDateString()} - {new Date(subscription.current_period_end).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {subscription.trial_end && (
                        <div className="flex justify-between">
                          <span className="text-sm" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                            Trial ends:
                          </span>
                          <span className="text-sm font-medium">
                            {new Date(subscription.trial_end).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Support */}
              <div className={`rounded-2xl p-[2px]`} style={{ background: isLight ? "#e6e3de" : `linear-gradient(to bottom right, var(--primary-dark), var(--muted-dark), var(--accent-dark))` }}>
                <div className="p-6 rounded-xl" style={{ background: isLight ? "#F8F4F0" : "var(--card-dark)", border: isLight ? "1px solid #ddd" : "1px solid var(--border-dark)" }}>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    isLight ? "text-[var(--text)]" : `bg-gradient-to-br ${gradient} bg-clip-text text-transparent`
                  }`}>
                    Need Help?
                  </h3>
                  
                  <p className="text-sm mb-4" style={{ color: isLight ? "var(--text-muted)" : "var(--text-muted-dark)" }}>
                    Have questions about your billing or subscription?
                  </p>
                  
                  <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 