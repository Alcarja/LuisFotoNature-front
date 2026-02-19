"use client";

import { useGetAllActivePosts } from "../adapters/hooks";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Calendar,
  Tag,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const PostsPage = () => {
  const { data: postsResponse } = useGetAllActivePosts();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const POSTS_PER_PAGE = 18;

  // Extract posts from response (assuming array format)
  const allPosts = Array.isArray(postsResponse) ? postsResponse : [];

  // Get unique categories
  const categories = Array.from(
    new Set(allPosts.map((post) => post.category).filter(Boolean)),
  ) as string[];

  // Filter posts by selected category and search term
  const filteredPosts = allPosts.filter((post) => {
    const matchesCategory =
      !selectedCategory || post.category === selectedCategory;
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Compute current page based on filter state
  const effectiveCurrentPage =
    selectedCategory !== null || searchTerm ? 1 : currentPage;

  // Pagination calculations
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (effectiveCurrentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-linear-to-b from-zinc-50 to-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <h1 className="text-5xl sm:text-6xl font-black text-zinc-900 mb-4 tracking-tight">
              Posts
            </h1>
            <p className="text-lg text-zinc-600 leading-relaxed">
              ¡Explora todos los viajes del Fotógrafo!
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar posts por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-zinc-200 bg-white text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="mt-3 text-sm text-zinc-600">
              Found {filteredPosts.length}{" "}
              {filteredPosts.length === 1 ? "post" : "posts"}
            </p>
          )}
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  selectedCategory === null
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
                )}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                    selectedCategory === category
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.id}`}
                  className="group cursor-pointer"
                >
                  <div className="space-y-4">
                    {/* Featured Image */}
                    <div className="relative w-full h-64 bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200">
                      {post.featuredImage ? (
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-zinc-100 to-zinc-200">
                          <span className="text-4xl">📷</span>
                        </div>
                      )}
                    </div>

                    {/* Post Info */}
                    <div>
                      {/* Category Badge */}
                      {post.category && (
                        <div className="flex items-center gap-2 mb-2">
                          <Tag className="h-3 w-3 text-zinc-500" />
                          <span className="text-xs font-semibold text-zinc-600 uppercase tracking-wide">
                            {post.category}
                          </span>
                        </div>
                      )}

                      {/* Title */}
                      <h2 className="text-xl font-black text-zinc-900 group-hover:text-zinc-700 transition-colors mb-3 line-clamp-2">
                        {post.title}
                      </h2>

                      {/* Meta Information */}
                      <div className="flex items-center gap-4 text-sm text-zinc-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          <time>
                            {post.createdAt
                              ? format(post.createdAt, "MMM dd, yyyy")
                              : ""}
                          </time>
                        </div>
                      </div>
                    </div>

                    {/* Hover Indicator */}
                    <div className="h-0.5 bg-zinc-900 group-hover:bg-zinc-700 transition-all duration-300 w-0 group-hover:w-full" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={effectiveCurrentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Anterior</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={cn(
                          "h-10 w-10 rounded-lg font-medium transition-colors",
                          effectiveCurrentPage === page
                            ? "bg-zinc-900 text-white"
                            : "border border-zinc-200 text-zinc-700 hover:bg-zinc-50",
                        )}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={effectiveCurrentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-2">
              No posts yet
            </h3>
            <p className="text-zinc-600">Check back soon for new photography</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsPage;
