declare namespace Cypress {
  interface Chainable {
    /**
     * Vérifie la présence et l'état des éléments de navigation principaux
     */
    checkMainNavigation(): Chainable<void>;

    openUserMenu(): Chainable<void>;
    openReviewsMenu(): Chainable<void>;
    openReviewsMenu(menu: string): Chainable<void>;
    mockApiMaintenance(maintenanceMode: string): Chainable<void>;
    mockApiNotificationsCount(count: number): Chainable<void>;
    mockApiAuthSession(isAuthenticated: boolean): Chainable<void>;
  }
}
