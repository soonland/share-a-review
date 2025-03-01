/**
 * @fileoverview End-to-end tests for the sign-out functionality
 */

/**
 * Test suite for authenticated user sign-out flow
 * Verifies sign-out process and post-logout state
 */
describe("Given the user is logged in", () => {
  /**
   * Tests for sign-out action and its effects
   */
  context("When the user clicks on the logout button", () => {
    /**
     * Verifies complete sign-out flow and access restrictions
     * Currently skipped (it.skip) - may need update for new auth flow
     *
     * Steps:
     * 1. Visit home page
     * 2. Intercept session check
     * 3. Sign in with credentials
     * 4. Open user menu
     * 5. Click sign-out
     * 6. Verify redirect and access restrictions
     *
     * @note Test is currently skipped and may need updates
     * for the latest authentication implementation
     */
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
