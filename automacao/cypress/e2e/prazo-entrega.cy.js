describe('Cálculo de prazo pela tela', () => {
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

  it('mostra prazo calculado somente com dias úteis após o cadastro', () => {
    cy.intercept('POST', '/api/entregas').as('criarEntrega');
    cy.get('[name="destinatario_nome"]').type('Cliente prazo útil');
    cy.get('[name="cidade"]').type('Curitiba');
    cy.get('[name="uf"]').type('PR');
    cy.get('#select-transportadora').select('1');
    cy.get('[name="peso_kg"]').type('5');
    cy.get('[name="volumes"]').type('1');
    cy.get('[name="data_coleta"]').type('2026-07-02');

    cy.contains('button', 'Cadastrar entrega').click();
    cy.wait('@criarEntrega');
    cy.get('#mensagem-form').should('have.class', 'sucesso').invoke('text').then((mensagem) => {
      const codigo = mensagem.match(/BRD-2026-\d{5}/)[0];

      cy.intercept('GET', '/api/entregas*').as('buscarEntrega');
      cy.get('#busca').clear().type(codigo);
      cy.wait('@buscarEntrega');
      cy.get('#tabela tr[data-id]').should('have.length', 1).click();
      cy.get('#detalhe').should('contain.text', 'Prazo: 2026-07-07');
    });
  });
});
