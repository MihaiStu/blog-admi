// scripts/webp-migrate.mjs
// Converts all JPG/PNG in public/uploads and public/images to WebP (quality 80)
// and updates all code references accordingly.

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const QUALITY = 80;

function findFiles(dir, extensions) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFiles(fullPath, extensions));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (extensions.includes(ext)) results.push(fullPath);
    }
  }
  return results;
}

(async () => {
  // ─── PHASE 1: Convert images ───────────────────────────────────────────────
  const imageDirs = [
    path.join(ROOT, 'public/uploads'),
    path.join(ROOT, 'public/images'),
  ];

  const imageFiles = imageDirs.flatMap(d =>
    findFiles(d, ['.jpg', '.jpeg', '.png'])
  );

  console.log(`\n=== PHASE 1: Converting ${imageFiles.length} images → WebP (quality ${QUALITY}) ===\n`);

  let converted = 0, errors = 0;
  for (const imgPath of imageFiles) {
    const webpPath = imgPath.replace(/\.(jpe?g|png)$/i, '.webp');
    try {
      await sharp(imgPath).webp({ quality: QUALITY }).toFile(webpPath);
      console.log(`  ✓  ${path.relative(ROOT, imgPath)}`);
      converted++;
    } catch (err) {
      console.error(`  ✗  ${path.relative(ROOT, imgPath)}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\n  → Converted: ${converted}   Errors: ${errors}\n`);

  // ─── PHASE 2: Update references ────────────────────────────────────────────
  const sourceFiles = [
    ...findFiles(path.join(ROOT, 'src'), ['.astro', '.md', '.ts', '.js', '.css']),
    path.join(ROOT, 'public/admin/config.yml'),
  ].filter(f => fs.existsSync(f));

  console.log(`=== PHASE 2: Updating references in ${sourceFiles.length} source files ===\n`);

  // Matches /uploads/... or /images/... paths ending in .jpg/.jpeg/.png
  // Handles URL-encoded names, spaces, dots in filename (e.g. file.1.jpg)
  const RE = /(\/(?:uploads|images)\/[^"'\n\r<>]+?)\.(jpe?g|png)(?=[^a-zA-Z0-9]|$)/gi;

  let updated = 0;
  for (const filePath of sourceFiles) {
    const original = fs.readFileSync(filePath, 'utf8');
    const replaced = original.replace(RE, '$1.webp');
    if (replaced !== original) {
      fs.writeFileSync(filePath, replaced, 'utf8');
      console.log(`  Updated: ${path.relative(ROOT, filePath)}`);
      updated++;
    }
  }

  console.log(`\n  → Updated ${updated} files.\n`);
  console.log('Migration complete!\n');
})();
