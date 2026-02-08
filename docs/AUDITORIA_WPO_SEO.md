# Auditoría WPO y SEO Técnico – Blog AdmiLogistic

**Fecha:** 2026  
**Alcance:** Rendimiento, indexación, experiencia de usuario y accesibilidad.

---

## 1. SEO Técnico y Metadatos

### 1.1 Head: title y meta description

| Estado | Detalle |
|--------|--------|
| ✅ | Las páginas que usan `BaseLayout` reciben `title` y `description` por props. |
| ⚠️ | **Título largo:** `descargables.astro`: "Kit de Supervivencia del Transportista 2026 - Evita Multas de 4.001€" → acortar a &lt;60 caracteres. |
| ❌ | **Páginas Kit (standalone):** `kit/checklist-cabina.astro`, `kit/guia-tiempos.astro`, `kit/planificador-mantenimiento.astro`, `kit/protocolo-emergencia.astro` tienen su propio `<head>` con solo `<title>`. **Faltan:** `meta name="description"`, Open Graph y canonical. |
| ⚠️ | **Blog `[id].astro`:** La meta description usa `post.data.description ?? post.data.title`. Si `description` en el MD es largo, puede superar 155 caracteres en el snippet. **Solución:** truncar a 155 caracteres en el layout o en la página. |

**Sugerencia de código (truncar description en blog):**

En `src/pages/blog/[id].astro`, al pasar `description` al layout:

```astro
description={typeof post.data.description === 'string'
  ? post.data.description.slice(0, 155).replace(/\s+\S*$/, '')
  : (post.data.title || '').slice(0, 155)}
```

### 1.2 Open Graph (LinkedIn, Facebook)

| Estado | Detalle |
|--------|--------|
| ❌ | **BaseLayout.astro** no incluye etiquetas Open Graph. No hay `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, ni `twitter:card`. |

**Sugerencia:** Añadir en `BaseLayout.astro` (en `<head>`), usando props opcionales `image` y `canonical`:

```astro
<meta property="og:type" content="website" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={new URL(Astro.url.pathname, Astro.site ?? 'https://admilogistic.es').href} />
<meta property="og:image" content={image ?? new URL('/images/hero/Portadaok2.png', Astro.site ?? 'https://admilogistic.es').href} />
<meta property="og:locale" content="es_ES" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
```

Configurar `site` en `astro.config.mjs` para que las URLs absolutas sean correctas.

### 1.3 Indexación: robots.txt y sitemap

| Estado | Detalle |
|--------|--------|
| ❌ | **robots.txt:** No existe en `public/`. Los buscadores no reciben instrucciones ni la ruta del sitemap. |
| ❌ | **sitemap.xml:** No está generado. Astro no tiene integrado el sitemap por defecto; hace falta `@astrojs/sitemap` y configurarlo. |

**Configuración recomendada**

- **`public/robots.txt`** (crear):

```txt
User-agent: *
Allow: /

# Bloquear panel de administración y rutas internas
Disallow: /admin
Disallow: /admin/

Sitemap: https://admilogistic.es/sitemap-index.xml
```

- **Astro:** Añadir integración `@astrojs/sitemap`, definir `site` en `astro.config.mjs` y generar sitemap en build.

### 1.4 Contenido duplicado (categorías)

| Estado | Detalle |
|--------|--------|
| ⚠️ | Las páginas de categorías (`/categorias/fiscalidad`, `/categorias/actualidad`, etc.) listan artículos con el mismo patrón (título, descripción, imagen). El contenido de cada categoría es único (títulos y enlaces distintos). No hay duplicado literal; conviene mantener títulos y meta description únicos por categoría (ya lo son). |
| ✅ | Las páginas de categorías tienen H1 y descripción distintos. |

### 1.5 Jerarquía H1–H6

| Estado | Detalle |
|--------|--------|
| ✅ | Una sola H1 por página en las páginas auditadas (index, proyectos, categorías, blog post, legales, bases-datos, kit index, descargables). |
| ✅ | Orden lógico: H1 → H2 → H3 en proyectos y artículos. |
| ⚠️ | Páginas Kit standalone (checklist, guía, protocolo, planificador): tienen H1 correcto; al ser HTML independiente, no afectan al resto del sitio. |

---

## 2. Performance y Carga (Core Web Vitals)

### 2.1 Imágenes

| Archivo | Problema | Sugerencia |
|---------|----------|------------|
| `src/pages/proyectos/tacografo.astro` (línea ~35) | `<img src="..." alt="..." />` sin `width`, `height` ni `loading="lazy"`. | Añadir `width="800" height="600"` (o dimensiones reales) y `loading="lazy"`. |
| `src/pages/proyectos/roadmaster.astro` (línea ~35) | Igual. | Idem. |
| `src/pages/categorias/index.astro` | Imágenes con `alt` y `loading="lazy"` ✅; sin `width`/`height`. | Añadir dimensiones para evitar CLS (reservar espacio). |
| `src/pages/categorias/fiscalidad.astro` y resto de categorías | `<img src={entry.data.image} alt={...} loading="lazy" />` sin dimensiones. | Añadir `width` y `height` si se conocen (o usar CSS aspect-ratio). |
| `src/pages/index.astro` (hero) | `loading="eager"` correcto para LCP; tiene `alt`. | Opcional: servir hero en WebP/AVIF y definir `width`/`height`. |
| `src/pages/blog/[id].astro` | Imagen con `alt` y `loading="eager"`; sin `width`/`height`. | Añadir dimensiones para evitar CLS. |

**Formatos:** En `public/images` hay uso de `.webp` y `.avif` en backgrounds; las imágenes de contenido (uploads, projects) son en su mayoría JPG/PNG. Recomendación: seguir convirtiendo a WebP/AVIF en assets críticos y usar `<picture>` si se necesita compatibilidad.

### 2.2 Critical CSS / Above the Fold

| Estado | Detalle |
|--------|--------|
| ⚠️ | `BaseLayout.astro` incluye un bloque `<style>` grande (reset, cards, hero, grid, CTA, modo edición). Todo se envía en el HTML. |
| ⚠️ | Estilos por página: muchas páginas tienen `<style>` con decenas o cientos de líneas (proyectos/index, blog/[id], categorías, etc.). |

**Sugerencias:**

- Extraer estilos globales (layout, header, footer) a un CSS estático y cargarlo con `<link rel="stylesheet">` para permitir cacheo.
- Mantener en cada página solo el CSS que afecta al contenido above the fold; el resto cargarlo con `media="print" onload="this.media='all'"` o similar para no bloquear el render.
- Astro ya hace scoped CSS; valorar usar `is:global` solo donde haga falta y minimizar CSS duplicado entre páginas.

### 2.3 JS y TBT (Total Blocking Time)

| Archivo | Problema | Sugerencia |
|---------|----------|------------|
| `BaseLayout.astro` | Script de AdSense con `async` ✅. Script inline de fondo y script de edición (solo DEV). | En producción el script de fondo es síncrono (inline); impacto limitado. Mantener AdSense async. |
| `bases-datos/*.astro` | `<script src="https://unpkg.com/leaflet@1.9.4/...">` sin `defer`. | Añadir `defer` para no bloquear el parser. |
| `descargables.astro` | `<script ... src="https://assets.ipzmarketing.com/...">` sin `async`/`defer`. | Añadir `async` o `defer`. |
| `AdminLayout.astro` | Decap CMS desde unpkg sin `defer`. | Cargar con `defer` si no se necesita antes de que termine el body. |

---

## 3. Adaptabilidad (Multi-Device)

### 3.1 Media queries

| Estado | Detalle |
|--------|--------|
| ✅ | Uso de `@media (max-width: 768px)` y `@media (max-width: 480px)` en Header, BaseLayout, proyectos, categorías, blog. |
| ⚠️ | No hay breakpoint explícito para tablet (481–768px) como rango diferenciado; en la práctica 768px y 480px cubren móvil/tablet. |
| ✅ | Viewport: `<meta name="viewport" content="width=device-width, initial-scale=1.0">` en BaseLayout. |

**Recomendación:** Definir variables o comentarios con los rangos 320–480 (móvil), 481–768 (tablet), 769+ (laptop/PC) para mantener coherencia en futuros estilos.

### 3.2 Touch targets (mínimo 44×44 px)

| Archivo | Problema | Sugerencia |
|---------|----------|------------|
| `Header.astro` | En `@media (max-width: 768px)`, `.nav-links a` tiene `padding: 0.25rem 0` (~4px vertical). El área clickeable no alcanza 44px de altura. | Añadir `min-height: 44px`, `display: inline-flex`, `align-items: center` y padding vertical suficiente (por ejemplo `padding: 0.5rem 0.75rem`) para enlaces del menú. |
| `Header.astro` | `.btn-descargables` con `padding: 0.5rem 1rem` puede quedar por debajo de 44px en altura. | Asegurar `min-height: 44px` y `min-width: 44px`. |
| `categorias/noticias.astro` | `.filter-btn` y `.pagination-btn`: revisar tamaño táctil. | Aplicar `min-height: 44px` y `min-width: 44px` (o padding equivalente). |
| `blog/[id].astro` | Enlaces del TOC y CTA "Descargar Kit Gratuito". | Comprobar que botones y enlaces tengan al menos 44×44px. |

---

## 4. Código y Accesibilidad

### 4.1 Semántica HTML

| Estado | Detalle |
|--------|--------|
| ✅ | Uso de `<main>`, `<header>`, `<nav>`, `<footer>`, `<article>`, `<section>`, `<aside>` en varias páginas. |
| ⚠️ | `proyectos/index.astro` y otras usan `<div class="header-section">` para el título principal; podría ser `<header>` dentro de `<main>`. |
| ⚠️ | Listas de tarjetas a veces son `<div class="...-grid">` con hijos `<div>`; si son listas de enlaces o artículos, conviene `<ul>`/`<li>` o `<article>`. |

**Sugerencia:** Sustituir contenedores de cabecera por `<header>` y agrupar tarjetas en `<ul>`/`<li>` o `<article>` cuando sea una lista de entradas.

### 4.2 Accesibilidad (A11y)

| Estado | Detalle |
|--------|--------|
| ✅ | `lang="es"` en `<html>`. |
| ✅ | Uso de `<time datetime="...">` en artículos y listados. |
| ⚠️ | **Contraste:** Texto blanco sobre fondos con `rgba(255,255,255,0.55)` y blur puede no cumplir WCAG AA en todos los contextos. Revisar con herramienta (ej. Contrast Checker). |
| ⚠️ | **Navegación por teclado:** Los filtros de noticias (`filter-btn`) y la paginación deben ser focusables y activables con Enter/Space. Comprobar que no haya `tabindex="-1"` sin razón. |
| ⚠️ | **Focus visible:** Asegurar `:focus-visible` con outline o box-shadow para enlaces y botones. |
| ❌ | **Páginas Kit (standalone):** No incluyen skip link ni estructura ARIA; son documentos imprimibles, pero si se indexan conviene al menos un título y descripción correctos. |

---

## 5. Configuración de sistema recomendada

### 5.1 `public/robots.txt`

```txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/

Sitemap: https://admilogistic.es/sitemap-index.xml
```

(Sustituir `admilogistic.es` por el dominio real si es distinto.)

### 5.2 Astro: site y sitemap

En `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://admilogistic.es',
  integrations: [sitemap()],
  // ... resto
});
```

Instalar: `npm i @astrojs/sitemap`.

### 5.3 Exclusión de páginas Kit del sitemap (opcional)

Si las páginas Kit son solo para descarga/impresión y no se quieren en el índice, en `astro.config.mjs`:

```js
sitemap({
  filter: (page) => !page.includes('/kit/checklist-cabina') && !page.includes('/kit/guia-tiempos') && !page.includes('/kit/planificador-mantenimiento') && !page.includes('/kit/protocolo-emergencia'),
})
```

O bloquearlas con `noindex` en su `<head>` y dejarlas en el sitemap.

---

## 6. Checklist de validación final

Marcar cuando esté aplicado:

### SEO
- [ ] Todas las páginas con BaseLayout tienen title &lt;60 caracteres y description &lt;155 caracteres.
- [ ] Open Graph (og:title, og:description, og:image, og:url) en BaseLayout.
- [ ] `public/robots.txt` creado y con Sitemap correcto.
- [ ] Sitemap generado con `@astrojs/sitemap` y `site` configurado.
- [ ] Una sola H1 por página y jerarquía H1→H2→H3 correcta.
- [ ] Páginas Kit con meta description y, si se indexan, OG; o con noindex si son solo descarga.

### Performance
- [ ] Imágenes con `alt`, `width`, `height` y `loading="lazy"` (salvo LCP).
- [ ] Scripts externos (Leaflet, AdSense, ipzmarketing, Decap) con `async` o `defer`.
- [ ] Revisión de CSS above the fold y carga diferida del resto.

### Responsive y touch
- [ ] Media queries para móvil (320–480), tablet (481–768) y desktop (769+).
- [ ] Enlaces y botones del header y del panel de noticias con área táctil ≥ 44×44 px.

### Accesibilidad
- [ ] Contraste de texto/fondo WCAG AA revisado.
- [ ] Navegación por teclado en filtros y paginación.
- [ ] Estilos `:focus-visible` en controles interactivos.
- [ ] Uso de `<header>`, `<main>`, `<nav>`, `<article>`, `<section>` donde corresponda.

---

## 7. Resumen de cambios aplicados (post-auditoría)

Se han implementado las siguientes correcciones en el repositorio:

| Área | Cambio |
|------|--------|
| **SEO** | `public/robots.txt` creado con Allow, Disallow /admin y Sitemap. |
| **SEO** | `astro.config.mjs`: `site: 'https://admilogistic.es'` e integración `@astrojs/sitemap` para generar `sitemap-index.xml` en el build. |
| **SEO** | `BaseLayout.astro`: meta description truncada a 155 caracteres, canonical, Open Graph (og:title, og:description, og:image, og:url, og:locale) y Twitter card. Nueva prop opcional `image` para OG. |
| **SEO** | `blog/[id].astro`: description truncada a 155 caracteres y paso de `image` al layout para OG. |
| **Performance** | `proyectos/tacografo.astro` y `roadmaster.astro`: imágenes con `width="800" height="600"` y `loading="lazy"`. |
| **Performance** | Scripts Leaflet en `bases-datos/*.astro` e `index.astro`: añadido `defer`. |
| **Performance** | Script ipzmarketing en `descargables.astro`: añadido `async`. |
| **Touch targets** | `Header.astro`: enlaces de navegación y botón Descargables con `min-height: 44px`, `min-width: 44px` y padding adecuado; en móvil se mantienen los 44px. |

**Pendiente de revisar manualmente:** título de descargables &lt;60 caracteres, páginas Kit (meta description y OG o noindex), contraste WCAG, estilos `:focus-visible` y semántica con `<header>`/`<article>` donde aplique.

---

*Informe generado como parte de la auditoría WPO y SEO técnico del Blog AdmiLogistic.*
