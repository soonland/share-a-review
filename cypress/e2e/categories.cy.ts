describe("Categories page", () => {
  context("Given the website is online", () => {
    const filterReviews = (data, itemName) => {
      return data.filter((el) => el.item_name.toLowerCase().includes(itemName));
    };

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

    context("When the user visits the review page", () => {
      it("Then the UI should display complete category elements", () => {
        cy.wait("@allReviews");

        // Vérification de la navigation principale
        cy.checkMainNavigation();

        // Vérification détaillée du menu reviews
        cy.get('[data-testid="testid.mainMenu.reviews"]')
          .should("be.visible")
          .and("contain", "Reviews (39)")
          .and("have.css", "font-weight", "900");

        // Vérification complète du select de catégories
        const categorySelect = cy.get('[data-testid="testid.form.selectField.category"]');
        categorySelect.should("be.visible").click();

        // Vérification détaillée du menu de catégories
        const categoryMenu = cy.get('[id="menu-category"] ul');
        categoryMenu.should("be.visible").and("have.class", "MuiList-root").children().should("have.length", 5);

        // Vérification des options de catégorie
        cy.get('[id="menu-category"] ul li:not(.Mui-disabled)')
          .should("have.length", 4)
          .each(($el) => {
            cy.wrap($el).should("be.visible").and("have.css", "cursor", "pointer");
          });

        // Sélection d'une catégorie
        cy.get('[id="menu-category"] ul li:not(.Mui-disabled)')
          .eq(2)
          .should("contain.text", "electronics")
          .and("not.have.class", "Mui-disabled")
          .click();

        // Vérification du champ de recherche
        const searchInput = cy.get('[data-testid="testid.form.inputField.item"] > .MuiInputBase-input');
        searchInput
          .should("be.visible")
          .and("be.enabled")
          // .and("have.attr", "placeholder")
          .and("not.have.class", "Mui-error");

        searchInput.type("test");

        // Vérification du bouton de recherche
        cy.get('[data-testid="testid.form.button.search"]')
          .should("be.visible")
          .and("be.enabled")
          // .and("have.css", "background-color")
          .click();
      });
    });

    context("When the user leaves the search field empty with no category", () => {
      it("Then the UI should display error", () => {
        cy.wait("@allReviews");
        cy.get('[data-testid="testid.form.button.search"]').should("exist").click();
        cy.get('[data-testid="testid.form.inputField.item"]').should("have.class", "Mui-error");
      });
    });

    context("When the user only types in a search term", () => {
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

    const selectCategory = (category) => {
      cy.get('[data-testid="testid.form.selectField.category"]').should("exist").click();
      cy.get('[id="menu-category"] ul li:not(.Mui-disabled)')
        .should("exist")
        .and("have.length", 4)
        .contains(category)
        .should("contain.text", category)
        .click();
    };

    const searchWithCategoryAndTerm = (category, term = "") => {
      cy.wait("@allReviews");
      const inputField = cy.get('[data-testid="testid.form.inputField.item"] > .MuiInputBase-input');
      inputField.should("exist");
      if (term) inputField.type(term);
      selectCategory(category);
      cy.get('[data-testid="testid.form.button.search"]').should("exist").click();
    };

    context("When the user only selects a category", () => {
      it("Then the UI should allow form submit", () => {
        searchWithCategoryAndTerm("electronics");
        cy.get('[data-testid="testid.form.inputField.item"]').should("not.have.class", "Mui-error");
        cy.url().should("include", "/categories/electronics");
      });
    });

    context("When the user selects a category and types in a search term", () => {
      it("Then the UI should allow form submit", () => {
        searchWithCategoryAndTerm("electronics", "test");
        cy.get('[data-testid="testid.form.inputField.item"]').should("not.have.class", "Mui-error");
        cy.url().should("include", "/categories/electronics?q=test");
      });
    });

    context("When the user selects a category and types in a search term and submits the form", () => {
      it("Then the UI should display the results", () => {
        searchWithCategoryAndTerm("electronics", "iphone");
        cy.wait("@movieReviews");
        cy.get('[data-testid$=".profileCard"]').should("exist").and("have.length", 2);
      });
    });
  });
});
