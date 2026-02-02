# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AdmiLogistic blog - Spanish professional blog for truckers, fleet managers and logistics companies. Built with Astro 5 and Decap CMS for content management.

## Commands

```bash
npm run dev          # Start dev server at localhost:4321
npm run build        # Build for production to ./dist/
npm run preview      # Preview production build
npm run admin:server # Start Decap CMS local backend proxy
npm run images:optimize # Optimize images with Sharp
```

## Architecture

### Content System
- **Blog posts**: `src/content/blog/*.md` - Markdown files with frontmatter (title, description, pubDate, category, image)
- **Projects**: `src/content/proyectos/*.md` - Product/tool pages managed via CMS
- **Categories**: Fixed set defined in `src/content.config.ts`: operaciones, cumplimiento, fiscalidad, vehiculos, tarjetas-gasoil, actualidad
- **Schema validation**: Zod schemas in `src/content.config.ts`

### Page Structure
- `src/pages/index.astro` - Homepage with hero, projects grid, news, videos, databases sections
- `src/pages/categorias/` - Category listing pages filtering blog posts
- `src/pages/proyectos/` - Product showcase pages (admin-logistic, roadmaster, tacografo)
- `src/pages/bases-datos/` - Database resource pages (talleres, gasolineras, parkings, hoteles)
- `src/pages/blog/[id].astro` - Dynamic blog post template

### Layouts
- `BaseLayout.astro` - Main layout with `pageBg` prop for background variants (home, categorias, etc.)

### CMS (Decap)
- Config: `public/admin/config.yml`
- Admin UI: `public/admin/index.html`
- Local dev: Uses `decap-server` proxy, writes directly to Git
- Production: GitHub backend (MihaiStu/blog-admi, main branch)
- Media uploads: `public/uploads/`

## Styling Conventions

- Glass-morphism cards: `background: rgba(255, 255, 255, 0.55)` with `backdrop-filter: blur()`
- White text on dark/image backgrounds with `text-shadow` for legibility
- CSS variables defined in page `<style>` blocks (not global)
- Responsive breakpoints: 1024px, 768px, 480px

## Content in Spanish

All user-facing content is in Spanish. Blog categories, UI labels, and meta descriptions should maintain Spanish language.
