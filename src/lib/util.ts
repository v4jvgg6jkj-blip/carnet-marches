const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export const url = (p: string) => BASE + (p.startsWith('/') ? p : '/' + p);

export const fmtDate = (d: Date, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) =>
  new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', ...opts }).format(d);

export const fmtDateHeure = (d: Date) =>
  new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(d);

export const tempsLecture = (body = '') => Math.max(1, Math.round(body.split(/\s+/).length / 220));
