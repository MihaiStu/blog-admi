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
  console.log('Optimización completada.');
})();
