import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const categoriasPermitidas = [
  "operaciones",
  "cumplimiento",
  "fiscalidad",
  "vehiculos",
  "tarjetas-gasoil",
  "actualidad",
] as const;

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date().optional(),
    date: z.coerce.date().optional(),
    lastUpdated: z.coerce.date().optional(),
    author: z.string().optional(),
    category: z.enum(categoriasPermitidas).optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    readingTime: z.string().optional(),
    tags: z.array(z.string()).optional(),
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
    slug: z.string().optional(),
    downloadPdf: z.string().optional(),
    downloadLabel: z.string().optional(),
    relatedArticles: z.array(z.string()).optional(),
  }),
});

const proyectos = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/proyectos" }),
  schema: z.object({
    slug: z.string().optional(),
    title: z.string(),
    description: z.string().optional(),
    intro: z.string(),
    problemList: z.array(z.union([z.string(), z.object({ item: z.string() })])),
    screenshotText: z.string().optional(),
    btnPrimaryLabel: z.string().optional(),
    btnPrimaryUrl: z.string().optional(),
    btnSecondaryLabel: z.string().optional(),
    btnSecondaryUrl: z.string().optional(),
  }),
});

export const collections = { blog, proyectos };
