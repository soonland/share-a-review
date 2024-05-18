describe("Home page", () => {
  context("Given the website is online", () => {
    beforeEach(() => {
      cy.intercept("GET", "/api/maintenance", {
        statusCode: 200,
        body: {
          maintenanceMode: "false",
        },
      }).as("maintenanceMode");
      cy.intercept("GET", "/api/auth/session", {
        statusCode: 200,
        body: {
          status: "authenticated",
          user: {
            id: "123",
            email: "",
            name: "",
            picture: "",
            locale: "",
            roles: [],
          },
        },
      }).as("session");
    });

    context("When the user is authenticated", () => {
      beforeEach(() => {
        cy.visit("/");
        cy.wait("@maintenanceMode");
        cy.wait("@session");
      });

      it("Then the UI should display elements for an authenticated user", () => {
        cy.openUserMenu();
      });
    });
  });

  context("Given the website is online", () => {
    beforeEach(() => {
      cy.intercept("GET", "/api/maintenance", {
        statusCode: 200,
        body: {
          maintenanceMode: "false",
        },
      }).as("maintenanceMode");
    });

    context("When the user is not authenticated", () => {
      beforeEach(() => {
        cy.intercept("GET", "/api/auth/session", {
          statusCode: 200,
          body: {},
        }).as("session");

        cy.visit("/");
        cy.wait("@maintenanceMode");
        cy.wait("@session");
      });

      it("Then the UI should display elements for a guest user", () => {
        cy.openUserMenu();
      });
    });
  });
});
