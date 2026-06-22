"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { uploadSiteAssetAction } from "@/app/admin/upload-actions";
import { resolveImageMime } from "@/lib/image-mime";
import { IMAGE_FILE_ACCEPT, MAX_INPUT_BYTES } from "@/lib/image-upload-limits";

export type ImageUploadFolder = "hero" | "trips" | "logo";

type Props = {
  folder: ImageUploadFolder;
  namePrefix: string;
  label: string;
  hint?: string;
  aspectClass: string;
  value?: string;
  onChange?: (url: string) => void;
  alt?: string;
};

type UploadMeta = {
  width: number;
  height: number;
  sizeKb: number;
  storageBackend?: string;
};

export function ImageUploadField({
  folder,
  namePrefix,
  label,
  hint,
  aspectClass,
  value = "",
  onChange,
  alt = "Uploaded image preview",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [meta, setMeta] = useState<UploadMeta | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const preview = localPreview || value || "";

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError("");
    setMeta(null);
    setProgress("");

    const resolvedMime = resolveImageMime(file.type, file.name);
    if (!resolvedMime) {
      setError(
        "Unsupported image type. Use JPEG, PNG, WebP, GIF, AVIF, TIFF, BMP, HEIC, or SVG.",
      );
      return;
    }

    if (file.size > MAX_INPUT_BYTES) {
      setError(
        `File is too large. Maximum ${Math.round(MAX_INPUT_BYTES / 1024 / 1024)} MB before compression.`,
      );
      return;
    }

    if (localPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(localPreview);
    }
    const blobUrl = URL.createObjectURL(file);
    setLocalPreview(blobUrl);

    setUploading(true);
    setProgress("Compressing and uploading…");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      formData.append("namePrefix", namePrefix);

      const result = await uploadSiteAssetAction(formData);
      if (result.error) throw new Error(result.error);
      if (!result.publicUrl) throw new Error("Upload failed — no URL returned.");

      onChange?.(result.publicUrl);
      setMeta({
        width: result.width ?? 0,
        height: result.height ?? 0,
        sizeKb: result.sizeKb ?? 0,
        storageBackend: result.storageBackend,
      });
      setProgress("Upload complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      if (localPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(localPreview);
      }
      setLocalPreview(null);
      setProgress("");
    } finally {
      setUploading(false);
    }
  }

  function handleClear() {
    setError("");
    setMeta(null);
    setProgress("");
    if (localPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(localPreview);
    }
    setLocalPreview(null);
    onChange?.("");
  }

  const isRemote =
    preview.startsWith("http") || preview.includes("/storage/v1/object/public/");

  return (
    <div className="space-y-4">
      <div>
        <p className="form-label mb-0">{label}</p>
        {hint && <p className="mt-1 text-base text-amor-text/70">{hint}</p>}
      </div>

      <div
        className={`relative w-full overflow-hidden rounded-xl border border-amor-soft bg-amor-soft ${aspectClass}`}
      >
        {preview ? (
          preview.startsWith("blob:") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt={alt}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          ) : (
            <Image
              src={preview}
              alt={alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
              unoptimized={preview.startsWith("/site-assets/") || isRemote}
            />
          )
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-base text-amor-text/60">
            No image yet
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
            <p className="font-medium text-amor-blue">{progress}</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          ref={inputRef}
          type="file"
          accept={IMAGE_FILE_ACCEPT}
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="btn-primary disabled:opacity-60"
        >
          {uploading ? "Uploading…" : preview ? "Replace image" : "Upload image"}
        </button>
        {preview && (
          <button
            type="button"
            disabled={uploading}
            onClick={handleClear}
            className="btn-secondary border-amor-red text-amor-red disabled:opacity-60"
          >
            Remove
          </button>
        )}
      </div>

      {progress && !error && (
        <p className="text-base font-medium text-amor-blue">{progress}</p>
      )}

      {meta && (
        <p className="text-base text-amor-text/80">
          Optimized:{" "}
          <span className="font-medium text-amor-blue">
            {meta.width}×{meta.height}px
          </span>
          ,{" "}
          <span className="font-medium text-amor-blue">{meta.sizeKb} KB</span>
          {meta.storageBackend && (
            <>
              {" "}
              — stored in{" "}
              {meta.storageBackend === "supabase" ? "Supabase" : "local public folder"}
            </>
          )}
        </p>
      )}

      {error && <p className="text-base text-amor-red">{error}</p>}
    </div>
  );
}
