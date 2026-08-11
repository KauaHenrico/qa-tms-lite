describe('Listagem de entregas', () => {
  beforeEach(() => {
    cy.request('POST', '/_reset').its('status').should('eq', 200);
  });

  it('retorna no total apenas as entregas do status filtrado', () => {
    cy.request('/api/entregas?status=EM_TRANSITO&limit=100').then((resposta) => {
      expect(resposta.status).to.eq(200);
      expect(resposta.body.itens).to.have.length.greaterThan(0);
      expect(resposta.body.itens).to.satisfy((entregas) =>
        entregas.every((entrega) => entrega.status === 'EM_TRANSITO'));
      expect(resposta.body.total).to.eq(resposta.body.itens.length);
    });
  });
});
