describe("Theme Switcher", () => {
  beforeEach(() => {
    cy.mockApiMaintenance("false");
    cy.visit("/");
    cy.wait("@maintenanceMode");
  });

  it("should have correct initial theme state", () => {
    // Vérification de l'état initial (thème clair)
    cy.get("body")
      .should("have.css", "background-color", "rgb(248, 247, 245)")
      .and("have.css", "color", "rgb(32, 33, 38)");

    cy.get('[data-testid="Brightness4Icon"]').should("be.visible").and("have.css", "cursor", "pointer");
  });

  it("should change theme with proper visual feedback", () => {
    // Passage au thème sombre
    cy.get('[data-testid="Brightness4Icon"]').should("be.visible").click();

    // Vérification du thème sombre
    cy.get("body")
      .should("have.css", "background-color", "rgb(0, 94, 123)")
      .and("have.css", "color", "rgb(146, 167, 175)");

    cy.get('[data-testid="Brightness7Icon"]').should("be.visible").and("have.css", "cursor", "pointer");

    // Retour au thème clair
    cy.get('[data-testid="Brightness7Icon"]').click();

    // Vérification du retour au thème clair
    cy.get("body")
      .should("have.css", "background-color", "rgb(248, 247, 245)")
      .and("have.css", "color", "rgb(32, 33, 38)");

    cy.get('[data-testid="Brightness4Icon"]').should("be.visible");
  });

  it("should persist theme preference", () => {
    // Passage au thème sombre
    cy.get('[data-testid="Brightness4Icon"]').click();

    // Rechargement de la page
    cy.reload();
    cy.wait("@maintenanceMode");

    // Vérification que le thème sombre est conservé
    cy.get("body")
      .should("have.css", "background-color", "rgb(0, 94, 123)")
      .and("have.css", "color", "rgb(146, 167, 175)");

    cy.get('[data-testid="Brightness7Icon"]').should("be.visible");
  });
});
