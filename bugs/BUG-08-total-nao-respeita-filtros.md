# Campo total não acompanha os filtros da listagem

**Severidade:** Média
**Ambiente:** Windows, Node.js 24.13.1, `http://localhost:3001`, dados restaurados por `POST /_reset`.

## Passos para reproduzir

1. Restaurar os dados.
2. Consultar entregas com busca por `São Paulo` e `limit=100`.
3. Consultar entregas com `status=EM_TRANSITO` e `limit=100`.
4. Consultar entregas canceladas com e sem `incluir_canceladas=true`.

## Resultado esperado

O campo `total` deve informar a quantidade de itens após a busca, filtro e regra de inclusão de canceladas.

## Resultado obtido

O campo `total` permaneceu em 42, independentemente do resultado da consulta.

## Evidência

```text
GET /api/entregas?status=CRIADA&incluir_canceladas=true&limit=100
HTTP 200 | total=42 | itens=8
GET /api/entregas?status=COLETADA&incluir_canceladas=true&limit=100
HTTP 200 | total=42 | itens=8
GET /api/entregas?status=EM_TRANSITO&incluir_canceladas=true&limit=100
HTTP 200 | total=42 | itens=9
GET /api/entregas?status=SAIU_ENTREGA&incluir_canceladas=true&limit=100
HTTP 200 | total=42 | itens=7
GET /api/entregas?status=ENTREGUE&incluir_canceladas=true&limit=100
HTTP 200 | total=42 | itens=7
GET /api/entregas?status=DEVOLVIDA&incluir_canceladas=true&limit=100
HTTP 200 | total=42 | itens=0

GET /api/entregas?status=CANCELADA&limit=100
HTTP 200 | total=42 | itens=0
GET /api/entregas?status=CANCELADA&incluir_canceladas=true&limit=100
HTTP 200 | total=42 | itens=3

GET /api/entregas?q=S%C3%A3o%20Paulo&limit=100
HTTP 200 | total=42 | itens=5
```

## Cobertura automatizada

O cenário [listagem.cy.js](../automacao/cypress/e2e/listagem.cy.js) filtra e busca pela tela, comparando o contador mostrado com as linhas exibidas.

## Observações

O contador exibido na tela pode induzir a operação a acreditar que a quantidade filtrada é maior do que a lista apresentada.
