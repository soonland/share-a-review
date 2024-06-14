describe("Reviews page", () => {
  context("Given the website is online", () => {
    context("When the user visits the review page", () => {
      beforeEach(() => {
        cy.mockApiMaintenance("false");
        cy.intercept("GET", "/api/reviews", { fixture: "reviews.json" }).as("movieReviews");
        cy.intercept("GET", "/api/categories", {
          body: {
            success: true,
            data: [
              { value: "movies", label: "movies" },
              { value: "series", label: "series" },
              { value: "books", label: "books" },
            ],
          },
        }).as("categories");

        cy.visit("/reviews");
        cy.wait("@maintenanceMode");
      });

      it("Then the UI should display elements for a guest user", () => {
        cy.wait("@movieReviews");
        cy.get('[data-testid="testid.mainMenu.reviews"]').should("exist").contains("Reviews (10)");
        cy.get('[data-testid="testid.form.selectField.category"]').should("exist").click();
        cy.get('[id="menu-category"] ul').should("exist").children().should("have.length", 4);
        cy.get('[id="menu-category"] ul li:not(.Mui-disabled)')
          .should("exist")
          .and("have.length", 3)
          .eq(0)
          .should("contain.text", "movies")
          .click();
        cy.get('[data-testid="testid.form.inputField.item"] > .MuiInputBase-input').should("exist").type("test");
        cy.get('[data-testid="testid.form.button.search"]').should("exist").click();
      });
    });
  });
});
