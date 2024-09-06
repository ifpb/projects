# Projetos do IFPB

O objetivo deste repositório consiste em exibir alunos e projetos do IFPB. Caso você ainda não possua projetos, não está na lista dos alunos, ou se você deseja atualizar alguma informação, basta fazer um Pull Request (PR) enviando os seus dados.

## Cadastro de alunos

O primeiro passo seria incluir o dados do aluno adicionando, no diretório no diretório [src/content/people/](https://github.com/ifpb/projects/tree/main/src/content/people), um arquivo seguindo este `src/content/people/nome-compacto-e-numero-da-matricula.md`:

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
  twitter: http://twitter.com/luizchavesjp
  lattes: http://lattes.cnpq.br/7165875430419020
  researchgate: https://www.researchgate.net/profile/Luiz_Rodrigues_Chaves
  email: lucachaves@gmail.com
---
```

Detalhe, vamos padronizar o `id` como sendo a sua matrícula do curso, ou do IFPB caso seja servidor, e os seguintes campos serão obrigatórios:

- `id`
- `name.compact`
- `name.full`
- `avatar`
- `occupations.*`
- `addresses.linkedin`
- `addresses.gihtub`

A imagem de avatar deve ser a do seu perfil do github, por exemplo, o endereço do avatar do código é https://github.com/luizchaves e a imagem de avatar é https://github.com/luizchaves.png.

## Cadastro de projetos

O próximo passo seria incluir os dados do projeto adicionando, no diretório [src/content/projects/](https://github.com/ifpb/projects/tree/main/src/content/projects), um arquivo seguindo este formato `src/content/projects/titulo-do-projeto.md`:

```yaml
---
name: IFPB Projects
description: Este portal tem como objetivo listar projetos construídos pelos alunos do IFPB.
preview: https://raw.githubusercontent.com/ifpb/projects/master/preview.png
page: https://ifpb.github.io/projects/
repository: https://github.com/ifpb/projects
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

A imagem do preview do projeto deve ser colocada no próprio repositório do projeto com a extensão `.png` e tamanho sugerido de `500x262` px.

## Testar localmente

Antes de fazer o Pull Request (PR) é recomendado fazer um testar localmente para ver como ficou o seu projeto. Para isso, você precisa ter o [Node.js](https://nodejs.org/) instalado. Depois, basta fazer o fork, clonar o repositório copiado e executar os seguintes comandos:

```bash
$ npm install
$ npm run build
$ npm run preview
```

Caso não tenha nenhum erro, abra o navegador e acesse o endereço sugerido no terminal.

Gostou da ideia? Então avise aos seus colegas e compartilhe seus projetos do IFPB!

