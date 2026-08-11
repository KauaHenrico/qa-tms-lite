describe('Listagem de entregas pela tela', () => {
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

  it('atualiza o contador depois de filtrar por status', () => {
    cy.intercept('GET', '/api/entregas*').as('filtrarEntregas');

    cy.get('#filtro-status').select('EM_TRANSITO');
    cy.wait('@filtrarEntregas');
    cy.get('#tabela tr[data-id]').should('have.length.at.least', 1).then(($linhas) => {
      cy.get('#contador').should('have.text', `${$linhas.length} entregas`);
    });
  });
});
