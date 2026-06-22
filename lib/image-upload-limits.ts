/** Max upload size before compression (client + server). */
export const MAX_INPUT_BYTES = 25 * 1024 * 1024;

/** Max stored file size after compression. */
export const MAX_COMPRESSED_BYTES = 8 * 1024 * 1024;

/** Longest edge after resize — high-res heroes and trip cards. */
export const MAX_LONG_EDGE_PX = 2560;

/** File input accept string — any image type; server validates MIME. */
export const IMAGE_FILE_ACCEPT = "image/*";
