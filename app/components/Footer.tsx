"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-12 px-6 bg-white border-t border-zinc-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-zinc-900" />
            <span className="font-black text-sm tracking-tight text-zinc-900">
              LUIS FOTO
            </span>
          </Link>

          {/* Links */}
          <nav className="flex items-center gap-8">
            <Link
              href="/"
              className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/posts"
              className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Posts
            </Link>
            <Link
              href="/gallery"
              className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Gallery
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-xs text-zinc-400">
            &copy; {new Date().getFullYear()} Luis Foto Nature
          </p>
        </div>
      </div>
    </footer>
  );
}
