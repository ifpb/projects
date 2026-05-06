# Estudantes e Projetos do IFPB

Este repositório é um portal que exibe estudantes, professores e colaboradores do IFPB juntamente com seus projetos acadêmicos e de pesquisa. O objetivo é criar um catálogo colaborativo dos trabalhos desenvolvidos na instituição.

**🌟 Portal disponível em: [https://ifpb.github.io/projects/](https://ifpb.github.io/projects/)**

## 📋 Sumário

- [🚀 Tecnologias](#-tecnologias)
- [📝 Como Contribuir](#-como-contribuir)
- [👤 Cadastro de Pessoas](#-cadastro-de-pessoas)
  - [🏷️ Campos Obrigatórios](#️-campos-obrigatórios)
  - [📸 Avatar](#-avatar)
  - [🏫 Códigos de Cursos e Campus](#-códigos-de-cursos-e-campus)
  - [📋 Campos Opcionais](#-campos-opcionais)
  - [👔 Múltiplas Ocupações](#-múltiplas-ocupações)
- [📦 Cadastro de Projetos](#-cadastro-de-projetos)
  - [🗂️ Tipos de Projetos](#️-tipos-de-projetos)
  - [🔗 Endereços do Projeto](#-endereços-do-projeto)
  - [📝 Campos com Múltiplos Valores](#-campos-com-múltiplos-valores)
  - [🏷️ Tags](#️-tags)
  - [👥 Colaboradores](#-colaboradores)
- [✨ Boas Práticas para um Projeto de Excelência](#-boas-práticas-para-um-projeto-de-excelência)
  - [📖 README do Projeto](#-readme-do-projeto)
  - [🔄 Automação com GitHub Actions](#-automação-com-github-actions)
  - [📊 GitHub Projects (Kanban)](#-github-projects-kanban)
  - [🎯 Outras Boas Práticas](#-outras-boas-práticas)
  - [🏆 Exemplos de Projetos Exemplares](#-exemplos-de-projetos-exemplares)
- [🤝 Contribuições](#-contribuições)
  - [1. Fork e Clone](#1-fork-e-clone)
  - [2. Atualize seu Fork (se já existir)](#2-atualize-seu-fork-se-já-existir)
  - [3. Adicione seus Arquivos](#3-adicione-seus-arquivos)
  - [4. Teste Localmente](#4-teste-localmente)
  - [5. Commit e Push](#5-commit-e-push)
  - [6. Crie o Pull Request](#6-crie-o-pull-request)
  - [📝 Convenções de Commit](#-convenções-de-commit)
- [🛠️ Desenvolvimento](#️-desenvolvimento)
  - [Comandos Disponíveis](#comandos-disponíveis)
  - [Estrutura do Projeto](#estrutura-do-projeto)
- [📊 Dados Atuais](#-dados-atuais)
- [📄 Licença](#-licença)

## 🚀 Tecnologias

- **[Astro.js](https://astro.build/)** v4.15.4 - Framework web moderno para sites rápidos
- **[React](https://react.dev/)** v18.2.0 - Componentes interativos
- **[Tailwind CSS](https://tailwindcss.com/)** v3.3.1 - Framework CSS utilitário
- **[Pagefind](https://pagefind.app/)** v1.1.1 - Busca estática rápida
- **[TypeScript](https://www.typescriptlang.com/)** - Tipagem estática
- **[Zod](https://zod.dev/)** - Validação de esquemas
- **YAML** - Formato de dados estruturados

## 📝 Como Contribuir

Você pode contribuir adicionando seus dados pessoais, projetos ou atualizando informações existentes através de Pull Requests (PRs). Este documento orienta sobre como fazer o cadastro de pessoas e projetos.

## 👤 Cadastro de Pessoas

Para se cadastrar, adicione um arquivo seguindo o formato `nome-sobrenome-id.yml` no diretório `src/content/people/`. O nome do arquivo deve usar apenas letras minúsculas, hifens e sua matrícula/ID.

### Exemplo: `luiz-chaves-20051370420.yml`

```yaml
name:
  compact: Luiz Chaves
  full: Luiz Carlos Rodrigues Chaves
avatar:
  github: https://github.com/luizchaves.png
occupations:
  - id: 20051370420
    type: student
    course: cstsi-jp  # curso-campus (formato unificado)
    isFinished: true  # true se já concluiu, false se ainda está cursando
addresses:
  github: https://github.com/luizchaves
  linkedin: https://www.linkedin.com/in/luizcarloschaves/
  instagram: https://www.instagram.com/luizcrchaves/
  bluesky: https://bsky.app/profile/luizcarloschaves.bsky.social
  homepage: https://luizchaves.github.io
  email: luiz.chaves@ifpb.edu.br
```

### 🏷️ Campos Obrigatórios

Segundo o [esquema de validação](./src/content/config.ts) definido com [Zod](https://zod.dev/), os seguintes campos são obrigatórios:

**Para todos os tipos:**
- `name.compact` - Nome resumido para exibição
- `name.full` - Nome completo
- `avatar.github` - URL da imagem do GitHub (formato: `https://github.com/username.png`)
- `occupations[].id` - Matrícula ou ID único
- `occupations[].type` - Tipo: `student`, `professor`, `collaborator`
- `addresses.github` - Perfil no GitHub

**Para estudantes:**
- `occupations[].course` - Código do curso + campus (ex: `cstsi-jp`, `csbes-jp`)

**Para professores e colaboradores:**
- `occupations[].campus` - Campus de atuação (ex: `ifpb-jp`)

### 📸 Avatar

A imagem de avatar deve ser do seu perfil do GitHub. Por exemplo:
- Perfil: `https://github.com/luizchaves`
- Avatar: `https://github.com/luizchaves.png`

### 🏫 Códigos de Cursos e Campus

- **Cursos**: `cstsi` (TSI), `cstrc` (Redes), `csbes` (Engenharia de Software), etc.
- **Campus**: `jp` (João Pessoa), `cz` (Cabedelo), `cg` (Campina Grande), etc.
- **Formato curso**: `{codigo-curso}-{campus}` (ex: `cstsi-jp`)

### 📋 Campos Opcionais

Você pode adicionar outros endereços sociais e profissionais:
- `addresses.linkedin`
- `addresses.instagram`
- `addresses.homepage`
- `addresses.lattes`
- `addresses.researchgate`
- `addresses.orcid`
- `addresses.bluesky`
- `addresses.twitter`
- `addresses.email`

### 👔 Múltiplas Ocupações

Pessoas podem ter múltiplas ocupações (ex: estudante e professor, múltiplos cursos):

```yaml
# Estudante de múltiplos cursos
occupations:
  - id: 20051370420
    type: student
    course: cstsi-jp
    isFinished: true
  - id: 20221370025
    type: student
    course: csbes-jp
    isFinished: false

# Estudante que virou professor
occupations:
  - id: 20051370420
    type: student
    course: cstsi-jp
    isFinished: true
  - id: 2680962
    type: professor
    campus: ifpb-jp

# Apenas professor
occupations:
  - id: 2680962
    type: professor
    campus: ifpb-jp
```

## 📦 Cadastro de Projetos

Para cadastrar um projeto, adicione um arquivo seguindo o formato `titulo-do-projeto.yml` no diretório `src/content/projects/`.

### Exemplo: `ifpb-projects.yml`

```yaml
name: IFPB Projects
description:
  Este portal tem como objetivo listar projetos construídos pelos
  estudantes, professores e colaboradores do IFPB.
addresses:
  preview: https://github.com/ifpb/projects/blob/main/preview.png?raw=true
  homepage: https://ifpb.github.io/projects/
  repository: https://github.com/ifpb/projects
  design: https://www.figma.com/design/example # figma, canva, etc.
category:
  type: subject  # ou 'subject', 'research', 'extension', 'open source'
  subject: pw2-csbes-jp
  period: 2025.1   # necessário para projetos de disciplina
tags:
  - javascript
  - astro.js
  - typescript
owners:
  - 20051370420  # matrícula/ID dos colaboradores
  - 2680962
```

### 🗂️ Tipos de Projetos

1. **Projeto de Disciplina** (`subject`)
   - Requer: `category.subject`, `category.period`
   - Disciplina única: `category: { type: subject, subject: "dw-cstrc-jp", period: "2024.1" }`
   - Múltiplas disciplinas: `category: { type: subject, subject: ["dw-cstrc-jp", "pw2-cstrc-jp"], period: "2024.1" }`

2. **Projeto de Pesquisa** (`research`)
   - Requer: `category.campus`
   - Exemplo: `category: { type: research, campus: "ifpb-jp" }`

3. **Projeto de Extensão** (`extension`)
   - Requer: `category.campus`
   - Exemplo: `category: { type: extension, campus: "ifpb-jp" }`

4. **Projeto Open Source** (`open source`)
   - Requer: `category.campus`
   - Exemplo: `category: { type: "open source", campus: "ifpb-jp" }`

### 🔗 Endereços do Projeto

- **`addresses.repository`** *(obrigatório)* - Repositório(s) no GitHub
  - Pode ser um único repositório: `repository: "https://github.com/user/repo"`
  - Ou múltiplos repositórios: `repository: ["https://github.com/user/frontend", "https://github.com/user/backend"]`
- **`addresses.preview`** *(obrigatório)* - Imagem de preview (500x262px recomendado)
- **`addresses.homepage`** *(opcional)* - Site/demo do projeto
- **`addresses.design`** *(opcional)* - Link do design/protótipo (Figma, etc.)
- **`addresses.workflow`** *(opcional)* - Link público para documentação do processo de desenvolvimento, metodologia ou fluxo de trabalho (ex: documentos sobre metodologia ágil, processo de desenvolvimento, pipeline CI/CD, etc.)

Exemplos de projetos com design e workflow:

- [Projetos com design](https://ifpb.github.io/projects/codes/design/1/) - Veja exemplos de projetos que incluem links para protótipos e designs
- [Projetos com workflow](https://ifpb.github.io/projects/codes/workflow/1/) - Veja exemplos de projetos que documentam seus processos de desenvolvimento

### 📝 Campos com Múltiplos Valores

Alguns campos suportam múltiplos valores quando aplicável:

#### `category.subject` (Disciplinas)
Para projetos que envolvem múltiplas disciplinas:

```yaml
# Disciplina única
category:
  type: subject
  subject: pw2-csbes-jp
  period: 2025.1

# Múltiplas disciplinas
category:
  type: subject
  subject:
    - pw2-csbes-jp   # Programação Web 2
    - dw-csbes-jp    # Desenvolvimento Web
  period: 2025.1
```

#### `addresses.repository` (Repositórios)
Para projetos com múltiplos repositórios (frontend/backend, monorepos, etc.):

```yaml
# Repositório único
addresses:
  repository: https://github.com/user/meu-projeto

# Múltiplos repositórios
addresses:
  repository:
    - https://github.com/user/frontend
    - https://github.com/user/backend
    - https://github.com/user/mobile
```

### 🏷️ Tags

Use tags descritivas das tecnologias, frameworks e conceitos utilizados:
- Linguagens: `javascript`, `python`, `java`, `kotlin`
- Frameworks: `react`, `vue.js`, `spring boot`, `flutter`
- Ferramentas: `docker`, `git`, `figma`
- Conceitos: `machine learning`, `mobile`, `web`, `api`
- Tipos de projeto: `e-commerce`, `blog`, `portfolio`, `chatbot`

### 👥 Colaboradores

No campo `owners`, liste as matrículas/IDs de todos os colaboradores do projeto. Certifique-se de que cada pessoa esteja cadastrada no diretório `src/content/people/`.

## ✨ Boas Práticas para um Projeto de Excelência

Para criar um projeto que se destaque e sirva de referência, siga estas orientações:

### 📖 README do Projeto

Todo projeto deve ter um README.md bem estruturado com:

```markdown
# Nome do Projeto

## 📋 Descrição
Descreva claramente o que o projeto faz, seus objetivos e contexto acadêmico.

## ✨ Funcionalidades
- Lista das principais funcionalidades
- Features implementadas
- Diferenciais do projeto

## 🛠️ Tecnologias Utilizadas
- Frontend: React, Vue.js, Vanilla JS...
- Backend: Node.js, Spring Boot, Django...
- Database: PostgreSQL, MySQL, MongoDB...
- Deploy: Vercel, Netlify, Heroku...

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- NPM ou Yarn
- Outras dependências específicas

### Instalação
1. Clone o repositório
   git clone https://github.com/usuario/projeto.git
2. Instale as dependências
   npm install
3. Configure as variáveis de ambiente
   cp .env.example .env
4. Execute o projeto
   npm run dev

## 📱 Demo
- [🌐 Site Online](https://seu-projeto.vercel.app)
- [🎨 Design no Figma](https://figma.com/design/...)
- [📊 Apresentação](https://slides.com/...)

## 🧪 Testes
Instrua sobre como executar os testes:
npm test
npm run test:e2e

## 📂 Estrutura do Projeto

src/
├── components/     # Componentes reutilizáveis
├── pages/         # Páginas da aplicação
├── services/      # Integração com APIs
├── utils/         # Funções utilitárias
└── styles/        # Estilos globais

## 👥 Autores
- **Seu Nome** - Desenvolvimento Full Stack - [@seuuser](https://github.com/seuuser)
- **Colega** - Frontend - [@colega](https://github.com/colega)

## 📄 Licença
Este projeto está sob licença [MIT](LICENSE).
```

### 🔄 Automação com GitHub Actions

Configure workflows automáticos para melhorar a qualidade do código:

#### `.github/workflows/ci.yml` - Integração Contínua

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'

      - run: npm ci
      - run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
```

#### Outros workflows recomendados:

- **Code Quality**: ESLint, Prettier, TypeScript checking
- **Security**: Dependabot, CodeQL analysis
- **Performance**: Lighthouse CI, Bundle analyzer
- **Documentation**: Auto-generate docs, deploy Storybook

### 📊 GitHub Projects (Kanban)

Organize o desenvolvimento com um quadro Kanban:

1. **Acesse** GitHub Projects no seu repositório
2. **Crie um novo projeto** com template "Team Planning"
3. **Configure colunas**:
   - 📋 **Backlog** - Ideias e funcionalidades futuras
   - 🔄 **To Do** - Tarefas prontas para desenvolvimento
   - 👷 **In Progress** - Em desenvolvimento
   - 👀 **In Review** - Aguardando revisão
   - ✅ **Done** - Concluído
   - 🚀 **Released** - Em produção

4. **Crie issues** detalhadas com:
   - Labels apropriadas (bug, feature, enhancement)
   - Assignees responsáveis
   - Milestones para organizar releases
   - Templates para padronizar relatórios

### 🎯 Outras Boas Práticas

#### Estrutura de Commits
Use Conventional Commits para histórico organizado:

- feat: adicionar autenticação com Google
- fix: corrigir erro de validação no formulário
- docs: atualizar documentação da API
- style: ajustar responsividade do header
- refactor: otimizar queries do banco de dados
- test: adicionar testes para componente Login

#### Arquivos Essenciais
- **`LICENSE`** - Licença do projeto (MIT, Apache, etc.)
- **`.gitignore`** - Arquivos ignorados pelo Git
- **`package.json`** - Dependências e scripts bem configurados
- **`.env.example`** - Exemplo de variáveis de ambiente
- **`CONTRIBUTING.md`** - Guia para contribuidores
- **`CHANGELOG.md`** - Histórico de mudanças

#### Qualidade de Código
- **Linting**: ESLint, Prettier para código limpo
- **Testes**: Jest, Vitest, Cypress para qualidade
- **Types**: TypeScript para tipagem estática
- **Performance**: Otimização de imagens, lazy loading
- **Acessibilidade**: Semantic HTML, ARIA labels

#### Deploy e Monitoramento
- **Hosting**: Vercel, Netlify, GitHub Pages
- **Domain**: Domínio personalizado quando possível
- **Analytics**: Google Analytics, Plausible
- **Monitoring**: Sentry para error tracking
- **Performance**: PageSpeed Insights, Core Web Vitals

#### Documentação Adicional
- **Wiki**: Documentação técnica detalhada
- **Storybook**: Para componentes (se aplicável)
- **OpenAPI**: Para APIs REST
- **Diagramas**: Arquitetura, fluxos, banco de dados

### 🏆 Exemplos de Projetos Exemplares

Confira projetos do portal que seguem essas boas práticas:
- [Projetos de disciplina](https://ifpb.github.io/projects/codes/subject/1/)
- [Projetos de pesquisa](https://ifpb.github.io/projects/codes/research/1/)
- [Projetos de extensão](https://ifpb.github.io/projects/codes/extension/1/)
- [Projetos com homepage](https://ifpb.github.io/projects/codes/homepage/1/)
- [Projetos open source](https://ifpb.github.io/projects/codes/open%20source/1/)

Um projeto bem estruturado não apenas demonstra conhecimento técnico, mas também profissionalismo e atenção aos detalhes que são muito valorizados no mercado de trabalho!

## 🤝 Contribuições

Contribuições são muito bem-vindas! Você pode:

- ✅ Adicionar seus dados pessoais e projetos
- ✅ Corrigir informações incorretas
- ✅ Melhorar a documentação
- ✅ Reportar bugs ou sugerir melhorias
- ✅ Contribuir com código (componentes, features, etc.)

Todas as contribuições para este projeto são realizadas através de Pull Requests (PRs). Este processo garante qualidade, permite revisão colaborativa e mantém o histórico organizado. Siga o passo a passo abaixo para contribuir de forma efetiva:

### 1. Fork e Clone

1. **Fork** este repositório (`ifpb/projects` → `seu-username/projects`)
2. **Clone** seu fork localmente:
   ```bash
   git clone https://github.com/seu-username/projects.git
   cd projects
   ```

3. **Configure o upstream** para manter seu fork atualizado:
   ```bash
   git remote add upstream https://github.com/ifpb/projects.git
   ```

### 2. Atualize seu Fork (se já existir)

Antes de fazer mudanças, sempre sincronize com o repositório original:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

### 3. Adicione seus Arquivos

- Adicione seu arquivo de pessoa em `src/content/people/`
- Adicione seus projetos em `src/content/projects/`
- Siga os exemplos e formatos descritos nas seções anteriores

### 4. Teste Localmente

Antes de enviar o PR, teste suas mudanças localmente:

```bash
# Instale as dependências
npm install

# Construa o projeto (verifica se não há erros)
npm run build

# Visualize o resultado
npm run preview
```

Se não houver erros, abra o navegador no endereço sugerido pelo terminal para ver como ficaram seus dados.

### 5. Commit e Push

```bash
# Adicione os arquivos
git add .

# Faça o commit com uma mensagem descritiva
git commit -m "content: Adicionando [Seu Nome] e projeto [Nome do Projeto]"

# Envie para seu fork
git push origin main
```

### 6. Crie o Pull Request

1. Acesse seu fork no GitHub
2. Clique em **"New Pull Request"**
3. Preencha título e descrição explicando as mudanças
4. Envie o PR e aguarde a revisão

### 📝 Convenções de Commit

Use prefixos descritivos nas mensagens de commit:

**Conteúdo:**
- `content: Adicionando pessoa [Nome]`
- `content: Adicionando projeto [Nome do Projeto]`
- `content: Atualizando informações de [Nome]`
- `content: Removendo pessoa/projeto [Nome]`

**Correções:**
- `fix: Corrigindo erro em [arquivo]`
- `fix: Corrigindo links quebrados`
- `fix: Ajustando validação de esquema`

**Funcionalidades:**
- `feat: Adicionando novo componente [nome]`
- `feat: Implementando busca avançada`
- `feat: Adicionando filtro por [critério]`

**Melhorias:**
- `refactor: Otimizando performance da página`
- `refactor: Melhorando acessibilidade`
- `refactor: Aprimorando UX do componente`

**Configuração:**
- `config: Atualizando dependências`
- `config: Configurando novo build script`
- `config: Ajustando configurações do Astro`

**Documentação:**
- `docs: Atualizando README com [informação]`
- `docs: Adicionando guia de [tópico]`
- `docs: Corrigindo documentação de [seção]`

**Estilos:**
- `style: Ajustando layout da página`
- `style: Melhorando responsividade`
- `style: Padronizando componentes`

## 🛠️ Desenvolvimento

### Comandos Disponíveis

```bash
# Desenvolvimento com hot-reload
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Build + Preview
npm run buildpreview

# Build + Pagefind + Preview (com busca)
npm run buildpreviewpf

# Carregar avatars do GitHub
npm run load:github:avatar
```

### Estrutura do Projeto

```
src/
├── content/           # Dados em YAML
│   ├── people/        # Pessoas (estudantes, professores)
│   ├── projects/      # Projetos
│   ├── courses/       # Cursos do IFPB
│   ├── subjects/      # Disciplinas
│   └── config.ts      # Esquemas de validação
├── components/        # Componentes React/Astro
├── helpers/           # Funções utilitárias
├── layouts/           # Layouts das páginas
├── pages/             # Rotas do site
└── styles/           # Estilos globais
```

## 📊 Dados Atuais

O portal atualmente indexa:
- **Pessoas** (estudantes, professores, colaboradores)
- **Projetos** de diferentes categorias
- **Busca rápida** com Pagefind
- **Filtros avançados** por curso, campus, tecnologia
- **Geração estática** para performance máxima

## 📄 Licença

Este projeto é open source. Veja o arquivo de licença para mais detalhes.

---

**💡 Gostou da ideia?** Compartilhe com seus colegas e professores! Vamos construir juntos o maior catálogo de projetos do IFPB! 🚀

