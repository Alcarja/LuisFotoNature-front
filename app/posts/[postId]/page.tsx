"use client";

import {
  useGetPostById,
  useGetCommentsByPostId,
  useCreateComment,
  useGetApprovedCommentsByPostId,
} from "@/app/adapters/hooks";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface Comment {
  id: number;
  postId: number;
  email: string;
  content: string;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
}

const IndicidualPostPage = () => {
  const router = useRouter();
  const params = useParams();
  const postId = Number(params.postId);
  const queryClient = useQueryClient();

  const { data: postResponse } = useGetPostById(postId);
  const { data: commentsResponse } = useGetApprovedCommentsByPostId(postId);
  const createCommentMutation = useCreateComment();

  const [commentEmail, setCommentEmail] = useState("");
  const [commentContent, setCommentContent] = useState("");

  const post = postResponse?.[0];

  const handleCreateComment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentEmail.trim() || !commentContent.trim()) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    createCommentMutation.mutate(
      {
        postId,
        comment: commentContent,
        email: commentEmail,
      },
      {
        onSuccess: () => {
          toast.success(
            "Comentario publicado correctamente. El administrador lo revisará y aprobará.",
          );
          setCommentEmail("");
          setCommentContent("");
          queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Error al crear el comentario",
          );
        },
      },
    );
  };

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

        {/* Comments Section */}
        <div className="mt-16 pt-12 border-t border-zinc-200">
          <h2 className="text-2xl font-bold text-zinc-900 mb-8">Comentarios</h2>

          {/* Create Comment Form */}
          <form
            onSubmit={handleCreateComment}
            className="mb-12 bg-zinc-50 rounded-lg p-6 border border-zinc-200"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Tu Email
                </label>
                <input
                  type="email"
                  value={commentEmail}
                  onChange={(e) => setCommentEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-2 rounded-lg border border-zinc-200 bg-white text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  disabled={createCommentMutation.isPending}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Comentario
                </label>
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Escribe tu comentario..."
                  className="w-full px-4 py-2 rounded-lg border border-zinc-200 bg-white text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none"
                  rows={4}
                  disabled={createCommentMutation.isPending}
                />
              </div>
              <button
                type="submit"
                disabled={createCommentMutation.isPending}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg py-2.5 font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createCommentMutation.isPending
                  ? "Publicando..."
                  : "Publicar Comentario"}
              </button>
            </div>
          </form>

          {/* Comments List - Show only approved comments */}
          {commentsResponse && commentsResponse.length > 0 ? (
            <div className="space-y-6">
              {commentsResponse
                .filter((comment: Comment) => comment.approved)
                .map((comment: Comment) => (
                  <div
                    key={comment.id}
                    className="bg-zinc-50 rounded-lg p-6 border border-zinc-100"
                  >
                    <div className="mb-3">
                      <p className="font-semibold text-zinc-900">
                        {comment.email}
                      </p>
                      <time className="text-xs text-zinc-500">
                        {format(
                          new Date(comment.createdAt),
                          "d 'de' MMMM 'de' yyyy",
                        )}
                      </time>
                    </div>
                    <p className="text-sm text-zinc-700 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 text-center py-8">
              No hay comentarios aún. ¡Sé el primero en comentar!
            </p>
          )}
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
