describe("Test for maintenance message", () => {
  context("When maintenanceMode is true", () => {
    beforeEach(() => {
      cy.intercept("GET", "/api/maintenance", {
        statusCode: 200,
        body: {
          maintenanceMode: "true",
        },
      }).as("maintenanceMode");
    });

    it("Check if the maintenance message is displayed", () => {
      cy.visit("/");
      cy.wait("@maintenanceMode");
      cy.get("[data-testid='testid.maintenanceMessage']").should("exist");
    });
  });

  context("When maintenanceMode is false", () => {
    beforeEach(() => {
      cy.intercept("GET", "/api/maintenance", {
        statusCode: 200,
        body: {
          maintenanceMode: "false",
        },
      }).as("maintenanceMode");
    });

    it("Check if the maintenance message is not displayed", () => {
      cy.visit("/");
      cy.wait("@maintenanceMode");
      cy.get("[data-testid='testid.maintenanceMessage']").should("not.exist");
    });
  });
});
