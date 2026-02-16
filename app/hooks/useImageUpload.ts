import { useState } from "react";
import imageCompression from "browser-image-compression";
import { uploadImage } from "@/app/services/imageUpload";
import { toast } from "sonner";

export function useImageUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImageHandler = async (
    file: File,
    context: "featured" | "post-body" = "featured"
  ): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Compress image
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });

      // Upload using presigned URL
      const imageUrl = await uploadImage(compressedFile, context);
      toast.success("Image uploaded successfully");
      return imageUrl;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Image upload failed";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Image upload error:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadImage: uploadImageHandler,
    isLoading,
    error,
  };
}
