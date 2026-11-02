import { CRYPTOS, CRYPTO_CURRENCY, INDICES } from '../config';

export type Serie = { t: number; v: number }[];

export type Quote = {
  symbole: string;
  nom: string;
  groupe?: string;
  prix: number | null;
  devise?: string;
  var1j: number | null; // variation 24 h / 1 séance, en %
  var7j?: number | null;
  var1m?: number | null;
  serie: Serie; // pour les graphiques
  id?: string;
};

const UA = 'Mozilla/5.0 (compatible; CarnetDeMarches/1.0)';

async function getJSON(url: string, timeoutMs = 10000): Promise<any> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' }, signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

const pct = (a: number, b: number) => (b ? ((a - b) / b) * 100 : null);

// ——— Cryptos : CoinGecko (gratuit, sans clé) ———
export function coingeckoUrl() {
  const ids = CRYPTOS.map((c) => c.id).join(',');
  return `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${CRYPTO_CURRENCY}&ids=${ids}&sparkline=true&price_change_percentage=24h,7d,30d`;
}

let cryptoCache: Promise<Quote[]> | null = null;
export function getCryptos(): Promise<Quote[]> {
  cryptoCache ??= (async () => {
    try {
      const data: any[] = await getJSON(coingeckoUrl());
      return CRYPTOS.map((c) => {
        const d = data.find((x) => x.id === c.id);
        const prices: number[] = d?.sparkline_in_7d?.price ?? [];
        const now = Date.now();
        const step = prices.length > 1 ? (7 * 24 * 3600 * 1000) / (prices.length - 1) : 0;
        return {
          id: c.id,
          symbole: c.symbole,
          nom: c.nom,
          prix: d?.current_price ?? null,
          devise: CRYPTO_CURRENCY.toUpperCase(),
          var1j: d?.price_change_percentage_24h_in_currency ?? d?.price_change_percentage_24h ?? null,
          var7j: d?.price_change_percentage_7d_in_currency ?? null,
          var1m: d?.price_change_percentage_30d_in_currency ?? null,
          serie: prices.map((v, i) => ({ t: now - (prices.length - 1 - i) * step, v })),
        };
      });
    } catch (e) {
      console.warn('[marchés] CoinGecko indisponible :', (e as Error).message);
      return CRYPTOS.map((c) => ({ id: c.id, symbole: c.symbole, nom: c.nom, prix: null, var1j: null, serie: [] }));
    }
  })();
  return cryptoCache;
}

// ——— Indices, devises, matières premières, actions : Yahoo Finance (sans clé, appelé au build) ———
const yahooCache = new Map<string, Promise<Quote>>();
export function getYahooQuote(symbole: string, nom = symbole, groupe?: string): Promise<Quote> {
  if (!yahooCache.has(symbole)) {
    yahooCache.set(
      symbole,
      (async () => {
        const vide: Quote = { symbole, nom, groupe, prix: null, var1j: null, serie: [] };
        for (const host of ['query1', 'query2']) {
          try {
            const url = `https://${host}.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbole)}?range=3mo&interval=1d`;
            const json = await getJSON(url);
            const r = json?.chart?.result?.[0];
            if (!r) throw new Error('réponse vide');
            const ts: number[] = r.timestamp ?? [];
            const closes: (number | null)[] = r.indicators?.quote?.[0]?.close ?? [];
            const serie: Serie = ts
              .map((t, i) => ({ t: t * 1000, v: closes[i] as number }))
              .filter((p) => typeof p.v === 'number' && !Number.isNaN(p.v));
            const prix: number = r.meta?.regularMarketPrice ?? serie.at(-1)?.v ?? null;
            if (serie.length && prix != null) serie[serie.length - 1] = { ...serie[serie.length - 1], v: prix };
            const prev = serie.at(-2)?.v;
            const s7 = serie.at(-6)?.v;
            const s1m = serie.at(-22)?.v;
            return {
              symbole,
              nom,
              groupe,
              prix,
              devise: r.meta?.currency,
              var1j: prev != null && prix != null ? pct(prix, prev) : null,
              var7j: s7 != null && prix != null ? pct(prix, s7) : null,
              var1m: s1m != null && prix != null ? pct(prix, s1m) : null,
              serie,
            };
          } catch (e) {
            console.warn(`[marchés] Yahoo ${symbole} (${host}) :`, (e as Error).message);
          }
        }
        return vide;
      })(),
    );
  }
  return yahooCache.get(symbole)!;
}

export function getIndices(): Promise<Quote[]> {
  return Promise.all(INDICES.map((i) => getYahooQuote(i.symbole, i.nom, i.groupe)));
}

// ——— Formatage ———
export function fmtPrix(v: number | null | undefined, devise?: string) {
  if (v == null) return '—';
  const digits = Math.abs(v) < 2 ? 4 : Math.abs(v) < 100 ? 2 : Math.abs(v) < 10000 ? 2 : 0;
  const n = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(v);
  const sym: Record<string, string> = { EUR: ' €', USD: ' $', JPY: ' ¥', GBP: ' £' };
  return devise ? n + (sym[devise] ?? ` ${devise}`) : n;
}

export function fmtPct(v: number | null | undefined) {
  if (v == null || Number.isNaN(v)) return '—';
  const s = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(v));
  return `${v > 0 ? '+' : v < 0 ? '−' : ''}${s} %`;
}

export const sens = (v: number | null | undefined) => (v == null ? '' : v > 0 ? 'hausse' : v < 0 ? 'baisse' : '');
