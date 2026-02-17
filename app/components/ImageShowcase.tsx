"use client";

import Link from "next/link";
import Image from "next/image";
import { useGetAllActivePosts } from "@/app/adapters/hooks";

interface Post {
  id: number;
  title: string;
  featuredImage: string;
  category: string;
}

export default function ImageShowcase() {
  const { data: postsResponse } = useGetAllActivePosts();
  const posts: Post[] = postsResponse?.slice(1, 4) || [];

  if (!posts.length) return null;

  return (
    <section>
      {posts.map((post, index) => (
        <Link
          key={post.id}
          href={`/posts/${post.id}`}
          className="group relative block w-full h-[75vh] overflow-hidden"
        >
          {/* Image */}
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-zinc-100" />
          )}

          {/* Overlay */}
          <div
            className={`absolute inset-0 ${
              index % 2 === 0
                ? "bg-linear-to-r from-black/50 via-black/10 to-transparent"
                : "bg-linear-to-l from-black/50 via-black/10 to-transparent"
            }`}
          />

          {/* Content */}
          <div
            className={`absolute inset-0 flex items-end p-10 md:p-16 ${
              index % 2 === 0 ? "justify-start" : "justify-end text-right"
            }`}
          >
            <div className="max-w-lg">
              {post.category && (
                <span className="inline-block text-xs font-medium tracking-[0.2em] text-white/60 uppercase mb-3">
                  {post.category}
                </span>
              )}
              <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.05] tracking-tight">
                {post.title}
              </h2>
              <span className="inline-block mt-4 text-sm text-white/50 group-hover:text-white/80 transition-colors">
                Read Story &rarr;
              </span>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
}
