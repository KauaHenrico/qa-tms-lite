const {
  abrirTelaComDadosIniciais,
  filtrarPorStatus,
  buscar,
} = require('../support/tela');

describe('Busca, filtros e paginação pela tela', () => {
  beforeEach(() => {
    abrirTelaComDadosIniciais();
  });

  it('encontra uma entrega pelo código de rastreio completo', () => {
    buscar('BRD-2026-00005');

    cy.get('#tabela tr[data-id]').should('have.length', 1);
    cy.get('#tabela').should('contain.text', 'BRD-2026-00005');
  });

  it('encontra entregas por parte do nome do destinatário', () => {
    buscar('Cliente 1');

    cy.get('#tabela tr[data-id]').should('have.length.at.least', 1);
    cy.get('#tabela').should('contain.text', 'Cliente 1');
  });

  it('encontra destinatário sem diferenciar maiúsculas e minúsculas', () => {
    buscar('cliente 5');

    cy.get('#tabela tr[data-id]').should('have.length', 1);
    cy.get('#tabela').should('contain.text', 'Cliente 5');
  });

  it('encontra cidade sem exigir acentuação', () => {
    buscar('Sao Paulo');

    cy.get('#tabela tr[data-id]').should('have.length.at.least', 1);
    cy.get('#tabela').should('contain.text', 'São Paulo');
  });

  it('atualiza o contador ao buscar por código único', () => {
    buscar('BRD-2026-00005');

    cy.get('#tabela tr[data-id]').should('have.length', 1);
    cy.get('#contador').should('have.text', '1 entregas');
  });

  it('mantém canceladas ocultas e as exibe quando a opção é marcada', () => {
    filtrarPorStatus('CANCELADA');
    cy.get('#tabela').should('contain.text', 'Nenhuma entrega encontrada.');

    cy.intercept('GET', '/api/entregas*').as('incluirCanceladas');
    cy.get('#incluir-canceladas').check();
    cy.wait('@incluirCanceladas');
    cy.get('#tabela tr[data-id]').should('have.length', 3);
  });

  it('atualiza o contador ao incluir entregas canceladas', () => {
    filtrarPorStatus('CANCELADA');
    cy.intercept('GET', '/api/entregas*').as('incluirCanceladas');
    cy.get('#incluir-canceladas').check();
    cy.wait('@incluirCanceladas');

    cy.get('#tabela tr[data-id]').should('have.length', 3);
    cy.get('#contador').should('have.text', '3 entregas');
  });

  it('mostra dez itens na primeira página quando há dados suficientes', () => {
    cy.get('#tabela tr[data-id]').should('have.length', 10);
  });

  it('avança para a segunda página pelo botão Próxima', () => {
    cy.intercept('GET', '/api/entregas*').as('proximaPagina');
    cy.contains('button', 'Próxima').click();
    cy.wait('@proximaPagina');

    cy.get('#pagina').should('have.text', 'Página 2');
    cy.get('#tabela tr[data-id]').should('have.length.at.least', 1);
  });
});

describe('Contador após filtro de status', () => {
  beforeEach(() => {
    abrirTelaComDadosIniciais();
  });

  it('mostra no contador somente as entregas em trânsito', () => {
    filtrarPorStatus('EM_TRANSITO');

    cy.get('#tabela tr[data-id]').should('have.length.at.least', 1).then(($linhas) => {
      cy.get('#contador').should('have.text', `${$linhas.length} entregas`);
    });
  });
});
