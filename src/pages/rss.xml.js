import rss from '@astrojs/rss';
import { getNotes, getAnalyses } from '../lib/posts';
import { SITE } from '../config';

export async function GET(context) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const items = [...(await getNotes()), ...(await getAnalyses())]
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .map((e) => ({ title: e.data.title, pubDate: e.data.date, description: e.data.resume ?? '', link: `${base}/${e.collection}/${e.id}/` }));
  return rss({ title: SITE.titre, description: SITE.sousTitre, site: context.site, items });
}
