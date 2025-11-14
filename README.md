# Estudantes e Projetos do IFPB

Este repositório é um portal que exibe estudantes, professores e colaboradores do IFPB juntamente com seus projetos acadêmicos e de pesquisa. O objetivo é criar um catálogo colaborativo dos trabalhos desenvolvidos na instituição.

**🌟 Portal disponível em: [https://ifpb.github.io/projects/](https://ifpb.github.io/projects/)**

## 🚀 Tecnologias

- **[Astro.js](https://astro.build/)** v4.15.4 - Framework web moderno para sites rápidos
- **[React](https://react.dev/)** v18.2.0 - Componentes interativos
- **[Tailwind CSS](https://tailwindcss.com/)** v3.3.1 - Framework CSS utilitário
- **[Pagefind](https://pagefind.app/)** v1.1.1 - Busca estática rápida
- **[TypeScript](https://www.typescriptlang.com/)** - Tipagem estática
- **[Zod](https://zod.dev/)** - Validação de esquemas
- **YAML** - Formato de dados estruturados

## 📝 Como Contribuir

Você pode contribuir adicionando seus dados pessoais, projetos ou atualizando informações existentes através de Pull Requests (PRs). Este documento orienta como fazer o cadastro de pessoas e projetos.

## 👤 Cadastro de Pessoas

Para se cadastrar, adicione um arquivo seguindo o formato `nome-sobrenome-id.yml` no diretório `src/content/people/`. O nome do arquivo deve usar apenas letras minúsculas, hífens e sua matrícula/ID.

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

## 🔄 Pull Request (PR)

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

## 🤝 Contribuições

Contribuições são muito bem-vindas! Você pode:
- ✅ Adicionar seus dados pessoais e projetos
- ✅ Corrigir informações incorretas
- ✅ Melhorar a documentação
- ✅ Reportar bugs ou sugerir melhorias
- ✅ Contribuir com código (componentes, features, etc.)

## 📄 Licença

Este projeto é open source. Veja o arquivo de licença para mais detalhes.

---

**💡 Gostou da ideia?** Compartilhe com seus colegas e professores! Vamos construir juntos o maior catálogo de projetos do IFPB! 🚀

