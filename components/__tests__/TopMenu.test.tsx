import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSession } from "next-auth/react";

import { IThemeContext, ThemeContext } from "../context/ThemeProvider";
import { mockSessionAuth, mockSessionUnAuth } from "../mockData";
import TopMenu from "../TopMenu";
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
  const reviewsMenu = screen.getByTestId("testid.topMenu.reviews");
  expect(reviewsMenu).toBeInTheDocument();
  await userEvent.click(reviewsMenu);
};

const validateTopMenu = async (expected: boolean = true) => {
  if (expected) {
    expect(screen.getByTestId("testid.subMenus.allReviews")).toBeInTheDocument();
    expect(screen.getByTestId("testid.subMenus.movies")).toBeInTheDocument();
    expect(screen.getByTestId("testid.subMenus.books")).toBeInTheDocument();
    expect(screen.getByTestId("testid.subMenus.music")).toBeInTheDocument();
    expect(screen.getByTestId("testid.subMenus.games")).toBeInTheDocument();
    expect(screen.getByTestId("testid.subMenus.products")).toBeInTheDocument();
    expect(screen.getByTestId("testid.subMenus.places")).toBeInTheDocument();
    expect(screen.getByTestId("testid.subMenus.restaurants")).toBeInTheDocument();
    expect(screen.getByTestId("testid.subMenus.recipes")).toBeInTheDocument();
    expect(screen.getByTestId("testid.subMenus.videos")).toBeInTheDocument();
    expect(screen.getByTestId("testid.subMenus.apps")).toBeInTheDocument();
    expect(screen.getByTestId("testid.subMenus.services")).toBeInTheDocument();
    expect(screen.getByTestId("testid.subMenus.events")).toBeInTheDocument();
    expect(screen.getByTestId("testid.subMenus.other")).toBeInTheDocument();
  } else {
    expect(screen.queryByTestId("testid.subMenus.allReviews")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.subMenus.movies")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.subMenus.bodoks")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.subMenus.music")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.subMenus.games")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.subMenus.products")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.subMenus.places")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.subMenus.restaurants")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.subMenus.recipes")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.subMenus.videos")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.subMenus.apps")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.subMenus.services")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.subMenus.events")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.subMenus.other")).not.toBeInTheDocument();
  }
};

const closeAccountMenu = async () => {
  await userEvent.type(screen.getByTestId("testid.topMenu.reviews"), "{escape}");
  await validateTopMenu(false);
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
        <TopMenu />
      </ThemeContext.Provider>,
    );

    // Open the menu
    await openReviewsMenu();

    // Validate the menu
    await validateTopMenu();

    // Close the menu
    await closeAccountMenu();
  });

  it("renders a UserMenu - Unauthenticated", async () => {
    (useSession as jest.Mock).mockReturnValue(mockSessionUnAuth);
    render(
      <ThemeContext.Provider value={context}>
        <TopMenu />
      </ThemeContext.Provider>,
    );

    await openReviewsMenu();

    await validateTopMenu();

    // Close the menu
    await closeAccountMenu();
  });
});
