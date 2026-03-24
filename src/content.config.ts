import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const docs = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/docs" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    sidebar: z
      .object({
        order: z.number().default(999),
        label: z.string().optional(),
      })
      .optional(),
    editUrl: z.boolean().default(true),
  }),
});

export const collections = { docs };
