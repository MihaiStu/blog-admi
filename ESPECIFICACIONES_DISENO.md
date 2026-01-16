# Especificaciones de Diseño - Blog AdmiLogistic

## 📐 Variables CSS Globales

### Espaciado (Spacing)
```css
--spacing-xs: 0.5rem    = 8px
--spacing-sm: 1rem      = 16px
--spacing-md: 1.5rem    = 24px
--spacing-lg: 2rem      = 32px
--spacing-xl: 3rem      = 48px
--spacing-2xl: 4rem     = 64px
--section-spacing: 96px
```

### Border Radius
```css
--radius: 16px
```

### Contenedores Principales
```css
max-width: 1200px  (contenedores principales)
max-width: 800px   (páginas individuales de bases de datos)
max-width: 1400px  (grid de bases de datos en índice)
```

---

## 🎨 HEADER

### Contenedor
- **Ancho máximo:** 1200px
- **Padding horizontal:** 1rem (16px)
- **Padding vertical:** 1rem (16px)
- **Altura total:** ~48px (con padding)

### Logo
- **Tamaño de fuente:** 1.5rem (24px)
- **Font-weight:** bold

### Navegación
- **Gap entre enlaces:** 2rem (32px)
- **Gap en móvil:** 1rem (16px)

---

## 🦸 HERO SECTION

### Contenedor Hero
- **Altura mínima:** 60vh
- **Padding:** 120px 16px 96px (top: 120px, horizontal: 16px, bottom: 96px)
- **Margin bottom:** 96px (--section-spacing)
- **Background:** Gradiente linear-gradient(135deg, #667eea 0%, #764ba2 100%)

### Hero Content
- **Ancho máximo:** 1200px
- **Grid:** 2 columnas (1fr 1fr)
- **Gap entre columnas:** 80px (desktop) / 48px (tablet) / 32px (móvil)

### Hero Text
- **H1:**
  - Font-size: clamp(2.5rem, 5.5vw, 4rem) = 40px - 64px
  - Line-height: 1.1
  - Margin-bottom: 24px
  - Letter-spacing: -0.025em
  - Font-weight: 700

- **Párrafo:**
  - Font-size: clamp(1.125rem, 2vw, 1.375rem) = 18px - 22px
  - Line-height: 1.65
  - Margin-bottom: 32px

### Hero Search Input
- **Ancho:** 100%
- **Ancho máximo:** 520px
- **Padding:** 16px 24px
- **Border-radius:** 12px
- **Font-size:** 1rem (16px)

### Hero Image
- **Ancho máximo:** 500px
- **Border-radius:** 16px
- **Altura:** auto (proporcional)

### Responsive Hero
- **Móvil (< 768px):**
  - Padding: 80px 16px 64px
  - Grid: 1 columna
  - Gap: 32px
  - H1 font-size: 2rem (32px)

- **Móvil pequeño (< 480px):**
  - Padding: 64px 16px 48px
  - H1 font-size: 2rem (32px)
  - Párrafo font-size: 1rem (16px)

---

## 🚀 PROJECTS SECTION

### Contenedor
- **Ancho máximo:** 1200px
- **Padding horizontal:** 16px
- **Margin bottom:** 96px (--section-spacing)

### Título H2
- **Font-size:** clamp(1.875rem, 4vw, 2.25rem) = 30px - 36px
- **Margin-bottom:** 16px
- **Letter-spacing:** -0.015em
- **Line-height:** 1.2

### Section Intro
- **Font-size:** 1rem (16px)
- **Ancho máximo:** 700px
- **Margin-bottom:** 48px
- **Line-height:** 1.65

### Projects Grid
- **Grid:** repeat(auto-fit, minmax(300px, 1fr))
- **Gap:** 2rem (32px)
- **Móvil:** 1 columna, gap: 32px

### Project Card
- **Padding:** 48px (--spacing-xl)
- **Border-radius:** 16px
- **Ancho mínimo:** 300px
- **Altura:** 100% (flex)

### Project Image (Placeholder)
- **Ancho:** 120px
- **Altura:** 120px
- **Border-radius:** 12px
- **Margin-bottom:** 24px (--spacing-md)

### Project Card H3
- **Font-size:** 1.375rem (22px)
- **Margin-bottom:** 12px
- **Line-height:** 1.3
- **Letter-spacing:** -0.01em

### Project Card P
- **Font-size:** 0.9375rem (15px)
- **Line-height:** 1.65
- **Margin-bottom:** 24px

### Project Button
- **Padding:** 0.75rem 2rem (12px 32px)
- **Border-radius:** 8px
- **Font-weight:** 600

---

## 📰 NEWS SECTION

### News Container
- **Ancho máximo:** 1200px
- **Grid:** 1fr 320px (contenido | sidebar)
- **Gap:** 48px (--spacing-xl)
- **Padding horizontal:** 16px
- **Margin bottom:** 96px

### News H2
- **Font-size:** clamp(1.875rem, 4vw, 2.25rem) = 30px - 36px
- **Margin-bottom:** 16px
- **Letter-spacing:** -0.015em

### News Featured
- **Grid:** 300px 1fr
- **Border-radius:** 16px
- **Margin-bottom:** 32px
- **Min-height imagen:** 200px

### News Featured Content
- **Padding:** 48px (--spacing-xl)
- **H3 font-size:** 1.375rem (22px)
- **H3 margin-bottom:** 12px
- **P font-size:** 1rem (16px)
- **P line-height:** 1.65

### News List
- **Display:** flex
- **Gap:** 1rem (16px)
- **Overflow-x:** auto

### News Item
- **Min-width:** 280px
- **Padding:** 16px (--spacing-sm)
- **Border-radius:** 12px
- **Gap interno:** 16px

### News Item Image
- **Ancho:** 120px
- **Altura:** 80px
- **Border-radius:** 8px

### News Item Content
- **H4 font-size:** 0.9375rem (15px)
- **H4 margin-bottom:** 6px
- **P font-size:** 0.8125rem (13px)
- **P line-height:** 1.5

---

## 📋 SIDEBAR

### Sidebar Container
- **Ancho:** 320px
- **Gap entre elementos:** 24px (1.5rem)

### Sidebar Follow
- **Padding:** 32px (--spacing-lg)
- **Border-radius:** 16px

### Sidebar Follow H3
- **Font-size:** 0.75rem (12px)
- **Font-weight:** 500
- **Margin-bottom:** 12px
- **Letter-spacing:** 0.05em
- **Text-transform:** uppercase

### Social Links
- **Gap:** 0.5rem (8px)
- **Font-size:** 0.875rem (14px)
- **Padding vertical:** 0.5rem (8px)

### Social Link SVG Icons
- **Ancho:** 18px
- **Altura:** 18px
- **Gap con texto:** 0.75rem (12px)

### Responsive Sidebar
- **Tablet (< 1024px):**
  - Grid: 1 columna
  - Sidebar se mueve arriba (order: -1)
  - Gap: 32px

---

## 🎥 VIDEOS SECTION

### Contenedor
- **Ancho máximo:** 1200px
- **Padding horizontal:** 16px
- **Margin bottom:** 96px

### Videos Grid
- **Grid:** repeat(auto-fit, minmax(280px, 1fr))
- **Gap:** 2rem (32px)
- **Móvil:** 1 columna

### Video Card
- **Border-radius:** 16px
- **Overflow:** hidden

### Video Thumbnail
- **Aspect-ratio:** 16/9
- **Ancho:** 100%

### Video Card H4
- **Padding:** 24px 24px 8px
- **Font-size:** 0.9375rem (15px)
- **Line-height:** 1.4
- **Letter-spacing:** -0.005em

### Video Link
- **Padding:** 0 24px 24px
- **Font-size:** 0.8125rem (13px)

---

## 🗄️ DATABASES SECTION

### Contenedor
- **Ancho máximo:** 1200px
- **Padding horizontal:** 16px

### Databases Grid (Home)
- **Grid:** repeat(auto-fit, minmax(200px, 1fr))
- **Gap:** 1.5rem (24px)
- **Móvil:** 2 columnas, gap: 16px
- **Móvil pequeño:** 1 columna

### Database Item (Home)
- **Padding:** 48px (--spacing-xl)
- **Border-radius:** 16px
- **Gap interno:** 16px (--spacing-sm)

### Database Image (Home)
- **Ancho:** 80px
- **Altura:** 80px
- **Margin-bottom:** 0.5rem (8px)

### Database Item Span
- **Font-size:** 1.125rem (18px)
- **Font-weight:** 600
- **Line-height:** 1.3

### Database Desc
- **Font-size:** 0.8125rem (13px)
- **Margin-top:** 4px

### Databases Grid (Índice)
- **Grid:** repeat(auto-fit, minmax(280px, 1fr))
- **Gap:** 2rem (32px)
- **Ancho máximo:** 1400px
- **Desktop (> 1200px):** 4 columnas
- **Móvil:** 1 columna

### Database Card (Índice)
- **Padding:** 2rem (32px)
- **Border-radius:** 16px

### Database Card Image (Índice)
- **Ancho máximo:** 180px
- **Altura:** auto
- **Margin-bottom:** 1.5rem (24px)

### Database Header Image (Páginas individuales)
- **Ancho máximo:** 400px
- **Altura:** auto
- **Margin:** 0 auto 2rem (32px)

---

## 📁 CATEGORÍAS

### Categories Grid
- **Grid:** repeat(auto-fit, minmax(300px, 1fr))
- **Gap:** 2rem (32px)
- **Margin-top:** 2rem (32px)
- **Móvil:** 1 columna

### Category Card
- **Padding:** 2rem (32px)
- **Border-radius:** 16px

### Category Image
- **Ancho máximo:** 200px
- **Altura:** auto
- **Margin-bottom:** 1.5rem (24px)

### Category Card H2
- **Margin-bottom:** 1rem (16px)

### Category Card P
- **Font-size:** 1.125rem (18px)
- **Line-height:** 1.6

---

## 📄 PÁGINAS INDIVIDUALES (Bases de Datos)

### Database Page
- **Ancho máximo:** 800px
- **Padding:** 2rem 1rem (32px 16px)

### Database Header
- **Margin-bottom:** 3rem (48px)
- **Text-align:** center

### Database Header Image
- **Ancho máximo:** 400px
- **Altura:** auto
- **Margin:** 0 auto 2rem (32px)

### H1
- **Font-size:** 2.5rem (40px)
- **Margin-bottom:** 2rem (32px)

### Info Box
- **Padding:** 1.5rem (24px)
- **Border-left:** 4px solid #0066cc
- **Border-radius:** 4px
- **Margin-bottom:** 2rem (32px)

### CTA Box
- **Padding:** 2rem (32px)
- **Border-radius:** 8px
- **Margin-bottom:** 2rem (32px)

### CTA Button
- **Padding:** 0.75rem 2rem (12px 32px)
- **Border-radius:** 4px

### Coming Soon
- **Padding:** 1.5rem (24px)
- **Border:** 1px solid #ffd700
- **Border-radius:** 4px

---

## 🦶 FOOTER

### Footer
- **Padding vertical:** 2rem (32px)
- **Background:** #1a1a1a

### Footer Container
- **Ancho máximo:** 1200px
- **Padding horizontal:** 1rem (16px)
- **Text-align:** center

### Footer P
- **Opacity:** 0.8

---

## 📱 BREAKPOINTS RESPONSIVE

```css
@media (max-width: 1024px)  /* Tablet */
@media (max-width: 768px)   /* Móvil */
@media (max-width: 480px)   /* Móvil pequeño */
```

---

## 🎨 SOMBRAS (Box Shadows)

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.04)
--shadow-md: 0 2px 8px -2px rgba(0, 0, 0, 0.08), 0 1px 4px -1px rgba(0, 0, 0, 0.04)
--shadow-lg: 0 8px 16px -4px rgba(0, 0, 0, 0.1), 0 4px 8px -2px rgba(0, 0, 0, 0.04)
```

---

## 📊 RESUMEN DE TAMAÑOS DE IMÁGENES

| Ubicación | Ancho | Altura | Border-radius |
|-----------|-------|--------|---------------|
| Hero Image | max 500px | auto | 16px |
| Project Placeholder | 120px | 120px | 12px |
| News Featured Image | 300px | min 200px | - |
| News Item Image | 120px | 80px | 8px |
| Database Image (Home) | 80px | 80px | - |
| Database Card Image | max 180px | auto | - |
| Database Header Image | max 400px | auto | - |
| Category Image | max 200px | auto | - |
| Video Thumbnail | 100% | auto (16:9) | - |
| Social Icon | 18px | 18px | - |

---

## 📏 RESUMEN DE PADDINGS

| Elemento | Padding |
|----------|---------|
| Hero | 120px 16px 96px |
| Project Card | 48px |
| News Featured Content | 48px |
| News Item | 16px |
| Sidebar Follow | 32px |
| Database Item (Home) | 48px |
| Database Card (Índice) | 32px |
| Category Card | 32px |
| Header | 16px vertical |
| Footer | 32px vertical |

---

## 📐 RESUMEN DE GAPS

| Grid/Container | Gap |
|-----------------|-----|
| Hero Content | 80px (desktop) / 48px (tablet) / 32px (móvil) |
| Projects Grid | 32px |
| News Container | 48px |
| News List | 16px |
| Sidebar | 24px |
| Videos Grid | 32px |
| Databases Grid (Home) | 24px |
| Databases Grid (Índice) | 32px |
| Categories Grid | 32px |

---

**Última actualización:** Todas las medidas están en píxeles o rem (1rem = 16px)
