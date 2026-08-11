# Busca diferencia acentuação e letras maiúsculas

**Severidade:** Média
**Ambiente:** Windows, Node.js 24.13.1, `http://localhost:3001`, dados restaurados por `POST /_reset`.

## Passos para reproduzir

1. Restaurar os dados.
2. Consultar `GET /api/entregas?q=sao%20paulo`.
3. Consultar `GET /api/entregas?q=S%C3%83O%20PAULO`.
4. Comparar com `GET /api/entregas?q=S%C3%A3o%20Paulo`.

## Resultado esperado

As três buscas devem retornar as mesmas cinco entregas de São Paulo.

## Resultado obtido

Somente a busca com grafia e caixa exatas retornou resultados.

## Evidência

```text
GET /api/entregas?q=sao%20paulo&limit=100
HTTP 200
{"total":42,"itens":[]}

GET /api/entregas?q=S%C3%83O%20PAULO&limit=100
HTTP 200
{"total":42,"itens":[]}
```

## Cobertura automatizada

O cenário [listagem.cy.js](../automacao/cypress/e2e/listagem.cy.js) digita `cliente 5` e `Sao Paulo` no campo de busca da tela e confirma que nenhuma entrega é encontrada.

## Observações

A regra documentada exige que a busca ignore acentuação e diferença entre maiúsculas e minúsculas.
