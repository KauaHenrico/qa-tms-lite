# Automação

## Ferramenta escolhida

Cypress foi escolhido para executar cenários ponta a ponta pela interface web,
simulando as ações de quem usa o sistema. Cada teste abre a página, preenche ou
seleciona campos, aciona botões e confere o resultado apresentado na tela.

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

Esse comando já abre e encerra o servidor. Antes de usá-lo, não deixe outro
`npm start` rodando na porta 3000.

Para abrir o Cypress de forma visual, inicie a aplicação em um terminal com
`npm start` e, em outro, execute `npm run cypress:open`.

## Cenários automatizados

| # | Cenário | Risco coberto | Por que priorizei |
|---|---|---|---|
| 1 | Pela tela, impedir salto de `CRIADA` para `ENTREGUE` | Uma entrega pode ser concluída sem coleta, trânsito ou saída para entrega | É o risco operacional mais grave relatado: o status pode induzir atendimento e expedição a tomarem decisões erradas. |
| 2 | Pela tela, tentar cadastrar peso zero e volume fracionado | Dados fisicamente inválidos entram na operação e comprometem expedição e cálculo de carga | O cadastro é a porta de entrada da operação; valores inválidos contaminam as informações posteriores. |
| 3 | Pela tela, cadastrar e conferir o prazo em dias úteis | O atendimento informa ao cliente uma data menor que o prazo contratado | É uma falha relatada pela Operação e afeta diretamente a promessa feita ao cliente. |
| 4 | Pela tela, filtrar status e conferir o total apresentado | O indicador da tela diverge da lista e prejudica a gestão operacional | A divergência foi relatada pela Operação e pode levar a acompanhamento incorreto do volume de entregas. |

## Observações

Cada caso restaura os dados iniciais antes de rodar para não depender da ordem
de execução. Screenshots gerados por falhas ficam fora do versionamento.

Na versão avaliada, quatro testes falham porque encontram os comportamentos
documentados nos bugs de status, cadastro, prazo e listagem. O caso de volume
fracionado passa porque a própria tela impede o envio de número não inteiro.
As falhas não são instabilidade: as asserções representam o contrato do README
e devem passar depois da correção.
