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

export default function Hero() {
  const { data: postsResponse } = useGetAllActivePosts();
  const latestPost = (postsResponse as Post[])?.[0];

  return (
    <section className="w-full bg-white px-6 md:px-12 lg:px-24 py-12 md:py-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16 lg:gap-24">
        {/* Left — Typography */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-1">
          <span className="text-xs font-medium tracking-[0.3em] text-zinc-400 uppercase mb-8">
            Fotografía Salvaje
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-black text-zinc-900 tracking-tighter leading-[0.9]">
            Luis Foto
            <br />
            <span className="text-zinc-300">Nature</span>
          </h1>
          <p className="text-base text-zinc-400 mt-8 max-w-sm leading-relaxed">
            Fauna y paisajes de los lugares más remotos del mundo.
          </p>
          <div className="flex items-center gap-6 mt-12">
            <Link
              href="/posts"
              className="text-sm font-medium text-white bg-zinc-900 px-6 py-3 rounded-md hover:bg-zinc-700 transition-colors"
            >
              Ver todas las historias
            </Link>
            {latestPost && (
              <Link
                href={`/posts/${latestPost.id}`}
                className="text-sm font-medium text-zinc-900 border-b border-zinc-900 pb-0.5 hover:text-zinc-500 hover:border-zinc-500 transition-colors"
              >
                Último post
              </Link>
            )}
          </div>
        </div>

        {/* Right — Featured Image */}
        <div className="w-full md:w-1/2 relative aspect-4/5 rounded-lg overflow-hidden group order-1 md:order-2">
          {latestPost?.featuredImage ? (
            <Image
              src={latestPost.featuredImage}
              alt={latestPost.title}
              fill
              priority
              className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-zinc-100 rounded-lg" />
          )}
        </div>
      </div>
    </section>
  );
}
