const {
  abrirTelaComDadosIniciais,
  abrirEntrega,
  alterarStatus,
} = require('../support/tela');

function selecionarStatus(status) {
  cy.intercept('PATCH', '/api/entregas/*/status').as(`alterarPara${status}`);
  cy.get('#novo-status').select(status);
  cy.wait(`@alterarPara${status}`);
  cy.get('#novo-status').should('have.value', status);
}

describe('Caminhos adicionais do fluxo de status', () => {
  beforeEach(() => {
    abrirTelaComDadosIniciais();
  });

  it('avança de CRIADA para COLETADA pela tela', () => {
    abrirEntrega(5);
    alterarStatus('COLETADA');

    cy.get('#novo-status').should('have.value', 'COLETADA');
    cy.get('.historico li').should('have.length', 2);
  });

  it('impede cancelar uma entrega que já está em trânsito', () => {
    abrirEntrega(2);
    cy.get('#novo-status').should('have.value', 'EM_TRANSITO');
    alterarStatus('CANCELADA');

    cy.get('#mensagem-status').should('contain.text', 'não permitida');
    cy.get('#novo-status').should('have.value', 'EM_TRANSITO');
    cy.get('.historico li').should('have.length', 1);
  });

  it('impede alterar uma entrega que já está entregue', () => {
    abrirEntrega(4);
    cy.get('#novo-status').should('have.value', 'ENTREGUE');
    alterarStatus('COLETADA');

    cy.get('#mensagem-status').should('contain.text', 'não permitida');
    cy.get('#novo-status').should('have.value', 'ENTREGUE');
  });

  it('permite completar todas as etapas válidas até ENTREGUE', () => {
    abrirEntrega(5);
    selecionarStatus('COLETADA');
    selecionarStatus('EM_TRANSITO');
    selecionarStatus('SAIU_ENTREGA');
    selecionarStatus('ENTREGUE');

    cy.get('.historico li').should('have.length', 5);
  });

  it('permite devolver uma entrega que saiu para entrega', () => {
    abrirEntrega(3);
    alterarStatus('DEVOLVIDA');

    cy.get('#novo-status').should('have.value', 'DEVOLVIDA');
    cy.get('.historico li').should('have.length', 2);
  });

  it('apresenta no histórico o status atual da entrega inicial', () => {
    abrirEntrega(4);

    cy.get('.historico').should('contain.text', 'ENTREGUE');
  });
});

describe('Bloqueio de salto no fluxo de status', () => {
  beforeEach(() => {
    abrirTelaComDadosIniciais();
  });

  it('impede selecionar ENTREGUE para uma entrega em CRIADA', () => {
    abrirEntrega(5);
    cy.get('#novo-status').should('have.value', 'CRIADA');
    alterarStatus('ENTREGUE');

    cy.get('#mensagem-status').should('contain.text', 'não permitida');
    cy.get('#novo-status').should('have.value', 'CRIADA');
    cy.get('.historico li').should('have.length', 1);
  });
});
