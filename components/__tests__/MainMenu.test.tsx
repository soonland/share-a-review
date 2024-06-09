import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSession } from "next-auth/react";

import { IThemeContext, ThemeContext } from "../context/ThemeProvider";
import MainMenu from "../MainMenu";
import { mockSessionAuth } from "../mockData";

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  useSession: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => "/"),
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

jest.mock("swr", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    data: {
      data: [],
    },
  }),
}));

const openReviewsMenu = async () => {
  const reviewsMenu = screen.getByTestId("testid.mainMenu.reviews");
  expect(reviewsMenu).toBeInTheDocument();
  await userEvent.click(reviewsMenu);
};

const validateReviewMenu = async (expected: boolean = true) => {
  if (expected) {
    expect(screen.getByTestId("testid.reviews.allReviews")).toBeInTheDocument();
    expect(screen.getByTestId("testid.reviews.movies")).toBeInTheDocument();
    expect(screen.getByTestId("testid.reviews.books")).toBeInTheDocument();
    // expect(screen.getByTestId("testid.reviews.music")).toBeInTheDocument();
    expect(screen.getByTestId("testid.reviews.games")).toBeInTheDocument();
    expect(screen.getByTestId("testid.reviews.electronics")).toBeInTheDocument();
    // expect(screen.getByTestId("testid.reviews.products")).toBeInTheDocument();
    // expect(screen.getByTestId("testid.reviews.places")).toBeInTheDocument();
    // expect(screen.getByTestId("testid.reviews.restaurants")).toBeInTheDocument();
    // expect(screen.getByTestId("testid.reviews.recipes")).toBeInTheDocument();
    // expect(screen.getByTestId("testid.reviews.videos")).toBeInTheDocument();
    // expect(screen.getByTestId("testid.reviews.apps")).toBeInTheDocument();
    // expect(screen.getByTestId("testid.reviews.services")).toBeInTheDocument();
    // expect(screen.getByTestId("testid.reviews.events")).toBeInTheDocument();
    expect(screen.getByTestId("testid.reviews.other")).toBeInTheDocument();
  } else {
    expect(screen.queryByTestId("testid.reviews.allReviews")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.reviews.movies")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.reviews.books")).not.toBeInTheDocument();
    // expect(screen.queryByTestId("testid.reviews.music")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.reviews.games")).not.toBeInTheDocument();
    // expect(screen.queryByTestId("testid.reviews.products")).not.toBeInTheDocument();
    // expect(screen.queryByTestId("testid.reviews.places")).not.toBeInTheDocument();
    // expect(screen.queryByTestId("testid.reviews.restaurants")).not.toBeInTheDocument();
    // expect(screen.queryByTestId("testid.reviews.recipes")).not.toBeInTheDocument();
    // expect(screen.queryByTestId("testid.reviews.videos")).not.toBeInTheDocument();
    // expect(screen.queryByTestId("testid.reviews.apps")).not.toBeInTheDocument();
    // expect(screen.queryByTestId("testid.reviews.services")).not.toBeInTheDocument();
    // expect(screen.queryByTestId("testid.reviews.events")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.reviews.electronics")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.reviews.other")).not.toBeInTheDocument();
  }
};

const closeReviewMenu = async () => {
  await userEvent.type(screen.getByTestId("testid.mainMenu.reviews"), "{escape}");
  await validateReviewMenu(false);
};

const context: IThemeContext = {
  dark: jest.fn(),
  isDark: "light",
};

describe("MainMenu", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a MainMenu", async () => {
    (useSession as jest.Mock).mockReturnValue(mockSessionAuth);
    render(
      <ThemeContext.Provider value={context}>
        <MainMenu />
      </ThemeContext.Provider>,
    );

    // Open the menu
    await openReviewsMenu();

    // // Validate the menu
    await validateReviewMenu();

    // // Close the menu
    await closeReviewMenu();
  });
});
