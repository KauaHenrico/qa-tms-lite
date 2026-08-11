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

function preencherFormulario({ peso, volumes }) {
  cy.get('[name="destinatario_nome"]').type('Destinatário de teste');
  cy.get('[name="cidade"]').type('Curitiba');
  cy.get('[name="uf"]').type('PR');
  cy.get('#select-transportadora').select('1');
  cy.get('[name="peso_kg"]').type(peso);
  cy.get('[name="volumes"]').type(volumes);
  cy.get('[name="data_coleta"]').type('2026-07-02');
}

describe('Validação do cadastro de entrega pela tela', () => {
  beforeEach(() => {
    abrirTelaComDadosIniciais();
  });

  it('recusa peso igual a zero ao enviar o formulário', () => {
    cy.intercept('POST', '/api/entregas').as('criarEntrega');
    preencherFormulario({ peso: '0', volumes: '1' });

    cy.contains('button', 'Cadastrar entrega').click();
    cy.wait('@criarEntrega');

    cy.get('#mensagem-form').should('have.class', 'erro');
    cy.get('#mensagem-form').should('contain.text', 'peso');
    cy.get('[name="peso_kg"]').should('have.value', '0');
  });

  it('recusa volume fracionado ao enviar o formulário', () => {
    preencherFormulario({ peso: '5', volumes: '1.5' });

    cy.contains('button', 'Cadastrar entrega').click();

    cy.get('[name="volumes"]').then(($campo) => {
      expect($campo[0].checkValidity()).to.eq(false);
    });
    cy.get('#mensagem-form').should('have.text', '');
    cy.get('[name="volumes"]').should('have.value', '1.5');
  });
});
