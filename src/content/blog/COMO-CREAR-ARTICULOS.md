---
title: "Cómo crear un nuevo artículo en el blog (Operaciones u otra categoría)"
description: "Guía rápida para crear artículos en local."
pubDate: 2025-01-30
category: operaciones
---

## En local

1. **Crea un archivo `.md`** dentro de **`src/content/blog/`**  
   Ejemplo: `src/content/blog/mi-articulo-operaciones.md`

2. **Añade el frontmatter** (bloque entre `---`) al inicio del archivo:

```yaml
---
title: "Título que quieras"
description: "Breve descripción (opcional)"
pubDate: 2025-01-30
category: operaciones
---
```

3. **Categorías permitidas** (valor de `category`):
   - `operaciones`
   - `cumplimiento`
   - `fiscalidad`
   - `vehiculos`
   - `tarjetas-gasoil`
   - `actualidad`

4. **Escribe el contenido** debajo del frontmatter en **Markdown** (títulos, listas, negrita, enlaces, etc.).

5. **Guarda** y recarga la web en local (`npm run dev` → http://localhost:4321).

- Los artículos de **Operaciones** se listan en: **Categorías → Operaciones** (`/categorias/operaciones`).
- Cada artículo tiene su propia URL: **`/blog/nombre-del-archivo`** (el “nombre del archivo” es el del `.md` sin extensión).
