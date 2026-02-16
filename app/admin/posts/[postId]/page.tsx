"use client";

import { format } from "date-fns";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  User,
  Tag,
  CheckCircle2,
  Circle,
  ImageOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetPostById } from "@/app/adapters/hooks";
import { updatePost } from "@/app/adapters/api";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import { uploadImage } from "@/app/services/imageUpload";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { TipTapEditor } from "@/components/ui/tiptap-editor";
import { findRemovedImageUrls } from "@/app/utils/imageTracking";
import { useQueryClient } from "@tanstack/react-query";

interface PostFormData {
  featuredImage: string;
  title: string;
  category: string;
  active: boolean;
  content: string;
}

export default function PostDetailPage() {
  const queryClient = useQueryClient();

  const router = useRouter();
  const params = useParams();
  const postId = Number(params.postId);

  const { data: postResponse } = useGetPostById(postId);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const featuredImageInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    defaultValues: {
      featuredImage: postResponse?.[0].featuredImage || "",
      title: postResponse?.[0]?.title || "",
      category: postResponse?.[0]?.category || "",
      active: postResponse?.[0]?.active || false,
      content: postResponse?.[0]?.content || "",
    },
  });

  useEffect(() => {
    if (postResponse?.[0]) {
      form.reset({
        featuredImage: postResponse[0].featuredImage || "",
        title: postResponse[0].title || "",
        category: postResponse[0].category || "",
        active: postResponse[0].active || false,
        content: postResponse[0].content || "",
      });
    }
  }, [postResponse, form]);

  const onSubmit = async (data: PostFormData) => {
    setIsSubmitting(true);
    try {
      // Find images that were removed from the editor content
      const oldContent = postResponse?.[0]?.content || "";
      const removedContentImages = findRemovedImageUrls(
        oldContent,
        data.content,
      );

      // Check if featured image was replaced
      const imagesToDelete = [...removedContentImages];
      const oldFeaturedImage = postResponse?.[0]?.featuredImage || "";
      const newFeaturedImage = data.featuredImage || "";

      if (oldFeaturedImage && oldFeaturedImage !== newFeaturedImage) {
        imagesToDelete.push(oldFeaturedImage);
      }

      // Update the post with new content and image URLs to delete
      await updatePost(postId, {
        postData: {
          featuredImage: data.featuredImage,
          title: data.title,
          category: data.category,
          content: data.content,
          active: data.active,
        },
        imageUrlsToDelete: imagesToDelete,
      });

      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      toast.success("Post updated successfully!");
      setIsEditMode(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update post",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeaturedImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingImage(true);
      try {
        // Compress image before uploading
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });

        // Upload to S3 using presigned URL
        const imageUrl = await uploadImage(compressedFile, "featured", postId);

        // Update form with new image URL
        form.setValue("featuredImage", imageUrl);
        toast.success("Featured image uploaded successfully");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Image upload failed";
        toast.error(errorMessage);
        console.error("Featured image upload error:", error);
      } finally {
        setIsUploadingImage(false);
        // Reset input
        if (featuredImageInputRef.current) {
          featuredImageInputRef.current.value = "";
        }
      }
    }
  };

  const formattedDate = postResponse?.[0].createdAt
    ? format(postResponse[0].createdAt, "dd/MM/yyyy")
    : "";

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-6">
      <div className="mx-auto max-w-250">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back to Posts</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
          {/* Featured Image Section */}
          <div className="relative w-full h-96 bg-zinc-100 border-b border-zinc-200 flex items-center justify-center overflow-hidden">
            {postResponse?.[0].featuredImage ? (
              <Image
                src={postResponse?.[0].featuredImage}
                alt={postResponse?.[0].title}
                fill
                className="object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-zinc-400">
                <ImageOff className="h-12 w-12" />
                <span className="text-sm font-medium">No featured image</span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-8">
            {isEditMode ? (
              // Edit Form Mode
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-zinc-900 mb-6">
                    Edit Post
                  </h2>

                  {/* Featured Image Field */}
                  <FormField
                    control={form.control}
                    name="featuredImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Featured Image</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            {field.value && (
                              <div className="relative w-full h-48 bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200">
                                <Image
                                  src={field.value}
                                  alt="Featured image preview"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="flex items-center gap-3">
                              <input
                                ref={featuredImageInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFeaturedImageUpload}
                                disabled={isUploadingImage}
                                className="hidden"
                              />
                              <Button
                                type="button"
                                onClick={() =>
                                  featuredImageInputRef.current?.click()
                                }
                                disabled={isUploadingImage}
                                className="bg-zinc-900 hover:bg-zinc-800 text-white"
                              >
                                {isUploadingImage
                                  ? "Uploading..."
                                  : "Upload Featured Image"}
                              </Button>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Title Field */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Post title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Category Field */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                          >
                            <option value="">Select a category</option>
                            <option value="Europa">Europa</option>
                            <option value="Asia">Asia</option>
                            <option value="Oceanía">Oceanía</option>
                            <option value="América del Norte">
                              América del Norte
                            </option>
                            <option value="América del Sur">
                              América del Sur
                            </option>
                            <option value="África">África</option>
                            <option value="La Antártida">La Antártida</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Active Field */}
                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-3">
                          <FormLabel className="mb-0">Active</FormLabel>
                          <Switch
                            checked={Boolean(field.value)}
                            onCheckedChange={field.onChange}
                            ref={field.ref}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Content Field */}
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <TipTapEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Write your post content..."
                          postId={postId}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg py-2.5 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </Form>
            ) : (
              // View Mode
              <>
                {/* Title */}
                <div className="mb-8">
                  <h1 className="text-4xl font-black text-zinc-900 leading-tight mb-2">
                    {postResponse?.[0].title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-zinc-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="h-4 w-4" />
                      <span>{postResponse?.[0].owner}</span>
                    </div>
                  </div>
                </div>

                {/* Meta Information Grid */}
                <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-zinc-200">
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 uppercase mb-2">
                      Category
                    </label>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-zinc-400" />
                      <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-zinc-100 text-zinc-700 rounded-full">
                        {postResponse?.[0].category}
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 uppercase mb-2">
                      Status
                    </label>
                    <div className="flex items-center gap-2">
                      {postResponse?.[0].active ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-zinc-400" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          postResponse?.[0].active
                            ? "text-green-700"
                            : "text-zinc-700"
                        }`}
                      >
                        {postResponse?.[0].active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 uppercase mb-3">
                    Content
                  </label>
                  <div
                    className="prose prose-zinc max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: postResponse?.[0].content || "",
                    }}
                  />
                </div>
              </>
            )}
          </div>

          {/* Action Footer */}
          <div className="px-8 py-6 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsEditMode(!isEditMode)}
                variant="outline"
                className="px-4 py-2 text-sm font-medium rounded-md border border-zinc-200 text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                {isEditMode ? "Cancel" : "Edit"}
              </Button>
              <Button className="px-4 py-2 text-sm font-medium rounded-md bg-zinc-900 hover:bg-zinc-800 text-white transition-colors">
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
