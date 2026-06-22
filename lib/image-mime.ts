const EXT_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  svg: "image/svg+xml",
  heic: "image/heic",
  heif: "image/heif",
  gif: "image/gif",
  bmp: "image/bmp",
  tif: "image/tiff",
  tiff: "image/tiff",
  avif: "image/avif",
};

const ALIAS_TO_MIME: Record<string, string> = {
  "image/jpg": "image/jpeg",
  "image/pjpeg": "image/jpeg",
  "image/x-png": "image/png",
};

export const ACCEPTED_IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/heic",
  "image/heif",
  "image/gif",
  "image/bmp",
  "image/tiff",
  "image/avif",
]);

export const SHARP_INPUT_MIMES = new Set(
  [...ACCEPTED_IMAGE_MIMES].filter((m) => m !== "image/svg+xml"),
);

export function resolveImageMime(
  fileType: string | undefined | null,
  fileName: string,
): string | null {
  const raw = fileType?.trim().toLowerCase() ?? "";
  const aliased = raw ? (ALIAS_TO_MIME[raw] ?? raw) : "";

  if (aliased && aliased !== "application/octet-stream") {
    if (ACCEPTED_IMAGE_MIMES.has(aliased)) return aliased;
    if (aliased.startsWith("image/")) return null;
  }

  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  return EXT_TO_MIME[ext] ?? null;
}

export function isAcceptedImageMime(mimeType: string): boolean {
  return ACCEPTED_IMAGE_MIMES.has(mimeType.toLowerCase());
}

export function isRasterImageMime(mimeType: string): boolean {
  return SHARP_INPUT_MIMES.has(mimeType.toLowerCase());
}
