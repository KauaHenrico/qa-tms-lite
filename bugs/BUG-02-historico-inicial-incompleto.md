# Entregas iniciais em status avançado não têm histórico compatível

**Severidade:** Alta
**Ambiente:** Windows, Node.js 24.13.1, `http://localhost:3001`, dados restaurados por `POST /_reset`.

## Passos para reproduzir

1. Restaurar os dados.
2. Consultar as entregas iniciais de `id=1` a `id=42`.
3. Separar as entregas cujo status é diferente de `CRIADA`.
4. Comparar o status atual com os itens do histórico de cada uma.

## Resultado esperado

Toda entrega que já inicia em um status posterior a `CRIADA` deve ter no histórico as etapas que levaram ao status atual, permitindo auditar coleta, trânsito e saída para entrega.

## Resultado obtido

A massa inicial possui 42 entregas. Destas, 34 começam em um status diferente de `CRIADA`; todas as 34 possuem somente o registro `CRIADA` no histórico. A entrega 4, em `ENTREGUE`, é apenas um exemplo do problema.

## Evidência

**Evidência visual:** [vídeo da consulta ao histórico](../evidencias/BUG-02-historico-inicial-incompleto.mp4).

```text
total de entregas iniciais=42
entregas com status diferente de CRIADA=34
dessas, com histórico somente CRIADA=34

amostra:
id=1 | status=COLETADA | histórico=CRIADA
id=2 | status=EM_TRANSITO | histórico=CRIADA
id=3 | status=SAIU_ENTREGA | histórico=CRIADA
id=4 | status=ENTREGUE | histórico=CRIADA
```

## Cobertura automatizada

O cenário [fluxo-status-adicional.cy.js](../automacao/cypress/e2e/fluxo-status-adicional.cy.js) abre a entrega 4 pela tela e confere se o histórico apresenta o status `ENTREGUE`.

## Observações

O problema está na massa inicial, não em um destinatário específico. A operação não consegue confirmar como 34 entregas chegaram ao status atual. É necessário corrigir ou carregar o histórico correspondente para todos esses registros.
