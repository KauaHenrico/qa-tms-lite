const {
  abrirTelaComDadosIniciais,
  preencherFormulario,
} = require('../support/tela');

describe('Código de rastreio gerado pelo cadastro', () => {
  beforeEach(() => {
    abrirTelaComDadosIniciais();
  });

  it('gera códigos diferentes quando o usuário envia dois cadastros rapidamente', () => {
    cy.intercept('POST', '/api/entregas').as('criarEntrega');
    preencherFormulario({ destinatario_nome: 'Cliente dois cliques' });

    cy.contains('button', 'Cadastrar entrega').dblclick();
    cy.wait(['@criarEntrega', '@criarEntrega']).then(([primeira, segunda]) => {
      expect(primeira.response.body.codigo).not.to.eq(segunda.response.body.codigo);
    });
  });
});
