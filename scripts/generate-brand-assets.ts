import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const LOGO = path.join(ROOT, "public/images/brand/amor-logo.png");

async function ensureDir(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

async function writeLogoPng(
  output: string,
  size: number,
  background: { r: number; g: number; b: number; alpha: number },
) {
  await ensureDir(output);
  await sharp(LOGO)
    .resize(size, size, { fit: "contain", background })
    .png()
    .toFile(output);
}

async function writeOgDefault() {
  const ogWidth = 1200;
  const ogHeight = 630;
  const logoWidth = 480;

  const logoBuffer = await sharp(LOGO)
    .resize(logoWidth, null, {
      fit: "inside",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const logoMeta = await sharp(logoBuffer).metadata();
  const lw = logoMeta.width ?? logoWidth;
  const lh = logoMeta.height ?? Math.round(logoWidth * 0.67);
  const left = Math.round((ogWidth - lw) / 2);
  const top = Math.round((ogHeight - lh) / 2);

  const bgSvg = `<svg width="${ogWidth}" height="${ogHeight}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#eef3fb"/>
        <stop offset="100%" stop-color="#ffffff"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)"/>
    <rect x="0" y="0" width="100%" height="6" fill="#ff1d1d"/>
    <rect x="0" y="${ogHeight - 8}" width="100%" height="8" fill="#174698"/>
  </svg>`;

  const output = path.join(ROOT, "public/og-default.png");
  await sharp(Buffer.from(bgSvg))
    .composite([{ input: logoBuffer, top, left }])
    .png()
    .toFile(output);
}

async function writeFaviconIco() {
  const sizes = [16, 32, 48];
  const pngBuffers = await Promise.all(
    sizes.map((size) =>
      sharp(LOGO)
        .resize(size, size, {
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .png()
        .toBuffer(),
    ),
  );

  const images = await Promise.all(
    pngBuffers.map(async (buffer) => {
      const meta = await sharp(buffer).metadata();
      return {
        width: meta.width ?? 32,
        height: meta.height ?? 32,
        data: await sharp(buffer).ensureAlpha().raw().toBuffer(),
      };
    }),
  );

  const headerSize = 6 + 16 * pngBuffers.length;
  let offset = headerSize;
  const entries: Buffer[] = [];

  for (let i = 0; i < pngBuffers.length; i++) {
    const image = images[i];
    const png = pngBuffers[i];
    const entry = Buffer.alloc(16);
    entry.writeUInt8(image.width === 256 ? 0 : image.width, 0);
    entry.writeUInt8(image.height === 256 ? 0 : image.height, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += png.length;
  }

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngBuffers.length, 4);

  const ico = Buffer.concat([header, ...entries, ...pngBuffers]);
  await fs.promises.writeFile(path.join(ROOT, "app/favicon.ico"), ico);
  await fs.promises.writeFile(path.join(ROOT, "public/favicon.ico"), ico);
}

async function main() {
  if (!fs.existsSync(LOGO)) {
    throw new Error(`Logo not found: ${LOGO}`);
  }

  const whiteBg = { r: 255, g: 255, b: 255, alpha: 1 } as const;
  const transparentBg = { r: 255, g: 255, b: 255, alpha: 0 } as const;

  await writeLogoPng(path.join(ROOT, "app/icon.png"), 512, transparentBg);
  await writeLogoPng(path.join(ROOT, "app/apple-icon.png"), 180, whiteBg);
  await writeLogoPng(path.join(ROOT, "public/favicon-32x32.png"), 32, whiteBg);
  await writeLogoPng(path.join(ROOT, "public/apple-touch-icon.png"), 180, whiteBg);
  await writeLogoPng(path.join(ROOT, "public/images/brand/amor-logo-512.png"), 512, whiteBg);
  await writeOgDefault();
  await writeFaviconIco();

  console.log("Brand assets generated.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
