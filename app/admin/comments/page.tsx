"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  CheckCircle2,
  XCircle,
  Trash2,
  MessageCircle,
  Eye,
  ExternalLink,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetAllComments, useUpdateComment } from "@/app/adapters/hooks";

type Comment = {
  id: number;
  email: string;
  content: string;
  approved: boolean;
  createdAt: string;
  postId: number;
  postTitle: string;
};

export default function CommentsPage() {
  const queryClient = useQueryClient();

  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "approved" | "pending">("");
  const [postFilter, setPostFilter] = useState("");
  const [viewingComment, setViewingComment] = useState<Comment | null>(null);

  const { data: commentsResponse } = useGetAllComments();
  const updateCommentMutation = useUpdateComment();

  const postTitles = useMemo(() => {
    const titles = (commentsResponse as Comment[])?.map((c) => c.postTitle) ?? [];
    return [...new Set(titles)].sort();
  }, [commentsResponse]);

  const filteredComments = useMemo(() => {
    return (commentsResponse as Comment[])?.filter((comment) => {
      const searchMatch =
        comment.content.toLowerCase().includes(searchFilter.toLowerCase()) ||
        comment.email.toLowerCase().includes(searchFilter.toLowerCase());
      const statusMatch =
        !statusFilter ||
        (statusFilter === "approved" && comment.approved) ||
        (statusFilter === "pending" && !comment.approved);
      const postMatch = !postFilter || comment.postTitle === postFilter;
      return searchMatch && statusMatch && postMatch;
    });
  }, [searchFilter, statusFilter, postFilter, commentsResponse]);

  const handleApprove = async (commentId: number, currentApproved: boolean) => {
    try {
      await updateCommentMutation.mutateAsync({
        commentId,
        approved: !currentApproved,
      });
      toast.success(
        currentApproved ? "Comment unapproved" : "Comment approved",
      );
      queryClient.invalidateQueries({ queryKey: ["allComments"] });
    } catch {
      toast.error("Failed to update comment");
    }
  };

  const handleDelete = async (_commentId: number) => {
    // TODO: implement delete API
    toast.error("Delete not implemented yet");
  };

  const handleFilterChange = () => {
    setPageIndex(0);
  };

  const columns = useMemo<ColumnDef<Comment>[]>(
    () => [
      {
        accessorKey: "email",
        header: "Author",
        cell: (info) => (
          <span className="font-medium text-zinc-900">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "postTitle",
        header: "Post",
        cell: (info) => (
          <span className="text-sm text-zinc-700 font-medium truncate max-w-48 block">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "content",
        header: "Comment",
        cell: (info) => {
          const content = info.getValue() as string;
          return (
            <span className="text-sm text-zinc-700 line-clamp-2 max-w-md">
              {content}
            </span>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: (info) => (
          <span className="text-sm text-zinc-600">
            {new Date(info.getValue() as string).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        ),
      },
      {
        accessorKey: "approved",
        header: "Status",
        cell: (info) => {
          const approved = info.getValue() as boolean;
          return (
            <span
              className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                approved
                  ? "bg-green-50 text-green-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {approved ? "Approved" : "Pending"}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: (info) => {
          const comment = info.row.original;
          return (
            <div className="flex items-center justify-end gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={`/posts/${comment.postId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors inline-flex"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>View post</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setViewingComment(comment)}
                    className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>View full comment</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleApprove(comment.id, comment.approved)}
                    className={`p-2 rounded-md transition-colors ${
                      comment.approved
                        ? "text-amber-500 hover:text-amber-700 hover:bg-amber-50"
                        : "text-green-500 hover:text-green-700 hover:bg-green-50"
                    }`}
                  >
                    {comment.approved ? (
                      <XCircle className="h-4 w-4" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {comment.approved ? "Unapprove" : "Approve"}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </div>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: filteredComments ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newState.pageIndex);
    },
  });

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-6">
      <div className="mx-auto max-w-325">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-black text-zinc-900">Commentarios</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Review and manage user comments
          </p>
        </div>

        {/* Filters */}
        <div className="mb-5 flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-52">
            <label className="block text-xs font-semibold text-zinc-600 uppercase mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search by email or content..."
                value={searchFilter}
                onChange={(e) => {
                  setSearchFilter(e.target.value);
                  handleFilterChange();
                }}
                className="w-full pl-8 pr-3 py-1.5 text-sm rounded-md border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-600 uppercase mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as "" | "approved" | "pending");
                handleFilterChange();
              }}
              className="px-3 py-1.5 text-sm rounded-md border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-600 uppercase mb-1">
              Post
            </label>
            <select
              value={postFilter}
              onChange={(e) => {
                setPostFilter(e.target.value);
                handleFilterChange();
              }}
              className="px-3 py-1.5 text-sm rounded-md border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent max-w-64 truncate"
            >
              <option value="">All</option>
              {postTitles.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>

          {(searchFilter || statusFilter || postFilter) && (
            <button
              onClick={() => {
                setSearchFilter("");
                setStatusFilter("");
                setPostFilter("");
                setPageIndex(0);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-zinc-600 rounded-md border border-zinc-200 hover:bg-zinc-50 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
          {(filteredComments?.length ?? 0) > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50">
                      {table.getHeaderGroups()[0]?.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-4 py-2.5 text-left text-xs font-semibold text-zinc-700 uppercase tracking-tight"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-zinc-50/50 transition-colors"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-4 py-2.5">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-200 bg-white">
                <div className="text-xs text-zinc-600">
                  Page{" "}
                  <span className="font-medium text-zinc-900">
                    {table.getState().pagination.pageIndex + 1}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-zinc-900">
                    {table.getPageCount()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="text-center">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
                  <MessageCircle className="h-5 w-5 text-zinc-400" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 mb-1">
                  No comments yet
                </h3>
                <p className="text-xs text-zinc-600">
                  Comments will appear here once users start engaging with your
                  posts
                </p>
              </div>
            </div>
          )}
        </div>

        {/* View Comment Dialog */}
        <Dialog
          open={!!viewingComment}
          onOpenChange={(open) => !open && setViewingComment(null)}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-black text-zinc-900">
                Comment Details
              </DialogTitle>
            </DialogHeader>
            {viewingComment && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-900">
                    {viewingComment.email}
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                      viewingComment.approved
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {viewingComment.approved ? "Approved" : "Pending"}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase mb-1">
                    Post
                  </p>
                  <p className="text-sm text-zinc-700">
                    {viewingComment.postTitle}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase mb-1">
                    Comment
                  </p>
                  <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                    {viewingComment.content}
                  </p>
                </div>
                <p className="text-xs text-zinc-400">
                  {new Date(viewingComment.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
