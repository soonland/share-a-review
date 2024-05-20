describe("Home page", () => {
  context("Given the website is online", () => {
    context("When the user is authenticated", () => {
      beforeEach(() => {
        cy.mockApiMaintenance("false");
        cy.mockApiAuthSession(true);

        cy.visit("/");
        cy.wait("@maintenanceMode");
        cy.wait("@session");
      });

      it("Then the UI should display elements for an authenticated user", () => {
        cy.openUserMenu();
        cy.openReviewsMenu("movies");
      });
    });

    context("When the user is not authenticated", () => {
      beforeEach(() => {
        cy.mockApiMaintenance("false");
        cy.mockApiAuthSession(false);

        cy.visit("/");
        cy.wait("@maintenanceMode");
        cy.wait("@session");
      });

      it("Then the UI should display elements for a guest user", () => {
        cy.openUserMenu();
        cy.openReviewsMenu("movies");
      });
    });
  });
});
