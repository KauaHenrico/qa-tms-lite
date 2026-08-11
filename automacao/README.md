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

| # | Cenário | Risco coberto | Por que priorizei |
|---|---|---|---|
| 1 | Impedir salto de `CRIADA` para `ENTREGUE` | Uma entrega pode ser concluída sem coleta, trânsito ou saída para entrega | É o risco operacional mais grave relatado: o status pode induzir atendimento e expedição a tomarem decisões erradas. |
| 2 | Recusar peso zero e volume fracionado no cadastro | Dados fisicamente inválidos entram na operação e comprometem expedição e cálculo de carga | O cadastro é a porta de entrada da operação; valores inválidos contaminam as informações posteriores. |
| 3 | Calcular o prazo apenas em dias úteis | O atendimento informa ao cliente uma data menor que o prazo contratado | É uma falha relatada pela Operação e afeta diretamente a promessa feita ao cliente. |
| 4 | Atualizar o total após filtro por status | O indicador da tela diverge da lista e prejudica a gestão operacional | A divergência foi relatada pela Operação e pode levar a acompanhamento incorreto do volume de entregas. |

## Observações

Cada caso restaura os dados iniciais antes de rodar para não depender da ordem
de execução. Screenshots gerados por falhas ficam fora do versionamento.

Na versão avaliada, os cinco testes falham porque encontram os comportamentos
documentados nos bugs de status, cadastro, prazo e listagem. Isso é o resultado
esperado enquanto os defeitos não forem corrigidos: as asserções representam o
contrato do README e devem passar depois da correção.
