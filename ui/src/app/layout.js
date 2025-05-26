"use client";
import "./globals.css";
import Link from "next/link";
import { AuthProvider, useAuth } from "../../context/AuthContext";
import { Suspense } from "react";

function AuthNav() {
  const { isAuthenticated, logout, user } = useAuth();
  // console.log("uuser", user);

  if (!isAuthenticated) return null;
  return (
    <div className="flex items-center gap-2">
      <Link href="/leads" className="hover:text-blue-600 font-medium">
        Leads
      </Link>{" "}
      <span className="text-sm text-green-700">
        Logged in as <b>{user?.email || user?.name || user?.role}</b>
      </span>
      <button
        onClick={logout}
        className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
      >
        Logout
      </button>
    </div>
  );
}

function AdminNavLink() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated || user?.role !== "admin") return null;
  return (
    <Link href="/admin" className="hover:text-blue-600 font-medium">
      Admin
    </Link>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Pixisphere</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gray-50 min-h-screen text-gray-900">
        <AuthProvider>
          <nav className="w-full bg-white shadow-sm px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl text-blue-600">
                Pixisphere
              </span>
            </div>
            <div className="flex gap-6 items-center">
              <Link href="/" className="hover:text-blue-600 font-medium">
                Home
              </Link>
              <Link href="/login" className="hover:text-blue-600 font-medium">
                Login
              </Link>
              <Link href="/signup" className="hover:text-blue-600 font-medium">
                Signup
              </Link>
              <AdminNavLink />
              <AuthNav />
            </div>
          </nav>
          <main className="max-w-5xl mx-auto px-4 py-8">
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
