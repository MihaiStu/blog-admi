// scripts/fetch-gasolineras.mjs
// Descarga precios oficiales de carburante (API gratuita del Gobierno, Minetur)
// y los agrupa por provincia para generar páginas SEO estáticas.
//
// Fuente: https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/
// Ejecutar:  node scripts/fetch-gasolineras.mjs
// Salida:    src/data/gasolineras-provincias.json
//
// Se centra en GASÓLEO A (diésel), que es lo que consumen los camiones.

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../src/data/gasolineras-provincias.json');

const API = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/';

// Precio "1,609" (coma decimal español) -> 1.609 ; vacío -> null
function parsePrecio(v) {
  if (!v || typeof v !== 'string') return null;
  const n = parseFloat(v.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

function parseCoord(v) {
  if (!v) return null;
  const n = parseFloat(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/ñ/g, 'n').replace(/Ñ/g, 'n')
    .normalize('NFD').replace(/\p{Diacritic}/gu, '') // quita acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Provincia en MAYÚSCULAS de la API -> Capitalización bonita
function titleCase(s) {
  return String(s).toLowerCase().replace(/(^|\s|\/|-)([a-záéíóúñ])/g, (m, sep, ch) => sep + ch.toUpperCase());
}

async function main() {
  console.log('Descargando estaciones de', API);
  const res = await fetch(API);
  if (!res.ok) throw new Error('API respondió ' + res.status);
  // La API devuelve BOM + JSON; res.json() de undici lo tolera, pero por si acaso:
  const text = await res.text();
  const data = JSON.parse(text.replace(/^﻿/, ''));
  const lista = data.ListaEESSPrecio || [];
  console.log('Estaciones recibidas:', lista.length, '| Fecha fuente:', data.Fecha);

  const provincias = new Map();

  for (const e of lista) {
    const provNombre = e['Provincia'];
    if (!provNombre) continue;
    const diesel = parsePrecio(e['Precio Gasoleo A']);
    // Solo nos interesan estaciones que venden gasóleo A (diésel de camión)
    if (diesel == null) continue;
    // Descarta precios claramente inválidos (placeholders tipo 1,000 o erróneos).
    // Ningún diésel real en España cae fuera de este rango.
    if (diesel < 1.10 || diesel > 2.50) continue;

    const slug = slugify(provNombre);
    if (!provincias.has(slug)) {
      provincias.set(slug, {
        slug,
        provincia: titleCase(provNombre),
        estaciones: [],
      });
    }
    provincias.get(slug).estaciones.push({
      rotulo: titleCase(e['Rótulo'] || ''),
      municipio: e['Municipio'] || e['Localidad'] || '',
      direccion: e['Dirección'] || '',
      horario: e['Horario'] || '',
      diesel,
      dieselPremium: parsePrecio(e['Precio Gasoleo Premium']),
      gasolina95: parsePrecio(e['Precio Gasolina 95 E5']),
      adblue: parsePrecio(e['Precio Adblue']),
      lat: parseCoord(e['Latitud']),
      lng: parseCoord(e['Longitud (WGS84)']),
    });
  }

  const out = {
    fecha: data.Fecha || null,
    generado: new Date().toISOString(),
    fuente: 'Ministerio para la Transición Ecológica (Geoportal de Hidrocarburos)',
    totalEstaciones: lista.length,
    provincias: [],
  };

  for (const p of provincias.values()) {
    const precios = p.estaciones.map((s) => s.diesel).sort((a, b) => a - b);
    const n = precios.length;
    const media = precios.reduce((a, b) => a + b, 0) / n;
    // ordena estaciones por diésel más barato
    p.estaciones.sort((a, b) => a.diesel - b.diesel);
    out.provincias.push({
      slug: p.slug,
      provincia: p.provincia,
      numEstaciones: n,
      dieselMin: +precios[0].toFixed(3),
      dieselMax: +precios[n - 1].toFixed(3),
      dieselMedia: +media.toFixed(3),
      // top 40 más baratas para render en HTML (suficiente para SEO, no infla la página)
      estaciones: p.estaciones.slice(0, 40),
    });
  }

  out.provincias.sort((a, b) => a.provincia.localeCompare(b.provincia, 'es'));

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(out, null, 2), 'utf-8');
  console.log('Escrito', OUT);
  console.log('Provincias:', out.provincias.length, '| Estaciones con diésel:', out.provincias.reduce((a, p) => a + p.numEstaciones, 0));
}

main().catch((err) => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
