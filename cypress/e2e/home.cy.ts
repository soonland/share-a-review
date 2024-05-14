describe("Home page", () => {
  it("Visit home page and validate components", () => {
    cy.visit("http://localhost:3000");

    cy.get("[data-testid='testid.appBar']").should("exist");
    cy.get("[data-testid='testid.menuButton']").should("exist");
    cy.get("[data-testid='testid.changeThemeMode']").should("exist");
    cy.get("[data-testid='testid.footer']").should("exist");
  });
});
