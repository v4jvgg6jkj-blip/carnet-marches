import { getCollection } from 'astro:content';

const visible = (e: { data: { brouillon: boolean } }) => import.meta.env.DEV || !e.data.brouillon;

export async function getNotes() {
  return (await getCollection('notes', visible)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
export async function getAnalyses() {
  return (await getCollection('analyses', visible)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
