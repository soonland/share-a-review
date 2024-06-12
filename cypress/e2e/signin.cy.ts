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
