/**
 * Create public site-assets bucket on Amor Supabase if missing.
 * Run: npm run ensure:storage
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  const raw = readFileSync(path, "utf8").replace(/^\uFEFF/, "");
  const env: Record<string, string> = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

async function main() {
  const env = loadEnvLocal();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error("Missing Supabase URL or service role in .env.local");
    process.exit(1);
  }
  if (!url.includes("ekdeizmxgucpvcrmoftz")) {
    console.error("Refusing: URL is not Amor Travel project ekdeizmxgucpvcrmoftz");
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;

  const exists = buckets?.some((b) => b.id === "site-assets");
  if (exists) {
    console.log("site-assets bucket already exists");
    return;
  }

  const { data, error } = await supabase.storage.createBucket("site-assets", {
    public: true,
    fileSizeLimit: 15 * 1024 * 1024,
    allowedMimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/avif",
      "image/svg+xml",
    ],
  });

  if (error) throw error;
  console.log("Created site-assets bucket:", data?.name ?? "site-assets");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
