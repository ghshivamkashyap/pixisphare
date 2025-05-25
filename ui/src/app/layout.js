import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "../../context/AuthContext";
import { Suspense } from "react";

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
            <div className="flex gap-6">
              <Link href="/" className="hover:text-blue-600 font-medium">
                Home
              </Link>
              <Link href="/login" className="hover:text-blue-600 font-medium">
                Login
              </Link>
              <Link href="/signup" className="hover:text-blue-600 font-medium">
                Signup
              </Link>
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
