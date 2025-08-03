"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";

export default function SettingsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  
  // Form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  const gradient = "from-[var(--primary-dark)] via-[var(--muted-dark)] to-[var(--accent-dark)]";
  const borderStyle = "1px solid var(--border-dark)";
  const hoverEffect = "hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out";

  const showMessage = (msg: string, type: "success" | "error") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showMessage("New passwords don't match", "error");
      return;
    }
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5001/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      });
      
      if (response.ok) {
        showMessage("Password changed successfully", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const data = await response.json();
        showMessage(data.msg || "Failed to change password", "error");
      }
    } catch (error) {
      showMessage("Network error", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5001/api/change-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          new_email: newEmail
        })
      });
      
      if (response.ok) {
        showMessage("Email change request sent. Check your new email for confirmation.", "success");
        setNewEmail("");
      } else {
        const data = await response.json();
        showMessage(data.msg || "Failed to change email", "error");
      }
    } catch (error) {
      showMessage("Network error", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5001/api/users/delete-account", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        showMessage("Account deleted successfully", "success");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        const data = await response.json();
        showMessage(data.msg || "Failed to delete account", "error");
      }
    } catch (error) {
      showMessage("Network error", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
              <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "black", color: "var(--text)" }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-dark)]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      className="min-h-screen font-sans transition-colors duration-300"
      style={{
        backgroundColor: "black",
        color: "var(--text)",
      }}
    >
      <Navigation />

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>
            ⚙️ Account Settings
          </h1>
          <p className="text-lg" style={{ color: "var(--text-muted-dark)" }}>
            Manage your account preferences and security
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            messageType === "success" ? "bg-green-900/20 border border-green-500/30" : "bg-red-900/20 border border-red-500/30"
          }`}>
            <p className={messageType === "success" ? "text-green-400" : "text-red-400"}>
              {message}
            </p>
          </div>
        )}

        {/* Account Info */}
        <div className={`${hoverEffect} rounded-2xl p-6 mb-8`} style={{ backgroundColor: "var(--card-dark)", border: borderStyle }}>
          <h2 className={`text-xl font-semibold mb-4 bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>
            Account Information
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted-dark)" }}>
                Username
              </label>
              <p className="text-lg" style={{ color: "var(--text)" }}>{user?.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted-dark)" }}>
                Email
              </label>
              <p className="text-lg" style={{ color: "var(--text)" }}>{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-muted-dark)" }}>
                Member Since
              </label>
              <p className="text-lg" style={{ color: "var(--text)" }}>
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className={`${hoverEffect} rounded-2xl p-6 mb-8`} style={{ backgroundColor: "var(--card-dark)", border: borderStyle }}>
          <h2 className={`text-xl font-semibold mb-4 bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>
            Change Password
          </h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-muted-dark)" }}>
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)]"
                style={{ 
                  backgroundColor: "var(--input-dark)", 
                  color: "var(--text)", 
                  borderColor: "var(--border-dark)" 
                }}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-muted-dark)" }}>
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)]"
                style={{ 
                  backgroundColor: "var(--input-dark)", 
                  color: "var(--text)", 
                  borderColor: "var(--border-dark)" 
                }}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-muted-dark)" }}>
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)]"
                style={{ 
                  backgroundColor: "var(--input-dark)", 
                  color: "var(--text)", 
                  borderColor: "var(--border-dark)" 
                }}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[var(--accent-dark)] to-[var(--primary-dark)] text-[var(--bg)]"
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Change Email */}
        <div className={`${hoverEffect} rounded-2xl p-6 mb-8`} style={{ backgroundColor: "var(--card-dark)", border: borderStyle }}>
          <h2 className={`text-xl font-semibold mb-4 bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>
            Change Email
          </h2>
          <form onSubmit={handleEmailChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-muted-dark)" }}>
                New Email Address
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--accent-dark)]"
                style={{ 
                  backgroundColor: "var(--input-dark)", 
                  color: "var(--text)", 
                  borderColor: "var(--border-dark)" 
                }}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[var(--accent-dark)] to-[var(--primary-dark)] text-[var(--bg)]"
            >
              {isLoading ? "Sending..." : "Send Email Change Request"}
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className={`${hoverEffect} rounded-2xl p-6`} style={{ backgroundColor: "var(--card-dark)", border: borderStyle }}>
          <h2 className={`text-xl font-semibold mb-4 bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>
            Danger Zone
          </h2>
          <div className="p-4 rounded-lg border" style={{ 
            backgroundColor: "rgba(239, 68, 68, 0.1)", 
            borderColor: "rgba(239, 68, 68, 0.3)" 
          }}>
            <h3 className="font-semibold mb-2" style={{ color: "#ef4444" }}>Delete Account</h3>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted-dark)" }}>
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <button
              onClick={handleDeleteAccount}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: "#ef4444", 
                color: "white" 
              }}
            >
              {isLoading ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
