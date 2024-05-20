import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSession } from "next-auth/react";

import { IThemeContext, ThemeContext } from "../context/ThemeProvider";
import MainMenu from "../MainMenu";
import { mockSessionAuth, mockSessionUnAuth } from "../mockData";
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  useSession: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => "/"),
}));

const openReviewsMenu = async () => {
  const reviewsMenu = screen.getByTestId("testid.mainMenu.reviews");
  expect(reviewsMenu).toBeInTheDocument();
  await userEvent.click(reviewsMenu);
};

const validateReviewMenu = async (expected: boolean = true) => {
  if (expected) {
    expect(screen.getByTestId("testid.reviewsMenu.allReviews")).toBeInTheDocument();
    expect(screen.getByTestId("testid.reviewsMenu.movies")).toBeInTheDocument();
    expect(screen.getByTestId("testid.reviewsMenu.books")).toBeInTheDocument();
    expect(screen.getByTestId("testid.reviewsMenu.music")).toBeInTheDocument();
    expect(screen.getByTestId("testid.reviewsMenu.games")).toBeInTheDocument();
    expect(screen.getByTestId("testid.reviewsMenu.products")).toBeInTheDocument();
    expect(screen.getByTestId("testid.reviewsMenu.places")).toBeInTheDocument();
    expect(screen.getByTestId("testid.reviewsMenu.restaurants")).toBeInTheDocument();
    expect(screen.getByTestId("testid.reviewsMenu.recipes")).toBeInTheDocument();
    expect(screen.getByTestId("testid.reviewsMenu.videos")).toBeInTheDocument();
    expect(screen.getByTestId("testid.reviewsMenu.apps")).toBeInTheDocument();
    expect(screen.getByTestId("testid.reviewsMenu.services")).toBeInTheDocument();
    expect(screen.getByTestId("testid.reviewsMenu.events")).toBeInTheDocument();
    expect(screen.getByTestId("testid.reviewsMenu.other")).toBeInTheDocument();
  } else {
    expect(screen.queryByTestId("testid.reviewsMenu.allReviews")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.reviewsMenu.movies")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.reviewsMenu.bodoks")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.reviewsMenu.music")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.reviewsMenu.games")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.reviewsMenu.products")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.reviewsMenu.places")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.reviewsMenu.restaurants")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.reviewsMenu.recipes")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.reviewsMenu.videos")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.reviewsMenu.apps")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.reviewsMenu.services")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.reviewsMenu.events")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.reviewsMenu.other")).not.toBeInTheDocument();
  }
};

const closeAccountMenu = async () => {
  await userEvent.type(screen.getByTestId("testid.mainMenu.reviews"), "{escape}");
  await validateReviewMenu(false);
};

const context: IThemeContext = {
  dark: jest.fn(),
  isDark: "light",
};

describe("UserMenu", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a UserMenu - Authenticated", async () => {
    (useSession as jest.Mock).mockReturnValue(mockSessionAuth);
    render(
      <ThemeContext.Provider value={context}>
        <MainMenu />
      </ThemeContext.Provider>,
    );

    // Open the menu
    await openReviewsMenu();

    // Validate the menu
    await validateReviewMenu();

    // Close the menu
    await closeAccountMenu();
  });

  it("renders a UserMenu - Unauthenticated", async () => {
    (useSession as jest.Mock).mockReturnValue(mockSessionUnAuth);
    render(
      <ThemeContext.Provider value={context}>
        <MainMenu />
      </ThemeContext.Provider>,
    );

    await openReviewsMenu();

    await validateReviewMenu();

    // Close the menu
    await closeAccountMenu();
  });
});
