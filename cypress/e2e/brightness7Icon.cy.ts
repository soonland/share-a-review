describe("Test for Brightness7Icon", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/maintenance", {
      statusCode: 200,
      body: {
        maintenanceMode: "false",
      },
    });
    cy.visit("/");
  });

  it("Check if Brightness7Icon exist", () => {
    cy.get('[data-testid="Brightness7Icon"]').should("exist");
  });

  it("Verify theme change from Light to Dark and Dark to Light", () => {
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
