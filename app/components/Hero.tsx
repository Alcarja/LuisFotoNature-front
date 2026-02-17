"use client";

import Link from "next/link";
import { useGetAllActivePosts } from "@/app/adapters/hooks";
import Image from "next/image";

interface Post {
  id: number;
  title: string;
  featuredImage: string;
  category: string;
  createdAt: string;
}

export default function Hero() {
  const { data: postsResponse } = useGetAllActivePosts();
  const latestPost: Post | undefined = postsResponse?.[0];

  return (
    <section className="relative w-full h-[85vh] overflow-hidden">
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
        <div className="w-full h-full bg-zinc-200" />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="max-w-5xl mx-auto w-full px-8 pb-20">
          {latestPost ? (
            <Link href={`/posts/${latestPost.id}`} className="group block">
              <span className="inline-block text-xs font-medium tracking-[0.2em] text-white/70 uppercase mb-4">
                {latestPost.category || "Latest"}
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight max-w-3xl group-hover:text-white/90 transition-colors">
                {latestPost.title}
              </h1>
            </Link>
          ) : (
            <>
              <span className="inline-block text-xs font-medium tracking-[0.2em] text-white/70 uppercase mb-4">
                Nature Photography
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight max-w-3xl">
                Moments Frozen in Time
              </h1>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
