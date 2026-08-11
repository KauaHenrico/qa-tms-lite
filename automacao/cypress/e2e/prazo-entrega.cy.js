describe('Cálculo de prazo da entrega', () => {
  beforeEach(() => {
    cy.request('POST', '/_reset').its('status').should('eq', 200);
  });

  it('conta somente dias úteis a partir da data de coleta', () => {
    cy.request({
      method: 'POST',
      url: '/api/entregas',
      body: {
        id_transportadora: 1,
        destinatario_nome: 'Cliente prazo útil',
        cidade: 'Curitiba',
        uf: 'PR',
        peso_kg: 5,
        volumes: 1,
        data_coleta: '2026-07-02',
      },
    }).then((resposta) => {
      expect(resposta.status).to.eq(201);
      expect(resposta.body.data_prazo).to.eq('2026-07-07');
    });
  });
});
