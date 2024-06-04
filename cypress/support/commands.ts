/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

Cypress.Commands.overwrite("visit", (originalFn, url: string, options?: Partial<Cypress.VisitOptions>) => {
  // Ajoute des en-têtes personnalisés à l'option de visite
  const vercelShare = Cypress.env("VERCEL_SHARE");
  console.log(`CYPRESS_VERCEL_SHARE: ${vercelShare}`);
  console.log(`CYPRESS_VERCEL_SHARE: ${Cypress.env("CYPRESS_VERCEL_SHARE")}`);
  console.log(`options: ${JSON.stringify(options)}`);
  const qs = { _vercel_share: vercelShare ?? null };

  const filterQs = (qs?: { [key: string]: unknown }) => {
    if (!qs) return {};
    return Object.fromEntries(Object.entries(qs).filter(([, value]) => value !== null && value !== undefined));
  };

  const newOptions = {
    qs: { ...filterQs(qs) },
    ...options,
  };

  // Log une information avant de visiter l'URL
  cy.log(`Visiting URL: ${url} with options: ${JSON.stringify(newOptions)}`);

  // Appelle la commande visit originale avec les nouvelles options
  originalFn({ url, ...newOptions });
});

Cypress.Commands.add("openUserMenu", () => {
  cy.get("[data-testid='testid.menu.accountButton']").should("exist").click();
  cy.get("[role='menu']").should("exist").should("be.visible");
  cy.get("[data-testid='testid.menu.account']").should("exist");
  cy.get("[data-testid='testid.menu.profile']").should("exist");
  cy.get("[data-testid='testid.menu.languageSwitcher']").should("exist");
  cy.get("@session")
    .its("response.body")
    .then((body) => {
      if (body.status === "authenticated") {
        cy.get("[data-testid='testid.menu.signIn']").should("not.exist");
        cy.get("[data-testid='testid.menu.signOut']").should("exist");
      } else {
        cy.get("[data-testid='testid.menu.signOut']").should("not.exist");
        cy.get("[data-testid='testid.menu.signIn']").should("exist");
      }
      cy.get("body").type("{esc}");
    });
});

Cypress.Commands.add("openReviewsMenu", (menu: string) => {
  cy.get("[data-testid='testid.mainMenu.reviews']").should("exist").click();
  if (menu) {
    cy.get(`[data-testid='testid.reviews.${menu}']`).should("exist").click();
  }
});

Cypress.Commands.add("mockApiMaintenance", (maintenanceMode: string) => {
  cy.intercept("GET", "/api/maintenance", {
    statusCode: 200,
    body: {
      maintenanceMode,
    },
  }).as("maintenanceMode");
});

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
