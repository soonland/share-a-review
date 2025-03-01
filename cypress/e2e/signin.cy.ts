/**
 * @fileoverview End-to-end tests for the sign-in functionality
 */

/**
 * Test suite for sign-in page features and authentication flows
 * Tests various authentication methods: Google, Spotify, and Credentials
 */
describe("Signin Page", () => {
  /**
   * Before each test, visit the home page
   */
  beforeEach(() => {
    cy.visit("/");
  });

  /**
   * Tests for sign-in page visibility and authentication options
   */
  context("Given the user visits the signin page", () => {
    /**
     * Verifies Google authentication button visibility
     * Steps:
     * 1. Intercept session check
     * 2. Open user menu
     * 3. Click sign-in option
     * 4. Verify Google button presence
     */
    it("Then the Google login button should be visible", () => {
      cy.intercept("GET", "/api/auth/session").as("session");
      cy.openUserMenu();
      cy.get("[data-testid='testid.menu.signIn']").click();
      cy.contains("button", "Sign in with Google").should("be.visible");
    });

    /**
     * Verifies Spotify authentication button visibility
     * Steps:
     * 1. Intercept session check
     * 2. Open user menu
     * 3. Click sign-in option
     * 4. Verify Spotify button presence
     */
    it("And the Spotify login button should be visible", () => {
      cy.intercept("GET", "/api/auth/session").as("session");
      cy.openUserMenu();
      cy.get("[data-testid='testid.menu.signIn']").click();
      cy.contains("button", "Sign in with Spotify").should("be.visible");
    });
  });

  /**
   * Tests credential-based authentication flow
   */
  context("When the user clicks the Sign in with Credentials button", () => {
    /**
     * Verifies successful login with credentials
     * Steps:
     * 1. Intercept session check
     * 2. Open user menu
     * 3. Enter credentials
     * 4. Submit form
     * 5. Verify redirect to home page
     */
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
