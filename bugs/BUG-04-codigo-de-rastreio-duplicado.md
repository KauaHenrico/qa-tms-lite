# Cadastros concorrentes recebem o mesmo código de rastreio

**Severidade:** Crítica
**Ambiente:** Windows, Node.js 24.13.1, `http://localhost:3001`, dados restaurados por `POST /_reset`.

## Passos para reproduzir

1. Restaurar os dados.
2. Enviar oito requisições de `POST /api/entregas` válidas em paralelo, variando apenas o nome do destinatário.
3. Comparar o campo `codigo` de cada resposta.

## Resultado esperado

Cada entrega deve receber um código único no formato `BRD-2026-XXXXX`, mesmo quando os cadastros ocorrem no mesmo instante.

## Resultado obtido

As oito respostas retornaram `201` com o mesmo código de rastreio.

## Evidência

```text
Oito POST /api/entregas enviados em paralelo, todos com corpo válido.

requisição 1: HTTP 201 | id=43 | codigo=BRD-2026-84290
requisição 2: HTTP 201 | id=44 | codigo=BRD-2026-84290
requisição 3: HTTP 201 | id=45 | codigo=BRD-2026-84290
requisição 4: HTTP 201 | id=46 | codigo=BRD-2026-84290
requisição 5: HTTP 201 | id=47 | codigo=BRD-2026-84290
requisição 6: HTTP 201 | id=48 | codigo=BRD-2026-84290
requisição 7: HTTP 201 | id=49 | codigo=BRD-2026-84290
requisição 8: HTTP 201 | id=50 | codigo=BRD-2026-84290
```

## Observações

O código é o identificador usado pelo cliente para rastrear a carga. A duplicidade pode levar uma consulta a apontar para a entrega errada.
