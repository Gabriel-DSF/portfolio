// Lit les flux RSS/Atom listés dans data.js (veille.feeds) et écrit veille.json.
// Lancé chaque jour par GitHub Actions. Aucune dépendance, Node 20+.
import { readFile, writeFile } from "node:fs/promises";
import vm from "node:vm";

const MAX_TOTAL = 30;       // nombre d'articles gardés dans veille.json
const MAX_PER_FEED = 8;     // nombre d'articles pris par flux
const SUMMARY_LENGTH = 220; // longueur du résumé affiché

const decode = (s) =>
  s.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
   .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
   .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
   .replace(/&apos;/g, "'").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");

const clean = (s = "") =>
  decode(s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1"))
    .replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const tag = (block, name) => {
  const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return m ? m[1] : "";
};

export function parseFeed(xml, sourceName) {
  const blocks = xml.match(/<(item|entry)[\s>][\s\S]*?<\/\1>/gi) || [];
  return blocks.slice(0, MAX_PER_FEED).map((b) => {
    const href = b.match(/<link[^>]*href=["']([^"']+)["']/i);
    const url = clean(tag(b, "link")) || (href ? decode(href[1]) : "");
    const rawDate = clean(tag(b, "pubDate") || tag(b, "published") || tag(b, "updated") || tag(b, "dc:date"));
    const date = new Date(rawDate);
    let summary = clean(tag(b, "description") || tag(b, "summary") || tag(b, "content"));
    if (summary.length > SUMMARY_LENGTH) summary = summary.slice(0, SUMMARY_LENGTH).replace(/\s\S*$/, "") + "…";
    return {
      title: clean(tag(b, "title")),
      url,
      source: sourceName,
      date: isNaN(date) ? null : date.toISOString(),
      summary,
    };
  }).filter((i) => i.title && i.url);
}

async function main() {
  const code = await readFile(new URL("../data.js", import.meta.url), "utf8");
  const SITE = vm.runInNewContext(code + "\n;SITE;");
  const feeds = (SITE.veille.feeds || []).filter((f) => f.url);
  let items = [];

  for (const f of feeds) {
    try {
      const res = await fetch(f.url, { headers: { "User-Agent": "portfolio-veille/1.0" }, signal: AbortSignal.timeout(15000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const found = parseFeed(await res.text(), f.name);
      console.log(`OK   ${f.name}: ${found.length} article(s)`);
      items.push(...found);
    } catch (err) {
      console.warn(`ECHEC ${f.name} (${f.url}): ${err.message}`);
    }
  }

  items.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  items = items.slice(0, MAX_TOTAL);
  await writeFile(new URL("../veille.json", import.meta.url),
    JSON.stringify({ updated: new Date().toISOString(), items }, null, 2) + "\n");
  console.log(`veille.json écrit : ${items.length} article(s)`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
