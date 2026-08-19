/**
 * Prefixa um caminho interno com o `base` configurado em `astro.config.mjs`.
 *
 * Existe para que a paginação não dependa do formato de `page.url.*` gerado pelo
 * Astro — que passou a incluir o `base` a partir da v5.
 */
export function url(path: string) {
  return `${import.meta.env.BASE_URL}/${path}`.replace(/\/{2,}/g, '/');
}
