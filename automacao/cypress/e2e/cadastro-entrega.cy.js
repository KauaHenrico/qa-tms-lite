const entregaValida = {
  id_transportadora: 1,
  destinatario_nome: 'Destinatário de teste',
  cidade: 'Curitiba',
  uf: 'PR',
  peso_kg: 5,
  volumes: 1,
  data_coleta: '2026-07-02',
};

describe('Validação do cadastro de entrega', () => {
  beforeEach(() => {
    cy.request('POST', '/_reset').its('status').should('eq', 200);
  });

  it('recusa peso igual a zero', () => {
    cy.request({
      method: 'POST',
      url: '/api/entregas',
      failOnStatusCode: false,
      body: { ...entregaValida, peso_kg: 0 },
    }).then((resposta) => {
      expect(resposta.status).to.eq(422);
      expect(resposta.body.erro).to.match(/peso/i);
    });
  });

  it('recusa volume fracionado', () => {
    cy.request({
      method: 'POST',
      url: '/api/entregas',
      failOnStatusCode: false,
      body: { ...entregaValida, volumes: 1.5 },
    }).then((resposta) => {
      expect(resposta.status).to.eq(422);
      expect(resposta.body.erro).to.match(/volume/i);
    });
  });
});
