const { abrirTelaComDadosIniciais } = require('../support/tela');

describe('Transportadoras disponíveis na tela', () => {
  beforeEach(() => {
    abrirTelaComDadosIniciais();
  });

  it('oferece apenas transportadoras ativas no formulário', () => {
    cy.get('#select-transportadora option').should('have.length', 4);
    cy.get('#select-transportadora').should('not.contain.text', 'Logística Norte Ltda');
  });

  it('exibe CNPJ sem máscara na tabela de entregas', () => {
    cy.get('tr[data-id="4"] .cnpj').should('have.text', '12345678000195');
  });
});
