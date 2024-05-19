declare namespace Cypress {
  interface Chainable {
    openUserMenu(): Chainable<void>;
    openReviewsMenu(): Chainable<void>;
    openReviewsMenu(menu: string): Chainable<void>;
  }
}
