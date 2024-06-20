describe("Home page", () => {
  context("Given the website is online", () => {
    context("When the user is authenticated", () => {
      beforeEach(() => {
        cy.mockApiMaintenance("false");
        cy.mockApiAuthSession(true);
        cy.intercept("GET", "/api/reviews*", { fixture: "reviews.json" }).as("movieReviews");
        cy.intercept("GET", "/api/categories", {
          body: {
            success: true,
            data: [
              { value: "movies", label: "Movies" },
              { value: "series", label: "Series" },
              { value: "books", label: "Books" },
            ],
          },
        }).as("categories");

        cy.visit("/");

        cy.wait("@maintenanceMode");
        cy.wait("@session");
      });

      it("Then the UI should display elements for an authenticated user", () => {
        cy.openUserMenu();
        cy.openReviewsMenu("movies");
        cy.wait("@movieReviews");
      });

      it("Then the user should see 3 main menu items", () => {
        cy.wait("@movieReviews");
        cy.get('[data-testid="testid.mainMenu.reviews"]').should("exist").contains("Reviews (39)");
        cy.get('[data-testid="testid.mainMenu.myReviews"]').should("exist");
        cy.get('[data-testid="testid.mainMenu.writeReview"]').should("exist");
      });
    });

    context("When the user is not authenticated", () => {
      beforeEach(() => {
        cy.mockApiMaintenance("false");
        cy.mockApiAuthSession(false);
        cy.intercept("GET", "/api/items?type=home", { fixture: "items.json" }).as("items");
        cy.intercept("GET", "/api/reviews*", { fixture: "reviews.json" }).as("movieReviews");
        cy.intercept("GET", "/api/categories", {
          body: {
            success: true,
            data: [
              { value: "movies", label: "Movies" },
              { value: "series", label: "Series" },
              { value: "books", label: "Books" },
            ],
          },
        }).as("categories");

        cy.visit("/");
        cy.wait("@maintenanceMode");
        cy.wait("@session");
      });

      it("Then the UI should display elements for a guest user", () => {
        cy.openUserMenu();
        cy.openReviewsMenu("movies");
        cy.wait("@movieReviews");
      });

      it("Then the UI should display items reviews on the home page", () => {
        cy.wait("@items");
      });
    });
  });
});
