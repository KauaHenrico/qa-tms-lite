function abrirTelaComDadosIniciais() {
  cy.intercept('GET', '/api/transportadoras').as('carregarTransportadoras');
  cy.intercept('GET', '/api/entregas*').as('carregarEntregas');
  cy.intercept('POST', '/_reset').as('resetarDados');

  cy.visit('/');
  cy.wait('@carregarTransportadoras');
  cy.wait('@carregarEntregas');
  cy.get('#resetar').click();
  cy.wait('@resetarDados');
  cy.wait('@carregarEntregas');
}

function preencherFormulario(dados = {}) {
  const valores = {
    destinatario_nome: 'Destinatário de teste',
    cidade: 'Curitiba',
    uf: 'PR',
    id_transportadora: '1',
    peso_kg: '5',
    volumes: '1',
    data_coleta: '2026-07-02',
    ...dados,
  };

  if (valores.destinatario_nome !== null) {
    cy.get('[name="destinatario_nome"]').type(valores.destinatario_nome);
  }
  if (valores.cidade !== null) {
    cy.get('[name="cidade"]').type(valores.cidade);
  }
  if (valores.uf !== null) {
    cy.get('[name="uf"]').type(valores.uf);
  }
  if (valores.id_transportadora !== null) {
    cy.get('#select-transportadora').select(valores.id_transportadora);
  }
  if (valores.peso_kg !== null) {
    cy.get('[name="peso_kg"]').type(valores.peso_kg);
  }
  if (valores.volumes !== null) {
    cy.get('[name="volumes"]').type(valores.volumes);
  }
  if (valores.data_coleta !== null) {
    cy.get('[name="data_coleta"]').type(valores.data_coleta);
  }
}

function enviarFormulario() {
  cy.contains('button', 'Cadastrar entrega').click();
}

function abrirEntrega(id) {
  cy.intercept('GET', `/api/entregas/${id}`).as('detalharEntrega');
  cy.get(`tr[data-id="${id}"]`).click();
  cy.wait('@detalharEntrega');
}

function alterarStatus(status) {
  cy.intercept('PATCH', '/api/entregas/*/status').as('alterarStatus');
  cy.get('#novo-status').select(status);
  cy.wait('@alterarStatus');
}

function filtrarPorStatus(status) {
  cy.intercept('GET', '/api/entregas*').as('filtrarEntregas');
  cy.get('#filtro-status').select(status);
  cy.wait('@filtrarEntregas');
}

function buscar(texto) {
  cy.intercept('GET', '/api/entregas*').as('buscarEntregas');
  cy.get('#busca').clear().type(texto);
  cy.wait('@buscarEntregas');
}

module.exports = {
  abrirTelaComDadosIniciais,
  preencherFormulario,
  enviarFormulario,
  abrirEntrega,
  alterarStatus,
  filtrarPorStatus,
  buscar,
};
