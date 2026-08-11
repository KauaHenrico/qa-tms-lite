# Casos de teste: TMS Lite

## 1. Fluxo de status e histórico

### CT 01: Concluir a sequência válida até entregue

| | |
|---|---|
| **Funcionalidade** | Fluxo de status e histórico |
| **Prioridade** | Alta |
| **Tipo** | Positivo |
| **Camada** | API |

**Pré condição:** dados resetados; entrega `id=5` em `CRIADA`.

**Passos:**
1. Alterar o status para `COLETADA`.
2. Alterar para `EM_TRANSITO`.
3. Alterar para `SAIU_ENTREGA`.
4. Alterar para `ENTREGUE`.
5. Conferir o histórico.

**Resultado esperado:** cada alteração deve retornar `200`. O histórico deve registrar as cinco etapas, incluindo o cadastro inicial.

**Resultado obtido:** As quatro alterações retornaram `200`; a entrega terminou em `ENTREGUE` e o histórico ficou com cinco registros.

**Status:** Passou

**Bug relacionado:** Não há.

### CT 02: Concluir a sequência válida com devolução

| | |
|---|---|
| **Funcionalidade** | Fluxo de status e histórico |
| **Prioridade** | Alta |
| **Tipo** | Positivo |
| **Camada** | API |

**Pré condição:** dados resetados; entrega `id=5` em `CRIADA`.

**Passos:**
1. Alterar o status para `COLETADA`.
2. Alterar para `EM_TRANSITO`.
3. Alterar para `SAIU_ENTREGA`.
4. Alterar para `DEVOLVIDA`.
5. Conferir o histórico.

**Resultado esperado:** cada alteração deve retornar `200`. A etapa final deve ser `DEVOLVIDA` e o histórico deve registrar todo o caminho.

**Resultado obtido:** As quatro alterações retornaram `200`; a entrega terminou em `DEVOLVIDA` e o histórico registrou todo o fluxo.

**Status:** Passou

**Bug relacionado:** Não há.

### CT 03: Avançar uma etapa válida do fluxo de status

| | |
|---|---|
| **Funcionalidade** | Status e histórico |
| **Prioridade** | Alta |
| **Tipo** | Positivo |
| **Camada** | API |

**Pré-condição:** dados resetados; entrega `id=5` em `CRIADA`.

**Passos:**
1. Enviar `PATCH /api/entregas/5/status` com corpo `{"status":"COLETADA","descricao":"Coletado na origem"}`.
2. Consultar a entrega retornada.

**Resultado esperado:** resposta `200`, status `COLETADA` e novo item no histórico com o status, a data e a descrição informada.

**Resultado obtido:** A alteração para `COLETADA` retornou `200` e foi incluída no histórico.

**Status:** Passou

**Bug relacionado:** Não há.

### CT 04: Permitir cancelamento enquanto a entrega está `CRIADA`

| | |
|---|---|
| **Funcionalidade** | Status e cancelamento |
| **Prioridade** | Alta |
| **Tipo** | Positivo |
| **Camada** | API |

**Pré-condição:** dados resetados; entrega `id=5` em `CRIADA`.

**Passos:**
1. Enviar `PATCH /api/entregas/5/status` com `{"status":"CANCELADA"}`.

**Resultado esperado:** resposta `200`, status `CANCELADA` e registro no histórico.

**Resultado obtido:** O cancelamento da entrega em `CRIADA` retornou `200` e criou o registro no histórico.

**Status:** Passou

**Bug relacionado:** Não há.

### CT 05: Permitir cancelamento enquanto a entrega está `COLETADA`

| | |
|---|---|
| **Funcionalidade** | Status e cancelamento |
| **Prioridade** | Alta |
| **Tipo** | Positivo |
| **Camada** | API |

**Pré-condição:** dados resetados; entrega `id=5` em `CRIADA`.

**Passos:**
1. Alterar a entrega `5` para `COLETADA`.
2. Alterar a mesma entrega para `CANCELADA`.

**Resultado esperado:** ambas as alterações devem retornar `200`; o cancelamento é permitido até `COLETADA`.

**Resultado obtido:** Após a coleta, o cancelamento retornou `200` e o histórico foi atualizado.

**Status:** Passou

**Bug relacionado:** Não há.

### CT 06: Impedir salto de `CRIADA` para `ENTREGUE`

| | |
|---|---|
| **Funcionalidade** | Status e histórico |
| **Prioridade** | Alta |
| **Tipo** | Negativo |
| **Camada** | API |

**Pré-condição:** dados resetados; entrega `id=5` em `CRIADA`.

**Passos:**
1. Enviar `PATCH /api/entregas/5/status` com corpo `{"status":"ENTREGUE","descricao":"Teste QA"}`.
2. Consultar a entrega e seu histórico.

**Resultado esperado:** resposta `422`; a entrega deve permanecer em `CRIADA` e o histórico não pode ser alterado, pois não é permitido pular etapas.

**Resultado obtido:** A API retornou `200` e alterou diretamente o status para `ENTREGUE`.

**Status:** Falhou

**Bug relacionado:** `bugs/BUG-01-validacao-do-fluxo-de-status.md`.

### CT 07: Impedir cancelamento após a entrada em trânsito

| | |
|---|---|
| **Funcionalidade** | Status e cancelamento |
| **Prioridade** | Alta |
| **Tipo** | Negativo |
| **Camada** | API |

**Pré-condição:** dados resetados; entrega `id=2` em `EM_TRANSITO`.

**Passos:**
1. Enviar `PATCH /api/entregas/2/status` com `{"status":"CANCELADA","descricao":"Teste QA"}`.

**Resultado esperado:** resposta `422`; a entrega deve continuar em `EM_TRANSITO` e não deve ganhar histórico de cancelamento.

**Resultado obtido:** A API retornou `200` e cancelou a entrega que estava em `EM_TRANSITO`.

**Status:** Falhou

**Bug relacionado:** `bugs/BUG-01-validacao-do-fluxo-de-status.md`.

### CT 08: Impedir alteração de status final

| | |
|---|---|
| **Funcionalidade** | Status e histórico |
| **Prioridade** | Alta |
| **Tipo** | Negativo |
| **Camada** | API |

**Pré-condição:** dados resetados; entrega `id=4` em `ENTREGUE`.

**Passos:**
1. Enviar `PATCH /api/entregas/4/status` com `{"status":"COLETADA","descricao":"Teste QA"}`.

**Resultado esperado:** resposta `422`; `ENTREGUE` é status final e a entrega não pode mudar.

**Resultado obtido:** A API retornou `200` e mudou uma entrega `ENTREGUE` para `COLETADA`.

**Status:** Falhou

**Bug relacionado:** `bugs/BUG-01-validacao-do-fluxo-de-status.md`.

### CT 09: Rejeitar status inexistente

| | |
|---|---|
| **Funcionalidade** | Status |
| **Prioridade** | Média |
| **Tipo** | Negativo |
| **Camada** | API |

**Pré-condição:** dados resetados; entrega `id=5` existente.

**Passos:**
1. Enviar `PATCH /api/entregas/5/status` com `{"status":"INVALIDO"}`.

**Resultado esperado:** resposta `422` com erro indicando status inválido; a entrega não é alterada.

**Resultado obtido:** A API retornou `422` com a mensagem `Status inválido: INVALIDO`.

**Status:** Passou

**Bug relacionado:** Não há.

### CT 10: Exibir histórico coerente para as entregas iniciais fora de `CRIADA`

| | |
|---|---|
| **Funcionalidade** | Histórico |
| **Prioridade** | Alta |
| **Tipo** | Integridade de dados |
| **Camada** | API e UI |

**Pré-condição:** dados resetados; massa inicial carregada.

**Passos:**
1. Consultar as entregas iniciais de `id=1` a `id=42`.
2. Selecionar as entregas com status diferente de `CRIADA`.
3. Conferir o status e os itens de `historico` de cada uma.

**Resultado esperado:** cada entrega em status posterior a `CRIADA` deve conter os registros das mudanças aceitas que a levaram ao estado atual, permitindo rastrear coleta, trânsito e saída para entrega.

**Resultado obtido:** Das 42 entregas iniciais, 34 começam em status diferente de `CRIADA`; todas as 34 possuem somente `CRIADA` no histórico. A entrega `id=4` é um exemplo.

**Status:** Falhou

**Bug relacionado:** `bugs/BUG-02-historico-inicial-incompleto.md`.

### CT 11: Impedir salto de status pela interface web

| | |
|---|---|
| **Funcionalidade** | UI de alteração de status |
| **Prioridade** | Alta |
| **Tipo** | Negativo / ponta a ponta |
| **Camada** | UI |

**Pré-condição:** dados resetados; entrega `BRD-2026-00005` em `CRIADA`.

**Passos:**
1. Abrir a entrega `BRD-2026-00005` na tabela.
2. Selecionar `ENTREGUE` no campo **Alterar status**.
3. Conferir o status e o histórico apresentados no detalhe.

**Resultado esperado:** a tela deve informar que a transição não é permitida; o status deve permanecer `CRIADA`.

**Resultado obtido:** Pela tela, a entrega `BRD-2026-00005` foi alterada de `CRIADA` para `ENTREGUE` e o evento foi gravado no histórico.

**Status:** Falhou

**Bug relacionado:** `bugs/BUG-01-validacao-do-fluxo-de-status.md`.

## 2. Cadastro e rastreio

### CT 12: Cadastrar entrega válida com transportadora ativa

| | |
|---|---|
| **Funcionalidade** | Cadastro de entrega |
| **Prioridade** | Alta |
| **Tipo** | Positivo |
| **Camada** | UI e API |

**Pré-condição:** dados resetados; transportadora `id=1` ativa.

**Passos:**
1. Preencher destinatário, cidade, UF, peso `1`, volumes `1`, transportadora `1` e uma data de coleta válida.
2. Cadastrar a entrega.

**Resultado esperado:** resposta `201`; entrega criada em `CRIADA`, com código de rastreio e histórico inicial.

**Resultado obtido:** O cadastro retornou `201`, com código de rastreio preenchido e status inicial `CRIADA`.

**Status:** Passou

**Bug relacionado:** Não há.

### CT 13: Rejeitar campo obrigatório ausente

| | |
|---|---|
| **Funcionalidade** | Cadastro de entrega |
| **Prioridade** | Alta |
| **Tipo** | Negativo |
| **Camada** | API |

**Pré-condição:** dados resetados.

**Passos:**
1. Enviar tentativas separadas com todos os campos válidos, deixando vazio `id_transportadora`, `destinatario_nome`, `cidade` e `uf`.

**Resultado esperado:** resposta `422`, mensagem que identifique o campo e nenhuma entrega criada.

**Resultado obtido:** A API retornou `422` para `id_transportadora`, `destinatario_nome`, `cidade` e `uf` vazios, identificando cada campo na mensagem.

**Status:** Passou

**Bug relacionado:** Não há.

### CT 14: Rejeitar campos textuais preenchidos apenas com espaços

| | |
|---|---|
| **Funcionalidade** | Cadastro de entrega |
| **Prioridade** | Alta |
| **Tipo** | Negativo / limite |
| **Camada** | UI e API |

**Pré-condição:** dados resetados.

**Passos:**
1. Preencher destinatário, cidade e UF com espaços em branco.
2. Informar transportadora ativa, peso `1` e volumes `1`.
3. Cadastrar.

**Resultado esperado:** resposta `422`; campos textuais em branco ou somente espaços não são válidos.

**Resultado obtido:** O cadastro com campos contendo apenas espaços retornou `201`.

**Status:** Falhou

**Bug relacionado:** `bugs/BUG-03-validacao-de-cadastro.md`.

### CT 15: Rejeitar transportadora inativa

| | |
|---|---|
| **Funcionalidade** | Cadastro e transportadoras |
| **Prioridade** | Alta |
| **Tipo** | Negativo |
| **Camada** | API |

**Pré-condição:** dados resetados; transportadora `id=5` inativa.

**Passos:**
1. Enviar cadastro válido usando `id_transportadora: 5`.

**Resultado esperado:** resposta `422` indicando que a transportadora está inativa; nenhuma entrega é criada.

**Resultado obtido:** A API retornou `422` para a transportadora inativa.

**Status:** Passou

**Bug relacionado:** Não há.

### CT 16: Retornar erro para transportadora inexistente

| | |
|---|---|
| **Funcionalidade** | Cadastro e transportadoras |
| **Prioridade** | Média |
| **Tipo** | Negativo |
| **Camada** | API |

**Pré-condição:** dados resetados.

**Passos:**
1. Enviar cadastro válido usando `id_transportadora: 999`.

**Resultado esperado:** resposta `404` e nenhuma entrega criada.

**Resultado obtido:** A API retornou `404` para a transportadora inexistente.

**Status:** Passou

**Bug relacionado:** Não há.

### CT 17: Rejeitar peso zero e negativo

| | |
|---|---|
| **Funcionalidade** | Cadastro de entrega |
| **Prioridade** | Alta |
| **Tipo** | Negativo / limite |
| **Camada** | UI e API |

**Pré-condição:** dados resetados.

**Passos:**
1. Tentar cadastrar uma entrega válida, exceto por `peso_kg: 0`.
2. Resetar os dados.
3. Repetir com `peso_kg: -1`.

**Resultado esperado:** ambos os cadastros devem retornar `422`, pois o peso precisa ser maior que zero.

**Resultado obtido:** Os cadastros com peso `0` e `-1` retornaram `201`.

**Status:** Falhou

**Bug relacionado:** `bugs/BUG-03-validacao-de-cadastro.md`.

### CT 18: Rejeitar volumes zero, negativos e fracionários

| | |
|---|---|
| **Funcionalidade** | Cadastro de entrega |
| **Prioridade** | Alta |
| **Tipo** | Negativo / limite |
| **Camada** | API |

**Pré-condição:** dados resetados.

**Passos:**
1. Tentar cadastrar uma entrega com `volumes: 0`.
2. Resetar e repetir com `volumes: -1`.
3. Resetar e repetir com `volumes: 1.5`.

**Resultado esperado:** cada tentativa deve retornar `422`, pois volumes é inteiro e tem mínimo `1`.

**Resultado obtido:** Os cadastros com volumes `0`, `-1` e `1.5` retornaram `201`.

**Status:** Falhou

**Bug relacionado:** `bugs/BUG-03-validacao-de-cadastro.md`.

### CT 19: Validar peso e volumes em valores de limite

| | |
|---|---|
| **Funcionalidade** | Cadastro de entrega |
| **Prioridade** | Alta |
| **Tipo** | Limite e negativo |
| **Camada** | API |

**Pré condição:** dados resetados; transportadora ativa disponível.

**Passos:**
1. Cadastrar uma entrega com peso `0.01` e volumes `1`.
2. Tentar cadastrar com volumes `-1`.
3. Tentar cadastrar com volumes em formato textual, por exemplo `abc`.
4. Tentar cadastrar sem peso e, em outra tentativa, sem volumes.
5. Repetir as duas tentativas informando peso e volumes como texto vazio.

**Resultado esperado:** o cadastro com peso `0.01` deve ser aceito. As demais tentativas devem retornar `422` e não criar entrega.

**Resultado obtido:** O peso `0.01` foi aceito, porém volume textual, peso ausente, volumes ausentes, peso vazio e volumes vazios também retornaram `201`. Os valores vazios foram gravados como `0`.

**Status:** Falhou

**Bug relacionado:** `bugs/BUG-03-validacao-de-cadastro.md`.

### CT 20: Garantir unicidade do código de rastreio sob cadastros simultâneos

| | |
|---|---|
| **Funcionalidade** | Código de rastreio |
| **Prioridade** | Alta |
| **Tipo** | Concorrência / limite |
| **Camada** | API |

**Pré-condição:** dados resetados.

**Passos:**
1. Enviar oito requisições de cadastro válidas em paralelo, variando apenas o nome do destinatário.
2. Comparar os códigos retornados.

**Resultado esperado:** as oito respostas `201` devem conter códigos distintos no formato `BRD-2026-XXXXX`.

**Resultado obtido:** Oito cadastros simultâneos retornaram `201` com o mesmo código `BRD-2026-84290`.

**Status:** Falhou

**Bug relacionado:** `bugs/BUG-04-codigo-de-rastreio-duplicado.md`.

### CT 21: Mostrar erro e manter os valores do formulário

| | |
|---|---|
| **Funcionalidade** | Cadastro pela tela |
| **Prioridade** | Média |
| **Tipo** | Negativo / usabilidade |
| **Camada** | UI |

**Pré condição:** dados resetados; formulário de cadastro aberto.

**Passos:**
1. Preencher todos os dados válidos, exceto peso `0`.
2. Enviar o formulário.
3. Conferir a mensagem apresentada e os valores dos campos.

**Resultado esperado:** a tela deve informar que o peso é inválido, não criar a entrega e manter os dados preenchidos para correção.

**Resultado obtido:** Pela tela, o cadastro com peso `0` exibiu confirmação de sucesso e limpou os campos do formulário.

**Status:** Falhou

**Bug relacionado:** `bugs/BUG-03-validacao-de-cadastro.md`.

## 3. Prazo de entrega

### CT 22: Calcular prazo considerando apenas dias úteis

| | |
|---|---|
| **Funcionalidade** | Prazo de entrega |
| **Prioridade** | Alta |
| **Tipo** | Regra de negócio / limite de data |
| **Camada** | UI e API |

**Pré-condição:** dados resetados; transportadora `id=1` com prazo de 3 dias.

**Passos:**
1. Cadastrar uma entrega com coleta em `2026-07-02` (quinta-feira), peso `1` e volumes `1`.
2. Conferir `data_prazo` na resposta e na tabela.

**Resultado esperado:** `2026-07-07`; devem ser contados sexta, segunda e terça, sem sábado e domingo.

**Resultado obtido:** Para coleta em `2026-07-02` e prazo de três dias, a API retornou `2026-07-05`; o esperado era `2026-07-07`.

**Status:** Falhou

**Bug relacionado:** `bugs/BUG-05-calculo-de-prazo-em-dias-corridos.md`.

### CT 23: Exibir prazo compatível com a transportadora em entrega já existente

| | |
|---|---|
| **Funcionalidade** | Prazo de entrega e massa inicial |
| **Prioridade** | Alta |
| **Tipo** | Integridade de dados |
| **Camada** | UI e API |

**Pré-condição:** dados resetados; entrega `id=1` usa a transportadora `id=2`, de prazo de 5 dias úteis.

**Passos:**
1. Consultar a entrega `id=1`.
2. Considerar a coleta `2026-06-02` (terça-feira) e calcular cinco dias úteis: 03, 04, 05, 08 e 09/06.

**Resultado esperado:** `data_prazo` igual a `2026-06-09`.

**Resultado obtido:** A entrega inicial `id=1`, com coleta em `2026-06-02`, informou prazo `2026-07-02`; o esperado era `2026-06-09`.

**Status:** Falhou

**Bug relacionado:** `bugs/BUG-06-prazo-incorreto-na-massa-inicial.md`.

### CT 24: Calcular prazo para coleta em sexta feira

| | |
|---|---|
| **Funcionalidade** | Prazo de entrega |
| **Prioridade** | Alta |
| **Tipo** | Limite de data |
| **Camada** | API |

**Pré condição:** dados resetados; transportadora `id=1`, com prazo de três dias úteis.

**Passos:**
1. Cadastrar uma entrega com data de coleta `2026-07-03`, sexta feira.
2. Conferir a data de prazo retornada.

**Resultado esperado:** o prazo deve ser `2026-07-08`, contando segunda, terça e quarta.

**Resultado obtido:** Para coleta em `2026-07-03`, a API retornou `2026-07-06`; o esperado era `2026-07-08`.

**Status:** Falhou

**Bug relacionado:** `bugs/BUG-05-calculo-de-prazo-em-dias-corridos.md`.

### CT 25: Calcular prazo para coleta no sábado e no domingo

| | |
|---|---|
| **Funcionalidade** | Prazo de entrega |
| **Prioridade** | Alta |
| **Tipo** | Limite de data |
| **Camada** | API |

**Pré condição:** dados resetados; transportadora `id=1`, com prazo de três dias úteis.

**Passos:**
1. Cadastrar uma entrega com coleta em `2026-07-04`, sábado.
2. Resetar e repetir com coleta em `2026-07-05`, domingo.
3. Conferir o prazo nas duas respostas.

**Resultado esperado:** nas duas situações, o prazo deve ser `2026-07-08`, pois a contagem começa na segunda feira.

**Resultado obtido:** Para sábado, retornou `2026-07-07` em vez de `2026-07-08`; para domingo, retornou `2026-07-08`.

**Status:** Falhou

**Bug relacionado:** `bugs/BUG-05-calculo-de-prazo-em-dias-corridos.md`.

## 4. Listagem, busca, filtros e paginação

### CT 26: Ocultar canceladas da listagem padrão

| | |
|---|---|
| **Funcionalidade** | Listagem de entregas |
| **Prioridade** | Média |
| **Tipo** | Positivo |
| **Camada** | API e UI |

**Pré-condição:** dados resetados; massa contém três entregas canceladas.

**Passos:**
1. Consultar `GET /api/entregas?limit=100` sem `incluir_canceladas`.
2. Conferir os status retornados.

**Resultado esperado:** nenhuma entrega `CANCELADA` deve estar nos itens da listagem padrão.

**Resultado obtido:** A listagem padrão retornou 39 entregas, sem nenhuma com status `CANCELADA`.

**Status:** Passou

**Bug relacionado:** Não há.

### CT 27: Incluir canceladas quando solicitado

| | |
|---|---|
| **Funcionalidade** | Listagem de entregas |
| **Prioridade** | Média |
| **Tipo** | Positivo |
| **Camada** | API e UI |

**Pré-condição:** dados resetados; massa contém três entregas canceladas.

**Passos:**
1. Consultar `GET /api/entregas?limit=100&incluir_canceladas=true` ou marcar a opção de incluir canceladas na tela.
2. Conferir os status retornados.

**Resultado esperado:** as entregas canceladas devem aparecer na lista.

**Resultado obtido:** Com `incluir_canceladas=true`, a API retornou 42 entregas, incluindo três canceladas.

**Status:** Passou

**Bug relacionado:** Não há.

### CT 28: Buscar pelo código de rastreio

| | |
|---|---|
| **Funcionalidade** | Busca de entregas |
| **Prioridade** | Média |
| **Tipo** | Positivo |
| **Camada** | UI e API |

**Pré condição:** dados resetados; entrega `BRD-2026-00008` disponível.

**Passos:**
1. Pesquisar por `BRD-2026-00008`.
2. Conferir o resultado mostrado na tabela.

**Resultado esperado:** a busca deve retornar somente a entrega de código `BRD-2026-00008`.

**Resultado obtido:** A busca pelo código `BRD-2026-00008` retornou somente a entrega correspondente.

**Status:** Passou

**Bug relacionado:** Não há.

### CT 29: Buscar parte do nome do destinatário

| | |
|---|---|
| **Funcionalidade** | Busca de entregas |
| **Prioridade** | Média |
| **Tipo** | Positivo |
| **Camada** | UI e API |

**Pré condição:** dados resetados.

**Passos:**
1. Pesquisar por `Cliente 1`.
2. Conferir se cada registro retornado possui esse texto no nome do destinatário.

**Resultado esperado:** devem aparecer apenas entregas cujo destinatário contém `Cliente 1`.

**Resultado obtido:** A busca por `Cliente 1` retornou apenas registros cujo destinatário contém o termo pesquisado.

**Status:** Passou

**Bug relacionado:** Não há.

### CT 30: Buscar por cidade sem diferenciação de acento

| | |
|---|---|
| **Funcionalidade** | Busca de entregas |
| **Prioridade** | Alta |
| **Tipo** | Negativo / usabilidade |
| **Camada** | UI e API |

**Pré-condição:** dados resetados; cinco entregas de São Paulo na massa inicial.

**Passos:**
1. Pesquisar por `sao paulo` na caixa de busca ou enviar `GET /api/entregas?q=sao%20paulo`.

**Resultado esperado:** retornar as mesmas cinco entregas que uma busca por `São Paulo`.

**Resultado obtido:** A busca por `sao paulo` retornou zero itens, embora existam entregas para `São Paulo`.

**Status:** Falhou

**Bug relacionado:** `bugs/BUG-07-busca-sensivel-a-acento-e-caixa.md`.

### CT 31: Buscar por cidade sem diferenciação entre maiúsculas e minúsculas

| | |
|---|---|
| **Funcionalidade** | Busca de entregas |
| **Prioridade** | Alta |
| **Tipo** | Negativo / usabilidade |
| **Camada** | UI e API |

**Pré-condição:** dados resetados; cinco entregas de São Paulo na massa inicial.

**Passos:**
1. Pesquisar por `SÃO PAULO`.
2. Comparar com a busca por `São Paulo`.

**Resultado esperado:** ambas as buscas devem retornar os mesmos cinco itens.

**Resultado obtido:** A busca por `SÃO PAULO` retornou zero itens.

**Status:** Falhou

**Bug relacionado:** `bugs/BUG-07-busca-sensivel-a-acento-e-caixa.md`.

### CT 32: Filtrar por cada status disponível

| | |
|---|---|
| **Funcionalidade** | Filtro de status |
| **Prioridade** | Alta |
| **Tipo** | Positivo |
| **Camada** | UI e API |

**Pré condição:** dados resetados.

**Passos:**
1. Aplicar, um por vez, os filtros `CRIADA`, `COLETADA`, `EM_TRANSITO`, `SAIU_ENTREGA`, `ENTREGUE` e `DEVOLVIDA`.
2. Conferir os itens retornados em cada filtro.

**Resultado esperado:** todos os itens retornados devem ter exatamente o status selecionado e o total deve corresponder à quantidade encontrada.

**Resultado obtido:** Os itens retornados respeitaram cada status, mas o campo `total` permaneceu `42` em todos os filtros.

**Status:** Falhou

**Bug relacionado:** `bugs/BUG-08-total-nao-respeita-filtros.md`.

### CT 33: Consultar entregas canceladas com e sem a opção de inclusão

| | |
|---|---|
| **Funcionalidade** | Filtro de status e canceladas |
| **Prioridade** | Alta |
| **Tipo** | Regra de negócio |
| **Camada** | UI e API |

**Pré condição:** dados resetados; existem entregas `CANCELADA` na massa inicial.

**Passos:**
1. Aplicar o filtro `CANCELADA` sem marcar **incluir canceladas**.
2. Repetir a consulta com `incluir_canceladas=true` ou marcando a opção na tela.

**Resultado esperado:** sem a opção, as canceladas não devem aparecer. Com a opção, devem aparecer somente entregas canceladas e o total deve refletir essa lista.

**Resultado obtido:** Sem a opção de inclusão, não houve itens; com a opção, foram retornadas três canceladas. Nos dois casos, `total` ficou em `42`.

**Status:** Falhou

**Bug relacionado:** `bugs/BUG-08-total-nao-respeita-filtros.md`.

### CT 34: Informar total correspondente ao filtro aplicado

| | |
|---|---|
| **Funcionalidade** | Busca, filtros e contador |
| **Prioridade** | Alta |
| **Tipo** | Negativo |
| **Camada** | UI e API |

**Pré-condição:** dados resetados.

**Passos:**
1. Pesquisar por `São Paulo`.
2. Conferir a quantidade de itens e o campo `total`/contador.
3. Repetir com o filtro `status=EM_TRANSITO`.

**Resultado esperado:** o total deve refletir o filtro: cinco para São Paulo e nove para `EM_TRANSITO` na massa inicial.

**Resultado obtido:** A busca por `São Paulo` retornou cinco itens, mas informou `total=42`.

**Status:** Falhou

**Bug relacionado:** `bugs/BUG-08-total-nao-respeita-filtros.md`.

### CT 35: Retornar exatamente o limite solicitado por página

| | |
|---|---|
| **Funcionalidade** | Paginação |
| **Prioridade** | Alta |
| **Tipo** | Limite |
| **Camada** | UI e API |

**Pré-condição:** dados resetados; página 1; listagem sem filtro.

**Passos:**
1. Consultar `GET /api/entregas?page=1&limit=10`.
2. Contar os itens retornados.
3. Repetir na página 2 e observar a tabela na UI.

**Resultado esperado:** cada página não final deve ter exatamente dez itens.

**Resultado obtido:** Com `limit=10`, a primeira página retornou nove itens.

**Status:** Falhou

**Bug relacionado:** `bugs/BUG-09-paginacao-retorna-item-a-menos.md`.

### CT 36: Validar a última página e uma página sem resultado

| | |
|---|---|
| **Funcionalidade** | Paginação |
| **Prioridade** | Média |
| **Tipo** | Limite |
| **Camada** | UI e API |

**Pré condição:** dados resetados; listagem padrão sem filtro e `limit=10`.

**Passos:**
1. Abrir a última página com resultado.
2. Conferir a quantidade de itens restantes.
3. Solicitar a página seguinte, que não possui registros.

**Resultado esperado:** a última página deve mostrar apenas o restante da lista. A página posterior não deve repetir itens nem apresentar registros indevidos.

**Resultado obtido:** A página 4 retornou nove itens e a página 5 retornou lista vazia, conforme esperado para a massa consultada.

**Status:** Passou

**Bug relacionado:** Não há.

### CT 37: Testar limites diferentes de paginação

| | |
|---|---|
| **Funcionalidade** | Paginação |
| **Prioridade** | Média |
| **Tipo** | Limite |
| **Camada** | API |

**Pré condição:** dados resetados.

**Passos:**
1. Consultar a listagem com `limit=1`.
2. Consultar novamente com `limit=100`.

**Resultado esperado:** a primeira consulta deve retornar um item. A segunda deve retornar todas as entregas elegíveis para a listagem padrão, sem canceladas.

**Resultado obtido:** Com `limit=1`, a API retornou zero itens; com `limit=100`, retornou 39 itens.

**Status:** Falhou

**Bug relacionado:** `bugs/BUG-09-paginacao-retorna-item-a-menos.md`.

## 5. Transportadoras

### CT 38: Listar somente transportadoras ativas por padrão

| | |
|---|---|
| **Funcionalidade** | Transportadoras |
| **Prioridade** | Média |
| **Tipo** | Positivo |
| **Camada** | API e UI |

**Pré-condição:** dados resetados; quatro transportadoras ativas e uma inativa.

**Passos:**
1. Consultar `GET /api/transportadoras`.
2. Conferir a lista do seletor de transportadora na tela.

**Resultado esperado:** apenas as quatro ativas devem ser retornadas e exibidas para cadastro.

**Resultado obtido:** A consulta padrão retornou quatro transportadoras, todas ativas.

**Status:** Passou

**Bug relacionado:** Não há.

### CT 39: Incluir transportadoras inativas quando solicitado e preservar CNPJ sem máscara

| | |
|---|---|
| **Funcionalidade** | Transportadoras |
| **Prioridade** | Média |
| **Tipo** | Positivo |
| **Camada** | API e UI |

**Pré-condição:** dados resetados.

**Passos:**
1. Consultar `GET /api/transportadoras?incluir_inativas=true`.
2. Conferir a transportadora `id=5` e os CNPJs retornados/exibidos.

**Resultado esperado:** cinco transportadoras, incluindo a inativa; CNPJ armazenado e exibido apenas com dígitos, sem máscara.

**Resultado obtido:** Com `incluir_inativas=true`, a consulta retornou cinco transportadoras, incluindo a inativa; os CNPJs vieram com 14 dígitos e sem máscara.

**Status:** Passou

**Bug relacionado:** Não há.

## 6. Contrato da API

### CT 40: Retornar `404` ao consultar entrega inexistente

| | |
|---|---|
| **Funcionalidade** | Consulta de entrega |
| **Prioridade** | Média |
| **Tipo** | Negativo |
| **Camada** | API |

**Pré-condição:** dados resetados; não existe entrega de id `99999`.

**Passos:**
1. Enviar `GET /api/entregas/99999`.

**Resultado esperado:** resposta `404` no formato `{ "erro": "..." }`.

**Resultado obtido:** A consulta de uma entrega inexistente retornou `200` com corpo `{}`.

**Status:** Falhou

**Bug relacionado:** `bugs/BUG-10-consulta-inexistente-retorna-200.md`.

## 7. Validações complementares do cadastro

### CT 41: Identificar os campos obrigatórios no cadastro

| | |
|---|---|
| **Funcionalidade** | Cadastro de entrega |
| **Prioridade** | Média |
| **Tipo** | Usabilidade / negativo |
| **Camada** | UI |

**Pré-condição:** aplicação disponível; formulário **Nova entrega** aberto.

**Passos:**
1. Conferir os rótulos de destinatário, cidade, UF, transportadora, peso e volumes.
2. Comparar os campos com a lista de obrigatoriedade do README.
3. Inspecionar se os controles possuem `required` ou `aria-required`.

**Resultado esperado:** os seis campos obrigatórios devem ser identificados na tela, com `*` no rótulo e marcação de obrigatoriedade no controle. `data_coleta` não deve ser marcada, pois é opcional.

**Resultado obtido:** nenhum dos seis campos possui `*`, `required` ou `aria-required`. A tela não informa previamente quais dados precisam ser preenchidos.

**Status:** Falhou

**Bug relacionado:** `bugs/BUG-11-indicacao-de-campos-obrigatorios.md`.

### CT 42: Rejeitar data de coleta inválida

| | |
|---|---|
| **Funcionalidade** | Cadastro e data de coleta |
| **Prioridade** | Alta |
| **Tipo** | Negativo / limite de data |
| **Camada** | API |

**Pré-condição:** dados resetados; transportadora ativa disponível.

**Passos:**
1. Enviar cadastro válido com `data_coleta: "data inválida"`.
2. Resetar e repetir com `data_coleta: "2026-02-30"`.
3. Resetar e repetir com `data_coleta: "2026-13-01"`.

**Resultado esperado:** as três tentativas devem retornar `422`, informar que a data é inválida e não criar entrega.

**Resultado obtido:** A API retornou `500` para data textual e mês inválido. A data impossível `2026-02-30` retornou `201` e prazo `2026-03-05`.

**Status:** Falhou

**Bug relacionado:** `bugs/BUG-12-validacao-da-data-de-coleta.md`.
