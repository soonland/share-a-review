import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import LeftMenu from "../LeftMenu";

describe("LeftMenu", () => {
  test("renders without crashing", () => {
    render(<LeftMenu />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders all menu items", async () => {
    render(<LeftMenu />);
    await userEvent.click(screen.getByRole("button"));
    const menuItems = screen.getAllByRole("menuitem");
    expect(menuItems).toHaveLength(10);
  });

  it("displays correct menu item text", async () => {
    render(<LeftMenu />);
    await userEvent.click(screen.getByRole("button"));
    const menuItemTexts = screen
      .getAllByRole("menuitem")
      .splice(1)
      .map((menuItem) => menuItem.textContent);
    const expectedMenuItemTexts = [
      "mainMenu.reviewsMenu.allReviews",
      "mainMenu.reviewsMenu.movies",
      "mainMenu.reviewsMenu.electronics",
      "mainMenu.reviewsMenu.books",
      // "mainMenu.reviewsMenu.music",
      "mainMenu.reviewsMenu.games",
      // "mainMenu.reviewsMenu.products",
      // "mainMenu.reviewsMenu.places",
      "mainMenu.reviewsMenu.restaurants",
      // "mainMenu.reviewsMenu.recipes",
      // "mainMenu.reviewsMenu.videos",
      // "mainMenu.reviewsMenu.apps",
      // "mainMenu.reviewsMenu.services",
      // "mainMenu.reviewsMenu.events",
      "mainMenu.reviewsMenu.other",
      "mainMenu.myReviews",
      "mainMenu.writeReview",
    ];
    expect(menuItemTexts).toEqual(expectedMenuItemTexts);
  });
});
