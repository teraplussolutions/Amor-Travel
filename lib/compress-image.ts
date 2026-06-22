import sharp, { type Metadata, type Sharp } from "sharp";
import {
  isAcceptedImageMime as isAcceptedMime,
  SHARP_INPUT_MIMES,
} from "@/lib/image-mime";
import {
  MAX_COMPRESSED_BYTES,
  MAX_LONG_EDGE_PX,
} from "@/lib/image-upload-limits";

export { MAX_COMPRESSED_BYTES, MAX_INPUT_BYTES } from "@/lib/image-upload-limits";

export const WEBP_QUALITY_PHOTO = 87;
export const JPEG_QUALITY_PHOTO = 88;
export const WEBP_QUALITY_GRAPHICS = 90;
export const JPEG_QUALITY_GRAPHICS = 90;

export type CompressedImage = {
  buffer: Buffer;
  contentType: string;
  extension: string;
  width: number;
  height: number;
  size: number;
  jpegFallback?: CompressedImage;
};

function isLikelyGraphic(inputMime: string, metadata: Metadata): boolean {
  const mime = inputMime.toLowerCase();
  if (mime === "image/png" || mime === "image/svg+xml") return true;
  if (metadata.hasAlpha) return true;
  if (metadata.format === "png") return true;
  return false;
}

function resizeOptions(width: number, height: number) {
  const longEdge = Math.max(width, height);
  if (longEdge <= MAX_LONG_EDGE_PX) return null;

  if (width >= height) {
    return { width: MAX_LONG_EDGE_PX, withoutEnlargement: true as const };
  }
  return { height: MAX_LONG_EDGE_PX, withoutEnlargement: true as const };
}

async function encodeWebpAndJpeg(
  pipeline: Sharp,
  graphic: boolean,
): Promise<
  Pick<CompressedImage, "buffer" | "contentType" | "extension"> & {
    jpegBuffer: Buffer;
  }
> {
  const webpQuality = graphic ? WEBP_QUALITY_GRAPHICS : WEBP_QUALITY_PHOTO;
  const jpegQuality = graphic ? JPEG_QUALITY_GRAPHICS : JPEG_QUALITY_PHOTO;

  const webpBuffer = await pipeline
    .clone()
    .webp({ quality: webpQuality, effort: 4 })
    .toBuffer();

  const jpegBuffer = await pipeline
    .clone()
    .jpeg({ quality: jpegQuality, mozjpeg: true })
    .toBuffer();

  if (jpegBuffer.length < webpBuffer.length * 0.9) {
    return {
      buffer: jpegBuffer,
      contentType: "image/jpeg",
      extension: "jpg",
      jpegBuffer,
    };
  }

  return {
    buffer: webpBuffer,
    contentType: "image/webp",
    extension: "webp",
    jpegBuffer,
  };
}

export async function compressImage(
  input: Buffer,
  mimeType?: string | null,
): Promise<CompressedImage> {
  const normalizedMime = mimeType?.toLowerCase() ?? "";

  if (normalizedMime === "image/svg+xml") {
    try {
      let pipeline = sharp(input, { density: 200 }).rotate();
      const meta = await pipeline.metadata();
      const resize =
        meta.width && meta.height
          ? resizeOptions(meta.width, meta.height)
          : { width: MAX_LONG_EDGE_PX, withoutEnlargement: true as const };

      if (resize) pipeline = pipeline.resize(resize);

      const { buffer, contentType, extension, jpegBuffer } =
        await encodeWebpAndJpeg(pipeline, true);
      const outputMeta = await sharp(buffer).metadata();

      const result: CompressedImage = {
        buffer,
        contentType,
        extension,
        width: outputMeta.width ?? 0,
        height: outputMeta.height ?? 0,
        size: buffer.length,
      };

      if (
        contentType === "image/webp" &&
        jpegBuffer.length <= MAX_COMPRESSED_BYTES
      ) {
        const jpegMeta = await sharp(jpegBuffer).metadata();
        result.jpegFallback = {
          buffer: jpegBuffer,
          contentType: "image/jpeg",
          extension: "jpg",
          width: jpegMeta.width ?? result.width,
          height: jpegMeta.height ?? result.height,
          size: jpegBuffer.length,
        };
      }

      if (result.size > MAX_COMPRESSED_BYTES) {
        throw new Error(
          "SVG rasterized image is still too large after compression. Try a simpler SVG.",
        );
      }

      return result;
    } catch (err) {
      if (err instanceof Error && err.message.includes("too large")) throw err;
      throw new Error(
        "Could not rasterize SVG. Try PNG, JPG, or WebP instead.",
      );
    }
  }

  if (normalizedMime && !SHARP_INPUT_MIMES.has(normalizedMime)) {
    throw new Error(
      "Unsupported image type. Use JPEG, PNG, WebP, GIF, AVIF, TIFF, BMP, HEIC, or SVG.",
    );
  }

  let metadata: Metadata;
  try {
    metadata = await sharp(input).rotate().metadata();
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (
      normalizedMime === "image/heic" ||
      normalizedMime === "image/heif" ||
      message.toLowerCase().includes("heif") ||
      message.toLowerCase().includes("heic")
    ) {
      throw new Error(
        "HEIC/HEIF is not supported on this server. Please convert to JPG or WebP first.",
      );
    }
    throw new Error("Invalid or unreadable image file.");
  }

  const { width, height } = metadata;
  if (!width || !height) {
    throw new Error("Invalid image dimensions.");
  }

  const graphic = isLikelyGraphic(normalizedMime, metadata);
  let pipeline = sharp(input).rotate();
  const resize = resizeOptions(width, height);
  if (resize) pipeline = pipeline.resize(resize);

  let encoded: Awaited<ReturnType<typeof encodeWebpAndJpeg>>;
  try {
    encoded = await encodeWebpAndJpeg(pipeline, graphic);
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (
      normalizedMime === "image/heic" ||
      normalizedMime === "image/heif" ||
      message.toLowerCase().includes("heif") ||
      message.toLowerCase().includes("heic")
    ) {
      throw new Error(
        "HEIC/HEIF is not supported on this server. Please convert to JPG or WebP first.",
      );
    }
    throw new Error("Could not compress image. Try another format.");
  }

  const { buffer, contentType, extension, jpegBuffer } = encoded;

  if (buffer.length > MAX_COMPRESSED_BYTES) {
    throw new Error(
      "Image is still too large after compression. Try a smaller source file.",
    );
  }

  const outputMeta = await sharp(buffer).metadata();
  const outWidth = outputMeta.width ?? width;
  const outHeight = outputMeta.height ?? height;

  const result: CompressedImage = {
    buffer,
    contentType,
    extension,
    width: outWidth,
    height: outHeight,
    size: buffer.length,
  };

  if (
    contentType === "image/webp" &&
    jpegBuffer.length <= MAX_COMPRESSED_BYTES &&
    jpegBuffer.length > 0
  ) {
    const jpegMeta = await sharp(jpegBuffer).metadata();
    result.jpegFallback = {
      buffer: jpegBuffer,
      contentType: "image/jpeg",
      extension: "jpg",
      width: jpegMeta.width ?? outWidth,
      height: jpegMeta.height ?? outHeight,
      size: jpegBuffer.length,
    };
  }

  return result;
}

export function isAcceptedImageMime(mimeType: string): boolean {
  return isAcceptedMime(mimeType);
}
