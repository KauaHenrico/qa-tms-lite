const { abrirTelaComDadosIniciais } = require('../support/tela');

describe('Indicação dos campos obrigatórios na tela', () => {
  beforeEach(() => {
    abrirTelaComDadosIniciais();
  });

  [
    ['destinatário', '[name="destinatario_nome"]'],
    ['cidade', '[name="cidade"]'],
    ['UF', '[name="uf"]'],
    ['transportadora', '#select-transportadora'],
    ['peso', '[name="peso_kg"]'],
    ['volumes', '[name="volumes"]'],
  ].forEach(([nome, seletor]) => {
    it(`identifica ${nome} como obrigatório`, () => {
      cy.get(seletor).should('have.attr', 'required');
    });
  });
});
