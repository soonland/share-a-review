describe("Test for maintenance message", () => {
  context("When maintenanceMode is true", () => {
    beforeEach(() => {
      cy.intercept("GET", "/api/maintenance", {
        statusCode: 200,
        body: {
          maintenanceMode: "true",
        },
      });
      cy.visit("/");
    });

    it("Check if the maintenance message is displayed", () => {
      cy.get(".MuiBackdrop-root > .MuiBox-root").should("exist");
    });
  });

  context("When maintenanceMode is false", () => {
    beforeEach(() => {
      cy.intercept("GET", "/api/maintenance", {
        statusCode: 200,
        body: {
          maintenanceMode: "true",
        },
      });
      cy.visit("/");
    });

    it("Check if the maintenance message is not displayed", () => {
      cy.get(".MuiBackdrop-root > .MuiBox-root").should("not.exist");
    });
  });
});
