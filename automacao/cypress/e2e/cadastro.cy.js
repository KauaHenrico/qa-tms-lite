const {
  abrirTelaComDadosIniciais,
  preencherFormulario,
  enviarFormulario,
  buscar,
} = require('../support/tela');

describe('Campos do formulário de cadastro', () => {
  beforeEach(() => {
    abrirTelaComDadosIniciais();
  });

  [
    ['destinatário', { destinatario_nome: null }, 'destinatario_nome'],
    ['cidade', { cidade: null }, 'cidade'],
    ['UF', { uf: null }, 'uf'],
  ].forEach(([nome, dados, campo]) => {
    it(`mostra erro quando ${nome} não é preenchido`, () => {
      preencherFormulario(dados);
      enviarFormulario();

      cy.get('#mensagem-form').should('have.class', 'erro');
      cy.get('#mensagem-form').should('contain.text', campo);
    });
  });

  [
    ['destinatário', { destinatario_nome: '   ' }],
    ['cidade', { cidade: '   ' }],
    ['UF', { uf: '  ' }],
  ].forEach(([nome, dados]) => {
    it(`recusa ${nome} preenchido somente com espaços`, () => {
      preencherFormulario(dados);
      enviarFormulario();

      cy.get('#mensagem-form').should('have.class', 'erro');
    });
  });

  [
    ['peso negativo', { peso_kg: '-1' }, '[name="peso_kg"]'],
    ['volume zero', { volumes: '0' }, '[name="volumes"]'],
    ['volume negativo', { volumes: '-1' }, '[name="volumes"]'],
    ['peso e volumes vazios', { peso_kg: null, volumes: null }, '[name="peso_kg"]'],
  ].forEach(([nome, dados, seletor]) => {
    it(`recusa ${nome}`, () => {
      preencherFormulario(dados);
      enviarFormulario();

      cy.get('#mensagem-form').should('have.class', 'erro');
      cy.get(seletor).should('not.have.value', '');
    });
  });

  it('mantém os valores preenchidos quando o cadastro é recusado', () => {
    preencherFormulario({ peso_kg: '0' });
    enviarFormulario();

    cy.get('[name="destinatario_nome"]').should('have.value', 'Destinatário de teste');
    cy.get('[name="peso_kg"]').should('have.value', '0');
  });

  it('cadastra uma entrega válida pela tela e a encontra pela busca', () => {
    cy.intercept('POST', '/api/entregas').as('criarEntrega');
    preencherFormulario({ destinatario_nome: 'Cliente cadastro válido' });
    enviarFormulario();
    cy.wait('@criarEntrega');

    cy.get('#mensagem-form').should('have.class', 'sucesso').invoke('text').then((mensagem) => {
      const codigo = mensagem.match(/BRD-2026-\d{5}/)[0];
      buscar(codigo);
      cy.get('#tabela tr[data-id]').should('have.length', 1);
      cy.get('#tabela').should('contain.text', 'Cliente cadastro válido');
    });
  });
});

describe('Validação numérica do cadastro pela tela', () => {
  beforeEach(() => {
    abrirTelaComDadosIniciais();
  });

  it('recusa peso igual a zero ao enviar o formulário', () => {
    cy.intercept('POST', '/api/entregas').as('criarEntrega');
    preencherFormulario({ peso_kg: '0' });
    enviarFormulario();
    cy.wait('@criarEntrega');

    cy.get('#mensagem-form').should('have.class', 'erro');
    cy.get('#mensagem-form').should('contain.text', 'peso');
    cy.get('[name="peso_kg"]').should('have.value', '0');
  });

  it('bloqueia volume fracionado antes do envio do formulário', () => {
    preencherFormulario({ volumes: '1.5' });
    enviarFormulario();

    cy.get('[name="volumes"]').then(($campo) => {
      expect($campo[0].checkValidity()).to.eq(false);
    });
    cy.get('#mensagem-form').should('have.text', '');
    cy.get('[name="volumes"]').should('have.value', '1.5');
  });
});

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
