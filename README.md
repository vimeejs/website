# @vimeejs/website

Landing page for [vimee](https://github.com/vimeejs/vimee) — a headless Vim engine for the web.

Live at [vimee.dev](https://vimee.dev)

## Tech Stack

- [Astro v6](https://astro.build/) (static output)
- [React 19](https://react.dev/) (islands for live demos)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [OGL](https://github.com/oframe/ogl) (WebGL phantom smoke effect)
- [@vimee/shiki-editor](https://github.com/vimeejs/vimee) (live Vim editor demos)

## Development

```bash
bun install
bun dev
```

Open [http://localhost:4321](http://localhost:4321)

## Build

```bash
bun run build
```

Output is in `dist/` — deploy to Cloudflare Pages or any static host.

## License

MIT
