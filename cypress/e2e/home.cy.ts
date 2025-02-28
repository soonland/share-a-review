describe("Home page", () => {
  context("Given the website is online", () => {
    context("When the user is authenticated", () => {
      beforeEach(() => {
        cy.mockApiMaintenance("false");
        cy.mockApiAuthSession(true);
        cy.mockApiNotificationsCount(3);
        cy.intercept("GET", "/api/reviews", { fixture: "reviews.json" }).as("allReviews");
        cy.intercept("GET", "/api/reviews?category=movies", { fixture: "reviews.json" }).as("movieReviews");
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

      it("Then the UI should display complete navigation elements", () => {
        cy.wait("@allReviews");

        // Vérification de la navigation principale
        cy.checkMainNavigation();

        // Vérification détaillée du menu utilisateur
        cy.openUserMenu();
        cy.get("[data-testid='testid.menu.accountButton']").and("be.visible").click();

        // Vérification des notifications
        cy.get("[data-testid='testid.menu.notifications']").should("be.visible").and("contain", "3");

        cy.get("body").type("{esc}");

        // Vérification détaillée des reviews
        cy.openReviewsMenu("movies");
        cy.wait("@movieReviews");
        cy.get('[data-testid="testid.mainMenu.reviews"]').should("contain", "Reviews (39)");
        cy.get("body").type("{esc}");

        // Vérification des boutons de review
        cy.get('[data-testid="testid.mainMenu.myReviews"]').should("be.visible").and("be.enabled");
        cy.get('[data-testid="testid.mainMenu.writeReview"]').should("be.visible").and("be.enabled");
      });
    });

    context("When the user is not authenticated", () => {
      beforeEach(() => {
        cy.mockApiMaintenance("false");
        cy.mockApiAuthSession(false);
        cy.intercept("GET", "/api/items?type=latest.reviewed", { fixture: "items.json" }).as("items");
        cy.intercept("GET", "/api/reviews?category=movies", { fixture: "reviews.json" }).as("movieReviews");
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
