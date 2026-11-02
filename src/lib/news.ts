import { XMLParser } from 'fast-xml-parser';
import { FLUX_RSS } from '../config';

export type News = { titre: string; lien: string; date: number; source: string; resume?: string };

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@' });
const txt = (x: any): string => (typeof x === 'string' ? x : x?.['#text'] ?? x?.['__cdata'] ?? '').toString();
const clean = (s: string) =>
  s.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, '’').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();

async function lireFlux(nom: string, url: string): Promise<News[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10000);
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CarnetDeMarches/1.0)' }, signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = parser.parse(await res.text());
    const items: any[] = [].concat(xml?.rss?.channel?.item ?? xml?.feed?.entry ?? xml?.['rdf:RDF']?.item ?? []);
    console.log(`[news] ${nom} : ${items.length} articles`);
    return items
      .map((it) => {
        const lien = typeof it.link === 'string' ? it.link : it.link?.['@href'] ?? txt(it.guid);
        const date = Date.parse(txt(it.pubDate) || txt(it.published) || txt(it.updated) || txt(it['dc:date']));
        const resume = clean(txt(it.description) || txt(it.summary)).slice(0, 220);
        return { titre: clean(txt(it.title)), lien, date: Number.isNaN(date) ? 0 : date, source: nom, resume: resume || undefined };
      })
      .filter((n) => n.titre && n.lien);
  } catch (e) {
    console.warn(`[news] ${nom} indisponible :`, (e as Error).message);
    return [];
  } finally {
    clearTimeout(timer);
  }
}

let cache: Promise<News[]> | null = null;
export function getNews(): Promise<News[]> {
  cache ??= (async () => {
    const all = (await Promise.all(FLUX_RSS.map((f) => lireFlux(f.nom, f.url)))).flat();
    const vus = new Set<string>();
    return all
      .filter((n) => {
        const k = n.titre.toLowerCase();
        if (vus.has(k)) return false;
        vus.add(k);
        return true;
      })
      .sort((a, b) => b.date - a.date);
  })();
  return cache;
}
