/**
 * @fileoverview Type definitions for custom Cypress commands
 */

declare namespace Cypress {
  interface Chainable {
    /**
     * Checks main navigation elements' visibility and state.
     * Verifies reviews menu and account button.
     *
     * @example
     * ```ts
     * cy.checkMainNavigation()
     * ```
     */
    checkMainNavigation(): Chainable<void>;

    /**
     * Opens user menu and verifies menu items based on authentication state.
     * Checks for profile link, language switcher, and auth-specific elements.
     *
     * @example
     * ```ts
     * cy.openUserMenu()
     * ```
     */
    openUserMenu(): Chainable<void>;

    /**
     * Opens reviews menu. If menu parameter is provided, selects specific category.
     *
     * @param {string} [menu] - Optional category to select in reviews menu
     * @example
     * ```ts
     * cy.openReviewsMenu()
     * cy.openReviewsMenu('movies')
     * ```
     */
    openReviewsMenu(): Chainable<void>;
    openReviewsMenu(menu: string): Chainable<void>;

    /**
     * Mocks maintenance mode API response.
     *
     * @param {string} maintenanceMode - Maintenance mode state to mock ('true' or 'false')
     * @example
     * ```ts
     * cy.mockApiMaintenance('false')
     * ```
     */
    mockApiMaintenance(maintenanceMode: string): Chainable<void>;

    /**
     * Mocks notifications count API response.
     *
     * @param {number} count - Number of notifications to mock
     * @example
     * ```ts
     * cy.mockApiNotificationsCount(5)
     * ```
     */
    mockApiNotificationsCount(count: number): Chainable<void>;

    /**
     * Mocks authentication session API response.
     * When true, mocks an authenticated session with user data.
     * When false, mocks an unauthenticated session.
     *
     * @param {boolean} isAuthenticated - Whether to mock authenticated session
     * @example
     * ```ts
     * cy.mockApiAuthSession(true)
     * ```
     */
    mockApiAuthSession(isAuthenticated: boolean): Chainable<void>;
  }
}
