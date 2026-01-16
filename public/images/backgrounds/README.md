Carpeta para imágenes de fondo (página de categorías y fondo editorial).

- Coloca aquí el archivo de fondo con el nombre: `bg-editorial.jpg` (o `bg-editorial.webp`).
- Recomendado: ancho >= 2000–2400 px, formato JPG/WEBP, calidad 70–85 para buen equilibrio calidad/peso.
- He generado una versión mejorada `bg-editorial-boost` en JPG/WebP/AVIF (más brillo y saturación) y actualicé el CSS para que use `bg-editorial-boost` como fondo principal con fallbacks AVIF/WebP/JPG.

Ejemplo de uso CSS actual: `background-image: image-set(url("/images/backgrounds/bg-editorial-boost.avif") type('image/avif') 1x, url("/images/backgrounds/bg-editorial-boost.webp") type('image/webp') 1x, url("/images/backgrounds/bg-editorial-boost.jpg") 1x);`