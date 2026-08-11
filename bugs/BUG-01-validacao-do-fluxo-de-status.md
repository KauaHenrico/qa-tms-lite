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
CRIADA para ENTREGUE: esperado 422; obtido HTTP 200, status=ENTREGUE
EM_TRANSITO para CANCELADA: esperado 422; obtido HTTP 200, status=CANCELADA
ENTREGUE para COLETADA: esperado 422; obtido HTTP 200, status=COLETADA
```

Pela tela, a entrega `BRD-2026-00005` também foi alterada diretamente de `CRIADA` para `ENTREGUE` e recebeu esse evento no histórico.

## Observações

O problema permite confirmar uma entrega que não foi coletada, cenário citado pela área de Operações. Também compromete o histórico e a confiança no status exibido.
