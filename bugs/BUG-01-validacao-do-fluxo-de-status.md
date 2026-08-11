# Fluxo de status aceita transições não permitidas

**Severidade:** Crítica
**Ambiente:** Windows, Node.js 24.13.1, `http://localhost:3001`, dados restaurados por `POST /_reset`.

## Passos para reproduzir

1. Restaurar os dados.
2. Enviar `PATCH /api/entregas/5/status` com `{"status":"ENTREGUE"}`. A entrega 5 inicia em `CRIADA`.
3. Restaurar os dados e enviar `PATCH /api/entregas/2/status` com `{"status":"CANCELADA"}`. A entrega 2 inicia em `EM_TRANSITO`.
4. Restaurar os dados e enviar `PATCH /api/entregas/4/status` com `{"status":"COLETADA"}`. A entrega 4 inicia em `ENTREGUE`.

## Resultado esperado

As três requisições devem retornar `422` e não alterar a entrega. Uma entrega não pode pular etapas, não pode ser cancelada após entrar em trânsito e não pode sair de um status final.

## Resultado obtido

As três requisições retornaram `200`. A entrega 5 ficou `ENTREGUE`, a entrega 2 ficou `CANCELADA` e a entrega 4 voltou para `COLETADA`.

## Evidência

**Evidência visual:** [vídeo da reprodução](../evidencias/BUG-01-validacao-do-fluxo-de-status.mp4).

```text
PATCH /api/entregas/5/status
corpo enviado: {"status":"ENTREGUE","descricao":"Teste QA"}
HTTP 200
{"id":5,"codigo":"BRD-2026-00005","id_transportadora":2,"destinatario_nome":"Cliente 5","cidade":"Salvador","uf":"BA","status":"ENTREGUE","peso_kg":8.5,"volumes":2,"data_coleta":"2026-06-06","data_prazo":"2026-07-06","historico":[{"status":"CRIADA","data":"2026-06-06","descricao":"Entrega registrada"},{"status":"ENTREGUE","data":"2026-08-10","descricao":"Teste QA"}]}

PATCH /api/entregas/2/status
corpo enviado: {"status":"CANCELADA","descricao":"Teste QA"}
HTTP 200
{"id":2,"codigo":"BRD-2026-00002","id_transportadora":3,"destinatario_nome":"Cliente 2","cidade":"Belo Horizonte","uf":"MG","status":"CANCELADA","peso_kg":3.4,"volumes":3,"data_coleta":"2026-06-03","data_prazo":"2026-07-03","historico":[{"status":"CRIADA","data":"2026-06-03","descricao":"Entrega registrada"},{"status":"CANCELADA","data":"2026-08-10","descricao":"Teste QA"}]}

PATCH /api/entregas/4/status
corpo enviado: {"status":"COLETADA","descricao":"Teste QA"}
HTTP 200
{"id":4,"codigo":"BRD-2026-00004","id_transportadora":1,"destinatario_nome":"Cliente 4","cidade":"Porto Alegre","uf":"RS","status":"COLETADA","peso_kg":6.8,"volumes":1,"data_coleta":"2026-06-05","data_prazo":"2026-07-05","historico":[{"status":"CRIADA","data":"2026-06-05","descricao":"Entrega registrada"},{"status":"COLETADA","data":"2026-08-10","descricao":"Teste QA"}]}
```

Pela tela, a entrega `BRD-2026-00005` também foi alterada diretamente de `CRIADA` para `ENTREGUE` e recebeu esse evento no histórico.

## Cobertura automatizada

Os cenários [fluxo-status.cy.js](../automacao/cypress/e2e/fluxo-status.cy.js) e [fluxo-status-adicional.cy.js](../automacao/cypress/e2e/fluxo-status-adicional.cy.js) executam essas alterações pela tela e reproduzem o salto de etapa, o cancelamento em trânsito e a mudança de status final.

## Observações

O problema permite confirmar uma entrega que não foi coletada, cenário citado pela área de Operações. Também compromete o histórico e a confiança no status exibido.
