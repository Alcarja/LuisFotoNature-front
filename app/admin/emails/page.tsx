"use client";

import { useCallback, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import {
  useGetAllSubscribers,
  useGetAllPosts,
  useSendPostCampaignEmail,
} from "@/app/adapters/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Send,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Post } from "@/types/post";

interface Subscriber {
  id: number;
  email: string;
  emailBlacklisted: boolean;
  smsBlacklisted: boolean;
  createdAt: string;
  modifiedAt: string;
  listIds: number[];
}

interface SubscribersResponse {
  contacts: Subscriber[];
  count: number;
}

export default function AdminEmails() {
  const queryClient = useQueryClient();
  const { data: subscribersData, isLoading: subscribersLoading } =
    useGetAllSubscribers();
  const { data: postsData, isLoading: postsLoading } = useGetAllPosts();
  const sendCampaign = useSendPostCampaignEmail();

  const subscribers = useMemo(
    () => (subscribersData as SubscribersResponse)?.contacts ?? [],
    [subscribersData],
  );
  const posts = useMemo(() => (postsData as Post[]) ?? [], [postsData]);

  // --- Subscribers state ---
  const [subSearch, setSubSearch] = useState("");
  const [subPageIndex, setSubPageIndex] = useState(0);
  const subPageSize = 10;

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((s) =>
      s.email.toLowerCase().includes(subSearch.toLowerCase()),
    );
  }, [subscribers, subSearch]);

  const subColumns = useMemo<ColumnDef<Subscriber>[]>(
    () => [
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => (
          <span className="font-medium text-zinc-900">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Subscribed",
        cell: (info) => (
          <span className="text-sm text-zinc-600">
            {new Date(info.getValue() as string).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        ),
      },
      {
        accessorKey: "emailBlacklisted",
        header: "Status",
        cell: (info) => {
          const blacklisted = info.getValue() as boolean;
          return (
            <span
              className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                blacklisted
                  ? "bg-red-50 text-red-700"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {blacklisted ? "Blacklisted" : "Active"}
            </span>
          );
        },
      },
    ],
    [],
  );

  const subTable = useReactTable({
    data: filteredSubscribers,
    columns: subColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination: { pageIndex: subPageIndex, pageSize: subPageSize } },
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex: subPageIndex, pageSize: subPageSize })
          : updater;
      setSubPageIndex(newState.pageIndex);
    },
  });

  const handleSendCampaign = useCallback(
    (postId: number) => {
      sendCampaign.mutate(
        { postId },
        {
          onSuccess: () => {
            toast.success("Campaign sent successfully!");
            queryClient.invalidateQueries({ queryKey: ["posts"] });
          },
          onError: () => {
            toast.error("Failed to send campaign. Please try again.");
          },
        },
      );
    },
    [sendCampaign, queryClient],
  );

  // --- Posts state ---
  const [postSearch, setPostSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [postPageIndex, setPostPageIndex] = useState(0);
  const postPageSize = 10;

  const categories = useMemo(() => {
    const cats = new Set(posts.map((p) => p.category).filter(Boolean));
    return Array.from(cats) as string[];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const titleMatch = p.title
        .toLowerCase()
        .includes(postSearch.toLowerCase());
      const catMatch = !categoryFilter || p.category === categoryFilter;
      return titleMatch && catMatch;
    });
  }, [posts, postSearch, categoryFilter]);

  const postColumns = useMemo<ColumnDef<Post>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: (info) => (
          <span className="font-medium text-zinc-900">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: (info) => {
          const value = info.getValue() as string | undefined;
          return value ? (
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-zinc-100 text-zinc-700 rounded-full">
              {value}
            </span>
          ) : (
            <span className="text-zinc-400 text-xs">—</span>
          );
        },
      },
      {
        accessorKey: "active",
        header: "Status",
        cell: (info) => {
          const isActive = info.getValue() as boolean | undefined;
          return (
            <span
              className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                isActive
                  ? "bg-green-50 text-green-700"
                  : "bg-zinc-100 text-zinc-700"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: (info) => (
          <span className="text-sm text-zinc-600">
            {new Date(info.getValue() as string).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        ),
      },
      {
        accessorKey: "campaignSent",
        header: "Campaign",
        cell: (info) => {
          const sent = info.getValue() as boolean | undefined;
          return (
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${
                sent
                  ? "bg-green-50 text-green-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {sent ? (
                <>
                  <Check className="h-3 w-3" /> Campaña enviada
                </>
              ) : (
                "No enviada"
              )}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: (info) => {
          const post = info.row.original;
          return (
            <div className="flex justify-end">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleSendCampaign(post.id)}
                    disabled={post.campaignSent || sendCampaign.isPending}
                    className="p-2 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {post.campaignSent
                    ? "Campaña ya enviada"
                    : "Enviar campaña a contactos"}
                </TooltipContent>
              </Tooltip>
            </div>
          );
        },
      },
    ],
    [handleSendCampaign, sendCampaign.isPending],
  );

  const postTable = useReactTable({
    data: filteredPosts,
    columns: postColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination: { pageIndex: postPageIndex, pageSize: postPageSize } },
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex: postPageIndex, pageSize: postPageSize })
          : updater;
      setPostPageIndex(newState.pageIndex);
    },
  });

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-6">
      <div className="mx-auto max-w-325">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-zinc-900">Emails</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage subscribers and email campaigns
          </p>
        </div>

        {/* ========== SUBSCRIBERS SECTION ========== */}
        <section className="mb-12">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-zinc-900">Subscribers</h2>
            <p className="text-sm text-zinc-500">
              {subscribers.length} contact{subscribers.length !== 1 && "s"} in
              your list
            </p>
          </div>

          {/* Search */}
          <div className="mb-5 flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-52">
              <label className="block text-xs font-semibold text-zinc-600 uppercase mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search by email..."
                  value={subSearch}
                  onChange={(e) => {
                    setSubSearch(e.target.value);
                    setSubPageIndex(0);
                  }}
                  className="w-full pl-8 pr-3 py-1.5 text-sm rounded-md border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                />
              </div>
            </div>
            {subSearch && (
              <button
                onClick={() => {
                  setSubSearch("");
                  setSubPageIndex(0);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-zinc-600 rounded-md border border-zinc-200 hover:bg-zinc-50 transition-colors"
              >
                <X className="h-3 w-3" /> Clear
              </button>
            )}
          </div>

          {/* Subscribers table */}
          <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
            {subscribersLoading ? (
              <div className="p-12 text-center text-sm text-zinc-400">
                Loading subscribers...
              </div>
            ) : filteredSubscribers.length === 0 ? (
              <div className="p-12 text-center text-sm text-zinc-400">
                No subscribers found.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      {subTable.getHeaderGroups().map((headerGroup) => (
                        <tr
                          key={headerGroup.id}
                          className="border-b border-zinc-200 bg-zinc-50"
                        >
                          {headerGroup.headers.map((header) => (
                            <th
                              key={header.id}
                              className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider"
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody>
                      {subTable.getRowModel().rows.map((row) => (
                        <tr
                          key={row.id}
                          className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50 transition-colors"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="px-4 py-3 text-sm">
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

                {subTable.getPageCount() > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-200">
                    <span className="text-xs text-zinc-500">
                      Page {subPageIndex + 1} of {subTable.getPageCount()}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSubPageIndex((p) => p - 1)}
                        disabled={!subTable.getCanPreviousPage()}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSubPageIndex((p) => p + 1)}
                        disabled={!subTable.getCanNextPage()}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* ========== POSTS SECTION ========== */}
        <section>
          <div className="mb-5">
            <h2 className="text-lg font-bold text-zinc-900">Posts</h2>
            <p className="text-sm text-zinc-500">
              {posts.length} post{posts.length !== 1 && "s"} available
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
                  placeholder="Search by title..."
                  value={postSearch}
                  onChange={(e) => {
                    setPostSearch(e.target.value);
                    setPostPageIndex(0);
                  }}
                  className="w-full pl-8 pr-3 py-1.5 text-sm rounded-md border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-600 uppercase mb-1">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPostPageIndex(0);
                }}
                className="px-3 py-1.5 text-sm rounded-md border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              >
                <option value="">All</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            {(postSearch || categoryFilter) && (
              <button
                onClick={() => {
                  setPostSearch("");
                  setCategoryFilter("");
                  setPostPageIndex(0);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-zinc-600 rounded-md border border-zinc-200 hover:bg-zinc-50 transition-colors"
              >
                <X className="h-3 w-3" /> Clear
              </button>
            )}
          </div>

          {/* Posts table */}
          <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
            {postsLoading ? (
              <div className="p-12 text-center text-sm text-zinc-400">
                Loading posts...
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="p-12 text-center text-sm text-zinc-400">
                No posts found.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      {postTable.getHeaderGroups().map((headerGroup) => (
                        <tr
                          key={headerGroup.id}
                          className="border-b border-zinc-200 bg-zinc-50"
                        >
                          {headerGroup.headers.map((header) => (
                            <th
                              key={header.id}
                              className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider"
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody>
                      {postTable.getRowModel().rows.map((row) => (
                        <tr
                          key={row.id}
                          className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50 transition-colors"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="px-4 py-3 text-sm">
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

                {postTable.getPageCount() > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-200">
                    <span className="text-xs text-zinc-500">
                      Page {postPageIndex + 1} of {postTable.getPageCount()}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPostPageIndex((p) => p - 1)}
                        disabled={!postTable.getCanPreviousPage()}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPostPageIndex((p) => p + 1)}
                        disabled={!postTable.getCanNextPage()}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
