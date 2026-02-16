"use client";

import { useGetPostById } from "@/app/adapters/hooks";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { format } from "date-fns";

const IndicidualPostPage = () => {
  const router = useRouter();
  const params = useParams();
  const postId = Number(params.postId);

  const { data: postResponse } = useGetPostById(postId);
  const post = postResponse?.[0];

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500">Loading...</p>
        </div>
      </div>
    );
  }

  const formattedDate = post.createdAt
    ? format(post.createdAt, "MMMM d, yyyy")
    : "";

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-zinc-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>
      </nav>

      {/* Hero Image */}
      {post.featuredImage && (
        <div className="w-full h-125 relative">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-contain"
            priority
          />
        </div>
      )}

      {/* Content */}
      <article className="max-w-5xl mx-auto px-8 py-20">
        {/* Header */}
        <header className="mb-16">
          <h1 className="text-6xl font-black text-zinc-900 leading-tight mb-8">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500 pb-8 border-b border-zinc-200">
            {post.createdAt && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-zinc-400" />
                <time dateTime={post.createdAt}>{formattedDate}</time>
              </div>
            )}

            {post.owner && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-zinc-400" />
                <span>{post.owner}</span>
              </div>
            )}

            {post.category && (
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-zinc-400" />
                <span className="text-sm font-medium text-zinc-700">
                  {post.category}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Article Body */}
        <div className="prose-content max-w-none">
          <div
            dangerouslySetInnerHTML={{
              __html: post.content || "",
            }}
          />
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-zinc-200 mt-20 py-12 bg-white">
        <div className="max-w-5xl mx-auto px-8 text-center">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} Luis Foto Nature
          </p>
        </div>
      </footer>
    </div>
  );
};

export default IndicidualPostPage;
