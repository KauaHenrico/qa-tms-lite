# Prazo de entrega considera dias corridos

**Severidade:** Alta
**Ambiente:** Windows, Node.js 24.13.1, `http://localhost:3001`, transportadora 1 com prazo de três dias.

## Passos para reproduzir

1. Restaurar os dados.
2. Cadastrar uma entrega com transportadora 1 e coleta em `2026-07-02`.
3. Repetir com coleta em `2026-07-03`, `2026-07-04` e `2026-07-05`.
4. Conferir `data_prazo` em cada resposta.

## Resultado esperado

O prazo deve contar somente dias úteis. Para as datas testadas, o prazo esperado é `2026-07-07` para a coleta de quinta-feira e `2026-07-08` para sexta-feira, sábado e domingo.

## Resultado obtido

Os prazos retornados foram equivalentes à soma de dias corridos.

## Evidência


```text
POST /api/entregas | coleta=2026-07-02 | prazo_dias=3
HTTP 201 | data_prazo=2026-07-05 | esperado=2026-07-07

POST /api/entregas | coleta=2026-07-03 | prazo_dias=3
HTTP 201 | data_prazo=2026-07-06 | esperado=2026-07-08

POST /api/entregas | coleta=2026-07-04 | prazo_dias=3
HTTP 201 | data_prazo=2026-07-07 | esperado=2026-07-08

POST /api/entregas | coleta=2026-07-05 | prazo_dias=3
HTTP 201 | data_prazo=2026-07-08 | esperado=2026-07-08
```

## Cobertura automatizada

Os cenários [prazo-entrega.cy.js](../automacao/cypress/e2e/prazo-entrega.cy.js) e [prazo-variacoes.cy.js](../automacao/cypress/e2e/prazo-variacoes.cy.js) cadastram entregas pela tela e conferem o prazo exibido para coleta em quinta, sexta e sábado.

## Observações

O prazo exibido pode ficar antes da data prometida pela transportadora, o que leva o atendimento a informar uma previsão incorreta ao cliente.
