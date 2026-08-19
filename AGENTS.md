# AGENTS.md

Guia para agentes de IA (Claude Code, Codex, Cursor, etc.) trabalhando neste repositório.

## O que é este projeto

Portal estático que cataloga pessoas (estudantes, professores, servidores) e projetos
acadêmicos do IFPB. Publicado em <https://ifpb.github.io/projects/>.

O repositório é **majoritariamente conteúdo, não código**: a maior parte das contribuições
são PRs de forks adicionando um único arquivo YAML em `src/content/people/` ou
`src/content/projects/`. O código em `src/` muda com pouca frequência.

## Stack

Astro 7 (SSG) · React 18 (ilhas) · Tailwind 4 · TypeScript · Zod (validação das coleções) ·
Pagefind (busca estática) · astro-icon 1 / @iconify/react (ícones) · YAML (dados).

Tailwind 4 entra pelo plugin Vite `@tailwindcss/vite` (não há mais `@astrojs/tailwind` nem
`tailwind.config.cjs`): a configuração é o `@import "tailwindcss"` no topo de
`src/styles/global.css`.

## Comandos

```bash
npm install            # Node >= 22.12.0 (exigido pelo Astro 7)
npm run dev            # http://localhost:4321/projects  (atenção ao base path)
npm run build          # prebuild (baixa previews) + astro build + postbuild (pagefind)
npm run preview        # serve dist/
npm run buildpreviewpf # build + pagefind + preview (única forma de testar a busca)

node scripts/fetch-previews.mjs      # baixa/atualiza o cache de previews (roda no prebuild)
npm run load:github:avatar          # preenche avatar.githubUC via API do GitHub
npm run extract:linkedin -- --course csbes-jp   # gera CSV em logs/
```

- **Não há testes nem linter configurado.** `npm run build` é a validação de fato: o Zod
  quebra o build em qualquer YAML fora do esquema. Rode-o antes de considerar uma
  alteração de conteúdo concluída.
- Prettier existe apenas como devDependency (com `prettier-plugin-astro` e
  `prettier-plugin-tailwindcss`), sem script nem arquivo de configuração. Use
  `npx prettier --write <arquivo>` quando precisar.
- O build gera ~2150 páginas (~780 pessoas + ~235 projetos) em cerca de 40s. Prefira
  `npm run dev` para iterar e reserve o build completo para a verificação final.

## Arquitetura

```
src/content/{people,projects,courses,subjects}/*.yml   # dados (fonte da verdade)
src/content.config.ts                                  # esquemas Zod + loaders das coleções
src/lib/*.ts                                           # módulos puros (sem astro:content)
src/helpers/*.ts                                       # consultas, derivação de tags, ordenação
src/pages/**                                           # rotas (todas via getStaticPaths)
src/components/*.{astro,tsx}                           # UI
src/layouts/BaseLayout.astro                           # shell + filtros + Pagefind
```

**`src/lib/` vs `src/helpers/`**: `helpers/` toca coleções (`astro:content`) e é
**server-only**; `lib/` é puro e é o único que pode ser importado por ilhas React.
`lib/taxonomy.ts` guarda cursos/campi/cidades e as buscas usadas pelo filtro;
`lib/url.ts` prefixa o `base` nas URLs de paginação; `lib/previews.ts` indexa os
previews baixados.

### Previews de projeto

`addresses.preview` aponta para repositórios de terceiros, e o Astro só otimiza imagem que
esteja em `src/`. O `prebuild` (`scripts/fetch-previews.mjs`) baixa cada preview para
`src/assets/previews/<id-do-yml>.<ext>`, e os componentes usam `<Image>` sobre o arquivo
local. Isso derruba o peso das imagens de **85 MB para 4,8 MB** (webp, largura 640).

O script nunca falha o build: URL morta significa arquivo ausente, e o card cai no
placeholder — o mesmo que acontecia antes via `onerror`. Os links quebrados vão para
`logs/previews-indisponiveis.csv`; vale revisar de vez em quando (hoje são 19).

O cache fica em `src/assets/previews/` (ignorado pelo Git, ~85 MB) com um `manifest.json`
que guarda a URL de origem — trocar a URL no YAML rebaixa só aquele arquivo. No CI o
diretório é restaurado por `actions/cache`.

O fluxo é sempre o mesmo: `getCollection()` → helper que filtra/ordena/deriva → página que
pagina com `paginate()` → grid de cards.

### Rotas

| Rota | Arquivo | Slug |
|---|---|---|
| `/codes/page/[page]` | `pages/codes/page/[page].astro` | paginação (`PAGE_SIZE = 12`) |
| `/codes/[tag]/[page]` | `pages/codes/[tag]/[page].astro` | uma rota por tag derivada |
| `/codes/[project]` | `pages/codes/[project].astro` | `getProjectId()` → `owner-repo` extraído da URL do repositório |
| `/people/page/[page]` | `pages/people/page/[page].astro` | paginação |
| `/people/[tag]/[page]` | `pages/people/[tag]/[page].astro` | uma rota por tag derivada |
| `/people/collaborator/[page]` | `pages/people/collaborator/[page].astro` | pessoas com projetos |
| `/people/[person]` | `pages/people/[person].astro` | `getFirstPersonId()` → matrícula |

### Sistema de tags (conceito central)

Tags **não são armazenadas**, são derivadas do YAML em tempo de build:

- `getPersonTags()` (`helpers/people.ts`) deriva de `occupations`: `student`, `professor`,
  `egresso`, campus (`jp`), curso (`cstsi-jp`), período (`2024.1`), turma
  (`cstsi-jp-2024.1`), nível (`graduação`), disciplinas dos projetos, além de flags como
  `projects`, `homepage`, `figma`, `researchgate`.
- `getProjectTags()` (`helpers/projects.ts`) deriva de `category` e `addresses`: tipo
  (`subject`), disciplina (`pw2-csbes-jp`), disciplina+período, curso, campus, mais
  `design` / `workflow` / `homepage`, além das `tags` livres do arquivo.

Consequência: **adicionar um YAML pode criar rotas novas**. Um projeto com uma disciplina
inédita gera `/codes/pw2-csbes-jp/1`, `/codes/pw2-csbes-jp-2025.1/1` etc. Os títulos dessas
páginas são montados por heurística de regex em `formatPageTitle()` (em
`pages/people/[tag]/[page].astro`) e por `getCourseName()` (`helpers/courses.ts`).

## Regras de conteúdo (derivadas de `src/content.config.ts`)

`src/content.config.ts` é a fonte da verdade — o README tem alguns pontos desatualizados
(veja "Armadilhas"). Ao validar ou gerar conteúdo, confira o esquema, não o README.

Arquivos com prefixo `_` (ex.: `_fulano-123.yml`) são **ignorados** pelos loaders — é assim
que cadastros incompletos ficam fora do site sem serem apagados.

### Pessoa — `src/content/people/nome-sobrenome-matricula.yml`

- `name.compact`, `name.full`, `avatar`, `occupations[]`, `addresses` são obrigatórios.
- `occupations[].id`: número com **6, 7, 11 ou 12 dígitos** (matrícula ou SIAPE).
- `occupations[].type`: `student` | `professor` | `employee`.
  - `student` exige `course` (`<curso>-<cidade>`) e `isFinished` (boolean).
  - `professor` / `employee` exigem `campus`.
- Cursos: `cmpti`, `csbee`, `csbes`, `cstads`, `cstrc`, `cstsi`, `cstt`, `ctie`, `ctii`, `ctim`.
- Cidades (sufixo do curso): `jp` (João Pessoa), `cg` (Campina Grande), `gb` (Guarabira),
  `cz` (Cajazeiras).
- Campus: `ifpb-jp`, `ifpb-cg`, `ifpb-gb`, `ifpb-cz`, `reitoria`.
- Avatar: `github` é a URL `https://github.com/<user>.png`; `githubUC` é a URL estável de
  `avatars.githubusercontent.com` preenchida por `npm run load:github:avatar`.
  `getAvatarImageUrl()` usa `avatar.selected` se presente, senão `githubUC || github`.
- Uma pessoa pode ter várias ocupações (vários cursos, aluno que virou professor). Os
  helpers assumem isso — nunca reduza `occupations` a um único item.

### Projeto — `src/content/projects/nome-do-projeto.yml`

- Obrigatórios: `name`, `description`, `addresses.repository`, `category`, `tags`, `owners`.
- `addresses.repository`: URL ou array de URLs (frontend/backend). O primeiro item define o
  slug da página do projeto.
- `category.type`: `subject` (exige `subject` — string ou array — e `period` no formato
  `2025.1`) | `research` | `extension` | `open source` (esses três exigem `campus`).
- `owners`: array de ids que **precisam existir** em algum `occupations[].id` de
  `src/content/people/`. Id sem pessoa correspondente não quebra o build — o projeto
  simplesmente aparece sem aquela pessoa. Verifique manualmente.
- `addresses.preview` é opcional no esquema, mas projetos sem preview são ordenados por
  último (`sortProjects`) e caem no placeholder. Na prática, inclua.

### Curso e disciplina

`src/content/courses/*.yml` e `src/content/subjects/*.yml` mudam raramente. Um curso ou
disciplina novo precisa ser cadastrado aqui **e** ter o código adicionado a
`abbreviationCourses` / `cities` em `src/lib/taxonomy.ts`, senão o Zod rejeita as
referências.

## Convenções de código

- Alias `@/*` → `src/*` (`tsconfig.json`). Use sempre o alias nos imports.
- **O base path `/projects/` está escrito à mão** na maior parte dos hrefs, `src` de imagens
  e caminhos de assets (ex.: `/projects/imgs/...`, `/projects/codes/page/1`). A exceção é a
  paginação, que usa `url()` de `@/lib/url`. Ao adicionar links, siga o padrão do arquivo em
  que está mexendo.
- **Link que só tem ícone precisa de `aria-label`.** O audit de a11y do Astro
  (`a11y-missing-content`) aceita texto, `aria-label`, `aria-labelledby`, `img[alt]` ou
  `svg > title` — **não** aceita o atributo `title`. Mantenha os dois: `title` para o
  tooltip, `aria-label` para o leitor de tela.
- **Heading vazio também reprova.** A mesma regra vale para `h1`–`h6`: o `BaseLayout`
  só renderiza o `<h1>` quando recebe `pageTitle` — sem isso a home ficava com um `<h1>`
  vazio além do seu próprio.
- **Controle sem destino não é `<a>`.** `<a>` sem `href` e `href=""` reprovam nos dois
  lados do audit; use `<span>` (paginação) ou troque a tag (o preview em
  `pages/codes/[project].astro` vira `div` quando o projeto não tem homepage).
- **`loading` segue a dobra, não uma regra fixa.** O preview da página de projeto é o LCP:
  vai `eager` + `fetchpriority="high"`. Nas grids, os cards da primeira fileira recebem a
  prop `eager` (3 em `ProjectGrid`, 4 em `PersonGrid`) e o resto fica `lazy`.
  As duas regras do audit (`perf-use-loading-lazy` e `perf-use-loading-eager`) são
  avaliadas contra o viewport atual e se contradizem numa grid responsiva: a 1440×900 ela
  pede mais imagens em `eager`, a 375×812 pede menos. **Não persiga zero nas grids** — a
  primeira fileira em `eager` é o meio-termo correto.
- **`getAvatarImageUrl(person, size?)`**: o `size` vira `?s=` na URL do GitHub, que
  redimensiona sob demanda — usado nas miniaturas de 32px (`s=128`), onde derruba o peso
  em ~83%. O avatar grande do `PersonCard` fica sem `size`: a 500px o GitHub devolve o
  mesmo arquivo, então não há ganho, e abaixo disso perde nitidez.
  ⚠️ **Nunca use `size` abaixo de 128**: o `PersonUtil.astro` troca por placeholder todo
  avatar com menos de 2000 bytes (é assim que ele reconhece o ícone padrão do GitHub), e a
  `s=64` uma foto real cai nessa faixa.
- Avatares usam o padrão do `PersonUtil.astro`:
  `src` começa no placeholder local e o JS troca por `data-src`, o que dá fallback quando a
  foto não existe.
- **Imagem local grande é problema de verdade.** O `people-placeholder.png` já esteve com
  2304×2304 e 96,8 KB para ser exibido a 32×32 — hoje tem 128×128 e 1,4 KB. Ao adicionar
  imagem em `public/imgs/`, gere-a no tamanho de exibição.
- **Nunca importe `astro:content` (nem nada de `@/helpers/`) em componente React.** A partir
  do Astro 5 isso é erro de build. Dados de coleção chegam às ilhas por props — veja como o
  `BaseLayout.astro` achata `courses`/`subjects` para o `Filter.tsx`.
- `helpers/people.ts` e `helpers/projects.ts` **memoizam** `getCollection()` em módulo
  (`allPeople()` / `allProjects()`). Isso não é micro-otimização: esses helpers se chamam
  dentro de laços e, sem o cache, o build estoura a memória do Node. Se precisar ordenar,
  copie antes (`[...await allPeople()]`) — o array é compartilhado.
- React só onde há interatividade (`Filter.tsx`, `Accordion.tsx`, `Badge.tsx`), com
  `client:visible`. Todo o resto é `.astro`.
- Tailwind com classes utilitárias inline; sem CSS-in-JS. `src/styles/global.css` é mínimo.
- **Prefira a escala a valor arbitrário.** No Tailwind 4 a escala de espaçamento é dinâmica
  (`--spacing: .25rem`), então `h-[200px]` se escreve `h-50` e `max-w-[400px]` vira
  `max-w-100` — basta o valor em px ser múltiplo de 4. Fração não funciona: `h-[150px]`
  precisaria de `h-37.5`, que o Tailwind não gera, então esses permanecem arbitrários.
- Textos de interface em português; nomes de código em inglês.

## Commits e PRs

Prefixos usados no histórico: `content:` (maioria absoluta), `feat:`, `fix:`, `refactor:`,
`docs:`, `config:`, `style:`.

```
content: Adicionando [Nome] e projeto [Projeto]
fix: Corrigindo homepage do projeto X
```

Contribuições chegam como PRs de forks. Ao revisar um PR de conteúdo, cheque: esquema
válido (rode o build), `owners` existentes, URLs acessíveis, nome de arquivo em
minúsculas com hífens.

## Armadilhas

- **Dois `getAllProjectTags` diferentes.** `helpers/projects.ts` retorna as tags derivadas
  (tipo, disciplina, curso, campus, design/workflow/homepage + tags livres);
  `helpers/tags.ts` retorna só as `tags` livres, em minúsculas. `BaseLayout.astro` importa
  a de `helpers/tags.ts`. Confira de onde está importando antes de mexer.
- O README diz `collaborator` como tipo de ocupação e `cz` = Cabedelo; o esquema diz
  `employee` e `cz` = Cajazeiras. O esquema vence.
- O README marca `addresses.preview` como obrigatório; no Zod é opcional.
- **Ícones com CSS que mira `path` precisam de `is:inline`.** Por padrão o astro-icon 1
  emite `<symbol>` + `<use>`, e regras como
  `.project-card .github-project-link path:first-child` não atravessam o shadow tree do
  `<use>` — o ícone do GitHub vira um círculo preto. Os usos em `ProjectCard.astro` e
  `PersonCard.astro` já levam `is:inline` por isso.
- O astro-icon avisa `Failed to load icons from "src/icons"` em todo build. É inofensivo:
  o projeto usa só conjuntos `@iconify-json`, sem SVGs locais.
- **Cuidado ao mutar `entry.data`.** As coleções são memoizadas, então o objeto é
  compartilhado por todo o build. `getProjectTags()` já teve esse bug: fazia
  `const projectTags = tags` (alias de `project.data.tags`) e dava `unshift`, acumulando
  tags a cada chamada e mudando o conjunto de rotas geradas. Copie antes: `[...tags]`.
- `src/helpers/image.ts` não é usado por ninguém — `PersonUtil.astro` tem a própria cópia
  inline em `is:inline` (roda no navegador). Não "conserte" um chamando o outro sem motivo.
- Matrícula repetida entre duas pessoas não quebra o build: o Astro só avisa
  (`conflicts with higher priority route`) e uma delas fica sem página individual. Ao
  revisar PR de conteúdo, confira o aviso no log.
- `dist/`, `.astro/` e `logs/` são gerados e estão no `.gitignore` — nunca edite nem
  commite. `logs/` acumula CSVs e saídas de build; trate como rascunho.
- A busca (Pagefind) só funciona depois do `postbuild`; em `npm run dev` ela não existe.
  Use `npm run buildpreviewpf` para testá-la. Se a busca sumir no preview, é quase sempre
  servidor antigo apontando para um `dist/` que foi apagado — reinicie o preview.
- `load:github:avatar` bate na API pública do GitHub (com delay aleatório de 1–4s por
  arquivo). Em ~780 arquivos, demora e pode esbarrar em rate limit.
