describe('Document', () => {
  it('create and list documents', () => {
    cy.visit('http://localhost:3000');

    cy.get('[type="email"]').type('e2e@test.com');
    cy.get('[type="password"]').type('Test@357');
    cy.get('[type="submit"]').click();

    cy.wait(1000);

    cy.get('#document-nav').click();

    cy.get('#add-document').click();

    cy.wait(1000);

    const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
    // eslint-disable-next-line consistent-return
    cy.on('uncaught:exception', err => {
      if (resizeObserverLoopErrRe.test(err.message)) {
        return false;
      }
    });

    /* cy.get('#document-type > div').click();
    cy.get(':nth-child(2) > .py-2').click();

    cy.get('#add_bank_details_page').click();
    cy.get('#show_company_info').click();
    cy.get('#show_signatures').click();

    cy.get('#Cabeçalho > button').click();
    //#region header
    cy.get('#layers\\[0\\]\\.representative_engineer').type('rodrigo');

    cy.get('#layers\\[0\\]\\.representative_architect').type('maria');

    cy.get('#layers\\[0\\]\\.customer\\.name').type('expak');

    cy.get('#document-nav-title').should('have.text', 'Recibo - expak');

    cy.get('#layers\\[0\\]\\.customer\\.document').type('12.121.212/1212-22');

    cy.get('#layers\\[0\\]\\.customer\\.representative').type('joao');

    cy.get('#layers\\[0\\]\\.address\\.postalCode').type('02207-080');

    cy.wait(1000);

    cy.get('#layers\\[0\\]\\.address\\.number').type('148');

    cy.get('#layers\\[0\\]\\.address\\.complement').type('a');

    cy.get('#layers\\[0\\]\\.address\\.street').should(
      'have.value',
      'Rua Carlos Alberto Luiz',
    );
    cy.get('#layers\\[0\\]\\.address\\.neighborhood').should(
      'have.value',
      'Vila Medeiros',
    );
    cy.get('#layers\\[0\\]\\.address\\.city').should('have.value', 'São Paulo');
    cy.get('#layers\\[0\\]\\.address\\.state').should('have.value', 'SP');

    cy.get('#back-button').click();
    //#endregion
    */

    // cy.get('#Bloco I > button').click();
    cy.get('#Bloco\\ I-btn').click();

    //#region block I
    cy.get('#tab-header').should('have.text', 'Bloco I');

    cy.get('#select-name').click();
    cy.get(':nth-child(1) > .py-2 > .text-accent-6').click();

    cy.get('#description-field').type('descrição');

    cy.get('#price-field').type('R$1.200,00');

    cy.get('#select-materials > .w-full').click();
    cy.get(':nth-child(1) > .py-2').click();
    cy.get('#select-materials > .w-full').click();
    cy.get(':nth-child(1) > .py-2 > .text-accent-6').click();
    cy.get('#select-materials > .w-full').click();
    cy.get(':nth-child(1) > .py-2').click();
    cy.get('#material-1 > .flex > .mr-2').click();

    //#endregion
    // cy.get('.text-left > .text-accent-3').click();
    // cy.get('.py-6 > .font-merriweather').click();
    // cy.get('.mx-2').click();
    /* ==== Generated with Cypress Studio ==== */
    // cy.get('.text-left > .text-accent-3').click();
    // cy.get('.py-6 > .font-merriweather').click();
    // cy.get(':nth-child(2) > :nth-child(2) > .h-10 > .w-full').click();
    // cy.get(':nth-child(1) > .py-2').click();
    // cy.get(':nth-child(3) > :nth-child(2) > .h-10 > .w-full').click();
    // cy.get(':nth-child(1) > .py-2 > .text-accent-6').click();
    /* ==== End Cypress Studio ==== */
  });
});
