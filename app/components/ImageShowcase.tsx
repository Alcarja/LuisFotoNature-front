"use client";

import Link from "next/link";
import Image from "next/image";
import { useGetAllActivePosts } from "@/app/adapters/hooks";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Post {
  id: number;
  title: string;
  featuredImage: string;
  category: string;
  createdAt: string;
}

export default function ImageShowcase() {
  const { data: postsResponse } = useGetAllActivePosts();
  const posts: Post[] = postsResponse?.slice(0, 2) || [];

  if (!posts.length) return null;

  return (
    <section className="w-full px-6 md:px-12 py-12 bg-white">
      <div className="max-w-6xl mx-auto space-y-20">
        {posts.map((post, index) => {
          const isReversed = index % 2 !== 0;

          return (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className={`group flex flex-col ${isReversed ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-6 md:gap-6`}
            >
              {/* Image */}
              <div className="w-full md:w-3/5 relative aspect-4/3 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                {post.featuredImage ? (
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300 text-sm">
                    Sin imagen
                  </div>
                )}
              </div>

              {/* Text */}
              <div
                className={`w-full md:w-2/5 ${isReversed ? "md:text-right" : ""}`}
              >
                {post.category && (
                  <span className="text-xs font-medium tracking-[0.2em] text-zinc-400 uppercase">
                    {post.category}
                  </span>
                )}
                <h3 className="text-3xl md:text-4xl font-black text-zinc-900 mt-3 leading-tight tracking-tight group-hover:text-zinc-600 transition-colors">
                  {post.title}
                </h3>
                {post.createdAt && (
                  <p className="text-sm text-zinc-400 mt-4">
                    {format(new Date(post.createdAt), "dd MMMM yyyy", {
                      locale: es,
                    })}
                  </p>
                )}
                <span className="inline-block mt-6 text-sm font-medium text-zinc-900 border-b border-zinc-900 pb-0.5 group-hover:text-zinc-500 group-hover:border-zinc-500 transition-colors">
                  Leer historia
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
