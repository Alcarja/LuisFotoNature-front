"use client";

import { useParams } from "next/navigation";
import {
  useGetGalleryById,
  useGetGalleryImagesByGalleryId,
} from "@/app/adapters/hooks";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Globe,
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
  createdAt: string;
}

interface GalleryImage {
  id: number;
  galleryId: number;
  imageUrl: string;
}

const GalleryPage = () => {
  const params = useParams();
  const galleryId = Number(params.galleryId);

  const { data: galleryResponse } = useGetGalleryById(galleryId);
  const { data: imagesResponse } = useGetGalleryImagesByGalleryId(galleryId);

  const gallery = (galleryResponse as Gallery[])?.[0];
  const images = (imagesResponse as GalleryImage[]) ?? [];

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? null : (prev + 1) % images.length,
    );
  }, [images.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? null : (prev - 1 + images.length) % images.length,
    );
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, goNext, goPrev]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIndex]);

  if (!gallery) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-zinc-400 text-sm">Cargando galería...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-linear-to-b from-zinc-50 to-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 py-10 sm:py-14">
          <Link
            href="/galleries"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors text-sm font-medium mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Todas las galerías
          </Link>

          <h1 className="text-4xl sm:text-5xl font-black text-zinc-900 mb-5 tracking-tight">
            {gallery.name}
          </h1>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-500">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{gallery.place}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="h-4 w-4 shrink-0" />
              <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold bg-zinc-100 text-zinc-700 rounded-full">
                {gallery.continent}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 shrink-0" />
              <time>{format(new Date(gallery.createdAt), "MMMM yyyy")}</time>
            </div>
            <div className="flex items-center gap-1.5">
              <Images className="h-4 w-4 shrink-0" />
              <span>
                {images.length} {images.length === 1 ? "foto" : "fotos"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Uniform grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => openLightbox(index)}
                className="group relative aspect-4/3 w-full overflow-hidden rounded-xl border border-zinc-200 cursor-zoom-in"
              >
                <Image
                  src={image.imageUrl}
                  alt={`${gallery.name} — foto ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300 flex items-end p-3">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {index + 1} / {images.length}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="text-6xl mb-4 opacity-40">📷</div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">
              Sin fotos aún
            </h3>
            <p className="text-zinc-500 text-sm">
              Esta galería no tiene imágenes todavía.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium tabular-nums select-none">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Image */}
          <div
            className="relative w-full max-w-5xl px-20 max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex].imageUrl}
              alt={`${gallery.name} — foto ${lightboxIndex + 1}`}
              width={1920}
              height={1080}
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              priority
            />
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Foto siguiente"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
