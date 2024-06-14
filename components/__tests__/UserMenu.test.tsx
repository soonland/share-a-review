import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signIn, signOut, useSession } from "next-auth/react";

import { IThemeContext, ThemeContext } from "../context/ThemeProvider";
import { mockSessionAuth, mockSessionUnAuth } from "../mockData";
import UserMenu from "../UserMenu";

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  useSession: jest.fn(),
}));
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => "/"),
}));

const openAccountMenu = async () => {
  const accountButton = screen.getByTestId("testid.menu.accountButton");
  expect(accountButton).toBeInTheDocument();
  await userEvent.click(accountButton);
};

const closeAccountMenu = async () => {
  await userEvent.type(screen.getByTestId("testid.menu.accountButton"), "{escape}");
  expect(screen.queryByTestId("testid.menu.account")).not.toBeInTheDocument();
  expect(screen.queryByTestId("testid.menu.profile")).not.toBeInTheDocument();
  expect(screen.queryByTestId("testid.menu.signIn")).not.toBeInTheDocument();
  expect(screen.queryByTestId("testid.menu.signOut")).not.toBeInTheDocument();
};

const validateAccountMenu = async (isAuthenticated: boolean) => {
  expect(screen.getByTestId("testid.userMenu")).toBeInTheDocument();
  expect(screen.getByTestId("testid.menu.account")).toBeInTheDocument();
  await userEvent.click(screen.getByTestId("testid.menu.account"));
  expect(screen.getByTestId("testid.menu.profile")).toBeInTheDocument();
  await userEvent.click(screen.getByTestId("testid.menu.profile"));
  if (isAuthenticated) {
    expect(screen.getByTestId("testid.menu.signOut")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("testid.menu.signOut"));
    expect(signOut).toHaveBeenCalledTimes(1);
  } else {
    expect(screen.getByTestId("testid.menu.signIn")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("testid.menu.signIn"));
    expect(signIn).toHaveBeenCalledTimes(1);
  }
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
        <UserMenu />
      </ThemeContext.Provider>,
    );

    // Open the menu
    await openAccountMenu();

    // Validate the menu
    await validateAccountMenu(true);

    // Close the menu
    await closeAccountMenu();
  });

  it("renders a UserMenu - Unauthenticated", async () => {
    (useSession as jest.Mock).mockReturnValue(mockSessionUnAuth);
    render(
      <ThemeContext.Provider value={context}>
        <UserMenu />
      </ThemeContext.Provider>,
    );

    await openAccountMenu();

    await validateAccountMenu(false);

    // Close the menu
    await closeAccountMenu();
  });
});
