import { COLORS } from "../support/colors";

describe("Theme Switcher", () => {
  beforeEach(() => {
    cy.mockApiMaintenance("false");
    cy.visit("/");
    cy.wait("@maintenanceMode");
  });

  it("should have correct initial theme state", () => {
    // Check initial state (light theme)
    cy.get("body")
      .should("have.css", "background-color", COLORS.LIGHT_BACKGROUND)
      .and("have.css", "color", COLORS.DARK_TEXT);

    cy.get('[data-testid="Brightness4Icon"]').should("be.visible").and("have.css", "cursor", "pointer");
  });

  it("should change theme with proper visual feedback", () => {
    // Switch to dark theme
    cy.get('[data-testid="Brightness4Icon"]').should("be.visible").click();

    // Verify dark theme
    cy.get("body")
      .should("have.css", "background-color", COLORS.DARK_BACKGROUND)
      .and("have.css", "color", COLORS.LIGHT_TEXT);

    cy.get('[data-testid="Brightness7Icon"]').should("be.visible").and("have.css", "cursor", "pointer");

    // Switch back to light theme
    cy.get('[data-testid="Brightness7Icon"]').click();

    // Verify return to light theme
    cy.get("body")
      .should("have.css", "background-color", COLORS.LIGHT_BACKGROUND)
      .and("have.css", "color", COLORS.DARK_TEXT);

    cy.get('[data-testid="Brightness4Icon"]').should("be.visible");
  });

  it("should persist theme preference", () => {
    // Switch to dark theme
    cy.get('[data-testid="Brightness4Icon"]').click();

    // Reload the page
    cy.reload();
    cy.wait("@maintenanceMode");

    // Verify dark theme is preserved
    cy.get("body")
      .should("have.css", "background-color", COLORS.DARK_BACKGROUND)
      .and("have.css", "color", COLORS.LIGHT_TEXT);

    cy.get('[data-testid="Brightness7Icon"]').should("be.visible");
  });
});
