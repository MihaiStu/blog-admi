# Admin (Decap CMS) – Uso en local

Para editar contenido (blog, proyectos como Roadmaster, etc.) en tu máquina sin tocar GitHub:

## 1. Arrancar el servidor proxy del CMS

En una terminal, desde la raíz del proyecto:

```bash
npm run admin:server
```

Se queda escuchando en **http://localhost:8081**. No la cierres mientras uses el admin.

## 2. Arrancar el sitio

En **otra** terminal:

```bash
npm run dev
```

Astro suele usar **http://localhost:4321**.

## 3. Abrir el admin

En el navegador:

**http://localhost:4321/admin**

(El admin se sirve desde tu sitio; el proxy en el puerto 8081 lo usa Decap por debajo.)

## 4. Editar

- No hace falta login en local: el proxy escribe directamente en tu repo Git.
- Los cambios se guardan en archivos (por ejemplo `src/content/proyectos/roadmaster.md`).
- Para verlos en la web, recarga la página del sitio (o deja que Astro recargue si está en modo dev).

## Si el puerto 8081 está ocupado

Crea un `.env` en la raíz del proyecto:

```
PORT=8082
```

Y en `public/admin/config.yml` cambia a:

```yaml
local_backend:
  url: http://localhost:8082/api/v1
```

Luego arranca el proxy con `npm run admin:server` (usará el puerto del `.env`).
