const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '../src/content/blog');

// file-slug → new title (skip pictogramas-tacografo)
const updates = {
  '2026-03-12-operador-transporte-mercado-espanol-2026':
    'Operador de Transporte en España: Guía y Requisitos 2026',
  '2026-03-12-rd-88-2026-base-logistica-agregacion-demanda':
    'RD 88/2026: Base Logística y Agregación de Demanda',
  '2026-03-10-informe-rentabilidad-transporte-44-toneladas':
    'Informe Rentabilidad Transporte 2026: Las 44 Toneladas',
  '2026-02-02-tarjetas-gasoil-profesionales-ahorro-control-flota':
    'Tarjetas Gasoil Profesionales: Ahorro y Control 2026',
  '2026-03-15-vectores-supervivencia-logistica-2026':
    'Vectores de Supervivencia Logística 2026: Costes Ocultos',
  '2026-02-03-conducir-tarjeta-conductor-caducada':
    'Tarjeta de Conductor Caducada: Multa y Excepción Legal',
  '2026-03-20-mediterraneo-2026-intermodalidad-ets-margenes':
    'Mediterráneo 2026: Intermodalidad, ETS y Márgenes',
  '2026-02-07-checklist-cabina-15-cosas-inspeccion':
    'Checklist de Cabina: 15 Puntos Clave de Inspección',
  '2026-02-03-mantenimiento-preventivo-flotas':
    'Mantenimiento Preventivo de Flotas: Reduce Averías 2026',
  '2026-02-06-articulo-12-escudo-legal-excesos-conduccion':
    'Artículo 12: Justificar Legalmente un Exceso de Conducción',
  '2026-02-03-tiempos-conduccion-descanso':
    'Tiempos de Conducción y Descanso 2026: Guía Completa',
  '2026-02-03-tacografo-inteligente-g2v2':
    'Tacógrafo G2V2: Fechas, Funciones y Sanciones 2026',
  '2026-02-03-zonas-bajas-emisiones-zbe':
    'Zonas Bajas Emisiones (ZBE) 2026: Guía del Transportista',
  '2026-02-20-seguros-obligatorios-transportista-2026':
    'Seguros Obligatorios Transportista 2026: Deduce el 100%',
  '2026-02-20-averia-carretera-vs-mantenimiento-preventivo-costes':
    'Avería vs. Mantenimiento Preventivo: El Coste Real',
  '2026-02-03-infracciones-multas-tacografo':
    'Multas Tacógrafo 2026: Importes por Infracción y Recurso',
  '2026-02-03-optimizacion-rutas':
    'Optimización de Rutas 2026: Maximizar el Margen',
  '2026-02-06-de-28-a-56-dias-cambio-multas-2026':
    '56 Días de Registros Tacógrafo: Nuevas Multas 2026',
  '2026-03-07-resolucion-consejo-acuses-recibo':
    'Resolución del Consejo: Acuse Digital y Defensa Legal',
  '2026-02-20-alta-autonomo-transportista-2026':
    'Alta Autónomo Transportista 2026: Requisitos y Trámites',
  '2026-02-02-tarjeta-gasoil-profesional-dkv':
    'Tarjeta DKV Gasoil Profesional: Ahorro y Fiscalidad',
  '2026-02-03-que-es-el-tacografo':
    'Tacógrafo Digital: Tipos, Funcionamiento y Obligaciones',
  '2026-02-03-interpretar-ticket-tacografo':
    'Cómo Leer el Ticket del Tacógrafo: Guía del Inspector',
  '2026-02-03-conduccion-eficiente-ecodriving':
    'Conducción Eficiente: Factor Humano y Ahorro en Ruta',
  '2026-02-06-lona-frigo-contenedor-verdad-autoescuela':
    'Lona, Frigo o Contenedor: Diferencias para el Transportista',
  '2026-02-03-camiones-electricos-vs-diesel':
    'Camión Eléctrico vs. Diésel 2026: ¿Vale la Pena?',
  '2026-02-07-autonomo-o-sociedad-rentabilidad-ruta':
    '¿Autónomo o Sociedad? Rentabilidad en el Transporte',
  '2026-02-02-tarjeta-gasoil-profesional-bp':
    'Tarjeta BP Profesional 2026: Ahorro y Control',
  '2026-02-03-inteligencia-artificial-transporte':
    'IA en el Transporte 2026: De la Teoría a la Práctica',
  '2026-02-03-gestoria-vs-asesoria':
    'Gestoría vs Asesoría: Diferencias y Cuál Elegir',
  '2026-02-07-ayudas-transporte-2026-fondos-europeos-digitalizacion':
    'Ayudas al Transporte 2026: Fondos y Digitalización',
  '2026-02-06-honorabilidad-seguro-vida-empresa-transporte':
    'Honorabilidad Transportista: El Seguro de tu Licencia',
};

let updated = 0, errors = 0;

for (const [slug, newTitle] of Object.entries(updates)) {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    console.error(`  ✗ NOT FOUND: ${slug}.md`);
    errors++;
    continue;
  }

  const original = fs.readFileSync(filePath, 'utf8');
  // Match title line: quoted or unquoted, at start of frontmatter
  const replaced = original.replace(
    /^title:[ \t]*(".*?"|'.*?'|[^\n]+)/m,
    `title: "${newTitle}"`
  );

  if (replaced === original) {
    console.error(`  ✗ NO MATCH: ${slug}.md`);
    errors++;
    continue;
  }

  fs.writeFileSync(filePath, replaced, 'utf8');
  console.log(`  ✓ ${slug}`);
  updated++;
}

console.log(`\nUpdated: ${updated}  Errors: ${errors}`);
