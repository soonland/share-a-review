describe("Given the user is logged in", () => {
  context("When the user clicks on the logout button", () => {
    it.skip("Then the user should be redirected to the signin page and no longer have access to authenticated features", () => {
      cy.visit("/");
      cy.intercept("GET", "/api/auth/session").as("session");
      cy.openUserMenu();
      cy.get("[data-testid='testid.menu.signIn']").click();
      cy.get("#input-username-for-credentials-provider").type("alexei@example.com");
      cy.get("#input-password-for-credentials-provider").type("password19");
      cy.contains("button", "Sign in with Credentials").click();
      cy.openUserMenu();
      cy.wait("@session");
      cy.get("[data-testid='testid.menu.signOut']").click();
    });
  });
});
