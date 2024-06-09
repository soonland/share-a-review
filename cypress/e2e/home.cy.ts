describe("Home page", () => {
  context("Given the website is online", () => {
    context("When the user is authenticated", () => {
      beforeEach(() => {
        cy.mockApiMaintenance("false");
        cy.mockApiAuthSession(true);
        cy.intercept("GET", "/api/reviews", { fixture: "reviews.json" }).as("reviews");

        cy.visit("/");

        cy.wait("@maintenanceMode");
        cy.wait("@session");
      });

      it("Then the UI should display elements for an authenticated user", () => {
        cy.openUserMenu();
        cy.openReviewsMenu("movies");
        cy.wait("@reviews");
      });

      it("Then the user should see 3 main menu items", () => {
        cy.get('[data-testid="testid.mainMenu.reviews"]').should("exist").contains("Reviews (10)");
        cy.get('[data-testid="testid.mainMenu.myReviews"]').should("exist");
        cy.get('[data-testid="testid.mainMenu.writeReview"]').should("exist");
      });
    });

    context("When the user is not authenticated", () => {
      beforeEach(() => {
        cy.mockApiMaintenance("false");
        cy.mockApiAuthSession(false);
        cy.intercept("GET", "/api/reviews/movies", { fixture: "reviews.json" }).as("reviews");

        cy.visit("/");
        cy.wait("@maintenanceMode");
        cy.wait("@session");
      });

      it("Then the UI should display elements for a guest user", () => {
        cy.openUserMenu();
        cy.openReviewsMenu("movies");
        cy.wait("@reviews");
      });
    });
  });
});
