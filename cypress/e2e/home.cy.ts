describe("Home page", () => {
  context("When the website is online", () => {
    beforeEach(() => {
      cy.intercept("GET", "/api/maintenance", {
        statusCode: 200,
        body: {
          maintenanceMode: "false",
        },
      }).as("maintenanceMode");
    });

    it("Check if the maintenance message is displayed", () => {
      cy.visit("/");
      cy.wait("@maintenanceMode");
      cy.get("[data-testid='testid.maintenanceMessage']").should("not.exist");
      cy.get("[data-testid='testid.appBar']").should("exist");
      cy.get("[data-testid='testid.menu.accountButton']").should("exist").click();
      cy.get("[role='menu']").should("exist").should("be.visible");
      cy.get("[data-testid='testid.menu.account']").should("exist");
      cy.get("[data-testid='testid.menu.profile']").should("exist");
      cy.get("[data-testid='testid.menu.signIn']").should("exist");
      cy.get("[data-testid='testid.menu.languageSwitcher']").should("exist");
      cy.get("[data-testid='testid.menu.signOut']").should("not.exist");
    });
  });
});
