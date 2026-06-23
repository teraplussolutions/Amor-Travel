# Amor Travel

Next.js platform for **Amor Travel** (amortravel.net) – public website, admin CMS, and agent tools.

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

## Database (Amor project `ekdeizmxgucpvcrmoftz`)

**Verify:** `npm run verify:supabase` — all five tables should return HTTP 200.

**Seed catalog:** `npm run seed:trips` — upserts agency, site settings, and 163 trips from `data/imported-trips.json`.

**CLI / psql from this PC:** direct `db.*.supabase.co` often fails (IPv6). Use pooler **`aws-1-eu-central-1.pooler.supabase.com`** (not `aws-0`). Session mode port `5432`, transaction mode `6543`. Set `SUPABASE_DB_PASSWORD` in `.env.local`, URL-encode `@` and `$` in the password when building a connection string.

## Apply migration manually

If Supabase CLI link fails (wrong org token), apply Phase 2 in the [SQL editor](https://supabase.com/dashboard/project/ekdeizmxgucpvcrmoftz/sql/new) or via psql on the **aws-1** pooler above:

1. Open the file `supabase/migrations/20260623000000_initial_phase2_schema.sql` in this repo and paste its **entire** contents into the SQL editor, then run.
2. In [Project Settings → API](https://supabase.com/dashboard/project/ekdeizmxgucpvcrmoftz/settings/api), copy **anon public** into `.env.local` as `NEXT_PUBLIC_SUPABASE_ANON_KEY` (along with `NEXT_PUBLIC_SUPABASE_URL`).
3. For server-side uploads and admin actions, set `SUPABASE_SERVICE_ROLE_KEY` from **service_role** in the same API page. If a newer `sb_secret_...` key fails with your SDK, use the legacy JWT (`eyJ...`) from API settings instead.

## Environment

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Without Supabase service role key, uploads save to `public/site-assets/` for local development.

## Scripts

```bash
npm run import:trips      # Import trips from amortravel.mk → JSON
npm run seed:trips        # Push JSON catalog into Supabase
npm run verify:supabase   # Check Phase 2 tables via REST
```