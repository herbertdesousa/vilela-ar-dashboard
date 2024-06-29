describe('Authentication', () => {
  it('sign in / sign out', () => {
    cy.visit('http://localhost:3000');

    cy.get('[type="email"]').type('e2e@test.com');
    cy.get('[type="password"]').type('123456');
    cy.get('[type="submit"]').click();

    cy.wait(1000);

    cy.get('#logout-btn').click();

    cy.wait(1000);

    cy.get('[type="email"]');
  });
});
