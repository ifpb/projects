# Projetos do IFPB

O objetivo deste repositório consiste em exibir projetos dos alunos no IFPB. Caso você ainda não possua projetos neste base, ou se você deseja atualizar alguma informação, basta fazer um Pull Request enviando os seus dados.

O primeiro passo seria incluir o dados do projeto adicionando um arquivo em `_data/projects/titulo-do-projeto.json` seguindo este formato:

```json
{
  "title": "Projects IFPB",
  "description": "Este portal tem como objetivo listar projetos construídos pelos alunos do IFPB.",
  "preview": "projects-ifpb.png",
  "demo": "https://ifpb.github.io/projects/",
  "repository": "https://github.com/ifpb/projects",
  "course": "cstsi",
  "session": "2019.1",
  "subject": "ls",
  "campus": "ifpb-jp",
  "topics": [
    "js"
  ],
  "owners": [
    20051370420
  ]
}
```

Além da descrição do projeto, cada integrante deve incluir suas informação no arquivo `_data/users/numero-da-matricula.json` seguindo o formato:

```json
{ 
  "id": "20051370420",
  "nomeCompactado": "Luiz Carlos Chaves",
  "nome": "Luiz Carlos Rodrigues Chaves",
  "email": "lucachaves@gmail.com",
  "avatar": "20051370420.jpg",
  "curso": "cstsi",
  "campus": "ifpb-jp",
  "linkedin": "https://www.linkedin.com/in/luizcrchaves/",
  "github": "https://github.com/lucachaves",
  "facebook": "https://www.facebook.com/luizcrchaves",
  "lattes": "http://lattes.cnpq.br/7165875430419020",
  "researchgate": "https://www.researchgate.net/profile/Luiz_Rodrigues_Chaves",
  "twitter": "http://twitter.com/",
  "instagram": "https://www.instagram.com/luizcrchaves/"
}
```

Detalhe, vamos padronizar o `id` como sendo a sua matrícula do curso, e seria muito interessante que você declarasse os campos `nomeCompactado`, `nome`, `email`, `avatar`, `curso`, `campus` e principalmente o seu `linkedin`.

Já as imagens do preview do projeto e do avatar dos integrantes devem ser colocadas respectivamente nas pastas `assets/thumbnails/projects/` e `assets/thumbnails/users/`, preferencialmente seguindo os tamanhos de `500x262` e de `300x300`, e as nomenclaturas de `titulo-do-projeto.jpg` e `numero-da-matricula.jpg`.

Gostou da ideia? Então compartilhe com seus colegas e compartilhe seus projetos do IFPB!
