"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useGetGalleryById,
  useCreateGalleryImage,
  useGetGalleryImagesByGalleryId,
  useUpdateGallery,
} from "@/app/adapters/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Globe,
  CheckCircle2,
  XCircle,
  Clock,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { uploadImage } from "@/app/services/imageUpload";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";

interface Gallery {
  id: number;
  userId: number;
  name: string;
  continent: string;
  place: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GalleryImage {
  id: number;
  galleryId: number;
  imageUrl: string;
  createdAt: string;
}

const AdminGalleryId = () => {
  const router = useRouter();
  const params = useParams();
  const galleryId = Number(params.galleryId);

  const { data: galleryResponse } = useGetGalleryById(galleryId);
  const { data: galleryImagesResponse } =
    useGetGalleryImagesByGalleryId(galleryId);

  const queryClient = useQueryClient();
  const createGalleryImage = useCreateGalleryImage();
  const updateGallery = useUpdateGallery();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const placeRef = useRef<HTMLInputElement>(null);
  const continentRef = useRef<HTMLSelectElement>(null);
  const activeRef = useRef<HTMLSelectElement>(null);

  const handleSaveChanges = async () => {
    await updateGallery.mutateAsync({
      galleryId,
      data: {
        name: nameRef.current?.value,
        place: placeRef.current?.value,
        continent: continentRef.current?.value,
        active: activeRef.current?.value === "true",
      },
    });
    await queryClient.invalidateQueries({ queryKey: ["gallery", galleryId] });
    await queryClient.invalidateQueries({ queryKey: ["allGalleries"] });

    setIsEditMode(false);
    toast.success("Gallery updated successfully!");
  };

  const gallery = (galleryResponse as Gallery[])?.[0];
  const galleryImages = (galleryImagesResponse as GalleryImage[]) ?? [];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setIsUploading(true);
    try {
      for (const file of files) {
        const compressed = await imageCompression(file, {
          maxSizeMB: 1.5,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });
        const url = await uploadImage(
          compressed,
          "post-body",
          undefined,
          galleryId,
        );
        await createGalleryImage.mutateAsync({ galleryId, url });
      }
      await queryClient.invalidateQueries({
        queryKey: ["galleryImages", galleryId],
      });
      toast.success(
        files.length === 1
          ? "Image uploaded successfully!"
          : `${files.length} images uploaded successfully!`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image",
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!gallery) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <p className="text-zinc-500 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-6">
      <div className="mx-auto max-w-250">
        {/* Back button */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back to Galleries</span>
          </button>
        </div>

        {/* Gallery Info Card */}
        <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden mb-6">
          {/* Dark header */}
          <div className="bg-zinc-900 px-8 py-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-2">
                  Gallery #{gallery.id}
                </p>
                {isEditMode ? (
                  <input
                    ref={nameRef}
                    defaultValue={gallery.name}
                    className="text-3xl font-black text-white bg-transparent border-b border-zinc-600 focus:border-zinc-300 outline-none w-full pb-1"
                  />
                ) : (
                  <h1 className="text-3xl font-black text-white leading-tight">
                    {gallery.name}
                  </h1>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0 mt-1">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full ${
                    gallery.active
                      ? "bg-green-500/20 text-green-300"
                      : "bg-amber-500/20 text-amber-300"
                  }`}
                >
                  {gallery.active ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5" />
                  )}
                  {gallery.active ? "Active" : "Inactive"}
                </span>
                <Button
                  onClick={() => setIsEditMode(!isEditMode)}
                  size="sm"
                  variant="outline"
                  className="border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:text-white bg-transparent text-xs"
                >
                  {isEditMode ? (
                    <>
                      <X className="h-3.5 w-3.5 mr-1.5" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Pencil className="h-3.5 w-3.5 mr-1.5" />
                      Edit
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="p-8">
            {isEditMode ? (
              <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Place
                  </label>
                  <input
                    ref={placeRef}
                    defaultValue={gallery.place}
                    className="w-full px-3 py-2 text-sm rounded-md border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Continent
                  </label>
                  <select
                    ref={continentRef}
                    defaultValue={gallery.continent}
                    className="w-full px-3 py-2 text-sm rounded-md border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  >
                    {[
                      "Europa",
                      "Asia",
                      "Oceanía",
                      "América del Norte",
                      "América del Sur",
                      "África",
                      "La Antártida",
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Status
                  </label>
                  <select
                    ref={activeRef}
                    defaultValue={gallery.active ? "true" : "false"}
                    className="w-full px-3 py-2 text-sm rounded-md border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleSaveChanges}
                    disabled={updateGallery.isPending}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white text-sm px-6 disabled:opacity-50"
                  >
                    {updateGallery.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Place
                  </label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-zinc-400 shrink-0" />
                    <span className="text-base font-medium text-zinc-900">
                      {gallery.place}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Continent
                  </label>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-zinc-400 shrink-0" />
                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-zinc-100 text-zinc-700 rounded-full">
                      {gallery.continent}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Created
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-zinc-400 shrink-0" />
                    <span className="text-sm text-zinc-700">
                      {format(
                        new Date(gallery.createdAt),
                        "MMMM d, yyyy · HH:mm",
                      )}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Last Updated
                  </label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-zinc-400 shrink-0" />
                    <span className="text-sm text-zinc-700">
                      {format(
                        new Date(gallery.updatedAt),
                        "MMMM d, yyyy · HH:mm",
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Images Card */}
        <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />

          {/* Images header */}
          <div className="px-8 py-5 border-b border-zinc-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-zinc-900">Images</h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                {galleryImages.length} photos in this gallery
              </p>
            </div>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              {isUploading ? "Uploading..." : "Add Images"}
            </Button>
          </div>

          {/* Image grid */}
          <div className="p-8">
            <div className="grid grid-cols-3 gap-4">
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  className="group relative aspect-4/3 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-100"
                >
                  <Image
                    src={image.imageUrl}
                    alt={`Photo ${image.id}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-lg">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add photo placeholder */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="aspect-4/3 rounded-lg border-2 border-dashed border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 transition-all flex flex-col items-center justify-center gap-2 text-zinc-400 hover:text-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-8 w-8" />
                <span className="text-xs font-medium">
                  {isUploading ? "Uploading..." : "Add Photo"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGalleryId;
