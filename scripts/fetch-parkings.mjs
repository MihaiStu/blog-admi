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
    // nombre real solo si existe y no es genérico; si no, cadena vacía (la página muestra el tipo)
    const nombre = nombreRaw.length >= 3 ? nombreRaw : '';
    provincias.get(slug).items.push({
      nombre,
      tipo: tipoDe(tags),
      municipio: (tags['addr:city'] || tags['addr:town'] || '').trim(),
      autopista: tags.ref || tags['destination:ref'] || '',
      plazasCamion: tags['capacity:hgv'] || tags.capacity || '',
      aseos: tags.toilets === 'yes',
      duchas: tags.shower === 'yes' || tags.shower === 'true',
      combustible: tags.fuel === 'yes' || !!tags['fuel:diesel'],
      lat: Math.round(lat * 1e6) / 1e6,
      lng: Math.round(lng * 1e6) / 1e6,
    });
  }

  const out = {
    generado: new Date().toISOString(),
    fuente: 'OpenStreetMap (Overpass API)',
    totalItems: 0,
    provincias: [],
  };

  for (const p of provincias.values()) {
    // SOLO áreas con nombre real. Las anónimas de OSM no aportan y ensucian la tabla.
    let named = p.items.filter((i) => i.nombre);

    // Deduplicar: OSM suele traer la misma área como nodo Y como polígono (mismo
    // nombre a <2 km). Fusionamos servicios y nos quedamos con una sola entrada.
    const vistos = [];
    named = named.filter((i) => {
      const dup = vistos.find(
        (v) => v.nombre.toLowerCase() === i.nombre.toLowerCase() && dist2(v.lat, v.lng, i.lat, i.lng) < 0.0004 // ~2 km
      );
      if (dup) {
        dup.aseos ||= i.aseos;
        dup.duchas ||= i.duchas;
        dup.combustible ||= i.combustible;
        dup.municipio ||= i.municipio;
        dup.autopista ||= i.autopista;
        dup.plazasCamion ||= i.plazasCamion;
        return false;
      }
      vistos.push(i);
      return true;
    });
    if (named.length === 0) continue; // provincia sin áreas nombradas -> no se genera página

    const orden = { 'Parking de camiones': 0, 'Área de servicio': 1, 'Área de descanso': 2 };
    named.sort((a, b) =>
      (orden[a.tipo] - orden[b.tipo]) ||
      a.nombre.localeCompare(b.nombre, 'es')
    );
    out.provincias.push({
      slug: p.slug,
      provincia: p.provincia,
      numItems: named.length,
      numParkings: named.filter((i) => i.tipo === 'Parking de camiones').length,
      numAreasServicio: named.filter((i) => i.tipo === 'Área de servicio').length,
      numAreasDescanso: named.filter((i) => i.tipo === 'Área de descanso').length,
      items: named.slice(0, 80),
    });
    out.totalItems += named.length;
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
