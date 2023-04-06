# Projetos do IFPB

O objetivo deste repositório consiste em exibir projetos dos alunos no IFPB. Caso você ainda não possua projetos neste base, ou se você deseja atualizar alguma informação, basta fazer um Pull Request enviando os seus dados.

O primeiro passo seria incluir o dados do projeto adicionando um arquivo em `src/content/projects/titulo-do-projeto.md` seguindo este formato:

```yaml
---
title: IFPB Projects
description: Este portal tem como objetivo listar projetos construídos pelos alunos do IFPB.
preview: https://raw.githubusercontent.com/ifpb/projects/master/preview.png
page: https://ifpb.github.io/projects/
repository: https://github.com/ifpb/projects
course: cstsi
subject: ls
semester: 2023.1
campus: ifpb-jp
tags:
  - js
  - astro.js
owners:
  - 20051370420
---

```

Além da descrição do projeto, cada integrante deve incluir suas informação no arquivo `src/content/students/numero-da-matricula.md` seguindo o formato:

```yaml
---
id: 20051370420
compactName: Luiz Chaves
name: Luiz Carlos Rodrigues Chaves
email: lucachaves@gmail.com
course: cstsi
campus: ifpb-jp
avatar: https://github.com/lucachaves.png
github: https://github.com/lucachaves
linkedin: https://www.linkedin.com/in/luizcrchaves/
twitter: http://twitter.com/luizchavesjp
instagram: https://www.instagram.com/luizcrchaves/
lattes: http://lattes.cnpq.br/7165875430419020
researchgate: https://www.researchgate.net/profile/Luiz_Rodrigues_Chaves
---
```

Detalhe, vamos padronizar o `id` como sendo a sua matrícula do curso, e seria muito interessante que você declarasse os campos `compactName`, `name`, `email`, `avatar`, `course`, `campus` e principalmente o seu `linkedin` e `gihtub`.

Já as imagens do preview do projeto e do avatar dos integrantes devem ser colocadas no próprio github. A imagem de avatar dever colocado no seu perfil do github, e a imagem de preview do projeto deve ser adicionada no próprio repositório com a extensão png e tamanho de `500x262`.

Gostou da ideia? Então avise aos seus colegas e compartilhe seus projetos do IFPB!

