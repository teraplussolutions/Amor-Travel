import fs from "node:fs";
import path from "node:path";

export type LocalImage = {
  filePath: string;
  publicPath: string;
  keywords: string[];
};

const KEYWORD_ALIASES: Record<string, string[]> = {
  antalya: ["antalya", "antalia", "turkey", "turcija", "turkija", "kusadasi", "izmir", "avsa"],
  athens: ["athens", "atina", "greece", "grcija", "grcka", "meteori", "solun", "thessaloniki"],
  belgrade: ["belgrade", "belgrad", "serbia", "srbija", "novi sad", "zlatibor", "tumane"],
  budapest: ["budapest", "budimpeshta", "hungary", "ungarija"],
  budva: ["budva", "montenegro", "crna gora", "tara", "rafting", "ostrog"],
  cappadocia: ["cappadocia", "kapadokija", "kapadokya"],
  copenhagen: ["copenhagen", "kopenhagen", "denmark", "danska", "sweden", "shvedska"],
  dubai: ["dubai", "dubaj", "abu dhabi"],
  egypt: ["egypt", "egipet", "sharm", "hurghada"],
  istanbul: ["istanbul", "bursa", "edrene", "eskisehir"],
  italy: [
    "italy",
    "italija",
    "rome",
    "rim",
    "venice",
    "venecija",
    "milan",
    "milano",
    "verona",
    "trst",
    "trieste",
    "toscana",
    "tuscany",
    "napoli",
    "neapol",
    "amalfi",
    "bari",
    "sorrento",
    "capri",
    "positano",
    "pompeja",
    "sardinia",
    "sardinija",
    "sicily",
    "sicilija",
  ],
  jordan: ["jordan", "jordanija", "petra", "amman", "wad"],
  malta: ["malta"],
  paris: ["paris", "pariz", "france", "francija", "nice", "niza", "monaco", "cote"],
  prague: ["prague", "praga", "czech", "ceska", "dresden"],
  vienna: ["vienna", "viena", "salzburg", "minhen", "munich", "innsbruck", "halstadt"],
  tbilisi: ["tbilisi", "gruzija", "georgia"],
  yerevan: ["yerevan", "jermenija", "armenia"],
  china: ["china", "kina", "peking", "beijing", "shanghai", "shangaj", "sian", "xian"],
  japan: ["japan", "japonija", "tokyo"],
  uzbekistan: ["uzbekistan", "uzbekistan"],
  india: ["india", "indija", "sri lanka", "shri lanka"],
  brazil: ["brazil", "brazil", "argentina", "argentini"],
  morocco: ["morocco", "maroko", "rabat", "fes", "casablanca", "kazablanka"],
  oman: ["oman"],
  alaska: ["alaska", "aljaska"],
  norway: ["norway", "norveska", "fjord"],
  spain: ["spain", "spanija", "barcelona", "barselona", "madrid", "toledo", "andaluzija"],
  portugal: ["portugal", "portugalija", "porto", "lisbon"],
  ireland: ["ireland", "irska"],
  lebanon: ["lebanon", "liban", "bejrut", "beirut"],
  israel: ["israel", "izrael", "erusalim", "jerusalem", "sveta zemja"],
  cyprus: ["cyprus", "kipar"],
  croatia: ["croatia", "hrvatska", "zagreb", "opatija"],
  slovenia: ["slovenia", "slovenija", "ljubljana", "bled", "bohinj", "postojna"],
  bosnia: ["bosna", "saraevo", "sarajevo", "mostar", "hercegovina"],
  romania: ["romania", "romanija", "bukuresht", "bucharest", "temishvar", "timisoara", "jashi", "iasi"],
  slovakia: ["slovakia", "bratislava"],
  austria: ["avstria", "austria"],
  albania: ["albanija", "albania", "ksamil", "orikum", "drach", "durres"],
  greece: [
    "grcija",
    "greece",
    "krf",
    "corfu",
    "kavala",
    "krit",
    "crete",
    "santorini",
    "zakintos",
    "zante",
    "lefkada",
    "kefalonia",
    "paralia",
    "leptokarija",
    "olympic beach",
    "halkidiki",
    "sivota",
    "parga",
    "kavos",
    "kalitea",
    "atos",
    "peloponez",
  ],
  maldives: ["maldivi", "maldives"],
  usa: ["sad", "havai", "hawaii", "mexico", "meksiko", "alaska"],
  korea: ["korea", "koreja"],
  switzerland: ["shvaicarija", "switzerland", "bernina", "lucern", "luzern"],
  phuket: ["phuket", "thailand", "tajland"],
  skopje: ["skopje", "makedonija", "macedonia"],
  sozopol: ["sozopol", "bulgaria", "bugariya"],
  venice: ["venice", "venecija"],
};

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stemFromFilename(filename: string): string {
  return normalizeText(path.parse(filename).name.replace(/[-_]/g, " "));
}

function buildKeywords(stem: string): string[] {
  const normalizedStem = normalizeText(stem);
  const keywords = new Set<string>(normalizedStem.split(" ").filter(Boolean));

  for (const [bucket, aliases] of Object.entries(KEYWORD_ALIASES)) {
    if (aliases.some((alias) => normalizedStem.includes(alias) || alias.includes(normalizedStem))) {
      keywords.add(bucket);
      aliases.forEach((alias) => keywords.add(alias));
    }
  }

  return [...keywords];
}

export function discoverLocalImages(projectRoot: string): LocalImage[] {
  const searchDirs = [
    path.join(projectRoot, "Pics"),
    path.join(projectRoot, "public", "images", "destinations"),
    path.join(projectRoot, "public", "site-assets", "destinations"),
    path.join(projectRoot, "amor-travel-temp", "public", "images", "destinations"),
    path.join(projectRoot, "amor-travel-temp", "public", "images", "hero"),
  ];

  const extensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".jfif"]);
  const images: LocalImage[] = [];
  const seen = new Set<string>();

  for (const dir of searchDirs) {
    if (!fs.existsSync(dir)) continue;

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isFile()) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (!extensions.has(ext)) continue;

      const filePath = path.join(dir, entry.name);
      const key = normalizeText(entry.name);
      if (seen.has(key)) continue;
      seen.add(key);

      let publicPath: string;
      if (dir.includes(`${path.sep}public${path.sep}`)) {
        publicPath = "/" + path.relative(path.join(projectRoot, "public"), filePath).replace(/\\/g, "/");
      } else if (dir.includes("amor-travel-temp")) {
        publicPath = `/images/${path.basename(dir)}/${entry.name}`;
      } else {
        publicPath = `/images/destinations/${entry.name}`;
      }

      const stem = stemFromFilename(entry.name);
      images.push({
        filePath,
        publicPath,
        keywords: buildKeywords(stem),
      });
    }
  }

  return images;
}

export function matchLocalImage(
  title: string,
  destination: string,
  images: LocalImage[],
  usedPaths: Set<string>,
): { publicPath: string | null; match: "keyword" | "none" } {
  const haystack = normalizeText(`${title} ${destination}`);

  let best: { image: LocalImage; score: number } | null = null;

  for (const image of images) {
    let score = 0;
    for (const keyword of image.keywords) {
      if (keyword.length < 3) continue;
      if (haystack.includes(keyword)) {
        score += keyword.length;
      }
    }
    if (!best || score > best.score) {
      best = { image, score };
    }
  }

  if (!best || best.score < 4) {
    return { publicPath: null, match: "none" };
  }

  if (!usedPaths.has(best.image.publicPath)) {
    usedPaths.add(best.image.publicPath);
    return { publicPath: best.image.publicPath, match: "keyword" };
  }

  const alternate = images.find(
    (image) =>
      image.publicPath !== best!.image.publicPath &&
      !usedPaths.has(image.publicPath) &&
      image.keywords.some((keyword) => haystack.includes(keyword)),
  );

  if (alternate) {
    usedPaths.add(alternate.publicPath);
    return { publicPath: alternate.publicPath, match: "keyword" };
  }

  return { publicPath: best.image.publicPath, match: "keyword" };
}
