/* Push changed URLs to IndexNow.
 *
 * Google does not take part, so this is not a replacement for Search Console.
 * Bing, Yandex, Seznam and Naver do, and it costs nothing: they read the same
 * sitemap this repo already generates, and this tells them to come now rather
 * than whenever they next crawl.
 *
 * The key is proved by hosting the same string at /<key>.txt on the domain,
 * which public/19dcb4e68023d2d30748257fd44c8749.txt does. Both must be deployed before a submission
 * is accepted, so run this AFTER `wrangler deploy`, never before.
 *
 *   node scripts/indexnow.mjs            # every URL in the sitemap
 *   node scripts/indexnow.mjs /a /b      # just these paths
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const HOST = "tamerabouomar.com";
const KEY = "19dcb4e68023d2d30748257fd44c8749";

const args = process.argv.slice(2);
const urlList = args.length
  ? args.map((p) => `https://${HOST}${p.startsWith("/") ? p : "/" + p}`)
  : [...readFileSync(join(root, "public/sitemap.xml"), "utf8")
      .matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList,
  }),
});

// 200 accepted, 202 accepted but key still being validated. Both are fine.
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urlList.length} URLs`);
if (![200, 202].includes(res.status)) console.log(await res.text());
