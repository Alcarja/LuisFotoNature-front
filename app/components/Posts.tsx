"use client";

import Link from "next/link";
import Image from "next/image";
import { useGetAllActivePosts } from "@/app/adapters/hooks";
import { format } from "date-fns";

interface Post {
  id: number;
  title: string;
  featuredImage: string;
  category: string;
  owner: string;
  createdAt: string;
}

export default function Posts() {
  const { data: postsResponse, isLoading } = useGetAllActivePosts();
  const posts: Post[] = postsResponse || [];

  if (isLoading) {
    return (
      <section className="w-full py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <span className="text-xs font-medium tracking-[0.2em] text-zinc-400 uppercase">
              Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 tracking-tight text-zinc-900">
              From the Field
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-zinc-100 rounded-xl mb-5" />
                <div className="h-3 bg-zinc-100 rounded w-20 mb-3" />
                <div className="h-5 bg-zinc-100 rounded w-3/4 mb-2" />
                <div className="h-5 bg-zinc-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!posts.length) return null;

  return (
    <section className="w-full py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-16">
          <span className="text-xs font-medium tracking-[0.2em] text-zinc-400 uppercase">
            Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-black mt-3 tracking-tight text-zinc-900">
            From the Field
          </h2>
        </div>

        {/* Posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="group block"
            >
              {/* Image */}
              <div className="relative h-64 bg-zinc-100 rounded-xl overflow-hidden mb-5">
                {post.featuredImage ? (
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300 text-sm">
                    No image
                  </div>
                )}
              </div>

              {/* Content */}
              {post.category && (
                <span className="text-xs font-medium tracking-[0.15em] text-zinc-400 uppercase">
                  {post.category}
                </span>
              )}
              <h3 className="text-xl font-bold text-zinc-900 mt-2 leading-snug group-hover:text-zinc-600 transition-colors line-clamp-2">
                {post.title}
              </h3>
              {post.createdAt && (
                <p className="text-sm text-zinc-400 mt-3">
                  {format(new Date(post.createdAt), "MMMM d, yyyy")}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
