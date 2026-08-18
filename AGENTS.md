# AGENTS.md

Guia para agentes de IA (Claude Code, Codex, Cursor, etc.) trabalhando neste repositório.

## O que é este projeto

Portal estático que cataloga pessoas (estudantes, professores, servidores) e projetos
acadêmicos do IFPB. Publicado em <https://ifpb.github.io/projects/>.

O repositório é **majoritariamente conteúdo, não código**: a maior parte das contribuições
são PRs de forks adicionando um único arquivo YAML em `src/content/people/` ou
`src/content/projects/`. O código em `src/` muda com pouca frequência.

## Stack

Astro 4 (SSG) · React 18 (ilhas) · Tailwind 3 · TypeScript · Zod (validação das coleções) ·
Pagefind (busca estática) · astro-icon / @iconify/react (ícones) · YAML (dados).

## Comandos

```bash
npm install            # Node 20+ (dev usa 24)
npm run dev            # http://localhost:4321/projects  (atenção ao base path)
npm run build          # astro build + postbuild (pagefind --site dist/)
npm run preview        # serve dist/
npm run buildpreviewpf # build + pagefind + preview (única forma de testar a busca)

npm run load:github:avatar          # preenche avatar.githubUC via API do GitHub
npm run extract:linkedin -- --course csbes-jp   # gera CSV em logs/
```

- **Não há testes nem linter configurado.** `npm run build` é a validação de fato: o Zod
  quebra o build em qualquer YAML fora do esquema. Rode-o antes de considerar uma
  alteração de conteúdo concluída.
- Prettier existe apenas como devDependency (com `prettier-plugin-astro` e
  `prettier-plugin-tailwindcss`), sem script nem arquivo de configuração. Use
  `npx prettier --write <arquivo>` quando precisar.
- O build gera páginas para ~780 pessoas e ~235 projetos; leva alguns minutos. Prefira
  `npm run dev` para iterar e reserve o build completo para a verificação final.

## Arquitetura

```
src/content/{people,projects,courses,subjects}/*.yml   # dados (fonte da verdade)
src/content/config.ts                                  # esquemas Zod + enums compartilhados
src/helpers/*.ts                                       # consultas, derivação de tags, ordenação
src/pages/**                                           # rotas (todas via getStaticPaths)
src/components/*.{astro,tsx}                           # UI
src/layouts/BaseLayout.astro                           # shell + filtros + Pagefind
```

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

## Regras de conteúdo (derivadas de `src/content/config.ts`)

`src/content/config.ts` é a fonte da verdade — o README tem alguns pontos desatualizados
(veja "Armadilhas"). Ao validar ou gerar conteúdo, confira o esquema, não o README.

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
`abbreviationCourses` / `cities` em `config.ts`, senão o Zod rejeita as referências.

## Convenções de código

- Alias `@/*` → `src/*` (`tsconfig.json`). Use sempre o alias nos imports.
- **O base path `/projects/` está escrito à mão** em hrefs, `src` de imagens e caminhos de
  assets pelos componentes (ex.: `/projects/imgs/...`, `/projects/codes/page/1`). Não se usa
  `import.meta.env.BASE_URL`. Ao adicionar links, siga o padrão existente; ao mudar `base`
  em `astro.config.mjs`, todos precisam ser atualizados.
- Helpers são funções puras exportadas nomeadamente; `helpers/courses.ts` e
  `helpers/subjects.ts` fazem `await getCollection()` no topo do módulo, então podem ser
  importados por componentes React (`Filter.tsx`) sem `astro:content` no cliente.
- React só onde há interatividade (`Filter.tsx`, `Accordion.tsx`, `Badge.tsx`), com
  `client:visible`. Todo o resto é `.astro`.
- Tailwind com classes utilitárias inline; sem CSS-in-JS. `src/styles/global.css` é mínimo.
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
- `src/helpers/image.ts` não é usado por ninguém — `PersonUtil.astro` tem a própria cópia
  inline em `is:inline` (roda no navegador). Não "conserte" um chamando o outro sem motivo.
- `scripts/extract-people-data.mjs` importa `yaml`, que **não está declarado** em
  `package.json` (resolve por dependência transitiva). Se o script quebrar após um
  `npm install` limpo, é isso.
- `dist/`, `.astro/` e `logs/` são gerados e estão no `.gitignore` — nunca edite nem
  commite. `logs/` acumula CSVs e saídas de build; trate como rascunho.
- A busca (Pagefind) só funciona depois do `postbuild`; em `npm run dev` ela não existe.
  Use `npm run buildpreviewpf` para testá-la.
- `load:github:avatar` bate na API pública do GitHub (com delay aleatório de 1–4s por
  arquivo). Em ~780 arquivos, demora e pode esbarrar em rate limit.
