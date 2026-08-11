# Casos de teste: TMS Lite

## Preparação para reproduzir os casos

1. No terminal, na raiz do projeto, executar `npm start`.
2. Aguardar a mensagem `TMS Lite rodando em http://localhost:3000`.
3. Para casos de tela, abrir `http://localhost:3000` no Brave ou em seu navegador de preferência.
4. Antes de cada caso, clicar em **Resetar dados** ou enviar `POST http://localhost:3000/_reset`.
5. Para os casos de API, considerar `http://localhost:3000` como base e enviar as requisições com um cliente REST. Os corpos JSON informados nos passos devem ser enviados com o cabeçalho `Content-Type: application/json`.
6. Quando o passo pedir uma consulta, conferir tanto o status HTTP quanto o corpo retornado. Quando pedir uma verificação na tela, aguardar a tabela ou o detalhe ser atualizado antes de seguir.

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
1. Restaurar os dados e confirmar, em `GET /api/entregas/5`, que a entrega está em `CRIADA`.
2. Enviar `PATCH /api/entregas/5/status` com `{"status":"COLETADA","descricao":"Coleta confirmada"}`.
3. Enviar `PATCH /api/entregas/5/status` com `{"status":"EM_TRANSITO","descricao":"Carga em trânsito"}`.
4. Enviar `PATCH /api/entregas/5/status` com `{"status":"SAIU_ENTREGA","descricao":"Saiu para entrega"}`.
5. Enviar `PATCH /api/entregas/5/status` com `{"status":"ENTREGUE","descricao":"Entrega concluída"}`.
6. Consultar `GET /api/entregas/5` e contar os itens de `historico`.

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
1. Restaurar os dados e confirmar, em `GET /api/entregas/5`, que a entrega está em `CRIADA`.
2. Enviar `PATCH /api/entregas/5/status` com `{"status":"COLETADA","descricao":"Coleta confirmada"}`.
3. Enviar `PATCH /api/entregas/5/status` com `{"status":"EM_TRANSITO","descricao":"Carga em trânsito"}`.
4. Enviar `PATCH /api/entregas/5/status` com `{"status":"SAIU_ENTREGA","descricao":"Saiu para entrega"}`.
5. Enviar `PATCH /api/entregas/5/status` com `{"status":"DEVOLVIDA","descricao":"Devolução solicitada"}`.
6. Consultar `GET /api/entregas/5` e conferir o status final e todos os itens de `historico`.

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
1. Restaurar os dados com `POST /_reset`.
2. Enviar `PATCH /api/entregas/5/status` com corpo `{"status":"COLETADA","descricao":"Coletado na origem"}`.
3. Consultar `GET /api/entregas/5` e conferir o status e o último item de `historico`.

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
1. Restaurar os dados com `POST /_reset`.
2. Enviar `PATCH /api/entregas/5/status` com `{"status":"CANCELADA","descricao":"Cancelamento solicitado"}`.
3. Consultar `GET /api/entregas/5` e conferir o status e o último item de `historico`.

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
1. Restaurar os dados com `POST /_reset`.
2. Enviar `PATCH /api/entregas/5/status` com `{"status":"COLETADA","descricao":"Coleta confirmada"}`.
3. Enviar `PATCH /api/entregas/5/status` com `{"status":"CANCELADA","descricao":"Cancelamento solicitado"}`.
4. Consultar `GET /api/entregas/5` e conferir o histórico.

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
1. Restaurar os dados com `POST /_reset`.
2. Enviar `PATCH /api/entregas/5/status` com corpo `{"status":"ENTREGUE","descricao":"Teste de salto de status"}`.
3. Consultar `GET /api/entregas/5` e comparar `status` e `historico` com o estado anterior à requisição.

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
1. Restaurar os dados com `POST /_reset`.
2. Consultar `GET /api/entregas/2` e confirmar `status: "EM_TRANSITO"`.
3. Enviar `PATCH /api/entregas/2/status` com `{"status":"CANCELADA","descricao":"Teste de cancelamento após trânsito"}`.
4. Consultar novamente `GET /api/entregas/2` e conferir se houve mudança no status ou no histórico.

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
1. Restaurar os dados com `POST /_reset`.
2. Consultar `GET /api/entregas/4` e confirmar `status: "ENTREGUE"`.
3. Enviar `PATCH /api/entregas/4/status` com `{"status":"COLETADA","descricao":"Teste de status final"}`.
4. Consultar novamente `GET /api/entregas/4` e conferir se houve mudança no status ou no histórico.

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
1. Restaurar os dados com `POST /_reset`.
2. Enviar `PATCH /api/entregas/5/status` com `{"status":"INVALIDO","descricao":"Status fora do catálogo"}`.
3. Consultar `GET /api/entregas/5` e confirmar que ela continua em `CRIADA`.

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
1. Restaurar os dados com `POST /_reset`.
2. Consultar `GET /api/entregas?limit=100&incluir_canceladas=true` para obter toda a massa inicial.
3. Separar os registros cujo `status` é diferente de `CRIADA`.
4. Para cada registro separado, consultar `GET /api/entregas/{id}` e comparar o status atual com os itens de `historico`.
5. Registrar a quantidade de entregas fora de `CRIADA` e quantas delas possuem somente o evento `CRIADA` no histórico.

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
1. Abrir `http://localhost:3000` no Brave e clicar em **Resetar dados**.
2. Na tabela, clicar na linha de código `BRD-2026-00005`.
3. Na seção **Detalhe**, abrir o campo **Alterar status** e selecionar `ENTREGUE`.
4. Conferir o status exibido no detalhe e o último item da seção **Histórico**.

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
1. Abrir `http://localhost:3000` no Brave e clicar em **Resetar dados**.
2. No formulário **Nova entrega**, preencher **Destinatário** com `Maria Souza`, **Cidade** com `Curitiba`, **UF** com `PR`, **Peso (kg)** com `1`, **Volumes** com `1` e **Data de coleta** com `2026-07-02`.
3. Selecionar `Trans Sul Logística` no campo **Transportadora**.
4. Clicar em **Cadastrar entrega**.
5. Conferir a mensagem da tela e localizar a entrega criada na tabela ou na resposta de `POST /api/entregas`.

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
1. Restaurar os dados com `POST /_reset`.
2. Usar como corpo base `{"id_transportadora":1,"destinatario_nome":"Teste obrigatório","cidade":"Curitiba","uf":"PR","peso_kg":1,"volumes":1,"data_coleta":"2026-07-02"}`.
3. Enviar `POST /api/entregas` sem `id_transportadora`.
4. Restaurar os dados e enviar a mesma requisição sem `destinatario_nome`.
5. Restaurar os dados e enviar a mesma requisição sem `cidade`.
6. Restaurar os dados e enviar a mesma requisição sem `uf`.
7. Após cada tentativa, consultar `GET /api/entregas?limit=100` e confirmar que não houve nova entrega.

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
1. Restaurar os dados com `POST /_reset`.
2. Enviar `POST /api/entregas` com `{"id_transportadora":1,"destinatario_nome":"   ","cidade":"   ","uf":"  ","peso_kg":1,"volumes":1,"data_coleta":"2026-07-02"}`.
3. Conferir o status HTTP, a resposta e a quantidade de entregas antes e depois do envio.
4. Repetir pela tela: preencher os três campos textuais somente com espaços, selecionar `Trans Sul Logística`, informar peso `1`, volumes `1`, data `2026-07-02` e clicar em **Cadastrar entrega**.

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
1. Restaurar os dados com `POST /_reset`.
2. Enviar `POST /api/entregas` com `{"id_transportadora":5,"destinatario_nome":"Teste transportadora inativa","cidade":"Curitiba","uf":"PR","peso_kg":1,"volumes":1,"data_coleta":"2026-07-02"}`.
3. Conferir o status HTTP e a mensagem retornada.

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
1. Restaurar os dados com `POST /_reset`.
2. Enviar `POST /api/entregas` com `{"id_transportadora":999,"destinatario_nome":"Teste transportadora inexistente","cidade":"Curitiba","uf":"PR","peso_kg":1,"volumes":1,"data_coleta":"2026-07-02"}`.
3. Conferir o status HTTP e confirmar que nenhuma entrega foi criada.

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
1. Restaurar os dados com `POST /_reset`.
2. Enviar `POST /api/entregas` com `{"id_transportadora":1,"destinatario_nome":"Teste peso zero","cidade":"Curitiba","uf":"PR","peso_kg":0,"volumes":1,"data_coleta":"2026-07-02"}`.
3. Restaurar os dados e repetir a requisição com `peso_kg:-1` e `destinatario_nome:"Teste peso negativo"`.
4. Conferir o status HTTP das duas tentativas e a quantidade de entregas criada.

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
1. Restaurar os dados com `POST /_reset`.
2. Enviar `POST /api/entregas` com `{"id_transportadora":1,"destinatario_nome":"Teste volume zero","cidade":"Curitiba","uf":"PR","peso_kg":1,"volumes":0,"data_coleta":"2026-07-02"}`.
3. Restaurar os dados e repetir com `volumes:-1` e `destinatario_nome:"Teste volume negativo"`.
4. Restaurar os dados e repetir com `volumes:1.5` e `destinatario_nome:"Teste volume fracionado"`.
5. Conferir o status HTTP e a quantidade de entregas após cada tentativa.

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
1. Restaurar os dados e enviar `POST /api/entregas` com `{"id_transportadora":1,"destinatario_nome":"Teste peso mínimo","cidade":"Curitiba","uf":"PR","peso_kg":0.01,"volumes":1,"data_coleta":"2026-07-02"}`.
2. Restaurar os dados e enviar o mesmo corpo com `volumes:-1`.
3. Restaurar os dados e enviar o mesmo corpo com `volumes:"abc"`.
4. Restaurar os dados e enviar uma requisição sem `peso_kg`; em outra execução, sem `volumes`.
5. Restaurar os dados e repetir as duas últimas requisições usando `peso_kg:""` e `volumes:""`.
6. Anotar o status HTTP e os valores gravados nas respostas aceitas.

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
1. Restaurar os dados com `POST /_reset`.
2. Preparar oito corpos válidos, alterando somente `destinatario_nome` para `Concorrência 01` até `Concorrência 08`; manter `id_transportadora:1`, `cidade:"Curitiba"`, `uf:"PR"`, `peso_kg:1`, `volumes:1` e `data_coleta:"2026-07-02"`.
3. Disparar os oito `POST /api/entregas` sem aguardar uma resposta antes da outra.
4. Guardar os oito corpos de resposta e comparar os campos `codigo`.

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
1. Abrir `http://localhost:3000` no Brave e clicar em **Resetar dados**.
2. No formulário **Nova entrega**, preencher **Destinatário** com `Teste preservação`, **Cidade** com `Curitiba`, **UF** com `PR`, selecionar `Trans Sul Logística`, preencher **Peso (kg)** com `0`, **Volumes** com `1` e **Data de coleta** com `2026-07-02`.
3. Clicar em **Cadastrar entrega**.
4. Conferir a mensagem exibida e verificar se cada campo ainda contém o valor informado.

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
1. Restaurar os dados com `POST /_reset`.
2. Enviar `POST /api/entregas` com `{"id_transportadora":1,"destinatario_nome":"Teste coleta quinta","cidade":"Curitiba","uf":"PR","peso_kg":1,"volumes":1,"data_coleta":"2026-07-02"}`.
3. Anotar `data_prazo` da resposta `201`.
4. Abrir a tela, localizar o código retornado na tabela e conferir a coluna **Prazo**.

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
1. Restaurar os dados com `POST /_reset`.
2. Consultar `GET /api/transportadoras` e confirmar que a transportadora `id=2` possui `prazo_dias: 5`.
3. Consultar `GET /api/entregas/1` e anotar `data_coleta` e `data_prazo`.
4. Contar manualmente os cinco dias úteis após `2026-06-02`: 03, 04, 05, 08 e 09/06.

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
1. Restaurar os dados com `POST /_reset`.
2. Enviar `POST /api/entregas` com `{"id_transportadora":1,"destinatario_nome":"Teste coleta sexta","cidade":"Curitiba","uf":"PR","peso_kg":1,"volumes":1,"data_coleta":"2026-07-03"}`.
3. Anotar `data_prazo` na resposta e comparar com `2026-07-08`.

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
1. Restaurar os dados com `POST /_reset`.
2. Enviar `POST /api/entregas` com `{"id_transportadora":1,"destinatario_nome":"Teste coleta sábado","cidade":"Curitiba","uf":"PR","peso_kg":1,"volumes":1,"data_coleta":"2026-07-04"}` e anotar `data_prazo`.
3. Restaurar os dados e enviar a mesma requisição trocando `destinatario_nome` para `Teste coleta domingo` e `data_coleta` para `2026-07-05`.
4. Comparar os dois prazos retornados com `2026-07-08`.

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
1. Restaurar os dados com `POST /_reset`.
2. Enviar `GET /api/entregas?limit=100` sem o parâmetro `incluir_canceladas`.
3. Conferir se os 39 itens retornados possuem status diferente de `CANCELADA`.
4. Na tela, deixar o filtro em **Todos os status**, manter a caixa **incluir canceladas** desmarcada e conferir se não há linha `CANCELADA` na tabela.

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
1. Restaurar os dados com `POST /_reset`.
2. Enviar `GET /api/entregas?limit=100&incluir_canceladas=true`.
3. Conferir se a resposta possui 42 itens e pelo menos três deles têm `status: "CANCELADA"`.
4. Na tela, marcar **incluir canceladas** e conferir se as três entregas canceladas aparecem na tabela.

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
1. Abrir `http://localhost:3000` no Brave e clicar em **Resetar dados**.
2. No campo **Buscar por código, destinatário ou cidade**, digitar `BRD-2026-00008`.
3. Aguardar a atualização da tabela e conferir que há somente uma linha, com o código `BRD-2026-00008`.
4. Limpar o campo de busca antes de encerrar o caso.

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
1. Abrir `http://localhost:3000` no Brave e clicar em **Resetar dados**.
2. No campo **Buscar por código, destinatário ou cidade**, digitar `Cliente 1`.
3. Aguardar a atualização da tabela e conferir, linha a linha, a coluna **Destinatário**.
4. Confirmar que cada valor retornado contém o texto `Cliente 1`.

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
1. Abrir `http://localhost:3000` no Brave e clicar em **Resetar dados**.
2. No campo de busca, digitar `São Paulo` e anotar a quantidade de linhas retornadas.
3. Limpar o campo, digitar `sao paulo` e anotar novamente a quantidade de linhas.
4. Comparar as duas listas e, se necessário, confirmar pela API com `GET /api/entregas?q=sao%20paulo&limit=100`.

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
1. Abrir `http://localhost:3000` no Brave e clicar em **Resetar dados**.
2. No campo de busca, digitar `São Paulo` e anotar os códigos encontrados.
3. Limpar o campo, digitar `SÃO PAULO` e anotar os códigos encontrados.
4. Comparar as duas listas de códigos.

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
1. Abrir `http://localhost:3000` no Brave e clicar em **Resetar dados**.
2. No filtro de status, selecionar `CRIADA`; conferir que todas as linhas exibem `CRIADA` e anotar o contador.
3. Repetir a ação para `COLETADA`, `EM_TRANSITO`, `SAIU_ENTREGA`, `ENTREGUE` e `DEVOLVIDA`.
4. Em cada seleção, conferir a coluna **Status** de todas as linhas e comparar o contador com o número de linhas.
5. Retornar o filtro para **Todos os status** ao final.

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
1. Abrir `http://localhost:3000` no Brave e clicar em **Resetar dados**.
2. Selecionar `CANCELADA` no filtro de status e manter **incluir canceladas** desmarcado; anotar as linhas e o contador.
3. Marcar **incluir canceladas** sem alterar o filtro `CANCELADA`.
4. Conferir que as três linhas retornadas exibem `CANCELADA` e comparar o contador com a quantidade de linhas.
5. Repetir pela API com `GET /api/entregas?status=CANCELADA&limit=100` e `GET /api/entregas?status=CANCELADA&incluir_canceladas=true&limit=100`.

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
1. Restaurar os dados com `POST /_reset`.
2. Enviar `GET /api/entregas?q=S%C3%A3o%20Paulo&limit=100`; contar `itens` e anotar `total`.
3. Enviar `GET /api/entregas?status=EM_TRANSITO&limit=100`; contar `itens` e anotar `total`.
4. Na tela, repetir a busca `São Paulo` e o filtro `EM_TRANSITO`, comparando o contador mostrado com o número de linhas.

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
1. Restaurar os dados com `POST /_reset`.
2. Enviar `GET /api/entregas?page=1&limit=10` e contar `itens`.
3. Enviar `GET /api/entregas?page=2&limit=10` e contar `itens`.
4. Na tela, deixar a busca vazia e a caixa de canceladas desmarcada; conferir a quantidade de linhas na página 1.
5. Clicar em **Próxima** e conferir a quantidade de linhas na página 2.

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
1. Restaurar os dados com `POST /_reset`.
2. Enviar `GET /api/entregas?page=4&limit=10` e contar os itens da última página com resultado.
3. Enviar `GET /api/entregas?page=5&limit=10` e conferir que `itens` é uma lista vazia.
4. Na tela, clicar em **Próxima** até chegar à página 4 e conferir as linhas; clicar mais uma vez e conferir a ausência de registros na página 5.

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
1. Restaurar os dados com `POST /_reset`.
2. Enviar `GET /api/entregas?page=1&limit=1` e contar `itens`.
3. Enviar `GET /api/entregas?page=1&limit=100` e contar `itens`.
4. Conferir que a segunda consulta não contém status `CANCELADA`.

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
1. Restaurar os dados com `POST /_reset`.
2. Enviar `GET /api/transportadoras` e contar os registros retornados.
3. Conferir que todos os registros têm `ativa: true`.
4. Abrir `http://localhost:3000` no Brave, localizar o campo **Transportadora** no formulário **Nova entrega** e contar as opções disponíveis.

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
1. Restaurar os dados com `POST /_reset`.
2. Enviar `GET /api/transportadoras?incluir_inativas=true`.
3. Contar cinco registros, localizar a transportadora `id: 5` e confirmar `ativa: false`.
4. Conferir que cada `cnpj` possui somente 14 dígitos, sem pontos, barra ou hífen.
5. Abrir a tela e conferir que os CNPJs exibidos nas linhas mantêm somente dígitos.

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
1. Restaurar os dados com `POST /_reset`.
2. Enviar `GET /api/entregas/99999`.
3. Anotar o status HTTP e o corpo completo da resposta.

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
1. Abrir `http://localhost:3000` no Brave e rolar até o formulário **Nova entrega**.
2. Conferir visualmente os rótulos **Destinatário**, **Cidade**, **UF**, **Transportadora**, **Peso (kg)** e **Volumes**, procurando um `*` ao lado do nome.
3. Conferir que o rótulo **Data de coleta** não possui essa marcação, pois o campo é opcional.
4. Inspecionar os seis controles no navegador e verificar a existência dos atributos `required` ou `aria-required`.
5. Comparar a tela com a tabela de obrigatoriedade do README.

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
1. Restaurar os dados com `POST /_reset`.
2. Enviar `POST /api/entregas` com `{"id_transportadora":1,"destinatario_nome":"Teste data textual","cidade":"Curitiba","uf":"PR","peso_kg":1,"volumes":1,"data_coleta":"data inválida"}`.
3. Restaurar os dados e repetir com `destinatario_nome:"Teste data impossível"` e `data_coleta:"2026-02-30"`.
4. Restaurar os dados e repetir com `destinatario_nome:"Teste mês inválido"` e `data_coleta:"2026-13-01"`.
5. Anotar o status HTTP, a mensagem e a quantidade de entregas criada em cada tentativa.

**Resultado esperado:** as três tentativas devem retornar `422`, informar que a data é inválida e não criar entrega.

**Resultado obtido:** A API retornou `500` para data textual e mês inválido. A data impossível `2026-02-30` retornou `201` e prazo `2026-03-05`.

**Status:** Falhou

**Bug relacionado:** `bugs/BUG-12-validacao-da-data-de-coleta.md`.
