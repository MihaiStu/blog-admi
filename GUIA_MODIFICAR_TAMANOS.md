# 📐 Guía para Modificar Tamaños de Bloques - Página de Inicio

## 📍 Archivo Principal
**`src/pages/index.astro`** - Al final del archivo hay una sección `<style>` con todo el CSS.

---

## 🎯 Secciones Principales y Cómo Modificarlas

### 1️⃣ **HERO (Sección Principal Superior)**

**Línea ~346-426**

```css
.hero {
  min-height: 60vh;        /* ← Altura del hero (60% de la pantalla) */
  padding: 120px 1rem 96px; /* ← Espaciado interno (arriba, lados, abajo) */
  margin-bottom: 96px;     /* ← Espacio debajo del hero */
}

.hero-content {
  max-width: 1200px;       /* ← Ancho máximo del contenido */
  gap: 80px;               /* ← Espacio entre texto e imagen */
}

.hero-image-content {
  max-width: 500px;        /* ← Tamaño máximo de la imagen */
}
```

**Para hacer el hero más pequeño:**
- Cambiar `min-height: 60vh` → `40vh` o `auto`
- Reducir `padding: 120px` → `60px` o `40px`
- Reducir `gap: 80px` → `40px` o `32px`

---

### 2️⃣ **PROJECTS (Tarjetas de Proyectos)**

**Línea ~428-522**

```css
.projects-grid {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  /* ↑ Tamaño mínimo de cada tarjeta: 300px */
  gap: 2rem;              /* ← Espacio entre tarjetas */
}

.project-card {
  padding: 3rem;           /* ← Espaciado interno de cada tarjeta */
}

.project-placeholder {
  width: 120px;           /* ← Tamaño del icono/imagen */
  height: 120px;
}
```

**Para hacer las tarjetas más pequeñas:**
- Cambiar `minmax(300px, 1fr)` → `minmax(250px, 1fr)` o `minmax(280px, 1fr)`
- Reducir `padding: 3rem` → `2rem` o `1.5rem`
- Reducir `gap: 2rem` → `1.5rem` o `1rem`

---

### 3️⃣ **NEWS (Noticias con Sidebar)**

**Línea ~524-700**

```css
.news-container {
  max-width: 1200px;      /* ← Ancho máximo */
  gap: 3rem;              /* ← Espacio entre noticias y sidebar */
}

.news-featured {
  grid-template-columns: 300px 1fr;
  /* ↑ Ancho de la imagen: 300px */
  margin-bottom: 2rem;     /* ← Espacio debajo */
}

.news-featured-content {
  padding: 3rem;          /* ← Espaciado interno */
}

.news-item {
  min-width: 280px;       /* ← Ancho mínimo de cada item */
  padding: 1rem;          /* ← Espaciado interno */
}
```

**Para hacer las noticias más compactas:**
- Cambiar `grid-template-columns: 300px 1fr` → `250px 1fr`
- Reducir `padding: 3rem` → `2rem`
- Reducir `min-width: 280px` → `240px`

---

### 4️⃣ **VIDEOS (Tarjetas de Vídeos)**

**Línea ~700-800**

```css
.videos-grid {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  /* ↑ Tamaño mínimo: 280px */
  gap: 2rem;              /* ← Espacio entre tarjetas */
}

.video-card {
  /* Sin padding específico, usa el del contenedor */
}
```

**Para hacer los vídeos más pequeños:**
- Cambiar `minmax(280px, 1fr)` → `minmax(240px, 1fr)`
- Reducir `gap: 2rem` → `1.5rem`

---

### 5️⃣ **DATABASES (Bases de Datos)**

**Línea ~800-900**

```css
.databases-grid {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  /* ↑ Tamaño mínimo: 200px */
  gap: 1.5rem;            /* ← Espacio entre tarjetas */
}

.database-item {
  padding: 3rem;          /* ← Espaciado interno */
}
```

**Para hacer las bases de datos más pequeñas:**
- Cambiar `minmax(200px, 1fr)` → `minmax(180px, 1fr)`
- Reducir `padding: 3rem` → `2rem` o `1.5rem`
- Reducir `gap: 1.5rem` → `1rem`

---

## 🎨 Variables Globales (Línea ~319-338)

Puedes modificar estas variables para cambiar TODOS los tamaños a la vez:

```css
:root {
  --spacing-xs: 0.5rem;    /* 8px */
  --spacing-sm: 1rem;      /* 16px */
  --spacing-md: 1.5rem;    /* 24px */
  --spacing-lg: 2rem;      /* 32px */
  --spacing-xl: 3rem;      /* 48px */
  --spacing-2xl: 4rem;     /* 64px */
  --section-spacing: 96px; /* Espacio entre secciones */
  --radius: 16px;          /* Bordes redondeados */
}
```

**Ejemplo:** Si cambias `--spacing-xl: 3rem` → `2rem`, todas las tarjetas que usen `padding: var(--spacing-xl)` se harán más pequeñas.

---

## 🔧 Ejemplos Prácticos

### Ejemplo 1: Hacer el Hero más pequeño
```css
.hero {
  min-height: 40vh;        /* Antes: 60vh */
  padding: 60px 1rem 48px; /* Antes: 120px 1rem 96px */
}
```

### Ejemplo 2: Hacer las tarjetas de proyectos más compactas
```css
.projects-grid {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* Antes: 300px */
  gap: 1.5rem; /* Antes: 2rem */
}

.project-card {
  padding: 2rem; /* Antes: 3rem */
}
```

### Ejemplo 3: Reducir espaciado entre secciones
```css
:root {
  --section-spacing: 64px; /* Antes: 96px */
}
```

---

## 📱 Responsive (Móviles)

Al final del archivo hay secciones `@media` que controlan cómo se ven en móviles. Busca:
- `@media (max-width: 1024px)` - Tablets
- `@media (max-width: 768px)` - Móviles
- `@media (max-width: 480px)` - Móviles pequeños

---

## 💡 Consejos

1. **Empieza por las variables globales** (`:root`) para cambios generales
2. **Modifica secciones específicas** si solo quieres cambiar una parte
3. **Guarda el archivo** y el servidor se recarga automáticamente
4. **Prueba en diferentes tamaños de pantalla** usando las herramientas de desarrollador del navegador

---

## 🚀 Cómo Editar

1. Abre `src/pages/index.astro` en tu editor
2. Ve al final del archivo (busca `<style>`)
3. Localiza la sección que quieres modificar (usa Ctrl+F para buscar)
4. Cambia los valores
5. Guarda el archivo
6. El navegador se recarga automáticamente

---

¿Necesitas ayuda con algún cambio específico? Solo dime qué sección y qué tamaño quieres y te ayudo a hacerlo.
