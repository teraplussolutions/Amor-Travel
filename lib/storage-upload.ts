/** Ensure storage receives raw bytes (avoids UTF-8 corruption of binary images). */
export function bufferToUploadBody(buffer: Buffer, contentType: string): Blob {
  const copy = Uint8Array.from(buffer);
  return new Blob([copy], { type: contentType });
}

export function isValidImageMagic(buffer: Buffer, contentType: string): boolean {
  if (buffer.length < 4) return false;
  const ct = contentType.toLowerCase();

  if (ct.includes("jpeg") || ct.includes("jpg")) {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (ct.includes("png")) {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    );
  }
  if (ct.includes("webp")) {
    return (
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46
    );
  }
  return buffer.length > 32;
}
