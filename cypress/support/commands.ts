/// <reference types="cypress" />

/**
 * @fileoverview Custom Cypress commands for common test operations
 */

/**
 * Checks main navigation elements are visible and enabled
 * Verifies reviews menu and account button presence
 */
Cypress.Commands.add("checkMainNavigation", () => {
  cy.get("[data-testid='testid.mainMenu.reviews']").should("be.visible").and("be.enabled");
  cy.get("[data-testid='testid.menu.accountButton']").should("be.visible").and("be.enabled");
});

/**
 * Overwrites default visit command to handle Vercel preview deployments
 * Adds necessary headers for preview environment access
 *
 * @param {Function} originalFn - Original Cypress visit function
 * @param {string} url - URL to visit
 * @param {Partial<Cypress.VisitOptions>} options - Visit options
 */
Cypress.Commands.overwrite("visit", (originalFn, url: string, options?: Partial<Cypress.VisitOptions>) => {
  const vercelProtectionBypass = Cypress.env("X_VERCEL_PROTECTION_BYPASS");
  cy.log(`Vercel protection bypass: ${vercelProtectionBypass}`);
  options = options || {};
  options.headers = options.headers || {};
  options.headers["x-vercel-protection-bypass"] = vercelProtectionBypass ?? "";
  options.headers["x-vercel-set-bypass-cookie"] = vercelProtectionBypass ? "true" : "";

  cy.log(`Visiting URL: ${url} with options: ${JSON.stringify(options)}`);

  originalFn({ url, ...options });
});

/**
 * Opens user menu and verifies appropriate menu items based on authentication state
 * Checks for:
 * - Profile link
 * - Language switcher
 * - Sign in/out buttons
 * - Notifications (for authenticated users)
 */
Cypress.Commands.add("openUserMenu", () => {
  cy.get("[data-testid='testid.menu.accountButton']").should("exist").click();
  cy.get("[role='menu']").should("exist").should("be.visible");
  cy.get("[data-testid='testid.menu.profile']").should("exist");
  cy.get("[data-testid='testid.menu.languageSwitcher']").should("exist");
  cy.get("@session")
    .its("response.body")
    .then((body) => {
      if (body.status === "authenticated" || !!body.user) {
        cy.get("[data-testid='testid.menu.signIn']").should("not.exist");
        cy.get("[data-testid='testid.menu.notifications']").should("exist");
        cy.get("[data-testid='testid.menu.signOut']").should("exist");
      } else {
        cy.get("[data-testid='testid.menu.signOut']").should("not.exist");
        cy.get("[data-testid='testid.menu.notifications']").should("not.exist");
        cy.get("[data-testid='testid.menu.signIn']").should("exist");
      }
      cy.get("body").type("{esc}");
    });
});

/**
 * Opens reviews menu and optionally selects a specific category
 *
 * @param {string} menu - Optional category to select in reviews menu
 */
Cypress.Commands.add("openReviewsMenu", (menu: string) => {
  cy.get("[data-testid='testid.mainMenu.reviews']").should("exist").click();
  if (menu) {
    cy.get(`[data-testid='testid.reviews.${menu}']`).should("exist").click();
  }
});

/**
 * Mocks maintenance mode API response
 *
 * @param {string} maintenanceMode - Maintenance mode state to mock
 */
Cypress.Commands.add("mockApiMaintenance", (maintenanceMode: string) => {
  cy.intercept("GET", "/api/maintenance", {
    statusCode: 200,
    body: {
      maintenanceMode,
    },
  }).as("maintenanceMode");
});

/**
 * Mocks notifications count API response
 *
 * @param {number} count - Number of notifications to mock
 */
Cypress.Commands.add("mockApiNotificationsCount", (count: number) => {
  cy.intercept("GET", "/api/notifications/count", {
    statusCode: 200,
    body: {
      count,
    },
  }).as("notificationsCount");
});

/**
 * Mocks authentication session API response
 *
 * @param {boolean} isAuthenticated - Whether to mock an authenticated or unauthenticated session
 */
Cypress.Commands.add("mockApiAuthSession", (isAuthenticated: boolean) => {
  if (isAuthenticated) {
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
  } else {
    cy.intercept("GET", "/api/auth/session", {
      statusCode: 200,
      body: {},
    }).as("session");
  }
});
