# Entrega inicial possui prazo incompatível com a transportadora

**Severidade:** Alta
**Ambiente:** Windows, Node.js 24.13.1, `http://localhost:3001`, dados restaurados por `POST /_reset`.

## Passos para reproduzir

1. Restaurar os dados.
2. Consultar `GET /api/entregas/1`.
3. Consultar a transportadora de id 2, que possui prazo de cinco dias úteis.
4. Calcular cinco dias úteis a partir da coleta `2026-06-02`.

## Resultado esperado

O prazo da entrega 1 deve ser `2026-06-09`.

## Resultado obtido

A entrega 1 apresenta `data_prazo: 2026-07-02`.

## Evidência

**Evidência visual:** [vídeo da entrega inicial](../evidencias/BUG-06-prazo-massa-inicial.mp4).

```text
GET /api/entregas/1
HTTP 200
{"id":1,"codigo":"BRD-2026-00001","id_transportadora":2,"destinatario_nome":"Cliente 1","cidade":"Rio de Janeiro","uf":"RJ","status":"COLETADA","peso_kg":1.7,"volumes":2,"data_coleta":"2026-06-02","data_prazo":"2026-07-02","historico":[{"status":"CRIADA","data":"2026-06-02","descricao":"Entrega registrada"}]}

Transportadora 2: prazo_dias=5
Prazo esperado: 2026-06-09
```

## Cobertura automatizada

O cenário [prazo-variacoes.cy.js](../automacao/cypress/e2e/prazo-variacoes.cy.js) abre uma entrega da massa inicial pela tela e confere o prazo contra o prazo contratado da transportadora.

## Observações

Mesmo sem criar novas entregas, a tela já apresenta prazo incorreto para registros existentes.
