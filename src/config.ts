// ———————————————————————————————————————————————
// Réglages du site : modifiez librement ce fichier.
// ———————————————————————————————————————————————

export const SITE = {
  titre: 'Carnet de marchés',
  sousTitre: 'Notes de lecture quotidiennes, analyses d’entreprises et suivi des marchés',
  auteur: 'DLHZP',
};

// Devise d'affichage des cryptos (CoinGecko) : 'eur' ou 'usd'
export const CRYPTO_CURRENCY: 'eur' | 'usd' = 'eur';

// Identifiants CoinGecko (https://www.coingecko.com/ → « API ID » sur la page de la crypto)
export const CRYPTOS = [
  { id: 'bitcoin', symbole: 'BTC', nom: 'Bitcoin' },
  { id: 'ethereum', symbole: 'ETH', nom: 'Ethereum' },
  { id: 'solana', symbole: 'SOL', nom: 'Solana' },
];

// Symboles Yahoo Finance (https://finance.yahoo.com/)
export const INDICES = [
  { symbole: '^FCHI', nom: 'CAC 40', groupe: 'Europe' },
  { symbole: '^STOXX50E', nom: 'Euro Stoxx 50', groupe: 'Europe' },
  { symbole: '^GDAXI', nom: 'DAX', groupe: 'Europe' },
  { symbole: '^GSPC', nom: 'S&P 500', groupe: 'États-Unis' },
  { symbole: '^IXIC', nom: 'Nasdaq', groupe: 'États-Unis' },
  { symbole: '^DJI', nom: 'Dow Jones', groupe: 'États-Unis' },
  { symbole: '^N225', nom: 'Nikkei 225', groupe: 'Asie' },
  { symbole: 'EURUSD=X', nom: 'EUR/USD', groupe: 'Autres' },
  { symbole: 'GC=F', nom: 'Or (once)', groupe: 'Autres' },
  { symbole: 'BZ=F', nom: 'Pétrole Brent', groupe: 'Autres' },
];

// Indices affichés dans le bandeau en haut de page
export const BANDEAU = ['^FCHI', '^GSPC', '^IXIC', 'EURUSD=X'];

// Flux RSS d'actualités financières (sans clé). Un flux en panne est simplement ignoré.
export const FLUX_RSS = [
  { nom: 'Le Figaro', url: 'https://www.lefigaro.fr/rss/figaro_economie.xml' },
  { nom: 'BFM Bourse', url: 'https://www.tradingsat.com/rssbourse.xml' },
  { nom: 'Le Monde', url: 'https://www.lemonde.fr/economie/rss_full.xml' },
  { nom: 'Investing.com', url: 'https://fr.investing.com/rss/news_25.rss' },
  { nom: 'CNBC', url: 'https://www.cnbc.com/id/10000664/device/rss/rss.html' },
  { nom: 'MarketWatch', url: 'https://feeds.content.dowjones.io/public/rss/mw_topstories' },
  { nom: 'CoinDesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/' },
];

export const NB_NEWS_ACCUEIL = 12;
export const NB_NEWS_PAGE = 40;
