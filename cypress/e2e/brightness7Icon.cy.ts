describe("Test for the presence of the Brightness icon", () => {
  it("Check the presence of the Brightness7 icon", () => {
    cy.visit("http://localhost:3000");
    cy.get('[data-testid="Brightness7Icon"]').should("exist");
  });
});

describe("Test for theme change", () => {
  it("Verify theme change", () => {
    cy.visit("http://localhost:3000");
    cy.get('[data-testid="Brightness7Icon"]')
      .should("exist")
      .then(() => {
        cy.get('[data-testid="Brightness7Icon"]').click();
        cy.wait(1000);
        cy.get('[data-testid="Brightness4Icon"]').should("exist");
      });
    cy.get('[data-testid="Brightness4Icon"]')
      .should("exist")
      .then(() => {
        cy.get('[data-testid="Brightness4Icon"]').click();
        cy.wait(1000);
        cy.get('[data-testid="Brightness7Icon"]').should("exist");
      });
  });
});
