# Projetos do IFPB

O objetivo deste repositório consiste em exibir projetos dos alunos no IFPB. Caso você ainda não possua projetos neste base, ou se você deseja atualizar alguma informação, basta fazer um Pull Request enviando os seus dados.

O primeiro passo seria incluir o dados do projeto adicionando, no diretório [src/content/projects/](https://github.com/ifpb/projects/tree/main/src/content/projects), um arquivo seguindo este formato `src/content/projects/titulo-do-projeto.md`:

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

Além da descrição do projeto, cada integrante deve incluir suas informação, no diretório [src/content/people/](https://github.com/ifpb/projects/tree/main/src/content/people), um arquivo seguindo este `src/content/people/nome-compacto-e-numero-da-matricula.md`:

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
  linkedin: https://www.linkedin.com/in/luizcrchaves/
  twitter: http://twitter.com/luizchavesjp
  lattes: http://lattes.cnpq.br/7165875430419020
  researchgate: https://www.researchgate.net/profile/Luiz_Rodrigues_Chaves
  email: lucachaves@gmail.com
---
```

Detalhe, vamos padronizar o `id` como sendo a sua matrícula do curso, e seria muito interessante que você declarasse os campos `name.compact`, `name.full`, `avatar`, `occupations` e principalmente o seu `addresses.linkedin` e `addresses.gihtub`.

Já as imagens do preview do projeto e do avatar dos integrantes devem ser colocadas no próprio github. A imagem de avatar dever ser colocado no seu perfil do github, e a imagem de preview do projeto deve ser adicionada no próprio repositório com a extensão `.png` e tamanho de `500x262` px.

Gostou da ideia? Então avise aos seus colegas e compartilhe seus projetos do IFPB!

