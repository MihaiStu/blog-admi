// scripts/fetch-parkings.mjs
// Descarga áreas de servicio, áreas de descanso y parkings de camiones de España
// desde OpenStreetMap (Overpass API, gratis) y las agrupa por provincia para
// generar páginas SEO estáticas ("parking camiones / área de descanso {provincia}").
//
// La provincia se asigna por CERCANÍA: OSM casi nunca trae provincia, así que
// usamos las ~11.000 gasolineras oficiales (que sí tienen provincia + coordenadas)
// como rejilla de referencia y asignamos a cada área la provincia de la gasolinera
// más cercana. Sin dependencias externas.
//
// Ejecutar:  node scripts/fetch-parkings.mjs
// Salida:    src/data/parkings-provincias.json

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../src/data/parkings-provincias.json');

const OVERPASS = 'https://overpass-api.de/api/interpreter';
const MINETUR = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/';

const OVERPASS_QUERY = `
[out:json][timeout:120];
area["ISO3166-1"="ES"][admin_level=2]->.es;
(
  nwr["amenity"="parking"]["hgv"="yes"](area.es);
  nwr["amenity"="parking"]["access"="hgv"](area.es);
  nwr["highway"="services"](area.es);
  nwr["highway"="rest_area"](area.es);
);
out center tags;`;

function parseCoord(v) {
  if (v == null) return null;
  const n = parseFloat(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

function slugify(s) {
  return String(s)
    .replace(/ñ/g, 'n').replace(/Ñ/g, 'n')
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function titleCase(s) {
  return String(s).toLowerCase().replace(/(^|\s|\/|-)([a-záéíóúñ])/g, (m, sep, ch) => sep + ch.toUpperCase());
}

// Distancia rápida (equirectangular, suficiente para "más cercano" en España)
function dist2(aLat, aLng, bLat, bLng) {
  const dLat = aLat - bLat;
  const dLng = (aLng - bLng) * Math.cos((aLat * Math.PI) / 180);
  return dLat * dLat + dLng * dLng;
}

async function fetchReferenciaProvincias() {
  console.log('Descargando gasolineras (rejilla de provincias)...');
  const res = await fetch(MINETUR);
  const data = JSON.parse((await res.text()).replace(/^﻿/, ''));
  const ref = [];
  for (const e of data.ListaEESSPrecio || []) {
    const lat = parseCoord(e['Latitud']);
    const lng = parseCoord(e['Longitud (WGS84)']);
    const prov = e['Provincia'];
    if (lat != null && lng != null && prov) ref.push({ lat, lng, prov: titleCase(prov) });
  }
  console.log('Puntos de referencia:', ref.length);
  return ref;
}

function provinciaMasCercana(lat, lng, ref) {
  let best = null;
  let bestD = Infinity;
  for (const r of ref) {
    const d = dist2(lat, lng, r.lat, r.lng);
    if (d < bestD) { bestD = d; best = r.prov; }
  }
  return best;
}

function tipoDe(tags) {
  if (tags.highway === 'services') return 'Área de servicio';
  if (tags.highway === 'rest_area') return 'Área de descanso';
  return 'Parking de camiones';
}

async function main() {
  const ref = await fetchReferenciaProvincias();

  console.log('Descargando áreas y parkings de OpenStreetMap...');
  const res = await fetch(OVERPASS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'AdmiLogistic-blog/1.0 (https://admilogistic.es; contacto@admilogistic.es)',
      'Accept': '*/*',
    },
    body: 'data=' + encodeURIComponent(OVERPASS_QUERY),
  });
  if (!res.ok) throw new Error('Overpass respondió ' + res.status);
  const data = await res.json();
  const els = data.elements || [];
  console.log('Elementos recibidos:', els.length);

  const provincias = new Map();

  for (const e of els) {
    const lat = e.lat ?? e.center?.lat;
    const lng = e.lon ?? e.center?.lon;
    if (lat == null || lng == null) continue;
    const tags = e.tags || {};
    const prov = provinciaMasCercana(lat, lng, ref);
    if (!prov) continue;

    const slug = slugify(prov);
    if (!provincias.has(slug)) {
      provincias.set(slug, { slug, provincia: prov, items: [] });
    }
    const nombreRaw = (tags.name || '').trim();
    const nombre = nombreRaw.length >= 3 ? nombreRaw : tipoDe(tags);
    provincias.get(slug).items.push({
      nombre,
      tipo: tipoDe(tags),
      autopista: tags.ref || tags['destination:ref'] || '',
      plazasCamion: tags['capacity:hgv'] || tags.capacity || '',
      aseos: tags.toilets === 'yes',
      duchas: tags.shower === 'yes' || tags.shower === 'true',
      combustible: tags.fuel === 'yes' || !!tags['fuel:diesel'],
      lat, lng,
    });
  }

  const out = {
    generado: new Date().toISOString(),
    fuente: 'OpenStreetMap (Overpass API)',
    totalItems: 0,
    provincias: [],
  };

  for (const p of provincias.values()) {
    // ordena: primero parkings de camiones, luego áreas de servicio, luego descanso; con nombre antes
    const orden = { 'Parking de camiones': 0, 'Área de servicio': 1, 'Área de descanso': 2 };
    p.items.sort((a, b) => (orden[a.tipo] - orden[b.tipo]) || a.nombre.localeCompare(b.nombre, 'es'));
    out.provincias.push({
      slug: p.slug,
      provincia: p.provincia,
      numItems: p.items.length,
      numParkings: p.items.filter((i) => i.tipo === 'Parking de camiones').length,
      numAreasServicio: p.items.filter((i) => i.tipo === 'Área de servicio').length,
      numAreasDescanso: p.items.filter((i) => i.tipo === 'Área de descanso').length,
      items: p.items.slice(0, 60), // suficiente para SEO, sin inflar la página
    });
    out.totalItems += p.items.length;
  }

  out.provincias.sort((a, b) => a.provincia.localeCompare(b.provincia, 'es'));

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(out, null, 2), 'utf-8');
  console.log('Escrito', OUT);
  console.log('Provincias:', out.provincias.length, '| Áreas/parkings totales:', out.totalItems);
}

main().catch((err) => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
