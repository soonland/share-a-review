describe("Home page", () => {
  context("Given the website is online", () => {
    context("When the user is authenticated", () => {
      beforeEach(() => {
        cy.mockApiMaintenance("false");
        cy.mockApiAuthSession(true);
        cy.mockApiNotificationsCount(3);
        cy.intercept("GET", "/api/reviews", { fixture: "reviews.json" }).as("allReviews");
        cy.intercept("GET", "/api/categories/movies", { fixture: "reviews.json" }).as("movieReviews");
        cy.intercept("GET", "/api/categories/list", {
          body: {
            success: true,
            data: [
              { value: "movies", label: "movies" },
              { value: "series", label: "series" },
              { value: "books", label: "books" },
            ],
          },
        }).as("categories");

        cy.visit("/");

        cy.wait("@maintenanceMode");
        cy.wait("@session");
      });

      it("Then the UI should display elements for an authenticated user", () => {
        cy.wait("@allReviews");
        cy.openUserMenu();
        cy.get("[data-testid='testid.menu.accountButton']").should("exist").click();
        cy.get("[data-testid='testid.menu.notifications']").should("exist");
        cy.get("[data-testid='testid.menu.notifications']").contains("3");
        cy.get("body").type("{esc}");
        cy.openReviewsMenu("movies");
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
        cy.intercept("GET", "/api/items?type=latest.reviewed", { fixture: "items.json" }).as("items");
        cy.intercept("GET", "/api/categories/movies", { fixture: "reviews.json" }).as("movieReviews");
        cy.intercept("GET", "/api/categories/list", {
          body: {
            success: true,
            data: [
              { value: "movies", label: "movies" },
              { value: "series", label: "series" },
              { value: "books", label: "books" },
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
        cy.wait("@categories");
        cy.wait("@movieReviews");
      });

      it("Then the UI should display items reviews on the home page", () => {
        cy.wait("@items");
      });
    });
  });
});
