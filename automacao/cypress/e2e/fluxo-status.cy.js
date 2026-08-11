describe('Fluxo de status pela tela', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/transportadoras').as('carregarTransportadoras');
    cy.intercept('GET', '/api/entregas*').as('carregarEntregas');
    cy.intercept('POST', '/_reset').as('resetarDados');

    cy.visit('/');
    cy.wait('@carregarTransportadoras');
    cy.wait('@carregarEntregas');
    cy.get('#resetar').click();
    cy.wait('@resetarDados');
    cy.wait('@carregarEntregas');
  });

  it('impede selecionar ENTREGUE para uma entrega em CRIADA', () => {
    cy.intercept('GET', '/api/entregas/5').as('detalharEntrega');
    cy.intercept('PATCH', '/api/entregas/5/status').as('alterarStatus');

    cy.get('tr[data-id="5"]').click();
    cy.wait('@detalharEntrega');
    cy.get('#novo-status').should('have.value', 'CRIADA').select('ENTREGUE');
    cy.wait('@alterarStatus');

    cy.get('#mensagem-status').should('contain.text', 'não permitida');
    cy.get('#novo-status').should('have.value', 'CRIADA');
    cy.get('.historico li').should('have.length', 1);
  });
});
