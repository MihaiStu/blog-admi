#!/usr/bin/env node

/**
 * AdmiLogistic Blog SEO Toolkit (AEO/GEO & Technical Auditor)
 * Command: node scripts/seo.cjs [audit|spy|diagnose|fix|all]
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const blogDir = path.join(rootDir, 'src/content/blog');
const distDir = path.join(rootDir, 'dist');
const publicDir = path.join(rootDir, 'public');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

// Main Router
function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'all';

  console.log(`\n${colors.bright}${colors.cyan}====================================================`);
  console.log(`🚀 ADMILOGISTIC SEO TOOLKIT (Traditional & AI Search)`);
  console.log(`====================================================${colors.reset}\n`);

  switch (command) {
    case 'audit':
      runAudit();
      break;
    case 'spy':
      runSpy();
      break;
    case 'diagnose':
      runDiagnose();
      break;
    case 'fix':
      runFix();
      break;
    case 'all':
      runAll();
      break;
    case '--help':
    case '-h':
    default:
      printHelp();
  }
}

function printHelp() {
  console.log(`${colors.bright}Uso:${colors.reset} node scripts/seo.cjs [comando]`);
  console.log(`\n${colors.bright}Comandos disponibles:${colors.reset}`);
  console.log(`  ${colors.green}audit${colors.reset}    - Auditoría técnica SEO tradicional (meta tags, enlaces rotos, alt de imágenes, tamaño de recursos).`);
  console.log(`  ${colors.green}spy${colors.reset}      - AI Search Spy (GEO / AEO - Optimización para ChatGPT, Gemini y Perplexity).`);
  console.log(`  ${colors.green}diagnose${colors.reset} - Diagnóstico de "ganancias rápidas" (FAQ Schema, intenciones de búsqueda y Q&A).`);
  console.log(`  ${colors.green}fix${colors.reset}      - Ejecución de correcciones autónomas (Generación de llms.txt y llms-full.txt).`);
  console.log(`  ${colors.green}all${colors.reset}      - Ejecuta todas las herramientas y genera un informe de estado consolidado.`);
  console.log(`\n${colors.dim}Nota: El comando 'audit' requiere que se haya ejecutado primero 'npm run build' para analizar la carpeta /dist.${colors.reset}\n`);
}

// Helper: Recursively get all HTML files from dist/
function getAllHtmlFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

// Helper: Recursively get all MD/MDX files from blog content
function getAllBlogFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllBlogFiles(fullPath));
    } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
      if (file !== '.gitkeep') {
        results.push(fullPath);
      }
    }
  });
  return results;
}

// ==========================================
// 1. AUDIT COMMAND (Technical SEO Auditor)
// ==========================================
function runAudit() {
  console.log(`${colors.bright}${colors.blue}[1/4] AUDITORÍA TÉCNICA SEO (en carpeta /dist)...${colors.reset}\n`);
  
  if (!fs.existsSync(distDir)) {
    console.log(`${colors.red}❌ Error: La carpeta /dist no existe. Por favor, ejecuta 'npm run build' primero.${colors.reset}\n`);
    return null;
  }

  const htmlFiles = getAllHtmlFiles(distDir);
  console.log(`Analizando ${htmlFiles.length} páginas HTML...`);

  const issues = {
    missingTitle: [],
    longTitle: [],
    missingDesc: [],
    longDesc: [],
    missingAlt: [],
    largeImages: [],
    brokenLinks: [],
    orphanPages: {}
  };

  const pages = {};
  const incomingLinks = {};

  // Initialize pages and link structures
  htmlFiles.forEach(file => {
    let rel = path.relative(distDir, file).replace(/\\/g, '/');
    let urlPath = '/' + rel;
    if (urlPath.endsWith('/index.html')) {
      urlPath = urlPath.slice(0, -10);
    } else if (urlPath === 'index.html') {
      urlPath = '/';
    }
    if (urlPath.endsWith('/') && urlPath !== '/') {
      urlPath = urlPath.slice(0, -1);
    }
    pages[urlPath] = file;
    incomingLinks[urlPath] = 0;
  });

  incomingLinks['/'] = 1; // Homepage always has links

  const hrefRegex = /href=["']([^"']+)["']/gi;
  const imgRegex = /<img([^>]+)>/gi;

  htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const relFile = path.relative(distDir, file).replace(/\\/g, '/');
    let sourceUrlPath = '/' + relFile;
    if (sourceUrlPath.endsWith('/index.html')) {
      sourceUrlPath = sourceUrlPath.slice(0, -10);
    }
    if (sourceUrlPath.endsWith('/') && sourceUrlPath !== '/') sourceUrlPath = sourceUrlPath.slice(0, -1);

    // 1. Title Audit
    const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
    if (!titleMatch) {
      issues.missingTitle.push(relFile);
    } else {
      const title = titleMatch[1].trim();
      if (title.length === 0) {
        issues.missingTitle.push(relFile);
      } else if (title.length > 60) {
        issues.longTitle.push({ file: relFile, length: title.length, title });
      }
    }

    // 2. Meta Description Audit
    const descMatch = content.match(/<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["']/i) ||
                      content.match(/<meta[^>]*content=["']([\s\S]*?)["']/i) && content.match(/<meta[^>]*name=["']description["']/i);
    if (!descMatch) {
      issues.missingDesc.push(relFile);
    } else {
      const desc = descMatch[1].trim();
      if (desc.length === 0) {
        issues.missingDesc.push(relFile);
      } else if (desc.length > 160) {
        issues.longDesc.push({ file: relFile, length: desc.length, desc });
      }
    }

    // 3. Alt Images Audit
    let imgMatch;
    while ((imgMatch = imgRegex.exec(content)) !== null) {
      const imgTag = imgMatch[1];
      const srcMatch = imgTag.match(/src=["']([^"']+)["']/i);
      const altMatch = imgTag.match(/alt=["']([^"']*)["']/i);

      if (srcMatch) {
        const src = srcMatch[1].trim();
        if (!src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('//')) {
          // Check image size
          let imgPath = path.join(publicDir, src);
          if (!fs.existsSync(imgPath)) {
            imgPath = path.join(distDir, src);
          }
          if (fs.existsSync(imgPath)) {
            const stat = fs.statSync(imgPath);
            const sizeKB = stat.size / 1024;
            if (sizeKB > 150) {
              issues.largeImages.push({ file: relFile, src, sizeKB });
            }
          }
        }
      }

      if (!altMatch || altMatch[1].trim().length === 0) {
        issues.missingAlt.push({ file: relFile, tag: imgMatch[0] });
      }
    }

    // 4. Links Audit (for Broken Links and Orphans)
    let linkMatch;
    while ((linkMatch = hrefRegex.exec(content)) !== null) {
      let target = linkMatch[1].trim();
      if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('#') || target.startsWith('mailto:') || target.startsWith('tel:') || target.startsWith('//')) {
        continue;
      }
      
      let targetUrl = target.split('#')[0].split('?')[0];
      if (targetUrl.endsWith('/') && targetUrl !== '/') {
        targetUrl = targetUrl.slice(0, -1);
      }
      if (!targetUrl.startsWith('/')) {
        targetUrl = path.posix.join(path.posix.dirname(sourceUrlPath), targetUrl);
      }

      if (targetUrl === sourceUrlPath) continue;

      if (incomingLinks[targetUrl] !== undefined) {
        incomingLinks[targetUrl]++;
      } else {
        // Target doesn't exist in our pages, check if it's a asset file
        let assetPath = path.join(distDir, targetUrl);
        if (!fs.existsSync(assetPath)) {
          issues.brokenLinks.push({ file: relFile, target });
        }
      }
    }
  });

  // Calculate Orphans (exclude standard files like 404, admin)
  Object.keys(incomingLinks).forEach(page => {
    if (incomingLinks[page] === 0) {
      const relFile = path.relative(distDir, pages[page]).replace(/\\/g, '/');
      const content = fs.readFileSync(pages[page], 'utf8');
      // Ignore if marked noindex
      const isNoindex = content.includes('noindex') || page.startsWith('/admin') || page === '/404.html';
      if (!isNoindex) {
        issues.orphanPages[page] = relFile;
      }
    }
  });

  // Output technical SEO audit report
  console.log(`\n${colors.bright}Resultados de Auditoría Técnica:${colors.reset}`);
  
  if (issues.missingTitle.length > 0) {
    console.log(`  ${colors.red}✗ Falta etiqueta title (${issues.missingTitle.length} páginas):${colors.reset}`);
    issues.missingTitle.forEach(f => console.log(`    - ${f}`));
  } else {
    console.log(`  ${colors.green}✓ Títulos presentes en todas las páginas.${colors.reset}`);
  }

  if (issues.longTitle.length > 0) {
    console.log(`  ${colors.yellow}⚠ Título demasiado largo (>60c - ${issues.longTitle.length} páginas):${colors.reset}`);
    issues.longTitle.forEach(i => console.log(`    - [${i.length}c] ${i.file} -> "${i.title}"`));
  } else {
    console.log(`  ${colors.green}✓ Longitud de títulos correcta (<=60c).${colors.reset}`);
  }

  if (issues.missingDesc.length > 0) {
    console.log(`  ${colors.red}✗ Falta meta descripción (${issues.missingDesc.length} páginas):${colors.reset}`);
    issues.missingDesc.forEach(f => console.log(`    - ${f}`));
  } else {
    console.log(`  ${colors.green}✓ Meta descripciones presentes en todas las páginas.${colors.reset}`);
  }

  if (issues.longDesc.length > 0) {
    console.log(`  ${colors.yellow}⚠ Meta descripción larga (>160c - ${issues.longDesc.length} páginas):${colors.reset}`);
    issues.longDesc.forEach(i => console.log(`    - [${i.length}c] ${i.file} -> "${i.desc.slice(0, 50)}..."`));
  } else {
    console.log(`  ${colors.green}✓ Longitud de meta descripciones correcta (<=160c).${colors.reset}`);
  }

  if (issues.missingAlt.length > 0) {
    console.log(`  ${colors.yellow}⚠ Imágenes sin atributo ALT (${issues.missingAlt.length} imágenes):${colors.reset}`);
    issues.missingAlt.slice(0, 10).forEach(i => console.log(`    - ${i.file}: ${i.tag}`));
    if (issues.missingAlt.length > 10) console.log(`    ... y ${issues.missingAlt.length - 10} más.`);
  } else {
    console.log(`  ${colors.green}✓ Todas las imágenes tienen etiqueta ALT.${colors.reset}`);
  }

  if (issues.largeImages.length > 0) {
    console.log(`  ${colors.yellow}⚠ Imágenes pesadas (>150KB - ${issues.largeImages.length} imágenes):${colors.reset}`);
    issues.largeImages.slice(0, 10).forEach(i => console.log(`    - [${i.sizeKB.toFixed(1)} KB] ${i.file} -> ${i.src}`));
    if (issues.largeImages.length > 10) console.log(`    ... y ${issues.largeImages.length - 10} más.`);
  } else {
    console.log(`  ${colors.green}✓ Todas las imágenes tienen un peso optimizado (<150KB).${colors.reset}`);
  }

  if (issues.brokenLinks.length > 0) {
    console.log(`  ${colors.red}✗ Enlaces internos rotos (${issues.brokenLinks.length} enlaces):${colors.reset}`);
    issues.brokenLinks.forEach(i => console.log(`    - ${i.file} apunta a ruta inexistente: ${i.target}`));
  } else {
    console.log(`  ${colors.green}✓ No se encontraron enlaces internos rotos.${colors.reset}`);
  }

  const orphans = Object.keys(issues.orphanPages);
  if (orphans.length > 0) {
    console.log(`  ${colors.red}✗ Páginas huérfanas (${orphans.length} páginas):${colors.reset}`);
    orphans.forEach(p => console.log(`    - ${p} (Archivo: ${issues.orphanPages[p]})`));
  } else {
    console.log(`  ${colors.green}✓ No hay páginas huérfanas públicas.${colors.reset}`);
  }

  const score = calculateAuditScore(issues, htmlFiles.length);
  console.log(`\n${colors.bright}Puntuación SEO Técnico: ${score >= 90 ? colors.green : score >= 75 ? colors.yellow : colors.red}${score}/100${colors.reset}\n`);

  return { issues, score };
}

function calculateAuditScore(issues, totalPages) {
  let score = 100;
  score -= issues.missingTitle.length * 5;
  score -= issues.missingDesc.length * 4;
  score -= Math.min(issues.longTitle.length * 1.5, 20); // Cap long title penalty
  score -= Math.min(issues.longDesc.length * 1, 15);    // Cap long desc penalty
  score -= Math.min(issues.missingAlt.length * 0.5, 10);
  score -= Math.min(issues.largeImages.length * 1.5, 15);
  score -= issues.brokenLinks.length * 6;
  score -= Object.keys(issues.orphanPages).length * 8;
  return Math.max(0, Math.round(score));
}

// ==========================================
// 2. SPY COMMAND (AI Search / GEO Auditor)
// ==========================================
function runSpy() {
  console.log(`${colors.bright}${colors.blue}[2/4] AI SEARCH SPY (GEO & AEO - Optimización de visibilidad para LLMs)...${colors.reset}\n`);

  const blogFiles = getAllBlogFiles(blogDir);
  console.log(`Analizando ${blogFiles.length} publicaciones de blog para motores de búsqueda de IA...`);

  const analysis = [];
  const keyEntities = ['boe', 'aeat', 'fenadismer', 'dgt', 'reglamento', 'directiva', 'real decreto', 'ley crea y crece', 'verifactu', 'facturae'];

  blogFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const filename = path.basename(file);
    const relFile = path.relative(blogDir, file);

    // Extract title
    const titleMatch = content.match(/^title:\s*["']?([^"'\n]+)["']?/m);
    const title = titleMatch ? titleMatch[1].trim() : filename;

    // Check structure (markdown headers)
    const h2Headers = (content.match(/^##\s+.+$/gm) || []).length;
    const h3Headers = (content.match(/^###\s+.+$/gm) || []).length;
    const totalHeaders = h2Headers + h3Headers;

    // Check list presence (LLMs love structured data lists)
    const listItems = (content.match(/^\s*[-\*+]\s+.+$/gm) || []).length;
    const numberedItems = (content.match(/^\s*\d+\.\s+.+$/gm) || []).length;
    const totalLists = listItems + numberedItems;

    // Check authority entities
    const entityMatches = [];
    keyEntities.forEach(ent => {
      const regex = new RegExp(`\\b${ent}\\b`, 'gi');
      const matches = content.match(regex);
      if (matches) {
        entityMatches.push({ entity: ent, count: matches.length });
      }
    });

    // Check citation/link count
    const extLinks = (content.match(/https?:\/\/(?!localhost|admilogistic)[^\s\)\]]+/gi) || []).length;

    // Check callouts/ArticleCallout blocks (summary blocks)
    const callouts = (content.match(/<ArticleCallout[^>]*>([\s\S]*?)<\/ArticleCallout>/gi) || []).length;

    // Calculate GEO Score
    let score = 0;
    const reasons = [];

    // 1. Structure (20 pts)
    if (totalHeaders >= 3) {
      score += 20;
    } else if (totalHeaders > 0) {
      score += 10;
      reasons.push('Estructura pobre (pocas secciones ## / ###)');
    } else {
      reasons.push('Sin estructura (falta usar cabeceras ## / ###)');
    }

    // 2. Lists & Bullet Points (20 pts)
    if (totalLists >= 8) {
      score += 20;
    } else if (totalLists > 0) {
      score += 10;
      reasons.push('Pocas listas/viñetas (las IAs prefieren resúmenes en lista)');
    } else {
      reasons.push('Sin listas (dificulta la extracción rápida del LLM)');
    }

    // 3. Citations & External Links (20 pts)
    if (extLinks >= 2) {
      score += 20;
    } else if (extLinks > 0) {
      score += 10;
      reasons.push('Pocas citas externas (los buscadores IA penalizan la falta de fuentes)');
    } else {
      reasons.push('Sin enlaces/citas externas (afecta la credibilidad para AEO)');
    }

    // 4. Key Entities (20 pts)
    if (entityMatches.length >= 2) {
      score += 20;
    } else if (entityMatches.length > 0) {
      score += 10;
      reasons.push('Baja densidad de entidades de autoridad');
    } else {
      reasons.push('Faltan términos normativos/entidades de peso (BOE, DGT, AEAT, CNMC)');
    }

    // 5. Summary Blocks / Callouts (20 pts)
    if (callouts >= 1) {
      score += 20;
    } else {
      reasons.push('Sin bloques destacados/resúmenes en el contenido');
    }

    analysis.push({
      file: relFile,
      title,
      score,
      reasons,
      extLinks,
      totalLists,
      entities: entityMatches.map(e => e.entity)
    });
  });

  analysis.sort((a, b) => a.score - b.score);

  console.log(`${colors.bright}Resultados de Visibilidad IA (GEO / AEO):${colors.reset}`);
  
  console.log(`\n  ${colors.bright}🚨 Publicaciones con menor "Puntuación de Visibilidad IA" (Acción Recomendada):${colors.reset}`);
  const poorPosts = analysis.filter(a => a.score < 60);
  if (poorPosts.length > 0) {
    poorPosts.forEach(a => {
      console.log(`    - ${colors.red}[Score: ${a.score}/100]${colors.reset} ${a.file}`);
      console.log(`      * Título: "${a.title}"`);
      a.reasons.forEach(r => console.log(`      • ${colors.yellow}Falta:${colors.reset} ${r}`));
    });
  } else {
    console.log(`    ${colors.green}✓ Todas las publicaciones superan el 60% de optimización GEO/AEO.${colors.reset}`);
  }

  // Calculate Average GEO Score
  const totalScore = analysis.reduce((sum, a) => sum + a.score, 0);
  const avgScore = Math.round(totalScore / analysis.length);

  console.log(`\n  ${colors.bright}Entidades más detectadas en el blog:${colors.reset}`);
  const entityCounts = {};
  analysis.forEach(a => {
    a.entities.forEach(ent => {
      entityCounts[ent] = (entityCounts[ent] || 0) + 1;
    });
  });
  Object.keys(entityCounts).sort((a, b) => entityCounts[b] - entityCounts[a]).slice(0, 5).forEach(ent => {
    console.log(`    - ${colors.cyan}${ent.toUpperCase()}${colors.reset}: presente en ${entityCounts[ent]} artículos.`);
  });

  console.log(`\n${colors.bright}Puntuación Promedio de Visibilidad IA: ${avgScore >= 80 ? colors.green : avgScore >= 60 ? colors.yellow : colors.red}${avgScore}/100${colors.reset}\n`);

  return { analysis, avgScore };
}

// ==========================================
// 3. DIAGNOSE COMMAND (Diagnoser & Quick Wins)
// ==========================================
function runDiagnose() {
  console.log(`${colors.bright}${colors.blue}[3/4] DIAGNÓSTICO DE OPORTUNIDADES ("Quick Wins" & Extractor de Preguntas)...${colors.reset}\n`);

  const blogFiles = getAllBlogFiles(blogDir);
  const diagnostics = [];

  blogFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const relFile = path.relative(blogDir, file);
    
    // Extract title
    const titleMatch = content.match(/^title:\s*["']?([^"'\n]+)["']?/m);
    const title = titleMatch ? titleMatch[1].trim() : relFile;

    // Detect user questions inside headings (¿...?)
    const headingQuestions = [];
    const h2h3Regex = /^##{1,2}\s+([^#\n]+)/gm;
    let match;
    while ((match = h2h3Regex.exec(content)) !== null) {
      const text = match[1].trim();
      if (text.startsWith('¿') || text.endsWith('?')) {
        headingQuestions.push(text);
      }
    }

    // Check for FAQ Schema in frontmatter
    const hasSchema = content.includes('faqSchema') || content.includes('FAQPage');

    // Extract Keywords/Key Phrases (Simple TF-IDF proxy)
    const words = content
      .toLowerCase()
      .replace(/[^\w\sñáéíóúü]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 5); // Ignore short words

    const stopWords = ['cuando', 'porque', 'nuestro', 'nuestra', 'entonces', 'durante', 'después', 'primero', 'artículo', 'empresa', 'transporte', 'carretera', 'españa'];
    const filteredWords = words.filter(w => !stopWords.includes(w));
    
    const freq = {};
    filteredWords.forEach(w => {
      freq[w] = (freq[w] || 0) + 1;
    });

    const keywords = Object.keys(freq)
      .sort((a, b) => freq[b] - freq[a])
      .slice(0, 3);

    // Identify Quick Wins
    const quickWins = [];
    if (headingQuestions.length === 0) {
      quickWins.push('No contiene secciones en formato Pregunta/Respuesta (¿...?). Añadir cabeceras tipo FAQ ayuda a las respuestas directas de la IA.');
    }
    if (!hasSchema) {
      quickWins.push('Falta FAQ Schema o marcado estructurado de preguntas/respuestas.');
    }
    if (!content.includes('ArticleCallout') && !content.includes('box-info')) {
      quickWins.push('No tiene llamada destacada al inicio (Resumen LCP para el usuario e IA).');
    }

    diagnostics.push({
      file: relFile,
      title,
      keywords,
      questions: headingQuestions,
      quickWins
    });
  });

  console.log(`${colors.bright}Diagnóstico de Ganancias Rápidas (SEO & AEO):${colors.reset}`);
  
  diagnostics.slice(0, 8).forEach(d => {
    if (d.quickWins.length > 0) {
      console.log(`\n  * ${colors.bright}${d.title}${colors.reset} (${d.file})`);
      console.log(`    - Palabras clave principales: ${colors.cyan}${d.keywords.join(', ')}${colors.reset}`);
      if (d.questions.length > 0) {
        console.log(`    - Preguntas actuales detectadas:`);
        d.questions.forEach(q => console.log(`      * ${q}`));
      }
      console.log(`    - ${colors.yellow}Oportunidades de mejora:${colors.reset}`);
      d.quickWins.forEach(q => console.log(`      • [Quick Win] ${q}`));
    }
  });

  if (diagnostics.length > 8) {
    console.log(`\n  ... y se han analizado ${diagnostics.length - 8} artículos más.`);
  }

  // Summary recommendation
  console.log(`\n${colors.bright}${colors.green}✔ Diagnóstico completado. El Fixer puede ayudar a implementar el llms.txt para mejorar la legibilidad IA.${colors.reset}\n`);

  return diagnostics;
}

// ==========================================
// 4. FIX COMMAND (Autonomous Fixer & LLM Config)
// ==========================================
function runFix() {
  console.log(`${colors.bright}${colors.blue}[4/4] EJECUTANDO FIXER (Generación de llms.txt y llms-full.txt)...${colors.reset}\n`);

  const blogFiles = getAllBlogFiles(blogDir);
  
  if (!fs.existsSync(publicDir)) {
    console.log(`Creando carpeta public/...`);
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Generate public/llms.txt
  const llmsTxtPath = path.join(publicDir, 'llms.txt');
  const llmsTxtContent = `# AdmiLogistic Blog

Información y noticias profesionales sobre transporte por carretera, gestión de flotas, tacógrafo y fiscalidad para autónomos y pymes del transporte en España.

## Metadata
- URL: https://blog.admilogistic.es
- Type: Blog profesional de logística y transporte
- Author: AdmiLogistic
- Language: es-ES

## Links
- [Bases de Datos](/bases-datos/): Recursos locales de parkings, talleres, gasolineras y hoteles.
- [Herramientas](/proyectos/): Aplicaciones de AdmiLogistic (Factura Digital, Tacógrafo, RoadMaster, Driver App).
- [Categorías](/categorias/): Operaciones, Cumplimiento, Fiscalidad, Vehículos, Tarjetas Gasoil, Actualidad.
- [llms-full.txt](/llms-full.txt): Base de datos de conocimiento completa en formato markdown consolidado para lectura en lote.
`;

  fs.writeFileSync(llmsTxtPath, llmsTxtContent, 'utf8');
  console.log(`  ${colors.green}✓ Generado: public/llms.txt${colors.reset} (${fs.statSync(llmsTxtPath).size} bytes)`);

  // 2. Generate public/llms-full.txt (consolidating all posts)
  const llmsFullTxtPath = path.join(publicDir, 'llms-full.txt');
  let llmsFullContent = `# AdmiLogistic Blog - Base de Datos de Conocimiento Consolidada

Este archivo contiene el repositorio completo de artículos del Blog AdmiLogistic en formato de texto plano y markdown. Optimizado para indexación y análisis por parte de modelos de lenguaje (LLMs).

---
`;

  let consolidatedCount = 0;

  blogFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const filename = path.basename(file);

    // Extract frontmatter
    const titleMatch = content.match(/^title:\s*["']?([^"'\n]+)["']?/m);
    const slugMatch = content.match(/^slug:\s*["']?([^"'\n]+)["']?/m) || [null, filename.replace(/\.mdx?$/, '')];
    const categoryMatch = content.match(/^category:\s*["']?([^"'\n]+)["']?/m);
    const dateMatch = content.match(/^(?:pubDate|date):\s*["']?([^"'\n]+)["']?/m);
    const descMatch = content.match(/^description:\s*["']?([^"'\n]+)["']?/m);

    const title = titleMatch ? titleMatch[1].trim() : 'Sin título';
    const slug = slugMatch[1].trim();
    const category = categoryMatch ? categoryMatch[1].trim() : 'general';
    const date = dateMatch ? dateMatch[1].trim() : 'N/A';
    const description = descMatch ? descMatch[1].trim() : '';

    // Strip frontmatter and clean markdown
    let body = content.replace(/^---[\s\S]*?---/, '').trim();
    
    // Strip Astro components/imports
    body = body.replace(/^import\s+[\s\S]*?from\s+['"].*?['"]/gm, '');
    body = body.replace(/<ArticleCallout[^>]*>/gi, '> [!NOTE]\n> ');
    body = body.replace(/<\/ArticleCallout>/gi, '\n');
    body = body.replace(/<SeriesNav[^>]*\/>/gi, '');
    body = body.replace(/<RelatedArticles[^>]*\/>/gi, '');

    // Append to consolidator
    llmsFullContent += `\n\n## ${title}\n\n`;
    llmsFullContent += `- **URL:** https://blog.admilogistic.es/blog/${slug}/\n`;
    llmsFullContent += `- **Categoría:** ${category}\n`;
    llmsFullContent += `- **Fecha:** ${date}\n`;
    if (description) llmsFullContent += `- **Descripción:** ${description}\n`;
    llmsFullContent += `\n### Contenido:\n\n${body}\n\n---\n`;
    
    consolidatedCount++;
  });

  fs.writeFileSync(llmsFullTxtPath, llmsFullContent, 'utf8');
  console.log(`  ${colors.green}✓ Generado: public/llms-full.txt${colors.reset} (${consolidatedCount} artículos consolidados, ${(fs.statSync(llmsFullTxtPath).size / 1024).toFixed(1)} KB)`);

  console.log(`\n${colors.bright}${colors.green}✔ Fixer ejecutado con éxito. Se crearon los archivos de visibilidad para IAs en la raíz pública.${colors.reset}\n`);
}

// ==========================================
// 5. ALL COMMAND (Consolidated Report)
// ==========================================
function runAll() {
  console.log(`${colors.bright}${colors.magenta}INICIANDO AUDITORÍA SEO CONSOLIDADA (Completa)...${colors.reset}`);
  
  const auditRes = runAudit();
  const spyRes = runSpy();
  runDiagnose();
  runFix();

  console.log(`${colors.bright}${colors.magenta}====================================================`);
  console.log(`📊 INFORME CONSOLIDADO DE ESTADO - BLOG ADMILOGISTIC`);
  console.log(`====================================================${colors.reset}`);
  
  if (auditRes) {
    console.log(`  Traditional SEO Score: ${auditRes.score}/100`);
    console.log(`  Technical Errors:      ${colors.red}${auditRes.issues.brokenLinks.length + Object.keys(auditRes.issues.orphanPages).length + auditRes.issues.missingTitle.length + auditRes.issues.missingDesc.length}${colors.reset} errores graves.`);
  } else {
    console.log(`  Traditional SEO Score: N/A (Ejecuta 'npm run build' primero)`);
  }
  
  if (spyRes) {
    console.log(`  AI Visibility Score:  ${spyRes.avgScore}/100`);
  }
  
  console.log(`\n${colors.green}👍 ¡Todos los análisis y optimizaciones del SEO Toolkit se han completado!${colors.reset}\n`);
}

// Start CLI
main();
