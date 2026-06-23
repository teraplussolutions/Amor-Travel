"use server";

import { revalidatePath } from "next/cache";
import { compressImage } from "@/lib/compress-image";
import { isAcceptedImageMime, resolveImageMime } from "@/lib/image-mime";
import { MAX_COMPRESSED_BYTES, MAX_INPUT_BYTES } from "@/lib/image-upload-limits";
import { isValidImageMagic } from "@/lib/storage-upload";
import {
  getStorageBackend,
  storeSiteAsset,
  type SiteAssetFolder,
} from "@/lib/site-storage";

export type UploadSiteAssetResult = {
  error?: string;
  publicUrl?: string;
  jpegFallbackUrl?: string;
  width?: number;
  height?: number;
  sizeKb?: number;
  storageBackend?: "supabase" | "local";
};

export async function uploadSiteAssetAction(
  formData: FormData,
): Promise<UploadSiteAssetResult> {
  try {
    const file = formData.get("file");
    const folder = formData.get("folder");
    const namePrefix = formData.get("namePrefix");

    if (!(file instanceof File)) {
      return { error: "No file selected for upload." };
    }

    if (folder !== "hero" && folder !== "trips" && folder !== "logo") {
      return { error: "Invalid upload folder." };
    }

    const resolvedMime = resolveImageMime(file.type, file.name);
    if (!resolvedMime || !isAcceptedImageMime(resolvedMime)) {
      return {
        error:
          "Unsupported image type. Use JPEG, PNG, WebP, GIF, AVIF, TIFF, BMP, HEIC, or SVG.",
      };
    }

    if (file.size > MAX_INPUT_BYTES) {
      return {
        error: `Image is too large before compression. Maximum ${Math.round(MAX_INPUT_BYTES / 1024 / 1024)} MB.`,
      };
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer());

    let compressed;
    try {
      compressed = await compressImage(inputBuffer, resolvedMime);
    } catch (err) {
      return {
        error:
          err instanceof Error
            ? err.message
            : "Could not compress image. Try another format.",
      };
    }

    if (compressed.size > MAX_COMPRESSED_BYTES) {
      return {
        error: `Image is still too large after compression (max ${Math.round(MAX_COMPRESSED_BYTES / 1024 / 1024)} MB).`,
      };
    }

    if (!isValidImageMagic(compressed.buffer, compressed.contentType)) {
      return { error: "Compressed image failed validation. Try another file." };
    }

    const prefix =
      typeof namePrefix === "string" && namePrefix.trim()
        ? namePrefix
        : folder;

    const { asset, error: storeError } = await storeSiteAsset(
      folder as SiteAssetFolder,
      prefix,
      compressed.buffer,
      compressed.contentType,
      compressed.extension,
      compressed.jpegFallback
        ? {
            buffer: compressed.jpegFallback.buffer,
            extension: compressed.jpegFallback.extension,
          }
        : undefined,
    );

    if (storeError || !asset) {
      return { error: storeError ?? "Failed to save image." };
    }

    revalidatePath("/admin/panel");

    return {
      publicUrl: asset.publicUrl,
      jpegFallbackUrl: asset.jpegFallbackUrl,
      width: compressed.width,
      height: compressed.height,
      sizeKb: Math.round(compressed.size / 1024),
      storageBackend: getStorageBackend(),
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error during upload.";

    if (message.includes("Body exceeded") || message.includes("413")) {
      return {
        error: `Upload too large. Maximum ${Math.round(MAX_INPUT_BYTES / 1024 / 1024)} MB before compression.`,
      };
    }

    return { error: message };
  }
}
