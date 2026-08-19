import type { ImageMetadata } from 'astro';

/**
 * Previews baixados por `scripts/fetch-previews.mjs` para `src/assets/previews/`,
 * indexados pelo id do projeto (nome do arquivo YAML sem extensão).
 *
 * Estar em `src/` é o que permite ao `<Image>` otimizar: o Astro nunca processa
 * o que está em `public/`. Preview ausente (URL morta ou projeto sem preview)
 * simplesmente não entra no mapa, e o card cai no placeholder.
 */
const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/previews/*.{png,jpg,jpeg,webp,gif,avif,svg}',
  { eager: true }
);

const previewsById = new Map<string, ImageMetadata>(
  Object.entries(files).map(([path, module]) => [
    path.split('/').pop()!.replace(/\.[^.]+$/, ''),
    module.default,
  ])
);

export function getPreviewImage(projectId: string) {
  return previewsById.get(projectId);
}
