/**
 * After running supabase/migrations/20260623000000_initial_phase2_schema.sql
 * in the dashboard SQL editor, run: npm run verify:supabase
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

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

const TABLES = [
  "agencies",
  "profiles",
  "trips",
  "site_settings",
  "exchange_rates",
] as const;

async function probe(
  url: string,
  key: string,
  label: string,
  table: string,
) {
  const res = await fetch(`${url}/rest/v1/${table}?select=id&limit=1`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "User-Agent": "amor-travel-verify/1.0",
    },
  });
  const body = await res.text();
  console.log(`${label} ${table}: HTTP ${res.status} ${body.slice(0, 120)}`);
  return res.status;
}

async function main() {
  const env = loadEnvLocal();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anon || !service) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL, anon key, or service role in .env.local");
    process.exit(1);
  }

  console.log(`Project: ${url}\n`);

  for (const table of TABLES) {
    await probe(url, anon, "anon", table);
  }
  console.log("");
  for (const table of TABLES) {
    await probe(url, service, "service", table);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
