# Plano de teste TMS Lite

## 1. Objetivo

Verificar se o TMS Lite pode ser usado pela operação para cadastrar, consultar e acompanhar entregas sem gerar informação incorreta para o cliente ou para o time interno.

## 2. Escopo

### Dentro do escopo

O escopo inclui cadastro de entregas, cálculo de prazo, geração de rastreio, fluxo de status, histórico, busca, filtros, paginação e regras de transportadoras. A validação será feita pela tela e pela API, porque parte das regras só pode ser exercitada diretamente pela API.

### Fora do escopo

Desempenho, carga, segurança, permissões de usuário e compatibilidade entre navegadores ficam fora desta rodada. O sistema não possui autenticação nem perfis de acesso e não há requisito de volume ou tempo de resposta. Feriados também não serão tratados como regra fechada, pois o README cita apenas sábado e domingo.

## 3. Ambiente

O ambiente previsto é Windows, Node.js 24.13.1, aplicação em `http://localhost:3000` e navegador Brave. Os dados são mantidos em memória e serão restaurados antes de cada cenário com `POST /_reset` ou pelo botão **Resetar dados**.

## 4. Estratégia

O README será usado como referência para o resultado esperado. A execução começará pelas regras com maior impacto operacional: status, prazo, cadastro e rastreio. Em seguida serão verificados busca, contador, paginação e transportadoras. Cada falha será confirmada pela API e, quando a ação existir na tela, também pela interface.

## 5. Riscos e priorização

| Área | Risco se falhar | Prioridade |
|---|---|---|
| Status e histórico | Entrega pode aparecer como concluída ou cancelada sem que a operação tenha ocorrido | Alta |
| Prazo de entrega | Atendimento pode repassar uma data errada ao cliente | Alta |
| Cadastro e rastreio | Dados inválidos ou rastreios repetidos dificultam atendimento e expedição | Alta |
| Busca, filtros e paginação | Operação pode deixar de localizar entregas ou tomar decisão com contagem incorreta | Alta |
| Transportadoras | Cadastro pode ser associado a parceiro inativo | Média |

## 6. Critérios de entrada e saída

O teste começa com a aplicação disponível, dados iniciais carregados e README revisado. O ciclo termina quando os cenários priorizados estiverem executados ou registrados como bloqueados, cada falha tiver evidência suficiente para reprodução e os itens fora do escopo estiverem documentados.

## 7. Cronograma

1. Revisar o relato da Operações, o desafio e o README para confirmar as regras de negócio.
2. Conferir o ambiente, iniciar a aplicação e restaurar os dados iniciais.
3. Executar os casos de status, histórico, cadastro, rastreio e prazo, pois são os cenários de maior risco.
4. Executar os casos de busca, filtros, paginação, transportadoras e contrato da API.
5. Atualizar cada caso com resultado obtido, status e referência ao bug quando houver falha.
6. Criar um arquivo em `bugs/` para cada defeito confirmado, incluindo passos, resultado esperado, resultado obtido, severidade e evidência.
7. Criar os cenários automatizados mais críticos em `automacao/`, documentar como rodar e executar a suíte.
8. Preencher `DECISOES.md` com itens fora do escopo, ambiguidades, comportamentos considerados corretos e próximos passos.
9. Preencher `RESPOSTA_OPERACAO.md` com a conclusão para a área de Operações.
10. Revisar todos os arquivos, conferir se a automação roda.