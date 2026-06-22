# Amor Travel

Next.js platform for **Amor Travel** (amortravel.net) — public website, admin CMS, and agent tools.

## Image upload & compression

Admin uploads at `/admin/panel`, `/admin/panel/settings`, and `/admin/panel/trips` use **Sharp** server actions to autocompress images while keeping high resolution.

### Supported input formats

| Format | Notes |
| ------ | ----- |
| JPEG / JPG | Photos |
| PNG | Graphics, screenshots |
| WebP | Modern photos |
| GIF | Animated frames → first frame |
| AVIF | Modern photos |
| TIFF / BMP | Scans and exports |
| SVG | Rasterized to WebP/JPEG |
| HEIC / HEIF | Supported if Sharp/libvips on the server supports it; otherwise a clear error asks for JPG/WebP |

File inputs use `accept="image/*"` — the server validates MIME type and extension.

### Compression settings

| Setting | Value |
| ------- | ----- |
| Max longest edge | **2560px** (never upscales smaller images) |
| Primary output | **WebP** (quality **87** photos, **90** graphics/text) |
| JPEG fallback | Saved alongside when WebP is primary (quality **88** photos, **90** graphics) |
| Orientation | Auto-rotate from EXIF, then metadata stripped |
| Max upload (before) | 25 MB |
| Max stored (after) | 8 MB |

### Storage

- **Supabase** (when `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` are set): `site-assets` bucket — folders `hero/`, `trips/`, `logo/`
- **Local fallback**: `public/site-assets/` with unique timestamped filenames

### Admin UI previews

- Hero slideshow: **21:9** aspect, `object-fit: cover`
- Trip cards: **4:3** aspect, `object-fit: cover`
- Settings hero: **16:9** aspect
- Upload shows optimized dimensions (px) and final size (KB)

## Development

```bash
npm install
npm run dev
```

```bash
npm run build
```

## Environment

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Without Supabase service role key, uploads save to `public/site-assets/` for local development.

## Scripts

```bash
npm run import:trips   # Import trips from amortravel.mk
```
