"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Helper to decode JWT and extract username
function getUsernameFromToken(token: string | null): string {
  if (!token) return "";
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub || payload.identity || payload.username || "";
  } catch {
    return "";
  }
}

export default function ProfilePage() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changing, setChanging] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState(""); // password for verification
  const [emailChangeLoading, setEmailChangeLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    setUsername(getUsernameFromToken(token));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setChanging(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:5001/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Password changed successfully.");
        setOldPassword("");
        setNewPassword("");
      } else {
        setError(data.msg || "Failed to change password.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setChanging(false);
    }
  };

  // Handler function for changing email
  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setEmailChangeLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:5001/api/change-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ new_email: newEmail, password: emailPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Email changed successfully.");
        setNewEmail("");
        setEmailPassword("");
      } else {
        setError(data.msg || "Failed to change email.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setEmailChangeLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <div className="mb-4">
        <span className="font-semibold">Username:</span> {username}
      </div>

      {/* Change Password Form */}
      <form className="w-full max-w-sm space-y-3 mb-6" onSubmit={handleChangePassword}>
        <h2 className="font-semibold text-lg mb-2">Change Password</h2>
        <input
          type="password"
          className="w-full px-4 py-2 border rounded"
          placeholder="Old Password"
          value={oldPassword}
          onChange={e => {
            setOldPassword(e.target.value);
            setError("");
            setSuccess("");
          }}
          required
        />
        <input
          type="password"
          className="w-full px-4 py-2 border rounded"
          placeholder="New Password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={changing}
        >
          {changing ? "Changing..." : "Change Password"}
        </button>
      </form>

      {/* Change Email Form */}
      <form className="w-full max-w-sm space-y-3 mb-6" onSubmit={handleChangeEmail}>
        <h2 className="font-semibold text-lg mb-2">Change Email</h2>
        <input
          type="email"
          className="w-full px-4 py-2 border rounded"
          placeholder="New Email"
          value={newEmail}
          onChange={e => setNewEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full px-4 py-2 border rounded"
          placeholder="Current Password"
          value={emailPassword}
          onChange={e => setEmailPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={emailChangeLoading}
        >
          {emailChangeLoading ? "Changing..." : "Change Email"}
        </button>
      </form>

      <button
        className="bg-gray-200 px-4 py-2 rounded"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}