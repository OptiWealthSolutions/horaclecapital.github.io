import { defineCollection, z } from 'astro:content';

const rapports = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),                          // ISO: "2026-04-24"
    author: z.string().default('Léo Lombardini'),
    category: z.string().default('Macro Economics'),
    issue: z.string().optional(),              // ex: "N°9"
    ogImage: z.string().optional(),
    thumbnail: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const recherches = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    author: z.string().default('Léo Lombardini'),
    category: z.string().default('Finance Quantitative'),
    type: z.enum(['pdf', 'notebook', 'code', 'video', 'link']).default('pdf'),
    fileUrl: z.string().optional(),
    ogImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { rapports, recherches };
