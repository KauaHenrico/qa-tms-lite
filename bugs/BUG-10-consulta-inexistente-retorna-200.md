# Consulta de entrega inexistente retorna sucesso

**Severidade:** Média
**Ambiente:** Windows, Node.js 24.13.1, `http://localhost:3001`, dados restaurados por `POST /_reset`.

## Passos para reproduzir

1. Restaurar os dados.
2. Enviar `GET /api/entregas/99999`.

## Resultado esperado

Resposta `404` no formato `{ "erro": "..." }` para uma entrega inexistente.

## Resultado obtido

Resposta `200` com corpo vazio `{}`.

## Evidência

```text
esperado HTTP 404
obtido HTTP 200
corpo={}
```

## Observações

Clientes da API não conseguem diferenciar uma entrega inexistente de uma resposta válida sem conteúdo.
