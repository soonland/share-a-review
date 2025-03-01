/**
 * @fileoverview End-to-end tests for the home page functionality
 */

/**
 * Test suite for home page features and behaviors
 * Tests both authenticated and unauthenticated user scenarios
 */
describe("Home page", () => {
  /**
   * Tests for online website state
   */
  context("Given the website is online", () => {
    /**
     * Tests for authenticated user scenarios
     * Verifies navigation elements, notifications, and review functionality
     */
    context("When the user is authenticated", () => {
      /**
       * Sets up test environment before each test
       * - Mocks maintenance mode as false
       * - Mocks authenticated session
       * - Mocks notifications count
       * - Intercepts API calls for reviews and categories
       */
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

      /**
       * Tests navigation elements visibility and functionality
       * Verifies:
       * - Main navigation components
       * - User menu accessibility
       * - Notification counter
       * - Reviews menu functionality
       * - Action buttons availability
       */
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

    /**
     * Tests for unauthenticated user scenarios
     * Verifies guest user experience and home page content
     */
    context("When the user is not authenticated", () => {
      /**
       * Sets up test environment for guest user
       * - Mocks maintenance mode as false
       * - Mocks unauthenticated session
       * - Intercepts API calls for items and categories
       */
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

      /**
       * Tests basic UI elements for guest users
       * Verifies:
       * - User menu accessibility
       * - Reviews menu functionality
       * - Category loading
       */
      it("Then the UI should display elements for a guest user", () => {
        cy.openUserMenu();
        cy.openReviewsMenu("movies");
        cy.wait("@categories");
        cy.wait("@movieReviews");
      });

      /**
       * Tests home page content for guest users
       * Verifies latest reviewed items are displayed
       */
      it("Then the UI should display items reviews on the home page", () => {
        cy.wait("@items");
      });
    });
  });
});
