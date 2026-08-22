# NetStock

Protótipo estático de um sistema para inventário de ativos de redes de computadores.

## Propósito

O NetStock organiza equipamentos como roteadores, switches, servidores e pontos de acesso em uma interface única. Esta entrega concentra-se na arquitetura da informação, identidade visual e navegação entre telas; os dados apresentados são fictícios e nenhuma operação é persistida.

## Telas

- **Dashboard:** visão geral dos ativos, distribuição por categoria e atividade recente.
- **Inventário:** tabela de equipamentos com filtros visuais e situação operacional.
- **Detalhes do equipamento:** informações técnicas e histórico de um ativo.
- **Manutenção:** equipamentos aguardando reparo ou revisão.

## Benchmarking

- **NetBox:** referência em documentação de infraestrutura, IPAM e inventário de dispositivos.
- **Snipe-IT:** referência em patrimônio, responsáveis e ciclo de vida de ativos.
- **GLPI:** referência em inventário integrado a chamados e manutenção.

O NetStock combina a visão técnica do NetBox com a leitura operacional de ferramentas de patrimônio, mantendo uma interface compacta para equipes de redes.

## Identidade

O nome une *network* e *stock*. A logo representa uma caixa de inventário conectada por nós de rede. A paleta usa azul-marinho para confiança, ciano para conectividade e verde para disponibilidade.

## Como visualizar

Abra `index.html` diretamente no navegador. As páginas usam somente HTML e CSS, sem instalação de dependências ou servidor obrigatório.

## Estrutura

```text
NetStock/
├── index.html
├── inventario.html
├── equipamento.html
├── manutencao.html
├── styles.css
├── logo.svg
└── README.md
```
