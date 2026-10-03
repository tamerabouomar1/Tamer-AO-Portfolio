/* Copy audit: scans every visible string on the site for AI-writing tells
   (em dashes, "not X, it is Y" reversals, filler adverbs, stacked "no card,
   no obligation" lines) and lists sentences repeated across pages.
     npm run copy:audit       EX=10 shows more examples per pattern
   A pattern hit is a prompt to reread, not a verdict: "a caption: its
   description" is normal in project captions. */

import { readFileSync, readdirSync } from "node:fs";
const root = new URL("../", import.meta.url).pathname;
const strings = []; // {src, text}
const walk = (v, src) => {
  if (typeof v === "string") { if (/[a-z].* [a-z]/i.test(v) && !/^(\/|https?:|#)/.test(v)) strings.push({ src, text: v }); }
  else if (Array.isArray(v)) v.forEach((x) => walk(x, src));
  else if (v && typeof v === "object") Object.entries(v).forEach(([k, x]) => { if (!["src","url","to","image","demo","images","poster","slug","href"].includes(k)) walk(x, src); });
};
for (const f of ["src/siteData.js"]) {
  const m = await import(root + f);
  for (const [k, v] of Object.entries(m)) if (k !== "TEMPLATES") walk(v, `${f.split("/")[1]}:${k}`);
}
// JSX text nodes in pages + components
for (const dir of ["src/pages", "src/components"]) for (const f of readdirSync(root + dir)) {
  if (!f.endsWith(".jsx")) continue;
  const s = readFileSync(root + dir + "/" + f, "utf8").replace(/\{\/\*[\s\S]*?\*\/\}/g, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  for (const m of s.matchAll(/>\s*([^<>{}]*[a-zA-Z][^<>{}]{12,})\s*</g)) strings.push({ src: `${dir.split("/")[1]}/${f}`, text: m[1].replace(/\s+/g, " ").trim() });
  for (const m of s.matchAll(/(?:title|label|placeholder|cta|kicker|sub)=\"([^"]{12,})\"/g)) strings.push({ src: `${dir.split("/")[1]}/${f}`, text: m[1] });
}
const PATTERNS = {
  "negative parallelism (not X. it is Y)": /\b(is not|isn't|are not|not just|not about|not a|not the|never)\b[^.!?]{0,80}[.!?;:,]\s+(it|that|this|they|the|what)\b[^.!?]{0,15}\b(is|are|was)\b/i,
  "'rather than' contrast": /\brather than\b/i,
  "'X, not Y' tag": /, not (a |an |the )?\w+( \w+)?[.,]/i,
  "here is / here's": /\bhere('s| is| are)\b/i,
  "that is the (part|point|whole|thing)": /\bthat('s| is) (the|exactly|why|what)\b/i,
  "the point / the whole": /\bthe (whole )?point\b|\bthe whole (thing|job|test)\b/i,
  "filler adverbs": /\b(actually|genuinely|deliberately|quietly|simply|truly|really|properly)\b/i,
  "'real' as intensifier": /\breal(ly)? (work|names?|numbers?|counts?|photos?|prices?|class|clients?|hours|proof)\b/i,
  "gravitas words": /\b(crucial|essential|pivotal|fundamental|seamless(ly)?|robust|leverage|elevate|unlock|empower|transform)\w*\b/i,
  "rhetorical Q answered": /\?\s+[A-Z][^.?!]{0,40}\./,
  "em dash": /—/,
  "unicode arrows": /[→←⇒]/,
  "no card / no obligation stack": /no card|no trial|no obligation|no email course/i,
  "every price ... price you pay": /price you pay/i,
  "colon reveal": /^[^:]{3,40}: [a-z]/,
  "short fragment sentences (3+ under 5 words)": null,
};
const counts = {}, examples = {};
for (const { src, text } of strings) {
  for (const [name, re] of Object.entries(PATTERNS)) {
    let hit = false;
    if (re) hit = re.test(text);
    else hit = text.split(/(?<=[.!?])\s+/).filter((s) => s.split(/\s+/).length <= 4 && s.length > 2).length >= 3;
    if (hit) { counts[name] = (counts[name] || 0) + 1; (examples[name] ||= []).push(`${src}: ${text.slice(0, 150)}`); }
  }
}
console.log(`${strings.length} visible strings scanned\n`);
for (const [n, c] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
  console.log(`${String(c).padStart(4)}  ${n}`);
  for (const e of examples[n].slice(0, Number(process.env.EX || 3))) console.log(`        ${e}`);
}
// Exact duplicate sentences across the site
const sent = {};
for (const { src, text } of strings) for (const s of text.split(/(?<=[.!?])\s+/)) if (s.split(" ").length >= 6) (sent[s] ||= new Set()).add(src);
const dups = Object.entries(sent).map(([s, set]) => [s, strings.filter(x => x.text.includes(s)).length]).filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]);
console.log(`\n${dups.length} sentences appear 2+ times:`);
for (const [s, n] of dups.slice(0, Number(process.env.DUP || 25))) console.log(`  x${n}  ${s.slice(0, 130)}`);
