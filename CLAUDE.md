# CLAUDE.md

@AGENTS.md

As instruções do projeto estão em [AGENTS.md](./AGENTS.md) — arquitetura, esquemas de
conteúdo, comandos, convenções e armadilhas. Mantenha aquele arquivo como fonte única;
use este aqui apenas para o que é específico do Claude Code.

## Como trabalhar neste repositório

- **Valide conteúdo com `npm run build`.** Não existe teste nem linter; o Zod quebrando o
  build é o único sinal confiável de que um YAML está correto. O build é lento
  (~780 pessoas + ~235 projetos), então rode-o uma vez ao final em vez de a cada edição.
- **Alterações de conteúdo são o caso comum.** Ao adicionar uma pessoa ou projeto, copie a
  estrutura de um arquivo vizinho do mesmo tipo em vez de montar do zero, e confira os
  valores permitidos em `src/content/config.ts`.
- **Confira `config.ts`, não o README,** quando houver divergência sobre campos e valores.
- Antes de mexer em tags, ordenação ou filtros, leia `helpers/people.ts` e
  `helpers/projects.ts` inteiros: tags são derivadas e criam rotas, então uma mudança
  pequena ali muda o conjunto de páginas geradas.
- Não edite `dist/`, `.astro/` ou `logs/` — são gerados e ignorados pelo Git.
- Ao criar links ou caminhos de asset, repita o prefixo `/projects/` escrito à mão, como no
  resto dos componentes.
