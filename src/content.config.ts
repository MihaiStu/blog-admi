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
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    category: z.enum(categoriasPermitidas),
    image: z.string().optional(),
  }),
});

export const collections = { blog };
