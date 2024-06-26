describe("Reviews page", () => {
  context("Given the website is online", () => {
    beforeEach(() => {
      cy.mockApiMaintenance("false");
      cy.fixture("reviews").then((reviews) => {
        this.reviews = reviews;
      });
      cy.intercept("GET", "/api/reviews", (req) => {
        req.reply({ body: { ...this.reviews } });
      }).as("allReviews");
      cy.intercept("GET", "/api/reviews/electronics*", (req) => {
        req.reply({
          body: {
            ...this.reviews,
            data: [...this.reviews.data.filter((el) => el.item_name.toLowerCase().includes("iphone"))],
          },
        });
      }).as("movieReviews");
      cy.intercept("GET", "/api/categories", {
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

      cy.visit("/reviews");
      cy.wait("@maintenanceMode");
    });

    context("When the user visits the review page", () => {
      it("Then the UI should display elements", () => {
        cy.wait("@allReviews");
        cy.get('[data-testid="testid.mainMenu.reviews"]').should("exist").contains("Reviews (39)");
        cy.get('[data-testid="testid.form.selectField.category"]').should("exist").click();
        cy.get('[id="menu-category"] ul').should("exist").children().should("have.length", 5);
        cy.get('[id="menu-category"] ul li:not(.Mui-disabled)')
          .should("exist")
          .and("have.length", 4)
          .eq(2)
          .should("contain.text", "electronics")
          .click();
        cy.get('[data-testid="testid.form.inputField.item"] > .MuiInputBase-input').should("exist").type("test");
        cy.get('[data-testid="testid.form.button.search"]').should("exist").click();
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
        cy.url().should("include", "/reviews?q=test");
      });
    });

    const selectCategory = (category) => {
      cy.get('[data-testid="testid.form.selectField.category"]').should("exist").click();
      cy.get('[id="menu-category"] ul li:not(.Mui-disabled)')
        .should("exist")
        .and("have.length", 4)
        .eq(2) // electronics TODO: change to dynamic
        .should("contain.text", category)
        .click();
    };

    context("When the user only selects a category", () => {
      it("Then the UI should allow form submit", () => {
        cy.wait("@allReviews");
        cy.get('[data-testid="testid.form.inputField.item"] > .MuiInputBase-input').should("exist");
        selectCategory("electronics");
        cy.get('[data-testid="testid.form.button.search"]').should("exist").click();
        cy.get('[data-testid="testid.form.inputField.item"]').should("not.have.class", "Mui-error");
        cy.url().should("include", "/reviews/electronics");
      });
    });

    context("When the user selects a category and types in a search term", () => {
      it("Then the UI should allow form submit", () => {
        cy.wait("@allReviews");
        cy.get('[data-testid="testid.form.inputField.item"] > .MuiInputBase-input').should("exist").type("test");
        selectCategory("electronics");
        cy.get('[data-testid="testid.form.button.search"]').should("exist").click();
        cy.get('[data-testid="testid.form.inputField.item"]').should("not.have.class", "Mui-error");
        cy.url().should("include", "/reviews/electronics?q=test");
      });
    });

    context("When the user selects a category and types in a search term and submits the form", () => {
      it("Then the UI should display the results", () => {
        cy.wait("@allReviews");
        cy.get('[data-testid="testid.form.inputField.item"] > .MuiInputBase-input').should("exist").type("iphone");
        selectCategory("electronics");
        cy.get('[data-testid="testid.form.button.search"]').should("exist").click();
        cy.wait("@movieReviews");
        cy.get('[data-testid$=".profileCard"]').should("exist").and("have.length", 2);
      });
    });
  });
});
