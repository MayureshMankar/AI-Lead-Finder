"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    
    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("rememberMe");
    
    // In a real app, you might want to call a logout endpoint to invalidate the token
    // await fetch("http://127.0.0.1:5001/api/logout", {
    //   method: "POST",
    //   headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    // });
    
    // Redirect to login
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
    >
      {loading ? "Signing out..." : "Sign Out"}
    </button>
  );
} 