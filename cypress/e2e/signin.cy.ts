describe("Signin Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  context("Given the user visits the signin page", () => {
    it("Then the Google login button should be visible", () => {
      cy.intercept("GET", "/api/auth/session").as("session");
      cy.openUserMenu();
      cy.get("[data-testid='testid.menu.signIn']").click();
      cy.contains("button", "Sign in with Google").should("be.visible");
    });

    it("And the Spotify login button should be visible", () => {
      cy.intercept("GET", "/api/auth/session").as("session");
      cy.openUserMenu();
      cy.get("[data-testid='testid.menu.signIn']").click();
      cy.contains("button", "Sign in with Spotify").should("be.visible");
    });
  });

  context("Given the user signs in using an authentication provider", () => {
    context("When the user clicks the Google login button", () => {
      it("Then they should be redirected to Google login", () => {
        cy.intercept("GET", "/api/auth/session").as("session");
        cy.openUserMenu();
        cy.get("[data-testid='testid.menu.signIn']").click();
        cy.intercept("GET", "**/accounts.google.com/**", {
          statusCode: 200,
        }).as("googleLogin");
        cy.contains("button", "Sign in with Google").click();
        cy.wait("@googleLogin");
      });
    });

    context("When the user clicks the Spotify login button", () => {
      it("Then they should be redirected to Spotify login", () => {
        cy.intercept("GET", "/api/auth/session").as("session");
        cy.openUserMenu();
        cy.get("[data-testid='testid.menu.signIn']").click();
        cy.intercept("GET", "**/accounts.spotify.com/**", {
          statusCode: 200,
        }).as("spotifyLogin");
        cy.contains("button", "Sign in with Spotify").click();
        cy.wait("@spotifyLogin");
      });
    });

    context("When the user clicks the Sign in with Credentials button", () => {
      it("Then they should be redirected to the login page", () => {
        cy.intercept("GET", "/api/auth/session").as("session");
        cy.openUserMenu();
        cy.get("[data-testid='testid.menu.signIn']").click();
        cy.get("#input-username-for-credentials-provider").type("alexei@example.com");
        cy.get("#input-password-for-credentials-provider").type("password19");
        cy.contains("button", "Sign in with Credentials").click();
        cy.url().should("include", "/");
      });
    });
  });
});
