const fs = require('fs');
const path = require('path');

function findPairs(dir, results) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) {
      findPairs(fp, results);
    } else if (/\.(jpe?g|png)$/i.test(e.name)) {
      const webp = fp.replace(/\.(jpe?g|png)$/i, '.webp');
      if (fs.existsSync(webp)) {
        results.push({ orig: fp, webp });
      }
    }
  }
}

const pairs = [];
findPairs('public/uploads', pairs);
findPairs('public/images', pairs);

let origTotal = 0, webpTotal = 0;
const rows = pairs.map(({ orig, webp }) => {
  const os = fs.statSync(orig).size;
  const ws = fs.statSync(webp).size;
  origTotal += os;
  webpTotal += ws;
  const pct = ((1 - ws / os) * 100).toFixed(0);
  const name = path.relative('public', orig);
  return { name, origKB: Math.round(os / 1024), webpKB: Math.round(ws / 1024), pct: +pct, savedKB: Math.round((os - ws) / 1024) };
});

rows.sort((a, b) => b.savedKB - a.savedKB);

console.log('\n--- TOP 25 por ahorro ---');
console.log('Archivo'.padEnd(52) + 'Original'.padStart(10) + '   WebP'.padStart(8) + '  Ahorro'.padStart(10));
console.log('-'.repeat(82));
for (const r of rows.slice(0, 25)) {
  console.log(
    r.name.slice(0, 51).padEnd(52) +
    (r.origKB + ' KB').padStart(10) +
    ('  ' + r.webpKB + ' KB').padStart(8) +
    ('  -' + r.pct + '%').padStart(10)
  );
}

const origMB = (origTotal / 1024 / 1024).toFixed(2);
const webpMB = (webpTotal / 1024 / 1024).toFixed(2);
const savedMB = ((origTotal - webpTotal) / 1024 / 1024).toFixed(2);
const pctTotal = ((1 - webpTotal / origTotal) * 100).toFixed(1);

console.log('\n--- RESUMEN GLOBAL (' + pairs.length + ' imágenes) ---');
console.log('Originales : ' + origMB + ' MB');
console.log('WebP       : ' + webpMB + ' MB');
console.log('Ahorro     : ' + savedMB + ' MB  (-' + pctTotal + '%)');
