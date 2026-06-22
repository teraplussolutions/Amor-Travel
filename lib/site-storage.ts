import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { bufferToUploadBody } from "@/lib/storage-upload";
import {
  isSupabaseStorageConfigured,
  tryCreateAdminClient,
} from "@/lib/supabase/admin";

export type SiteAssetFolder = "hero" | "trips" | "logo";

const FOLDER_PREFIX: Record<SiteAssetFolder, string> = {
  hero: "hero",
  trips: "trips",
  logo: "logo",
};

export type StoredAsset = {
  publicUrl: string;
  jpegFallbackUrl?: string;
  storagePath: string;
};

function publicUrlForSupabase(storagePath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, "");
  return `${base}/storage/v1/object/public/site-assets/${storagePath}`;
}

async function uploadBufferToSupabase(
  storagePath: string,
  buffer: Buffer,
  contentType: string,
): Promise<{ error?: string }> {
  const admin = tryCreateAdminClient();
  if (!admin) {
    return { error: "Supabase admin client is not configured." };
  }

  const { error } = await admin.storage.from("site-assets").upload(
    storagePath,
    bufferToUploadBody(buffer, contentType),
    {
      cacheControl: "31536000",
      upsert: true,
      contentType,
    },
  );

  if (error) return { error: error.message };
  return {};
}

async function saveBufferLocally(
  storagePath: string,
  buffer: Buffer,
): Promise<void> {
  const filePath = path.join(process.cwd(), "public", "site-assets", storagePath);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, buffer);
}

function sanitizeNamePrefix(prefix: string, fallback: string): string {
  const cleaned = prefix
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return cleaned || fallback;
}

export async function storeSiteAsset(
  folder: SiteAssetFolder,
  namePrefix: string,
  buffer: Buffer,
  contentType: string,
  extension: string,
  jpegFallback?: { buffer: Buffer; extension: string },
): Promise<{ asset?: StoredAsset; error?: string }> {
  const prefix = sanitizeNamePrefix(namePrefix, FOLDER_PREFIX[folder]);
  const timestamp = Date.now();
  const storagePath = `${FOLDER_PREFIX[folder]}/${prefix}-${timestamp}.${extension}`;

  if (isSupabaseStorageConfigured()) {
    const { error } = await uploadBufferToSupabase(storagePath, buffer, contentType);
    if (error) return { error };

    let jpegFallbackUrl: string | undefined;
    if (jpegFallback) {
      const fallbackPath = `${FOLDER_PREFIX[folder]}/${prefix}-${timestamp}-fallback.${jpegFallback.extension}`;
      const fb = await uploadBufferToSupabase(
        fallbackPath,
        jpegFallback.buffer,
        "image/jpeg",
      );
      if (!fb.error) {
        jpegFallbackUrl = publicUrlForSupabase(fallbackPath);
      }
    }

    return {
      asset: {
        publicUrl: publicUrlForSupabase(storagePath),
        jpegFallbackUrl,
        storagePath,
      },
    };
  }

  try {
    await saveBufferLocally(storagePath, buffer);

    let jpegFallbackUrl: string | undefined;
    if (jpegFallback) {
      const fallbackPath = `${FOLDER_PREFIX[folder]}/${prefix}-${timestamp}-fallback.${jpegFallback.extension}`;
      await saveBufferLocally(fallbackPath, jpegFallback.buffer);
      jpegFallbackUrl = `/site-assets/${fallbackPath}`;
    }

    return {
      asset: {
        publicUrl: `/site-assets/${storagePath}`,
        jpegFallbackUrl,
        storagePath,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Local save failed";
    return { error: message };
  }
}

export function getStorageBackend(): "supabase" | "local" {
  return isSupabaseStorageConfigured() ? "supabase" : "local";
}
