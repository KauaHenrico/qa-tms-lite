# Paginação não retorna a quantidade solicitada

**Severidade:** Média
**Ambiente:** Windows, Node.js 24.13.1, `http://localhost:3001`, dados restaurados por `POST /_reset`.

## Passos para reproduzir

1. Restaurar os dados.
2. Consultar `GET /api/entregas?page=1&limit=10`.
3. Restaurar os dados e consultar `GET /api/entregas?limit=1`.
4. Comparar o tamanho de `itens` com o valor de `limit`.

## Resultado esperado

Cada página deve retornar exatamente o valor solicitado em `limit`, exceto a última página quando houver menos itens restantes.

## Resultado obtido

Com `limit=10`, a primeira página retornou nove itens. Com `limit=1`, a resposta não retornou nenhum item.

## Evidência

```text
GET /api/entregas?limit=10&page=1
HTTP 200 | total=42 | itens=9

GET /api/entregas?limit=1&page=1
HTTP 200 | total=42 | itens=0

GET /api/entregas?limit=100&page=1
HTTP 200 | total=42 | itens=39
```

## Observações

Itens intermediários deixam de aparecer durante a navegação entre páginas.
