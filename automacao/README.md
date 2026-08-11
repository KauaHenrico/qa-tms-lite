# Automação

## Ferramenta escolhida

Cypress foi escolhido para executar cenários ponta a ponta pela API, usando o
mesmo servidor que atende a interface. A ferramenta permite conferir código de
resposta e conteúdo retornado em cada regra crítica.

## Pré-requisitos

Node.js 18 ou superior. Depois de clonar o repositório, instale as dependências:

```bash
npm install
```

## Como rodar

Com um único comando, a aplicação é iniciada, a suíte é executada e o processo
do servidor é encerrado ao fim:

```bash
npm run test:e2e
```

Para abrir o Cypress de forma visual, inicie a aplicação em um terminal com
`npm start` e, em outro, execute `npm run cypress:open`.

## Cenários automatizados

Os cenários e sua justificativa serão registrados junto às respectivas suítes.

## Observações

Cada caso restaura os dados iniciais antes de rodar para não depender da ordem
de execução. Screenshots gerados por falhas ficam fora do versionamento.
