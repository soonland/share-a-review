/**
 * @fileoverview End-to-end tests for the maintenance message functionality
 */

/**
 * Test suite for maintenance message display behavior
 * Tests visibility of maintenance message based on maintenance mode state
 */
describe("Test for maintenance message", () => {
  /**
   * Tests behavior when maintenance mode is enabled
   */
  context("When maintenanceMode is true", () => {
    /**
     * Sets up test environment before each test
     * - Mocks maintenance mode API to return true
     */
    beforeEach(() => {
      cy.intercept("GET", "/api/maintenance", {
        statusCode: 200,
        body: {
          maintenanceMode: "true",
        },
      }).as("maintenanceMode");
    });

    /**
     * Tests maintenance message visibility when mode is enabled
     * Verifies that the maintenance message element is present in the DOM
     */
    it("Check if the maintenance message is displayed", () => {
      cy.visit("/");
      cy.wait("@maintenanceMode");
      cy.get("[data-testid='testid.maintenanceMessage']").should("exist");
    });
  });

  /**
   * Tests behavior when maintenance mode is disabled
   */
  context("When maintenanceMode is false", () => {
    /**
     * Sets up test environment before each test
     * - Mocks maintenance mode API to return false
     */
    beforeEach(() => {
      cy.intercept("GET", "/api/maintenance", {
        statusCode: 200,
        body: {
          maintenanceMode: "false",
        },
      }).as("maintenanceMode");
    });

    /**
     * Tests maintenance message visibility when mode is disabled
     * Verifies that the maintenance message element is not present in the DOM
     */
    it("Check if the maintenance message is not displayed", () => {
      cy.visit("/");
      cy.wait("@maintenanceMode");
      cy.get("[data-testid='testid.maintenanceMessage']").should("not.exist");
    });
  });
});
