import "./globals.css";
import { ReactNode } from "react";
import "@fontsource/inter"; // in layout.tsx or globals.css
import { AuthProvider } from "@/contexts/AuthContext";


export const metadata = {
  title: "AI Lead Finder",
  description: "Automate job scraping and outreach.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <AuthProvider>
          {/* Add Navbar here if needed */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
