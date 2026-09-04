#!/usr/bin/env node
/* Poster frames for every video on /media.
 *
 * Search Console reported the page's eleven videos as unindexed, all for the
 * same reason: "No thumbnail URL provided". A <video> with no `poster` gives
 * Google nothing to show in a video result, so it indexes none of them — and
 * the reels are the page's whole argument, 618,000 views of proof.
 *
 * This pulls one still out of each clip and writes it to
 * public/assets/motion/posters/<name>.webp. Those files are what the `poster`
 * attribute and the VideoObject thumbnailUrl both point at, so a crawler has a
 * thumbnail and a visitor sees the frame instead of a black box while the
 * video buffers.
 *
 * Choosing the frame:
 *   - Logo motions resolve at the END. Their first frame is a nearly blank
 *     canvas mid-animation — QuickLook's own thumbnail of logomotion-csa is
 *     white with a stray line — so these take a frame near the close, where
 *     the finished logo actually sits.
 *   - Everything else samples across the middle of the clip and keeps the
 *     frame with the most tonal spread, which reliably skips the black frames
 *     and cuts-to-white that a fixed timestamp lands on by accident.
 *
 * Needs ffmpeg. It is not a dependency of the site — posters are committed, so
 * this runs only when a clip is added or replaced:
 *
 *   npm i -D ffmpeg-static && node scripts/build-video-posters.mjs
 *   FFMPEG=/path/to/ffmpeg node scripts/build-video-posters.mjs
 *   node scripts/build-video-posters.mjs --force   # redo existing posters
 */
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = join(ROOT, "public/assets/motion");
const OUT_DIR = join(SRC_DIR, "posters");
const TMP = join(OUT_DIR, ".tmp");
const FORCE = process.argv.includes("--force");

/* ffmpeg, from wherever it is. ffmpeg-static ships a binary per platform and
   is the least ceremony on a machine without Homebrew. */
async function ffmpegPath() {
  if (process.env.FFMPEG) return process.env.FFMPEG;
  try {
    return (await import("ffmpeg-static")).default;
  } catch {
    /* fall through to PATH */
  }
  try {
    return execFileSync("which", ["ffmpeg"], { encoding: "utf8" }).trim();
  } catch {
    console.error(
      "build-video-posters: no ffmpeg. `npm i -D ffmpeg-static`, or set FFMPEG=/path/to/ffmpeg."
    );
    process.exit(1);
  }
}

const FFMPEG = await ffmpegPath();
const run = (args) => execFileSync(FFMPEG, args, { stdio: ["ignore", "pipe", "pipe"] });

function probe(file) {
  /* ffmpeg rather than ffprobe: ffmpeg-static ships only the one binary.
     Decoding to null prints the real end time even when the container header
     lies, which some of these exports do. It is written to stderr and ffmpeg
     exits 0, so the progress line has to be read on the success path — the
     first version only looked at it when the call threw, and every clip came
     back as "could not read duration". */
  const { stderr } = spawnSync(FFMPEG, ["-i", file, "-f", "null", "-"], {
    encoding: "utf8",
    maxBuffer: 1 << 24,
  });
  const err = `${stderr || ""}`;
  const times = [...err.matchAll(/time=(\d+):(\d+):(\d+\.\d+)/g)];
  if (!times.length) return { duration: 0 };
  const [, h, m, s] = times.at(-1);

  /* The video's OWN dimensions, off the stream line. The poster is capped at
     1080 on the long edge, so its size is not the file's size — and a
     VideoObject stating the poster's width is stating something false about
     the video. */
  const dim = err.match(/Video:.*?, (\d{2,5})x(\d{2,5})[ ,]/);

  return {
    duration: Number(h) * 3600 + Number(m) * 60 + Number(s),
    width: dim ? Number(dim[1]) : null,
    height: dim ? Number(dim[2]) : null,
  };
}

/* ISO 8601, which is the only duration format schema.org accepts:
   6.75 seconds -> PT7S. Rounded up, because a VideoObject claiming PT6S for a
   6.75s clip is stating something false about the file. */
const iso8601 = (seconds) => {
  const total = Math.max(1, Math.ceil(seconds));
  const m = Math.floor(total / 60);
  const sec = total % 60;
  return `PT${m ? `${m}M` : ""}${sec ? `${sec}S` : ""}`;
};

function grab(file, at, out) {
  run(["-y", "-ss", at.toFixed(2), "-i", file, "-frames:v", "1", "-q:v", "2", out]);
}

/* How much is actually in the frame. A black frame, a white flash and a
   held title card all have almost no tonal spread; a real shot has plenty.
   Standard deviation of luminance says which is which in one number. */
async function interest(file) {
  const { channels } = await sharp(file).greyscale().stats();
  return channels[0].stdev;
}

/* The logo animations resolve at the END — the finished mark is the frame
   worth showing, and their first frame is a nearly blank canvas mid-build.
   They still get searched, just over the closing stretch rather than the
   middle: BIAF holds two dark seconds after its logo fades, so "the last
   frame" alone produced an all-but-black poster. */
const ENDS_ON_THE_POINT = /^logomotion-/;
const LATE = [0.6, 0.7, 0.78, 0.85, 0.92, 0.97];
const MIDDLE = [0.15, 0.28, 0.4, 0.52, 0.64, 0.76];

async function pick(file, base, dur) {
  if (!dur) throw new Error("could not read duration");

  const candidates = (ENDS_ON_THE_POINT.test(base) ? LATE : MIDDLE).map((f) => dur * f);

  let best = null;
  for (const [i, at] of candidates.entries()) {
    const tmp = join(TMP, `${base}-${i}.jpg`);
    try {
      grab(file, at, tmp);
    } catch {
      continue; // a seek past a truncated stream; try the next one
    }
    const score = await interest(tmp);
    if (!best || score > best.score) best = { tmp, score, at };
  }
  if (!best) throw new Error("no frame could be decoded");
  return best;
}

mkdirSync(TMP, { recursive: true });

const videos = readdirSync(SRC_DIR)
  .filter((f) => f.endsWith(".mp4"))
  .sort();

/* The manifest is what the VideoObject markup is built from at prerender
   time. Google wants a thumbnail, a duration and — for the thumbnail to be
   usable — its dimensions, and all three are properties of the file rather
   than facts anyone should be retyping into siteData.js by hand. Written
   beside the posters and committed with them, so a build never needs ffmpeg. */
const MANIFEST = join(OUT_DIR, "manifest.json");
const manifest = {};

let made = 0;
let kept = 0;
for (const name of videos) {
  const base = name.replace(/\.mp4$/, "");
  const out = join(OUT_DIR, `${base}.webp`);
  try {
    const { duration: dur, width, height } = probe(join(SRC_DIR, name));

    if (!existsSync(out) || FORCE) {
      const { tmp, at } = await pick(join(SRC_DIR, name), base, dur);
      /* 1080 on the long edge: comfortably over the ~720 the cards render at
         2x, and Google asks only for at least 60x30. Quality 80 keeps every
         one of these under about 120KB. */
      await sharp(tmp)
        .resize({ width: 1080, height: 1080, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(out);
      made++;
      console.log(`  ${base}.webp  (frame at ${at.toFixed(1)}s)`);
    } else {
      kept++;
    }

    const poster = await sharp(out).metadata();
    manifest[`${base}.mp4`] = {
      poster: `/assets/motion/posters/${base}.webp`,
      posterWidth: poster.width,
      posterHeight: poster.height,
      // The video's own frame size, not the poster's.
      width,
      height,
      duration: iso8601(dur),
    };
  } catch (err) {
    console.warn(`  ${base}: skipped — ${err.message}`);
  }
}

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
rmSync(TMP, { recursive: true, force: true });
console.log(
  `build-video-posters: ${made} written, ${kept} already present, ${Object.keys(manifest).length} in the manifest`
);
