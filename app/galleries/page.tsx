"use client";

import {
  useGetAllActiveGalleries,
  useGetAllGalleries,
  useGetGalleryImagesByGalleryId,
} from "@/app/adapters/hooks";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Globe,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Images,
} from "lucide-react";

interface Gallery {
  id: number;
  name: string;
  continent: string;
  place: string;
  active: boolean;
  createdAt: string;
}

interface GalleryImage {
  id: number;
  galleryId: number;
  imageUrl: string;
}

function GalleryCard({ gallery }: { gallery: Gallery }) {
  const { data: imagesResponse } = useGetGalleryImagesByGalleryId(gallery.id);
  const images = (imagesResponse as GalleryImage[]) ?? [];
  const previewImages = images.slice(0, 2);

  return (
    <Link href={`/galleries/${gallery.id}`} className="group block">
      {/* Image preview area */}
      <div className="relative w-full h-60 bg-zinc-100 rounded-xl overflow-hidden border border-zinc-200 mb-4">
        {previewImages.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-zinc-100 to-zinc-200">
            <span className="text-5xl opacity-40">📷</span>
          </div>
        ) : previewImages.length === 1 ? (
          <Image
            src={previewImages[0].imageUrl}
            alt={gallery.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex h-full gap-px">
            <div className="relative flex-3">
              <Image
                src={previewImages[0].imageUrl}
                alt={gallery.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative flex-2">
              <Image
                src={previewImages[1].imageUrl}
                alt={`${gallery.name} preview`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        )}

        {/* Dark gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/50 to-transparent pointer-events-none" />

        {/* Photo count badge */}
        {images.length > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
            <Images className="h-3 w-3" />
            {images.length} {images.length === 1 ? "foto" : "fotos"}
          </div>
        )}

        {/* Continent badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-zinc-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            <Globe className="h-3 w-3" />
            {gallery.continent}
          </span>
        </div>
      </div>

      {/* Gallery info */}
      <div className="space-y-2">
        <h2 className="text-lg font-black text-zinc-900 group-hover:text-zinc-600 transition-colors line-clamp-1 leading-tight">
          {gallery.name}
        </h2>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>{gallery.place}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <time>{format(new Date(gallery.createdAt), "MMM yyyy")}</time>
          </div>
        </div>
      </div>

      {/* Animated underline on hover */}
      <div className="mt-3 h-px bg-zinc-900 transition-all duration-300 w-0 group-hover:w-full" />
    </Link>
  );
}

const GALLERIES_PER_PAGE = 12;

const GalleriesPage = () => {
  const { data: galleriesResponse } = useGetAllActiveGalleries();

  const [selectedContinent, setSelectedContinent] = useState<string | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const allGalleries = (
    Array.isArray(galleriesResponse) ? galleriesResponse : []
  ).filter((g: Gallery) => g.active) as Gallery[];

  const continents = Array.from(
    new Set(allGalleries.map((g) => g.continent).filter(Boolean)),
  ) as string[];

  const filteredGalleries = allGalleries.filter((gallery) => {
    const matchesContinent =
      !selectedContinent || gallery.continent === selectedContinent;
    const matchesSearch =
      gallery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gallery.place.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesContinent && matchesSearch;
  });

  const effectivePage =
    selectedContinent !== null || searchTerm ? 1 : currentPage;
  const totalPages = Math.ceil(filteredGalleries.length / GALLERIES_PER_PAGE);
  const startIndex = (effectivePage - 1) * GALLERIES_PER_PAGE;
  const paginatedGalleries = filteredGalleries.slice(
    startIndex,
    startIndex + GALLERIES_PER_PAGE,
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-linear-to-b from-zinc-50 to-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <h1 className="text-5xl sm:text-6xl font-black text-zinc-900 mb-4 tracking-tight">
              Galerías
            </h1>
            <p className="text-lg text-zinc-600 leading-relaxed">
              Colecciones de fotografía de naturaleza alrededor del mundo.
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search */}
        <div className="mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o lugar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-zinc-200 bg-white text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="mt-3 text-sm text-zinc-500">
              {filteredGalleries.length}{" "}
              {filteredGalleries.length === 1 ? "galería" : "galerías"}{" "}
              encontradas
            </p>
          )}
        </div>

        {/* Continent filter */}
        {continents.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedContinent(null)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  selectedContinent === null
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
                )}
              >
                Todos
              </button>
              {continents.map((continent) => (
                <button
                  key={continent}
                  onClick={() => setSelectedContinent(continent)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                    selectedContinent === continent
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
                  )}
                >
                  {continent}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Gallery grid */}
        {filteredGalleries.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedGalleries.map((gallery) => (
                <GalleryCard key={gallery.id} gallery={gallery} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-14 flex items-center justify-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={effectivePage === 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
                          effectivePage === page
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
                  disabled={effectivePage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="text-6xl mb-4 opacity-40">📷</div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-2">
              No hay galerías
            </h3>
            <p className="text-zinc-500">
              Vuelve pronto para ver las novedades
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleriesPage;
