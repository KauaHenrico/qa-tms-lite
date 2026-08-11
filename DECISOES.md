# Decisões

## 1. O que ficou de fora

| Item não coberto | Por quê | Risco de deixar assim |
|---|---|---|
| Desempenho, carga e concorrência em grande volume | Não há requisito de volume, tempo de resposta ou quantidade de usuários simultâneos. | Médio: lentidão ou comportamento sob carga ainda não foi medido. |
| Segurança, autenticação e permissões | A aplicação não possui login, perfis ou controle de acesso no escopo fornecido. | Médio: esse tema precisa entrar quando houver usuários e dados reais. |
| Compatibilidade entre navegadores | A execução manual foi feita no Brave e a automação usou o navegador do Cypress. Não houve matriz de navegadores. | Baixo neste ciclo: diferenças visuais ou de validação nativa podem existir em outros navegadores. |
| Feriados no prazo | O README define apenas sábado e domingo como dias não úteis. | Baixo enquanto a regra não incluir calendário de feriados. |

## 2. Ambiguidades e interpretações

O cálculo de prazo considerou somente sábado e domingo como dias não úteis. Essa foi a interpretação adotada porque é a única regra documentada; feriados devem ser incluídos apenas se a Operação definir o calendário aplicável.

A busca foi validada por código, parte do nome e cidade. A regra de ignorar caixa e acentuação foi tratada como obrigatória, pois está descrita de forma explícita no README.

O README define seis campos obrigatórios, mas não determina como a tela deve indicá-los. Registrei a ausência de marcação e do atributo `required` como problema de usabilidade de severidade média: a regra existe, porém a pessoa usuária só a descobre depois de tentar enviar o formulário.

## 3. Comportamentos que investiguei e considerei corretos

O caminho válido de status até `ENTREGUE` e a ramificação `SAIU_ENTREGA → DEVOLVIDA` funcionaram quando executados pela tela.

Entregas canceladas ficam ocultas por padrão e aparecem ao marcar **incluir canceladas**. Esse comportamento está de acordo com a regra documentada.

O formulário apresenta apenas transportadoras ativas e exibe o CNPJ sem máscara. Também foi confirmado que o navegador bloqueia volume fracionado antes do envio do formulário.

## 4. Critério de severidade

**Crítica** foi usada quando a falha pode concluir, cancelar ou rastrear a entrega errada, afetando diretamente a operação e o cliente. **Alta** cobre informação operacional incorreta, cadastro inválido ou prazo errado que exige conferência manual. **Média** abrange busca, contador, paginação e orientação da tela, que prejudicam o trabalho mas têm alternativa de conferência. Não houve achado classificado como baixo.

## 5. O que eu faria com mais tempo

1. Retestar cada bug depois da correção e manter os cenários Cypress como regressão.
2. Exercitar parâmetros inválidos e limites do contrato da API, incluindo páginas, limites e datas.
3. Definir com a Operação o tratamento de feriados e automatizar o calendário acordado.
4. Executar testes de carga e concorrência com volume próximo ao uso real.
5. Avaliar acessibilidade e compatibilidade em outros navegadores.

## 6. Recomendação de evolução

Implementar contas individuais para administradores e demais pessoas que cadastram ou atualizam entregas. Cada criação, alteração de status, cancelamento e edição deve registrar quem realizou a ação, quando ela ocorreu e quais dados foram modificados. Esse histórico de auditoria facilita a investigação de divergências, evita alterações sem responsável identificado e dá mais segurança para a Operação usar o sistema como fonte de consulta.
