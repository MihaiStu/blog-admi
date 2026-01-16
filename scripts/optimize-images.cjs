const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const inputDir = path.join(__dirname, '..', 'public', 'images', 'projects');
const sizes = [480, 800, 1200];

const files = [
  { src: 'admiok.png', base: 'admin-logistic-tools' },
  { src: 'roadok.png', base: 'roadmaster' },
  { src: 'tachook.png', base: 'tacografo' }
];

(async () => {
  console.log('Optimización de imágenes iniciada...');
  for (const file of files) {
    const srcPath = path.join(inputDir, file.src);
    if (!fs.existsSync(srcPath)) {
      console.warn(`No encontrado: ${file.src}, saltando.`);
      continue;
    }

    for (const size of sizes) {
      const outJpg = path.join(inputDir, `${file.base}-${size}.jpg`);
      const outWebp = path.join(inputDir, `${file.base}-${size}.webp`);

      await sharp(srcPath)
        .resize(size)
        .jpeg({ quality: 80 })
        .toFile(outJpg);

      await sharp(srcPath)
        .resize(size)
        .webp({ quality: 75 })
        .toFile(outWebp);

      console.log(`Generado: ${path.basename(outJpg)} / ${path.basename(outWebp)}`);
    }

    // También generar una versión por defecto (800)
    const defaultJpg = path.join(inputDir, `${file.base}.jpg`);
    const defaultWebp = path.join(inputDir, `${file.base}.webp`);
    if (!fs.existsSync(defaultJpg)) {
      await sharp(srcPath).resize(800).jpeg({ quality: 80 }).toFile(defaultJpg);
      await sharp(srcPath).resize(800).webp({ quality: 75 }).toFile(defaultWebp);
      console.log(`Generadas por defecto: ${path.basename(defaultJpg)} / ${path.basename(defaultWebp)}`);
    }
  }

  // Background processing: generate contextual boosted backgrounds (JPG/WebP/AVIF)
  const backgroundsDir = path.join(__dirname, '..', 'public', 'images', 'backgrounds');
  const backgrounds = [
    // HOME: use bg-home.jpg as source
    { src: 'bg-home.jpg', base: 'bg-home-boost', width: 2400, modulate: { brightness: 1.06, saturation: 1.08 }, overlay: { type: 'fog', opacity: 0.06, color: '#ffffff' }, normalize: true, sharpen: true },
    // CATEGORÍAS: use bg-categorias.jpg as source
    { src: 'bg-categorias.jpg', base: 'bg-categorias-boost', width: 2400, modulate: { brightness: 1.03, saturation: 1.04 }, overlay: null, normalize: true, sharpen: true },
    // BASES: use bg-bases.jpg as source
    { src: 'bg-bases.jpg', base: 'bg-bases-boost', width: 2400, modulate: { brightness: 0.98, saturation: 0.95 }, overlay: { type: 'tint', opacity: 0.06, color: '#eaf4ff' }, normalize: true, sharpen: true },
    // PROYECTOS: use bg-proyectos.jpg as source
    { src: 'bg-proyectos.jpg', base: 'bg-proyectos-boost', width: 2400, modulate: { brightness: 1.12, saturation: 1.22 }, overlay: { type: 'vibe', opacity: 0.06, color: '#fff5f8' }, normalize: true, sharpen: true }
  ];

  for (const bg of backgrounds) {
    const srcPath = path.join(backgroundsDir, bg.src);
    if (!fs.existsSync(srcPath)) {
      console.warn(`Background no encontrado: ${bg.src}, saltando ${bg.base}.`);
      continue;
    }

    const outJpg = path.join(backgroundsDir, `${bg.base}.jpg`);
    const outWebp = path.join(backgroundsDir, `${bg.base}.webp`);
    const outAvif = path.join(backgroundsDir, `${bg.base}.avif`);

    // Get metadata to compute resized height (so overlay SVG matches dimensions)
    const srcMeta = await sharp(srcPath).metadata();
    const effectiveWidth = Math.min(bg.width, srcMeta.width);
    const resizedHeight = Math.max( Math.round((effectiveWidth / srcMeta.width) * srcMeta.height), 1 );

    let pipeline = sharp(srcPath).resize({ width: bg.width, withoutEnlargement: true });

    // Apply color/brightness adjustments
    if (bg.modulate) {
      pipeline = pipeline.modulate({ brightness: bg.modulate.brightness || 1, saturation: bg.modulate.saturation || 1 });
    }

    // Normalize/contrast and sharpen when requested
    if (bg.normalize) pipeline = pipeline.normalize();
    if (bg.sharpen) pipeline = pipeline.sharpen();

    try {
      // Generate a resized buffer first so we can get exact dimensions for overlays
      const resizedBuffer = await pipeline.clone().toBuffer();
      const resizedMeta2 = await sharp(resizedBuffer).metadata();
      const exactW = resizedMeta2.width;
      const exactH = resizedMeta2.height;

      let finalPipeline = sharp(resizedBuffer);

      // Apply overlays (fog/tint/vibe) using SVG composed over the image; SVG sized to match resized image
      if (bg.overlay) {
        let svg = null;
        if (bg.overlay.type === 'fog') {
          svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${exactW}' height='${exactH}' viewBox='0 0 ${exactW} ${exactH}'><defs><radialGradient id='g' cx='50%' cy='65%' r='60%'><stop offset='0%' stop-color='${bg.overlay.color}' stop-opacity='${bg.overlay.opacity}'/><stop offset='100%' stop-color='${bg.overlay.color}' stop-opacity='0'/></radialGradient></defs><rect width='100%' height='100%' fill='url(#g)'/></svg>`;
        } else if (bg.overlay.type === 'tint' || bg.overlay.type === 'vibe') {
          svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${exactW}' height='${exactH}' viewBox='0 0 ${exactW} ${exactH}'><rect width='100%' height='100%' fill='${bg.overlay.color}' fill-opacity='${bg.overlay.opacity}'/></svg>`;
        }

        if (svg) {
          finalPipeline = finalPipeline.composite([{ input: Buffer.from(svg), blend: 'over' }]);
        }
      }

      // Write outputs from final pipeline
      await finalPipeline.clone().jpeg({ quality: 82 }).toFile(outJpg);
      await finalPipeline.clone().webp({ quality: 75 }).toFile(outWebp);
      await finalPipeline.clone().avif({ quality: 60 }).toFile(outAvif);

      console.log(`Generado background contextual: ${path.basename(outJpg)} / ${path.basename(outWebp)} / ${path.basename(outAvif)}`);
    } catch (err) {
      console.error(`Error al procesar ${bg.base}:`, err.message);
    }
  }

  console.log('Optimización completada.');
})();
