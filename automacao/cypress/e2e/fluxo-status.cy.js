describe('Fluxo de status da entrega', () => {
  beforeEach(() => {
    cy.request('POST', '/_reset').its('status').should('eq', 200);
  });

  it('recusa o salto de CRIADA para ENTREGUE', () => {
    cy.request({
      method: 'PATCH',
      url: '/api/entregas/5/status',
      failOnStatusCode: false,
      body: {
        status: 'ENTREGUE',
        descricao: 'Tentativa de finalizar sem as etapas anteriores',
      },
    }).then((resposta) => {
      expect(resposta.status).to.eq(422);
      expect(resposta.body.erro).to.match(/transi[çc][ãa]o|permitida/i);
    });

    cy.request('/api/entregas/5').then((resposta) => {
      expect(resposta.body.status).to.eq('CRIADA');
      expect(resposta.body.historico).to.have.length(1);
    });
  });
});
