import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://vimee.dev",
  output: "static",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ja"],
  },
  integrations: [mdx(), react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        external: ["/pagefind/pagefind.js"],
      },
    },
  },
  markdown: {
    shikiConfig: {
      theme: "github-dark",
    },
  },
});
