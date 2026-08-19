# Plano de upgrade do Astro (4.15 → 7.2)

Levantado em 2026-08-18 contra o código atual (`main` @ 94371f3).

> **Status: executado em 2026-08-18**, na branch `chore/upgrade-astro-7`. O projeto está em
> Astro 7.2.3 + Tailwind 4. O plano abaixo ficou como registro; o que divergiu na prática
> está resumido aqui.
>
> | Previsto | O que aconteceu |
> |---|---|
> | astro-icon quebraria na Fase 2 (Astro 5) | Quebrou já na Fase 1 (Astro 4.16): o Rollup novo rejeita o `export { Props }` da v0.8 |
> | — | **Não previsto:** o build do Astro 5 estourou a memória. Causa: os helpers chamam `getCollection()` dentro de laços e o content layer desserializa a coleção a cada chamada. Resolvido memoizando — build caiu de 84s para ~23s |
> | — | **Não previsto:** o glob loader captura arquivos `_*.yml`, que o Astro 4 ignorava por convenção. Padrão corrigido para `**/[^_]*.yml` (44 cadastros incompletos) |
> | — | **Não previsto:** o astro-icon 1 emite `<symbol>`/`<use>`, e o CSS que mira `path` não atravessa o shadow tree. Resolvido com `is:inline` nos dois ícones afetados |
> | Compilador Rust do Astro 7 exigiria correções de HTML | Nenhuma. O build passou de primeira |
> | Fase 0.2 trocaria todo `/projects/` escrito à mão | Feito só na paginação, que era o ponto que o `paginate()` da v5 quebrava. O resto do prefixo manual continua como está |
>
> Ganhos colaterais medidos: `dist/_astro` caiu de **4,4 MB para 196 KB** e o bundle do
> `Filter` de **312 KB para 30 KB**, porque `astro:content` deixou de ir para o cliente.

## Situação

| Pacote | Instalado | Última versão | Observação |
|---|---|---|---|
| `astro` | 4.15.4 | **7.2.3** | 3 majors de atraso (5, 6, 7) |
| `@astrojs/react` | ^3.6.2 | 6.0.3 | pareado por major com o Astro |
| `@astrojs/tailwind` | ^5.1.0 | 6.0.2 | **peer dep trava em `astro ^5`** — não existe versão para Astro 6/7 |
| `tailwindcss` | ^3.3.1 | 4.3.3 | TW4 exige `@tailwindcss/vite` |
| `astro-icon` | ^0.8.0 | 1.2.0 | v1 é reescrita: integração + pacotes locais de ícones |
| `react` / `react-dom` | ^18.2.0 | 19.2.8 | **não precisa subir**: todos os `@astrojs/react` aceitam React 18 |
| `pagefind` | ^1.1.1 | 1.5.2 | independente do Astro |
| Node (runner do CI) | 20 (padrão da action) | — | Astro 6+ exige **Node ≥ 22.12.0** |

Pareamento verificado (`devDependencies.astro` de cada pacote):

| Astro | `@astrojs/react` | Vite | Node mínimo |
|---|---|---|---|
| 5.18.2 | 4.x | 6 | 18.20.8 / 20.3 / 22 |
| 6.4.8 | 5.x | 7 | **22.12.0** |
| 7.2.3 | 6.x | 8 | **22.12.0** |

## Destino recomendado

Ir até o **Astro 7.2.3**, em **quatro PRs sequenciais** (um por major), cada um com build
verde antes do próximo. Pular majors não é suportado e mistura causas de erro.

O trabalho pesado **não está no Astro em si** — está em três dívidas que este repositório
carrega e que os majors passam a proibir:

1. `astro:content` no bundle do cliente (`Filter.tsx`) → proibido a partir do Astro 5.
2. Base path `/projects/` escrito à mão sobre URLs que o `paginate()` passa a gerar já com
   o base → links duplicados no Astro 5.
3. `params` numérico em `getStaticPaths()` → rejeitado no Astro 6.

## Como validar (não há testes)

O critério de aceite de cada fase é o **diff da lista de rotas geradas**. O build atual
produz **2150 páginas HTML**; qualquer variação não intencional é regressão.

```bash
npm run build && find dist -name '*.html' | sed 's|^dist/||' | sort > /tmp/rotas-antes.txt
# ... aplica a fase ...
npm run build && find dist -name '*.html' | sed 's|^dist/||' | sort > /tmp/rotas-depois.txt
diff /tmp/rotas-antes.txt /tmp/rotas-depois.txt
```

Complementar, em cada fase, com inspeção visual de cinco páginas:

- `/projects/` (home)
- `/projects/codes/page/1` (grid + filtros + paginação)
- `/projects/codes/ifpb-projects` (detalhe de projeto)
- `/projects/people/20051370420` (detalhe de pessoa, com ícones sociais)
- `/projects/people/cstsi-jp/1` (rota derivada de tag)

E `npm run buildpreviewpf` ao menos uma vez por fase, porque a busca (Pagefind) só existe
depois do `postbuild`.

---

## Fase 0 — Preparação (ainda no Astro 4)

Nada aqui muda de versão. São correções que **já fazem sentido hoje** e que transformam
três quebras futuras em não-eventos. Podem ir em PRs separados e mergear antes do upgrade.

### 0.1 — Tirar `astro:content` do cliente  ⚠️ bloqueador nº 1

`src/components/Filter.tsx` é uma ilha React (`client:visible`) e importa:

```ts
import { getCourse, getCourseByAbbreviation, getPeriodCourses } from '@/helpers/courses';
import { abbreviationCourses, campi, cities } from '@/content/config';
```

`helpers/courses.ts` faz `await getCollection('courses')` no topo do módulo e
`content/config.ts` importa `astro:content`. Resultado: o runtime de content collections
vai inteiro para o navegador. O bundle `dist/_astro/Filter.*.js` tem **312 KB** e contém,
literalmente, o aviso do próprio Astro 4:

> astro:content is only supported running server-side. […] In the future it will not be supported.

Esse "future" é o Astro 5, onde o acesso a `astro:content` no cliente passa a ser proibido.

**O que fazer:**

- Criar `src/lib/taxonomy.ts` (módulo puro, sem `astro:content`) com `abbreviationCourses`,
  `cities`, `campi` e os tipos derivados. `src/content/config.ts` passa a importar desse
  módulo em vez de exportá-los.
- `Filter.tsx` deixa de importar `@/helpers/courses`. Os dados de curso/disciplina que ele
  precisa (nome, nível, campus) passam a chegar por **props** — `BaseLayout.astro` já
  monta `peopleTags` e `projectTags` no servidor; basta montar também um mapa
  `{ [id]: { name, level, campus } }` e passar junto.
- Atualizar os outros importadores de `@/content/config`
  (`pages/people/[tag]/[page].astro`, `pages/codes/[project].astro`, `PersonCard.astro`,
  `helpers/*.ts`) para o novo caminho quando for valor, mantendo `import type` para tipos.

**Ganho imediato, independente do upgrade:** o maior bundle do site deve cair de 312 KB
para poucos KB.

### 0.2 — Centralizar o base path

Hoje `/projects` aparece escrito à mão em hrefs, `src` de imagem e caminhos de asset —
`PaginationIndex.astro` faz `` href={`/projects${page.url.prev}`} ``, e o `page.url.*` vem
do `paginate()`. No Astro 5 o `paginate()` passa a incluir o `base` sozinho, e essa
concatenação vira `/projects/projects/codes/page/2` em **todos os links de paginação**.

**O que fazer:** criar um helper único em `src/lib/url.ts`:

```ts
export const url = (path: string) =>
  `${import.meta.env.BASE_URL}/${path}`.replace(/\/{2,}/g, '/');
```

e trocar as ocorrências manuais por ele. Em `PaginationIndex.astro`, parar de prefixar
`page.url.first/prev/next/last` — no Astro 4 esses valores ainda não têm o base, então
nesta fase eles passam pelo helper; na Fase 2 o helper vira identidade para eles.

Alternativa mais barata, se preferir mexer menos agora: deixar como está e corrigir
`PaginationIndex.astro` dentro da Fase 2, sabendo exatamente onde está o problema.

### 0.3 — Fixar Node 22

Astro 6 exige Node ≥ 22.12.0 (versões ímpares não são suportadas). O `package.json` não
declara `engines`.

```json
"engines": { "node": ">=22.12.0" }
```

E no CI (`.github/workflows/deploy.yml`), passar `node-version: 22` para a action.

### 0.4 — Declarar `yaml`

`scripts/extract-people-data.mjs` importa `yaml` sem que ele esteja no `package.json`
(resolve por dependência transitiva). Qualquer mudança de árvore de dependências no
upgrade pode derrubar o script sem aviso. `npm i -D yaml`.

---

## Fase 1 — Astro 4.16.19 (aquecimento)

```bash
npx @astrojs/upgrade
```

Ficar em `astro@^4.16` (dist-tag `legacy`). É só patch/minor: serve para separar "quebrou
por causa de bug corrigido no 4.16" de "quebrou por causa do major". Espera-se **zero**
diferença no diff de rotas.

---

## Fase 2 — Astro 5.18.2

```bash
npx @astrojs/upgrade
# astro 5.18.2 · @astrojs/react 4.x · @astrojs/tailwind 6.0.2 (Tailwind 3 continua)
```

**Tailwind fica no 3 nesta fase.** `@astrojs/tailwind@6` ainda suporta `astro ^5.0.0` — não
misture a migração do Tailwind com a do Astro.

### 2.1 Content collections → Content Layer

Mover `src/content/config.ts` → `src/content.config.ts` e trocar `type: 'data'` por
`loader`:

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const peopleCollection = defineCollection({
  loader: glob({ base: './src/content/people', pattern: '**/*.yml' }),
  schema: /* inalterado */,
});
```

Os esquemas Zod não mudam. **O código consumidor também não**: uma varredura mostrou que o
repositório só usa `getCollection()`, `entry.data` e o tipo `CollectionEntry` — não há
`entry.slug`, `entry.id`, `entry.render()` nem `getEntry()`. Essa é a parte fácil.

Se preferir adiar, `legacy: { collections: true }` no `astro.config.mjs` mantém o
comportamento antigo no Astro 5 — mas a flag **é removida no Astro 6**, então é dívida com
prazo de 1 fase.

⚠️ A ordem de `getCollection()` passa a ser não-determinística. O repositório já ordena
explicitamente (`sortPeople`, `sortProjects`, `.sort()` nas tags), então o risco é baixo —
mas confirmar pelo diff de rotas, que é sensível a ordem em paginação.

### 2.2 `paginate()` e o base

Aplicar a correção da 0.2 se ela não foi feita antes. Sintoma se esquecer: todo link de
paginação vira `/projects/projects/...` (404). O diff de rotas **não** pega isso — as
páginas continuam sendo geradas; só os links quebram. Verificar clicando.

### 2.3 `astro:content` no cliente

Se a 0.1 não foi feita, é aqui que o build quebra. Não há workaround.

### 2.4 astro-icon 0.8 → 1.2

`astro-icon@0.8` não declara peer dep de `astro`, então o npm **não vai avisar** de
incompatibilidade — é preciso testar. Assumindo que precise migrar (provável; a v0.8
buscava ícones da API remota da Iconify em build, comportamento removido na v1):

```bash
npm i astro-icon@^1.2.0
npm i -D @iconify-json/{ph,mdi,uim,uil,logos,simple-icons,clarity,icon-park,la}
```

```js
// astro.config.mjs
import icon from 'astro-icon';
export default defineConfig({ integrations: [icon(), tailwind(), react()] });
```

- `import { Icon } from 'astro-icon'` → `import { Icon } from 'astro-icon/components'`
  (4 arquivos: `NavBar.astro`, `PersonCard.astro`, `ProjectCard.astro` e o que mais usar).
- Props `name` e `size` continuam válidas — inclusive o nome dinâmico de
  `PersonCard.astro` (`name={link.icon}`).
- Conjuntos em uso, levantados do código: `ph`, `mdi`, `uim`, `uil`, `logos`,
  `simple-icons`, `clarity`, `icon-park`, `la`.
- Seletores CSS `[astro-icon]` viraram `[data-icon]` — **não afeta** este repo, que usa
  seletores de classe em `src/styles/global.css`. Mas a v1 monta spritesheet, então
  conferir visualmente as regras `path:first-child { fill: #fff }` do `.project-card`.
- `@iconify/react` (usado em `Filter.tsx` e `Accordion.tsx`) é outra biblioteca e não é
  afetada. Vale notar à parte que ela busca ícones da API da Iconify **em runtime, no
  navegador** — candidato a padronizar depois.

---

## Fase 3 — Astro 6.4.8

O major mais caro, porque força o Tailwind 4 junto.

### 3.1 Node 22.12+

Local e CI. Fora disso o Astro nem inicia.

### 3.2 Content collections, parte 2

- Remover `type` das definições (já removido se a Fase 2 foi completa).
- Remover `legacy: { collections: true }` se tiver sido usada — a flag não existe mais.
- **`z` deixa de ser exportado por `astro:content`**: em `src/content.config.ts`,
  `import { z, defineCollection } from 'astro:content'` vira
  `import { defineCollection } from 'astro:content'` + `import { z } from 'astro/zod'`.

### 3.3 `params` só aceita string  ⚠️

`src/pages/people/[person].astro` faz:

```ts
params: { person: getFirstPersonId(person) }   // number — matrícula
```

`getFirstPersonId()` devolve `number` (o esquema define `id` como `z.number()`). No Astro 6
params numéricos são rejeitados. Corrigir para `String(getFirstPersonId(person))`.

Auditar as outras `getStaticPaths()`: `codes/[project].astro` usa `getProjectId()` (string,
ok) e as rotas de tag usam `{ tag }` (string, ok).

### 3.4 Tailwind 3 → 4

Obrigatório: `@astrojs/tailwind` não tem versão compatível com Astro 6.

```bash
npx astro add tailwind      # instala tailwindcss@4 + @tailwindcss/vite
npm uninstall @astrojs/tailwind
```

- Remover `tailwind()` de `astro.config.mjs` e adicionar o plugin Vite.
- `tailwind.config.cjs` deixa de ser usado — e aqui isso é indolor: o arquivo está
  **vazio** (sem `theme.extend`, sem plugins).
- `src/styles/global.css` (8 linhas de CSS puro) ganha `@import "tailwindcss";` no topo.
  Ele já é importado pelo `BaseLayout.astro`.
- Classes renomeadas encontradas no código (210 classes distintas, apenas 11 ocorrências
  a corrigir):

  | Ocorrências | Tailwind 3 | Tailwind 4 |
  |---|---|---|
  | 5 | `rounded` | `rounded-sm` |
  | 4 | `outline-none` | `outline-hidden` |
  | 1 | `ring` | `ring-3` |
  | 1 | `bg-opacity-50` | `bg-black/50` (na cor) |

- ⚠️ **9 usos de `border` sem cor**: no TW4 a cor padrão da borda muda de `gray-200` para
  `currentColor`. Ou explicitar `border-gray-200`, ou declarar o padrão antigo no
  `@layer base`.
- `shadow-md` / `shadow-lg` mantêm o nome e a aparência.

### 3.5 Outras remoções do v6 (verificar, provavelmente não se aplicam)

`Astro.glob()`, `<ViewTransitions />`, config em `.cjs`/`.cts`, `import.meta.env` sem
coerção de tipo. Nenhuma dessas apareceu na varredura do `src/` — confirmar no build.

---

## Fase 4 — Astro 7.2.3

```bash
npx @astrojs/upgrade   # astro 7.2.3 · @astrojs/react 6.x · Vite 8
```

### 4.1 Compilador Rust, mais rígido com HTML  ⚠️ principal risco desta fase

O compilador Rust passou a ser o único, e ele **não conserta mais HTML inválido**: tag não
fechada agora é erro de build, e HTML semanticamente inválido não é mais auto-corrigido.
São ~2.264 linhas de `.astro`/`.tsx` escritas à mão, com bastante markup aninhado em
`PersonCard.astro` (209 linhas) e `ProjectCard.astro` (194 linhas). O build vai apontar
cada caso; é trabalho mecânico, mas reserve tempo.

### 4.2 `compressHTML: 'jsx'`

O padrão mudou de `true` para `'jsx'` (remove espaço em branco por regras de JSX). Pode
alterar espaçamento renderizado entre elementos inline — conferir nos cards, onde há
`<span>`/`<a>` lado a lado. Se incomodar, `compressHTML: true` no config restaura.

### 4.3 Sätteri

Novo processador Markdown padrão no lugar do pipeline remark/rehype. **Não se aplica**:
o repositório não tem nenhum `.md`/`.mdx` renderizado — todo o conteúdo é YAML.

---

## CI

`.github/workflows/deploy.yml` usa `withastro/action@v3` (atual: **v6.1.2**), cujo padrão é
Node 20 — insuficiente a partir do Astro 6.

```yaml
- name: Install, build, and upload your site
  uses: withastro/action@v6
  with:
    node-version: 22
```

Subir a action junto com a Fase 3. O `postbuild` (Pagefind) continua rodando sozinho,
porque a action executa `npm run build` e o npm dispara o `postbuild`.

---

## Riscos, em ordem de custo

| # | Risco | Fase | Sinal | Mitigação |
|---|---|---|---|---|
| 1 | `astro:content` no cliente (`Filter.tsx`) | 2 | build quebra | Fase 0.1, antes do upgrade |
| 2 | Tailwind 3 → 4 forçado pelo fim do `@astrojs/tailwind` | 3 | sem versão compatível | config vazio ⇒ migração pequena; 11 classes |
| 3 | HTML inválido rejeitado pelo compilador Rust | 4 | build quebra, arquivo a arquivo | rodar build cedo; correção mecânica |
| 4 | `paginate()` + base duplicado | 2 | links 404, **build passa** | Fase 0.2; teste de clique |
| 5 | `params` numérico em `[person]` | 3 | build quebra | `String(...)` |
| 6 | astro-icon 0.8 sem peer dep declarada | 2 | falha silenciosa ou ícones sumindo | migrar para v1 no mesmo PR |
| 7 | Ordem não-determinística de `getCollection()` | 2 | paginação embaralhada | já há sort explícito; conferir diff |

## Checklist por PR

- [ ] `npm run build` sem erro nem warning novo
- [ ] `diff` da lista de rotas: só diferenças esperadas (2150 páginas de baseline)
- [ ] `npm run buildpreviewpf` e busca funcionando
- [ ] As cinco páginas de referência conferidas no navegador, incluindo clique na paginação
- [ ] Ícones renderizando (cards de pessoa e de projeto)
- [ ] Filtro lateral abrindo e filtrando
- [ ] Tamanho de `dist/_astro` comparado ao anterior (baseline: 4,4 MB)
- [ ] `AGENTS.md` atualizado se stack, comandos ou caminhos mudaram
