"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full min-h-[80vh] flex flex-col items-center justify-center px-6 bg-white">
      <span className="text-xs font-medium tracking-[0.3em] text-zinc-400 uppercase mb-8">
        Nature Photography
      </span>
      <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-zinc-900 tracking-tighter leading-[0.9] text-center">
        Luis Foto
        <br />
        <span className="text-zinc-300">Nature</span>
      </h1>
      <p className="text-base text-zinc-400 mt-8 max-w-sm text-center leading-relaxed">
        Wildlife and landscapes from the most remote corners of the world.
      </p>
      <Link
        href="/posts"
        className="mt-12 text-sm font-medium text-zinc-900 border-b border-zinc-900 pb-0.5 hover:text-zinc-500 hover:border-zinc-500 transition-colors"
      >
        View all stories
      </Link>
    </section>
  );
}
