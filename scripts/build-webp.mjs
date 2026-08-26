/* Convert every site image to WebP, resized to what the page actually uses.
 *
 * The library was 43MB of JPEGs averaging 153KB, displayed in cards a few
 * hundred pixels wide and in a lightbox that never exceeds about 1600. The
 * bytes were paying for resolution nothing rendered.
 *
 * Originals are left in git and deleted from public/ so they are not deployed
 * twice; `git checkout public/assets` brings them back if a conversion ever
 * looks wrong. Re-running is safe: an image already converted is skipped.
 *
 *   node scripts/build-webp.mjs           # convert
 *   node scripts/build-webp.mjs --dry     # report savings, change nothing
 */
import { readdirSync, statSync, unlinkSync, existsSync } from "node:fs";
import { join, dirname, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");

/* 1000px, not the source's 1300-1500.
 *
 * Nothing on this site renders an image wider than about 500 CSS pixels: the
 * cards are a grid, and the widest use is the lightbox panel. At 2x device
 * pixel ratio that is 1000, so this is the point past which extra width is
 * bytes nobody can see. A first cap of 1600 saved nothing at all, because
 * almost every source was already narrower than that — the waste was never
 * width alone, it was width AND format together.
 *
 * The full-page screenshots (web-*-full) are the exception in shape rather
 * than width: 1200x13607 for Kitchen Garage. Their height is inherent to what
 * they are and stays. They are only fetched when someone opens the lightbox,
 * which is why they are no longer preloaded at all. */
const MAX_W = 1000;
const QUALITY = 78;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if ([".jpg", ".jpeg", ".png"].includes(extname(name).toLowerCase())) out.push(p);
  }
  return out;
}

const files = walk(join(ROOT, "public/assets"));
let before = 0, after = 0, converted = 0, skipped = 0;

for (const src of files) {
  const webp = join(dirname(src), basename(src, extname(src)) + ".webp");
  const srcSize = statSync(src).size;
  before += srcSize;

  if (existsSync(webp)) { after += statSync(webp).size; skipped++; continue; }

  const img = sharp(src);
  const meta = await img.metadata();
  const pipeline = meta.width > MAX_W ? img.resize({ width: MAX_W }) : img;

  if (DRY) {
    const buf = await pipeline.webp({ quality: QUALITY }).toBuffer();
    after += buf.length;
  } else {
    await pipeline.webp({ quality: QUALITY }).toFile(webp);
    after += statSync(webp).size;
    unlinkSync(src);           // recoverable from git
  }
  converted++;
}

const mb = (n) => (n / 1024 / 1024).toFixed(1) + "MB";
console.log(
  `${DRY ? "[dry] " : ""}images: ${files.length}  converted: ${converted}  already done: ${skipped}\n` +
  `${DRY ? "[dry] " : ""}${mb(before)} -> ${mb(after)}  (${Math.round((1 - after / before) * 100)}% smaller)`
);
