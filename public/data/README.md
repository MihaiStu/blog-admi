# Datos de las bases (mapa del blog)

Estos JSON son los mismos datos que usa **RoadMaster**. Para actualizarlos con la base completa:

1. En el proyecto **RoadMaster** (en tu PC, mismo nivel que `blog-admi`):
   ```bash
   cd path/a/roadmaster
   npm run export-bases-blog
   ```
2. Los archivos `talleres.json`, `parkings.json` y `hoteles.json` se generan en esta carpeta (`blog-admi/public/data/`).
3. `gasolineras.geojson` se mantiene desde tu carpeta *PLATAFORMA ADMI* (copiar manualmente si lo actualizas).

Así el mapa del blog siempre muestra datos de fiar y al día.
