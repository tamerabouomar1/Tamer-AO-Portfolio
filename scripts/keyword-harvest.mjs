// Harvest what people in Lebanon actually type into Google, via the public
// autocomplete endpoint. No volumes, but every row is a real query and the
// endpoint only returns ones with enough demand to be suggested.
import { writeFileSync } from "node:fs";

const CORE = [
  "website design lebanon", "web design lebanon", "web design beirut", "web developer lebanon",
  "website developer lebanon", "web design company lebanon", "website cost lebanon",
  "logo design lebanon", "logo designer beirut", "graphic designer lebanon", "graphic design lebanon",
  "freelance graphic designer lebanon", "branding agency lebanon", "social media management lebanon",
  "social media agency lebanon", "digital marketing agency lebanon", "marketing agency lebanon",
  "seo lebanon", "google business profile", "google my business lebanon", "ecommerce website lebanon",
  "online store lebanon", "restaurant website", "qr menu lebanon", "video editor lebanon",
  "تصميم مواقع لبنان", "تصميم لوغو لبنان", "تصميم مواقع", "مصمم جرافيك لبنان", "شركة تسويق لبنان",
];
const EXTRA = [
  "website design beirut", "website designer near me", "web designer aley", "web design agency beirut",
  "wordpress developer lebanon", "shopify lebanon", "shopify developer lebanon", "landing page design lebanon",
  "how much does a website cost in lebanon", "how to make a website in lebanon", "domain name lebanon",
  "web hosting lebanon", "seo company lebanon", "seo agency beirut", "local seo lebanon",
  "google maps listing lebanon", "add my business to google maps lebanon", "google ads lebanon",
  "online menu lebanon", "digital menu lebanon", "restaurant website design", "restaurant online ordering lebanon",
  "salon website", "salon booking app lebanon", "barber booking lebanon", "clinic website lebanon",
  "dentist website design", "real estate website lebanon", "construction company website",
  "gym website design", "personal trainer website", "portfolio website lebanon",
  "brand identity lebanon", "branding lebanon", "logo design price lebanon", "logo animation",
  "company profile design lebanon", "packaging design lebanon", "menu design lebanon",
  "business card design lebanon", "brochure design lebanon", "motion graphics lebanon",
  "content creator lebanon", "reels editor lebanon", "social media manager lebanon",
  "social media manager salary lebanon", "social media packages lebanon", "instagram marketing lebanon",
  "instagram ads lebanon", "tiktok marketing lebanon", "videographer lebanon", "photographer for restaurants lebanon",
  "free website templates", "free html templates", "free portfolio website template", "free restaurant website template",
  "free landing page template", "free website for small business",
  "freelance web developer lebanon", "freelancer lebanon", "hire designer lebanon",
  "self defense classes lebanon", "personal trainer lebanon", "bjj lebanon", "wrestling lebanon", "taekwondo lebanon",
  "تصميم موقع الكتروني", "تصميم موقع الكتروني لبنان", "شركة تصميم مواقع لبنان", "تصميم متجر الكتروني لبنان",
  "ادارة صفحات سوشيال ميديا لبنان", "ادارة سوشيال ميديا", "تصميم شعار", "تصميم هوية بصرية لبنان",
  "كم سعر تصميم موقع", "اضافة موقع على خرائط جوجل", "تسويق الكتروني لبنان", "مصور لبنان", "مونتاج فيديو لبنان",
];

const AZ = "abcdefghijklmnopqrstuvwxyz".split("");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const isArabic = (s) => /[؀-ۿ]/.test(s);

async function suggest(q) {
  const hl = isArabic(q) ? "ar" : "en";
  const url = `https://suggestqueries.google.com/complete/search?client=chrome&hl=${hl}&gl=lb&q=${encodeURIComponent(q)}`;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) throw new Error(String(res.status));
      const buf = Buffer.from(await res.arrayBuffer());
      const ct = res.headers.get("content-type") || "";
      const text = /iso-8859-1|windows-1256/i.test(ct) ? new TextDecoder("windows-1256").decode(buf) : buf.toString("utf8");
      const json = JSON.parse(text);
      const rel = json[4]?.["google:suggestrelevance"] || [];
      return json[1].map((s, i) => ({ s, rel: rel[i] ?? 0 }));
    } catch (e) {
      await sleep(1500 * (attempt + 1));
      if (attempt === 2) return { error: String(e) };
    }
  }
}

const out = {}; // suggestion -> { rel: max relevance, seeds: Set }
let calls = 0, errors = 0;
async function run(q, seed) {
  const r = await suggest(q);
  calls++;
  if (!Array.isArray(r)) { errors++; return; }
  for (const { s, rel } of r) {
    const k = s.toLowerCase().trim();
    if (!out[k]) out[k] = { rel: 0, seeds: new Set(), hits: 0 };
    out[k].rel = Math.max(out[k].rel, rel);
    out[k].seeds.add(seed);
    out[k].hits++;
  }
  await sleep(140);
}

for (const seed of [...CORE, ...EXTRA]) await run(seed, seed);
for (const seed of CORE) {
  const letters = isArabic(seed) ? "ابتجحخدرسشصطعفقكلمنهوي".split("") : AZ;
  for (const l of letters) await run(`${seed} ${l}`, seed);
}

const rows = Object.entries(out)
  .map(([q, v]) => ({ q, rel: v.rel, hits: v.hits, seeds: [...v.seeds] }))
  .sort((a, b) => b.hits - a.hits || b.rel - a.rel);
writeFileSync(new URL("./keyword-data.json", import.meta.url), JSON.stringify(rows, null, 1));
console.log(`calls=${calls} errors=${errors} unique=${rows.length}`);
