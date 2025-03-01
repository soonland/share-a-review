/**
 * @fileoverview End-to-end tests for the categories page functionality
 */

/**
 * Test suite for categories page features and behaviors
 * Tests search functionality, category selection, and form validation
 */
describe("Categories page", () => {
  /**
   * Tests for online website state
   */
  context("Given the website is online", () => {
    /**
     * Filters reviews based on item name
     *
     * @param {Array} data - Array of review objects
     * @param {string} itemName - Name to filter by
     * @returns {Array} Filtered reviews array
     */
    const filterReviews = (data, itemName) => {
      return data.filter((el) => el.item_name.toLowerCase().includes(itemName));
    };

    /**
     * Sets up test environment before each test
     * - Mocks maintenance mode
     * - Loads review fixtures
     * - Intercepts API calls for reviews and categories
     */
    beforeEach(() => {
      cy.mockApiMaintenance("false");
      cy.fixture("reviews").then((reviews) => {
        this.reviews = reviews;
      });
      cy.intercept("GET", "/api/reviews", (req) => {
        req.reply({ body: { ...this.reviews } });
      }).as("allReviews");
      cy.intercept("GET", "/api/reviews?category*", (req) => {
        req.reply({
          body: {
            ...this.reviews,
            data: filterReviews(this.reviews.data, "iphone"),
          },
        });
      }).as("movieReviews");
      cy.intercept("GET", "/api/categories/list", {
        body: {
          success: true,
          data: [
            { value: "movies", label: "movies" },
            { value: "series", label: "series" },
            { value: "electronics", label: "electronics" },
            { value: "books", label: "books" },
          ],
        },
      }).as("categories");

      cy.visit("/categories");
      cy.wait("@maintenanceMode");
    });

    /**
     * Tests for initial page load and category UI elements
     */
    context("When the user visits the review page", () => {
      /**
       * Tests category UI elements and interactions
       * Verifies:
       * - Navigation elements
       * - Category dropdown functionality
       * - Search input behavior
       * - Search button functionality
       */
      it("Then the UI should display complete category elements", () => {
        cy.wait("@allReviews");

        // Check main navigation
        cy.checkMainNavigation();

        // Detailed check of reviews menu
        cy.get('[data-testid="testid.mainMenu.reviews"]')
          .should("be.visible")
          .and("contain", "Reviews (39)")
          .and("have.css", "font-weight", "900");

        // Complete check of category select
        const categorySelect = cy.get('[data-testid="testid.form.selectField.category"]');
        categorySelect.should("be.visible").click();

        // Detailed check of categories menu
        const categoryMenu = cy.get('[id="menu-category"] ul');
        categoryMenu.should("be.visible").and("have.class", "MuiList-root").children().should("have.length", 5);

        // Check category options
        cy.get('[id="menu-category"] ul li:not(.Mui-disabled)')
          .should("have.length", 4)
          .each(($el) => {
            cy.wrap($el).should("be.visible").and("have.css", "cursor", "pointer");
          });

        // Category selection
        cy.get('[id="menu-category"] ul li:not(.Mui-disabled)')
          .eq(2)
          .should("contain.text", "electronics")
          .and("not.have.class", "Mui-disabled")
          .click();

        // Check search field
        const searchInput = cy.get('[data-testid="testid.form.inputField.item"] > .MuiInputBase-input');
        searchInput.should("be.visible").and("be.enabled").and("not.have.class", "Mui-error");

        searchInput.type("test");

        // Check search button
        cy.get('[data-testid="testid.form.button.search"]').should("be.visible").and("be.enabled").click();
      });
    });

    /**
     * Tests form validation for empty search
     */
    context("When the user leaves the search field empty with no category", () => {
      /**
       * Verifies error display for empty search
       */
      it("Then the UI should display error", () => {
        cy.wait("@allReviews");
        cy.get('[data-testid="testid.form.button.search"]').should("exist").click();
        cy.get('[data-testid="testid.form.inputField.item"]').should("have.class", "Mui-error");
      });
    });

    /**
     * Tests search with term only
     */
    context("When the user only types in a search term", () => {
      /**
       * Verifies form submission with search term only
       */
      it("Then the UI should allow form submit", () => {
        cy.wait("@allReviews");
        cy.get('[data-testid="testid.form.inputField.item"] > .MuiInputBase-input').should("exist").type("test");
        cy.get('[data-testid="testid.form.selectField.category"]')
          .should("exist")
          .get("input")
          .should("not.have.value");
        cy.get('[data-testid="testid.form.button.search"]').should("exist").click();
        cy.get('[data-testid="testid.form.inputField.item"]').should("not.have.class", "Mui-error");
        cy.url().should("include", "/categories?q=test");
      });
    });

    /**
     * Helper function to select a category from the dropdown
     *
     * @param {string} category - Category name to select
     */
    const selectCategory = (category) => {
      cy.get('[data-testid="testid.form.selectField.category"]').should("exist").click();
      cy.get('[id="menu-category"] ul li:not(.Mui-disabled)')
        .should("exist")
        .and("have.length", 4)
        .contains(category)
        .should("contain.text", category)
        .click();
    };

    /**
     * Helper function to perform search with category and optional term
     *
     * @param {string} category - Category to search in
     * @param {string} [term=""] - Optional search term
     */
    const searchWithCategoryAndTerm = (category, term = "") => {
      cy.wait("@allReviews");
      const inputField = cy.get('[data-testid="testid.form.inputField.item"] > .MuiInputBase-input');
      inputField.should("exist");
      if (term) inputField.type(term);
      selectCategory(category);
      cy.get('[data-testid="testid.form.button.search"]').should("exist").click();
    };

    /**
     * Tests category-only search
     */
    context("When the user only selects a category", () => {
      /**
       * Verifies form submission with category only
       */
      it("Then the UI should allow form submit", () => {
        searchWithCategoryAndTerm("electronics");
        cy.get('[data-testid="testid.form.inputField.item"]').should("not.have.class", "Mui-error");
        cy.url().should("include", "/categories/electronics");
      });
    });

    /**
     * Tests search with both category and term
     */
    context("When the user selects a category and types in a search term", () => {
      /**
       * Verifies form submission with both category and search term
       */
      it("Then the UI should allow form submit", () => {
        searchWithCategoryAndTerm("electronics", "test");
        cy.get('[data-testid="testid.form.inputField.item"]').should("not.have.class", "Mui-error");
        cy.url().should("include", "/categories/electronics?q=test");
      });
    });

    /**
     * Tests search results display
     */
    context("When the user selects a category and types in a search term and submits the form", () => {
      /**
       * Verifies search results display correctly
       */
      it("Then the UI should display the results", () => {
        searchWithCategoryAndTerm("electronics", "iphone");
        cy.wait("@movieReviews");
        cy.get('[data-testid$=".profileCard"]').should("exist").and("have.length", 2);
      });
    });
  });
});
