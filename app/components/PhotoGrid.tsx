"use client";

import Image from "next/image";
import Link from "next/link";
import { useGetAllActivePosts } from "@/app/adapters/hooks";

interface Post {
  id: number;
  title: string;
  featuredImage: string;
  category: string;
}

export default function PhotoGrid() {
  const { data: postsResponse } = useGetAllActivePosts();
  const posts = ((postsResponse as Post[]) ?? []).filter(
    (p) => p.featuredImage,
  );

  if (posts.length < 3) return null;

  const gridPosts = posts.slice(0, 6);

  return (
    <section className="w-full px-6 md:px-12 lg:px-24 py-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <span className="text-xs font-medium tracking-[0.3em] text-zinc-400 uppercase">
            Galería
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight mt-3">
            De las trincheras
          </h2>
        </div>

        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {gridPosts.map((post, index) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="group block relative overflow-hidden rounded-lg break-inside-avoid"
            >
              <div
                className={
                  index % 3 === 0
                    ? "aspect-3/4"
                    : index % 3 === 1
                      ? "aspect-square"
                      : "aspect-4/3"
                }
              >
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  {post.category && (
                    <span className="text-[10px] font-medium tracking-[0.2em] text-white/70 uppercase">
                      {post.category}
                    </span>
                  )}
                  <p className="text-sm font-bold text-white mt-1 leading-tight">
                    {post.title}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/posts"
            className="text-sm font-medium text-zinc-900 border-b border-zinc-900 pb-0.5 hover:text-zinc-500 hover:border-zinc-500 transition-colors"
          >
            Ver todas las historias
          </Link>
        </div>
      </div>
    </section>
  );
}
