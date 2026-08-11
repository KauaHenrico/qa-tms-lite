# Cadastro aceita dados inválidos de entrega

**Severidade:** Alta
**Ambiente:** Windows, Node.js 24.13.1, `http://localhost:3001`, dados restaurados por `POST /_reset`.

## Passos para reproduzir

1. Restaurar os dados.
2. Enviar um cadastro válido, alterando apenas os campos abaixo em tentativas separadas:
   `destinatario_nome`, `cidade` e `uf` com espaços; `peso_kg` igual a `0` ou `-1`; `volumes` igual a `0`, `-1`, `1.5` ou `abc`; peso ou volumes ausentes.
3. Conferir o status HTTP e a entrega criada.

## Resultado esperado

Campos textuais com espaços devem ser recusados. Peso deve ser maior que zero. Volumes deve ser inteiro e no mínimo um. Campos numéricos obrigatórios ausentes ou em formato inválido devem retornar `422` e não criar entrega.

## Resultado obtido

Os cadastros com espaços, peso zero, peso negativo, volumes zero, negativos, fracionários, textuais e campos numéricos ausentes retornaram `201`.

## Evidência

**Evidência visual:** [vídeo do cadastro inválido aceito](../evidencias/BUG-03-validacao-de-cadastro.mp4).

```text
campos com espaços: esperado 422; obtido HTTP 201
peso 0: HTTP 201; peso -1: HTTP 201
volumes 0: HTTP 201; volumes -1: HTTP 201; volumes 1.5: HTTP 201
volume abc: HTTP 201; peso ausente: HTTP 201; volumes ausentes: HTTP 201
```

Pela tela, peso `0` retornou mensagem de sucesso e limpou os campos do formulário.

## Cobertura automatizada

Os cenários [cadastro-entrega.cy.js](../automacao/cypress/e2e/cadastro-entrega.cy.js) e [cadastro-campos.cy.js](../automacao/cypress/e2e/cadastro-campos.cy.js) preenchem o formulário, clicam em **Cadastrar entrega** e reproduzem os casos de espaços, pesos inválidos, volumes zero ou negativos, campos numéricos vazios e limpeza indevida dos valores. O navegador bloqueia volume fracionário na tela; a aceitação desse valor pela API permanece registrada na evidência manual acima.

## Observações

O sistema passa a armazenar cargas impossíveis ou incompletas. Isso afeta cálculo operacional, expedição e atendimento. A falha da tela decorre da mesma validação ausente no cadastro.
