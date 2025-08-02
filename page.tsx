"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Fetch user info from backend (optional, or decode from JWT if you store username)
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    // If your JWT contains the username, you can decode it here.
    // For now, just show a placeholder.
    setUsername("YourUsername"); // Replace with actual username if available
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="mb-4">
        <span className="font-semibold">Username:</span> {username}
      </div>
      <button
        className="bg-gray-200 px-4 py-2 rounded"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}