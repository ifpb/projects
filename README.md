# Estudantes e Projetos do IFPB

O objetivo deste repositório consiste em exibir os alunos e os projetos do IFPB. Caso você ainda não possua projetos, não está na lista dos alunos, ou se você deseja atualizar alguma informação existente, basta fazer um Pull Request (PR) enviando os seus dados. A seguir, é apresentado como fazer o cadastro de alunos e projetos, e as orientações para o PR.

## Cadastro de alunos

O primeiro passo seria incluir o dados do aluno adicionando um arquivo seguindo este formato `name-compact-id.md`, no diretório no diretório [src/content/people/](https://github.com/ifpb/projects/tree/main/src/content/people), por exemplo, o arquivo `luiz-chaves-20051370420.md`:

```yaml
---
id: 20051370420
name:
  compact: Luiz Chaves
  full: Luiz Carlos Rodrigues Chaves
avatar: https://github.com/luizchaves.png
occupations:
- id: 20051370420
  type: student
  campus: ifpb-jp
  course: cstsi
  isFinished: true
addresses:
  github: https://github.com/luizchaves
  linkedin: https://www.linkedin.com/in/luizcarloschaves/
  lattes: http://lattes.cnpq.br/7165875430419020
  researchgate: https://www.researchgate.net/profile/Luiz_Rodrigues_Chaves
  instagram: https://www.instagram.com/luizcrchaves/
  threads: https://www.threads.net/@luizcrchves
  bluesky: https://bsky.app/profile/luizcarloschaves.bsky.social
  twitter: http://twitter.com/luizchavesjp
  email: luiz.chaves@ifpb.edu.br
---
```

Vamos padronizar o `id` como sendo a sua matrícula do curso, ou a do IFPB no caso de servidor, e os seguintes campos serão obrigatórios para estudante segundo a [definição de coleção do Astro.js](https://docs.astro.build/en/guides/content-collections/#defining-a-collection-schema) no arquivo [src/content/config.ts](https://github.com/ifpb/projects/tree/main/src/content/config.ts) (Esquema feito com [Zod](https://zod.dev/)):

- `id`
- `name.compact`
- `name.full`
- `avatar`
- `occupations.$.id`
- `occupations.$.type`
- `occupations.$.campus`
- `occupations.$.course`
- `addresses.gihtub`
- `addresses.linkedin`

A imagem de avatar deve ser a do seu perfil do github, por exemplo, o endereço do avatar do exemplo é https://github.com/luizchaves, logo a imagem avatar deve ser https://github.com/luizchaves.png.

## Cadastro de projetos

O próximo passo seria incluir os dados do projeto adicionando um arquivo seguindo este formato `titulo-do-projeto.md`, no diretório [src/content/projects/](https://github.com/ifpb/projects/tree/main/src/content/projects), por exemplo, o arquivo `ifpb-projects.md`:

```yaml
---
name: Home da UAI-IFPB
description: Este portal tem como objetivo ser um landing page da UAI do IFPB.
addresses:
  preview: https://raw.githubusercontent.com/ifpb/ifpb.github.io/main/preview.png
  homepage: https://ifpb.github.io/
  repository: https://github.com/ifpb/ifpb.github.io
  template: https://www.figma.com/design/tgIYBEusxWkzNX803dBgUs/ifpb.github.io?node-id=0-1&t=Y6u5fodNP8JCcDHw-1
category:
  type: subject
  subject: ls
  semester: 2023.1
  course: cstsi
  campus: ifpb-jp
tags:
  - js
  - astro.js
owners:
  - 20051370420
---
```

Este exemplo é um projeto do tipo `projeto de disciplina`, no arquivo [src/content/config.ts](https://github.com/ifpb/projects/tree/main/src/content/config.ts) é possível ver outros tipos de projetos. Neste exemplo de projeto de disciplina existem estes endereços do projeto:


- `addresses.repository` - Endereço do repositório do projeto no Github (obrigatório);
- `addresses.preview` - Endereço da imagem de preview do projeto (print screen), que deve ser colocada no próprio repositório do projeto com a extensão `.png` e tamanho sugerido de `500x262px` (obrigatório);
- `addresses.homepage` - Site do projeto em execução, caso exista (opcional).

No campo `owners` é possível adicionar uma lista alunos, caso o projeto tenha mais de um colaborador, informando a matrícula do aluno, depois é importante que cada aluno faça seu o cadastrado de suas informações.

## Pull Request

Para enviar seus dados é necessário fazer o Pull Request (PR). Inicialmente é preciso fazer uma cópia/fork deste repositório (`ifpb/projects` - upstream), clonar o repositório copiado (`seu-username/projects` - origin) e adicionar os arquivos de alunos e projetos conforme descrito anteriormente. Caso já tenha feito o fork, basta atualizar o seu repositório local antes de fazer o PR.

Após inclusão dos arquivos é recomendado fazer um teste localmente para ver como ficou seus dados. Para isso, você precisa ter o [Node.js](https://nodejs.org/) instalado e executar os seguintes comandos:

```bash
$ npm install
$ npm run build
$ npm run preview
```

Caso não tenha nenhum erro, abra o navegador e acesse o endereço sugerido no terminal. Se deu tudo certo, gere o commit dos arquivos e os envie em um PR, depois é só aguardar a aprovação para que as informações apareçam em [https://ifpb.github.io/projects/](https://ifpb.github.io/projects/), mas antes do PR lembre de atualizar o seu repositório local (origin) com o repositório original (upstream), e ao gerar a mensagem de commit informe o que foi feito, por exemplo, `content: Adicionando o aluno Luiz Chaves` ou `content: Adicionando o projeto IFPB Projects`.

Gostou da ideia? Então avise aos seus colegas e compartilhe seus projetos do IFPB!

