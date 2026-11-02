import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Notes quotidiennes prises en lisant la presse
const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    sources: z.array(z.string()).default([]), // ex. ["Les Echos", "Le Monde"]
    tags: z.array(z.string()).default([]),
    resume: z.string().optional(),
    brouillon: z.boolean().default(false),
  }),
});

// Analyses d'actions / d'entreprises
const analyses = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/analyses' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    entreprise: z.string(),
    ticker: z.string().optional(), // symbole Yahoo Finance, ex. "MC.PA", "AAPL"
    secteur: z.string().optional(),
    avis: z.enum(['Achat', 'Renforcer', 'Conserver', 'Alléger', 'Vendre', 'À surveiller']).optional(),
    objectif: z.number().optional(), // objectif de cours
    tags: z.array(z.string()).default([]),
    resume: z.string().optional(),
    brouillon: z.boolean().default(false),
  }),
});

export const collections = { notes, analyses };
