"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white flex flex-col">

      {/* ✅ Navbar */}
      <nav className="w-full flex justify-between items-center px-8 py-5 bg-black/20 backdrop-blur-xl border-b border-white/10 fixed top-0 z-50">
        <h1 className="text-3xl font-extrabold text-purple-400 tracking-wide">Leetpeers</h1>
        <div className="flex gap-4">
          <Link href="/auth/signin" className="px-4 py-2 text-white hover:text-purple-300 transition">
            Sign In
          </Link>
          <Link href="/auth/signup" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* ✅ Hero Section (Centered, No Image) */}
      <section className="flex flex-col items-center text-center px-6 mt-40 space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
          Collaborate. <span className="text-purple-400">Code.</span> Conquer.
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl">
          Join peers, create coding groups, and solve problems together using real-time
          whiteboards and collaboration tools.
        </p>
        <div className="flex gap-4">
          <Link
            href="/auth/signup"
            className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-lg font-medium transition"
          >
            Get Started 🚀
          </Link>
          <Link
            href="/auth/signin"
            className="border border-purple-500 hover:bg-purple-600 hover:text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* ✅ Footer */}
      <footer className="text-center mt-auto py-6 text-gray-500 border-t border-white/10">
        © {new Date().getFullYear()} Leetpeers — Built for Collaboration & Innovation
      </footer>
    </main>
  );
}
