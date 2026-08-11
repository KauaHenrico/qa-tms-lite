# Formulário não identifica os campos obrigatórios

**Severidade:** Média
**Ambiente:** Windows, Node.js 24.13.1, `http://localhost:3001`, dados restaurados por `POST /_reset`.

## Passos para reproduzir

1. Abrir a seção **Nova entrega**.
2. Comparar os campos obrigatórios do README com os rótulos exibidos no formulário.
3. Inspecionar os campos de destinatário, cidade, UF, transportadora, peso e volumes.

## Resultado esperado

Os seis campos obrigatórios devem ser claramente identificados na tela, por exemplo com `*` no rótulo e atributo `required` ou `aria-required="true"` no controle.

## Resultado obtido

Nenhum dos rótulos possui `*`. Os seis controles obrigatórios estão sem atributo `required` e sem `aria-required`. A pessoa usuária só descobre a obrigatoriedade após tentar enviar o formulário.

## Evidência

**Evidência visual:** [vídeo do formulário](../evidencias/BUG-11-campos-obrigatorios.mp4).

```text
destinatario_nome | required=false | aria-required=null
cidade            | required=false | aria-required=null
uf                | required=false | aria-required=null
id_transportadora | required=false | aria-required=null
peso_kg           | required=false | aria-required=null
volumes           | required=false | aria-required=null
```

## Cobertura automatizada

O cenário [cadastro.cy.js](../automacao/cypress/e2e/cadastro.cy.js) inspeciona individualmente os seis controles obrigatórios da tela.

## Observações

`data_coleta` é opcional segundo o README e, por isso, não deve receber marcação de campo obrigatório.
