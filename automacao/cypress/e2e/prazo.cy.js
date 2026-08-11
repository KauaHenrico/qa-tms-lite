const {
  abrirTelaComDadosIniciais,
  preencherFormulario,
  enviarFormulario,
  buscar,
  abrirEntrega,
} = require('../support/tela');

function cadastrarEConferirPrazo(dataColeta, prazoEsperado) {
  cy.intercept('POST', '/api/entregas').as('criarEntrega');
  preencherFormulario({
    destinatario_nome: `Cliente prazo ${dataColeta}`,
    data_coleta: dataColeta,
  });
  enviarFormulario();
  cy.wait('@criarEntrega');

  cy.get('#mensagem-form').should('have.class', 'sucesso').invoke('text').then((mensagem) => {
    const codigo = mensagem.match(/BRD-2026-\d{5}/)[0];
    buscar(codigo);
    cy.get('#tabela tr[data-id]').should('have.length', 1).click();
    cy.get('#detalhe').should('contain.text', `Prazo: ${prazoEsperado}`);
  });
}

describe('Variações do cálculo de prazo pela tela', () => {
  beforeEach(() => {
    abrirTelaComDadosIniciais();
  });

  it('calcula três dias úteis a partir de uma coleta na sexta-feira', () => {
    cadastrarEConferirPrazo('2026-07-03', '2026-07-08');
  });

  it('calcula três dias úteis a partir de uma coleta no sábado', () => {
    cadastrarEConferirPrazo('2026-07-04', '2026-07-08');
  });

  it('exibe na massa inicial o prazo coerente com a transportadora', () => {
    abrirEntrega(4);

    cy.get('#detalhe').should('contain.text', 'Coleta: 2026-06-05');
    cy.get('#detalhe').should('contain.text', 'Prazo: 2026-06-10');
  });
});

describe('Cálculo de prazo a partir de uma quinta-feira', () => {
  beforeEach(() => {
    abrirTelaComDadosIniciais();
  });

  it('mostra prazo calculado somente com dias úteis após o cadastro', () => {
    cy.intercept('POST', '/api/entregas').as('criarEntrega');
    preencherFormulario({ destinatario_nome: 'Cliente prazo útil', data_coleta: '2026-07-02' });
    enviarFormulario();
    cy.wait('@criarEntrega');

    cy.get('#mensagem-form').should('have.class', 'sucesso').invoke('text').then((mensagem) => {
      const codigo = mensagem.match(/BRD-2026-\d{5}/)[0];
      buscar(codigo);
      cy.get('#tabela tr[data-id]').should('have.length', 1).click();
      cy.get('#detalhe').should('contain.text', 'Prazo: 2026-07-07');
    });
  });
});
