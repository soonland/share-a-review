declare namespace Cypress {
  interface Chainable {
    openUserMenu(): Chainable<void>;
    openReviewsMenu(): Chainable<void>;
    openReviewsMenu(menu: string): Chainable<void>;
    mockApiMaintenance(maintenanceMode: string): Chainable<void>;
    mockApiAuthSession(isAuthenticated: boolean): Chainable<void>;
  }
}
