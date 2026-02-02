# Subidas del CMS (blog y páginas)

Las imágenes que subes desde el **admin** (Decap CMS) se guardan aquí.

- **Ruta en el proyecto:** `public/uploads/`
- **URL en la web:** `/uploads/nombre-del-archivo.jpg`

## Si tienes imágenes en otra carpeta (p. ej. `C:\...\marketing\articulos blog`)

1. **Opción A – Subir desde el admin:** En el artículo, en el campo "Imagen", usa el botón de subir y elige el archivo. Se copiará aquí automáticamente.
2. **Opción B – Copiar a mano:** Copia los archivos a `public/uploads/` (o a una subcarpeta como `public/uploads/articulos-blog/`). En el admin, al elegir imagen, selecciona el archivo que ya está en `/uploads/...`.

**Importante:** El sitio solo puede usar imágenes que estén **dentro del proyecto** (en `public/`). Una ruta como `C:\Users\...\marketing\articulos blog` está fuera del proyecto; hay que copiarlas aquí o subirlas desde el admin.
