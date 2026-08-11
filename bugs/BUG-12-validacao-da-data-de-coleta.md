# API aceita ou falha com datas de coleta inválidas

**Severidade:** Alta
**Ambiente:** Windows, Node.js 24.13.1, `http://localhost:3001`, dados restaurados por `POST /_reset`.

## Passos para reproduzir

1. Restaurar os dados.
2. Enviar um `POST /api/entregas` válido, com exceção de `data_coleta: "data inválida"`.
3. Restaurar os dados e repetir com `data_coleta: "2026-02-30"`.
4. Restaurar os dados e repetir com `data_coleta: "2026-13-01"`.

## Resultado esperado

Datas que não seguem o formato ou não existem no calendário devem retornar `422`, com mensagem que identifique `data_coleta`. Nenhuma entrega deve ser criada.

## Resultado obtido

Os valores textuais e com mês inválido retornaram `500`. A data impossível `2026-02-30` retornou `201`, foi mantida na entrega e gerou prazo `2026-03-05`.

## Evidência

```text
data_coleta="data inválida" -> HTTP 500 | {"erro":"Erro interno"}
data_coleta="2026-02-30" -> HTTP 201 | data_coleta=2026-02-30 | data_prazo=2026-03-05
data_coleta="2026-13-01" -> HTTP 500 | {"erro":"Erro interno"}
```

## Observações

O problema é diferente do BUG-05: aqui a entrada é inválida. No BUG-05, a data é válida, mas o prazo é calculado em dias corridos.
