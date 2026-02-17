"use client";

import Link from "next/link";
import { useGetAllActivePosts } from "@/app/adapters/hooks";
import Image from "next/image";

interface Post {
  id: number;
  title: string;
  featuredImage: string;
  category: string;
}

export default function Hero() {
  const { data: postsResponse } = useGetAllActivePosts();
  const latestPost: Post | undefined = postsResponse?.[0];

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      {latestPost?.featuredImage ? (
        <Image
          src={latestPost.featuredImage}
          alt={latestPost.title || "Nature photography"}
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="w-full h-full bg-zinc-100" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <span className="text-xs font-medium tracking-[0.3em] text-white/60 uppercase mb-6">
          Nature Photography
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[0.95]">
          Luis Foto
          <br />
          Nature
        </h1>
        <p className="text-sm md:text-base text-white/60 mt-6 max-w-md leading-relaxed">
          Capturing the raw beauty of wildlife and landscapes from the most remote corners of the world.
        </p>
        <Link
          href="/posts"
          className="mt-10 px-8 py-3 border border-white/30 text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-all"
        >
          Explore Stories
        </Link>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] tracking-[0.2em] text-white/40 uppercase">Scroll</span>
        <div className="w-px h-8 bg-white/20" />
      </div>
    </section>
  );
}
