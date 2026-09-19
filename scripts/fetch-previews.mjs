/**
 * Baixa os previews dos projetos para `src/assets/previews/`, onde o `<Image>` do
 * Astro consegue otimizá-los (webp + redimensionamento).
 *
 * Existe porque os previews são URLs em repositórios de terceiros: com `<Image>`
 * apontando direto para elas, uma única URL morta faz o `astro build` sair com erro.
 * Aqui a falha é absorvida — o projeto simplesmente fica sem arquivo local, e o card
 * cai no placeholder, que é o comportamento que o site já tinha.
 *
 * O cache é ignorado pelo Git (são ~90 MB). Roda automaticamente via `prebuild`.
 */
import { readFileSync, readdirSync, mkdirSync, existsSync, writeFileSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectsDir = join(__dirname, '../src/content/projects');
const outDir = join(__dirname, '../src/assets/previews');

const CONCURRENCY = 8;
const TIMEOUT_MS = 20000;
const EXT_BY_TYPE = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
};

function clearOtherExtensions(id, keepExt) {
  for (const ext of Object.values(EXT_BY_TYPE)) {
    if (ext !== keepExt) {
      const p = join(outDir, `${id}.${ext}`);
      if (existsSync(p)) {
        try { unlinkSync(p); } catch {}
      }
    }
  }
}

function sniffExtension(buffer) {
  if (buffer.length < 12) return null;
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'jpg';
  if (buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP') return 'webp';
  if (buffer.subarray(0, 4).toString('ascii') === 'GIF8') return 'gif';
  const head = buffer.subarray(0, 512).toString('utf-8').trimStart();
  if (head.startsWith('<svg') || (head.startsWith('<?xml') && head.includes('<svg'))) return 'svg';
  return null;
}

function collectTargets() {
  return readdirSync(projectsDir)
    .filter((f) => f.endsWith('.yml') && !f.startsWith('_'))
    .flatMap((file) => {
      const data = parse(readFileSync(join(projectsDir, file), 'utf-8'));
      const url = data?.addresses?.preview;
      if (!url) return [];
      return [{ id: file.replace(/\.yml$/, '').toLowerCase(), url }];
    });
}

const manifestPath = join(outDir, 'manifest.json');

function readManifest() {
  try {
    return JSON.parse(readFileSync(manifestPath, 'utf-8'));
  } catch {
    return {};
  }
}

/**
 * O cache é válido só se o arquivo existe **e** veio da URL que está no YAML hoje —
 * senão trocar a URL de um preview num PR não teria efeito.
 */
function hasLocalFile(id) {
  return existsSync(join(outDir, `${id}.webp`)) || existsSync(join(outDir, `${id}.svg`));
}

function findExistingLocalFile(id) {
  for (const ext of Object.values(EXT_BY_TYPE)) {
    const p = join(outDir, `${id}.${ext}`);
    if (existsSync(p)) return { path: p, ext };
  }
  return null;
}

async function optimizeExistingLocalFile(id, existing) {
  if (existing.ext === 'svg') return true;
  try {
    const buffer = readFileSync(existing.path);
    const optimizedBuffer = await sharp(buffer)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
    clearOtherExtensions(id, 'webp');
    writeFileSync(join(outDir, `${id}.webp`), optimizedBuffer);
    return true;
  } catch {
    return false;
  }
}

function alreadyCached(manifest, { id, url }) {
  return hasLocalFile(id) && manifest[id] === url;
}

async function download({ id, url }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'ifpb-projects-build' },
    });

    if (!response.ok) return { id, ok: false, reason: `HTTP ${response.status}` };

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length === 0) return { id, ok: false, reason: 'resposta vazia' };

    const type = (response.headers.get('Content-Type') || '').split(';')[0].trim();
    // Vários hosts servem imagem como application/octet-stream, então o Content-Type
    // é só a primeira pista: se não bater, olha-se a assinatura do arquivo.
    const ext = EXT_BY_TYPE[type] ?? sniffExtension(buffer);
    if (!ext) return { id, ok: false, reason: `formato não reconhecido (${type || 'sem tipo'})` };

    if (ext === 'svg') {
      clearOtherExtensions(id, 'svg');
      writeFileSync(join(outDir, `${id}.svg`), buffer);
      return { id, ok: true, bytes: buffer.length };
    }

    // Redimensiona e converte imagens raster para WebP otimizado (largura máx 800px)
    const optimizedBuffer = await sharp(buffer)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    clearOtherExtensions(id, 'webp');
    writeFileSync(join(outDir, `${id}.webp`), optimizedBuffer);
    return { id, ok: true, bytes: optimizedBuffer.length };
  } catch (error) {
    return { id, ok: false, reason: error.name === 'AbortError' ? 'timeout' : error.message };
  } finally {
    clearTimeout(timer);
  }
}

async function run() {
  mkdirSync(outDir, { recursive: true });

  const targets = collectTargets();
  const manifest = readManifest();

  // Otimiza arquivos locais existentes que ainda estejam em png/jpg
  for (const t of targets) {
    if (manifest[t.id] === t.url && !hasLocalFile(t.id)) {
      const existing = findExistingLocalFile(t.id);
      if (existing) {
        await optimizeExistingLocalFile(t.id, existing);
      }
    }
  }

  const pending = targets.filter((t) => !alreadyCached(manifest, t));
  const cached = targets.length - pending.length;

  console.log(
    `previews: ${targets.length} no conteúdo · ${cached} já em cache · ${pending.length} a baixar`
  );

  const results = [];
  const queue = [...pending];

  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (queue.length) {
        results.push(await download(queue.shift()));
      }
    })
  );

  const ok = results.filter((r) => r.ok);
  const bytes = ok.reduce((acc, r) => acc + r.bytes, 0);

  // Falha com cópia local antiga não é degradação: o card continua com preview.
  // Só entra no relatório quem ficou realmente sem imagem.
  const stale = results.filter((r) => !r.ok && hasLocalFile(r.id));
  const missing = results.filter((r) => !r.ok && !hasLocalFile(r.id));

  const nextManifest = { ...manifest };
  for (const result of ok) {
    nextManifest[result.id] = targets.find((t) => t.id === result.id).url;
  }
  for (const result of missing) delete nextManifest[result.id];
  writeFileSync(manifestPath, `${JSON.stringify(nextManifest, null, 2)}\n`);

  console.log(`\nbaixados: ${ok.length} (${(bytes / 1024 / 1024).toFixed(1)} MB)`);

  if (stale.length) {
    console.log(
      `${stale.length} preview(s) não puderam ser revalidados — mantida a cópia em cache`
    );
  }

  if (missing.length) {
    console.log(`${missing.length} preview(s) sem imagem — esses cards usam o placeholder:`);
    for (const f of missing) console.log(`  ${f.id}: ${f.reason}`);
  }

  if (missing.length) {
    const reportDir = join(__dirname, '../logs');
    mkdirSync(reportDir, { recursive: true });
    const report = missing
      .map((f) => `${f.id},${f.reason},${targets.find((t) => t.id === f.id)?.url ?? ''}`)
      .join('\n');
    writeFileSync(
      join(reportDir, 'previews-indisponiveis.csv'),
      `projeto,motivo,url\n${report}\n`
    );
    console.log('relatório: logs/previews-indisponiveis.csv');
  }

  // Nunca falha o build: preview ausente é degradação prevista, não erro.
  writeFileSync(
    join(outDir, '.gitignore'),
    '# cache de previews baixados pelo scripts/fetch-previews.mjs\n*\n!.gitignore\n'
  );
}

run();
