"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useGetAllGalleries, useCreateGallery } from "@/app/adapters/hooks";
import { useAuth } from "@/app/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Gallery {
  id: number;
  userId: number;
  name: string;
  continent: string;
  place: string;
  active: boolean;
  createdAt: string;
}

const continents = [
  "Europa",
  "Asia",
  "Oceanía",
  "América del Norte",
  "América del Sur",
  "África",
  "La Antártida",
];

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters.")
    .max(100, "Name must be at most 100 characters."),
  continent: z.string().min(1, "Please select a continent."),
  place: z
    .string()
    .min(2, "Place must be at least 2 characters.")
    .max(100, "Place must be at most 100 characters."),
});

export default function AdminGalleries() {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: galleriesResponse } = useGetAllGalleries();
  const createGalleryMutation = useCreateGallery();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;

  const [searchFilter, setSearchFilter] = useState("");
  const [continentFilter, setContinentFilter] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", continent: "", place: "" },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!user?.id) {
      toast.error("User not authenticated. Please log in.");
      return;
    }

    createGalleryMutation.mutate(
      { userId: Number(user.id), ...data },
      {
        onSuccess: () => {
          toast.success("Gallery created successfully!");
          queryClient.invalidateQueries({ queryKey: ["allGalleries"] });
          form.reset();
          setDialogOpen(false);
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : "Failed to create gallery",
          );
        },
      },
    );
  };

  const filteredGalleries = useMemo(() => {
    return (galleriesResponse as Gallery[])?.filter((gallery) => {
      const searchMatch =
        gallery.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        gallery.place.toLowerCase().includes(searchFilter.toLowerCase()) ||
        gallery.continent.toLowerCase().includes(searchFilter.toLowerCase());
      const continentMatch =
        !continentFilter || gallery.continent === continentFilter;
      return searchMatch && continentMatch;
    });
  }, [searchFilter, continentFilter, galleriesResponse]);

  const columns = useMemo<ColumnDef<Gallery>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: (info) => (
          <span className="font-medium text-zinc-900">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "place",
        header: "Place",
        cell: (info) => (
          <span className="text-sm text-zinc-600">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "continent",
        header: "Continent",
        cell: (info) => (
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-zinc-100 text-zinc-700 rounded-full">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created",
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
        accessorKey: "active",
        header: "Status",
        cell: (info) => {
          const isActive = info.getValue() as boolean;
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
        id: "actions",
        header: "",
        cell: (info) => {
          const gallery = info.row.original;
          return (
            <div className="flex items-center justify-end gap-1">
              <button
                onClick={() => router.push(`/admin/galleries/${gallery.id}`)}
                className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        },
      },
    ],
    [router],
  );

  const table = useReactTable({
    data: filteredGalleries ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: { pageIndex, pageSize },
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
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-zinc-900">Galerías</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Manage your photography galleries
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors shadow-sm">
                <Plus className="h-4 w-4" />
                Create Gallery
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader className="pb-2">
                <DialogTitle className="text-2xl font-black text-zinc-900">
                  Create New Gallery
                </DialogTitle>
                <DialogDescription className="text-sm text-zinc-600 pt-1">
                  Add a new photography gallery
                </DialogDescription>
              </DialogHeader>
              <form
                id="form-create-gallery"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 py-4"
              >
                {/* Name */}
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-zinc-700">
                        Name
                      </label>
                      <Input
                        {...field}
                        placeholder="E.g., Wildlife of Borneo"
                        className={`w-full px-4 py-2.5 text-sm rounded-md border transition-colors ${
                          fieldState.invalid
                            ? "border-red-300 focus:ring-red-500"
                            : "border-zinc-200 focus:ring-zinc-900"
                        } bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:border-transparent`}
                        autoComplete="off"
                      />
                      {fieldState.invalid && fieldState.error && (
                        <p className="text-xs text-red-600 flex items-center gap-1.5 pt-1">
                          ✕ {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                {/* Continent */}
                <Controller
                  name="continent"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-zinc-700">
                        Continent
                      </label>
                      <select
                        {...field}
                        className={`w-full px-4 py-2.5 text-sm rounded-md border transition-colors ${
                          fieldState.invalid
                            ? "border-red-300 focus:ring-red-500"
                            : "border-zinc-200 focus:ring-zinc-900"
                        } bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:border-transparent`}
                      >
                        <option value="">Select a continent</option>
                        {continents.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      {fieldState.invalid && fieldState.error && (
                        <p className="text-xs text-red-600 flex items-center gap-1.5 pt-1">
                          ✕ {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                {/* Place */}
                <Controller
                  name="place"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-zinc-700">
                        Place
                      </label>
                      <Input
                        {...field}
                        placeholder="E.g., Borneo, Malaysia"
                        className={`w-full px-4 py-2.5 text-sm rounded-md border transition-colors ${
                          fieldState.invalid
                            ? "border-red-300 focus:ring-red-500"
                            : "border-zinc-200 focus:ring-zinc-900"
                        } bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:border-transparent`}
                        autoComplete="off"
                      />
                      {fieldState.invalid && fieldState.error && (
                        <p className="text-xs text-red-600 flex items-center gap-1.5 pt-1">
                          ✕ {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </form>

              <div className="flex gap-3 pt-6 border-t border-zinc-200 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setDialogOpen(false);
                  }}
                  className="flex-1 text-sm font-medium rounded-md border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-colors py-2.5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="form-create-gallery"
                  className="flex-1 text-sm font-medium rounded-md bg-zinc-900 hover:bg-zinc-800 text-white transition-colors py-2.5"
                >
                  Create Gallery
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
                placeholder="Search by name, place or continent..."
                value={searchFilter}
                onChange={(e) => {
                  setSearchFilter(e.target.value);
                  setPageIndex(0);
                }}
                className="w-full pl-8 pr-3 py-1.5 text-sm rounded-md border border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-600 uppercase mb-1">
              Continent
            </label>
            <select
              value={continentFilter}
              onChange={(e) => {
                setContinentFilter(e.target.value);
                setPageIndex(0);
              }}
              className="px-3 py-1.5 text-sm rounded-md border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
            >
              <option value="">All</option>
              {continents.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {(searchFilter || continentFilter) && (
            <button
              onClick={() => {
                setSearchFilter("");
                setContinentFilter("");
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
          {galleriesResponse?.length > 0 ? (
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
                  <Plus className="h-5 w-5 text-zinc-400" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 mb-1">
                  No galleries yet
                </h3>
                <p className="text-xs text-zinc-600 mb-3">
                  Create your first gallery to get started
                </p>
                <Button
                  onClick={() => setDialogOpen(true)}
                  className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create Gallery
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
