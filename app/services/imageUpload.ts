import stpApi from "@/app/utils/stp-api";

export interface PresignedUrlResponse {
  presignedUrl: string;
  publicUrl: string;
}

export interface UploadConfirmResponse {
  success: boolean;
  imageUrl: string;
}

/**
 * Upload an image to S3 using a presigned URL
 * 1. Request presigned URL from backend
 * 2. Upload image directly to S3
 * 3. Confirm upload with backend
 */
export async function uploadImage(
  file: File,
  context: "featured" | "post-body" = "post-body",
  postId?: number
): Promise<string> {
  try {
    // Step 1: Get presigned URL
    const presignResponse = await stpApi.post("/api/upload/presign", {
      filename: file.name,
      contentType: file.type,
      postId,
    });

    const { presignedUrl, publicUrl } = presignResponse as PresignedUrlResponse;

    // Step 2: Upload directly to S3
    const uploadResponse = await fetch(presignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error(`S3 upload failed: ${uploadResponse.statusText}`);
    }

    // Step 3: Confirm upload with backend
    const confirmResponse = await stpApi.post("/api/upload/confirm", {
      publicUrl,
      filename: file.name,
      contentType: file.type,
      context,
    });

    const { imageUrl } = confirmResponse as UploadConfirmResponse;
    return imageUrl;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Image upload failed";
    throw new Error(errorMessage);
  }
}
