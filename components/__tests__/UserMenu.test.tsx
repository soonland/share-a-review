import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSession } from "next-auth/react";

import { IThemeContext, ThemeContext } from "../context/ThemeProvider";
import UserMenu from "../UserMenu";

jest.mock("next-auth/react");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => "/"),
}));
const mockSessionAuth = {
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
  status: "authenticated",
  data: {
    user: {
      name: "test",
      image: {
        src: "/img.jpg",
        height: 24,
        width: 24,
        blurDataURL: "data:image/png;base64,imagedata",
      },
    },
  },
};

describe("UserMenu", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a UserMenu - Authenticated", async () => {
    const context: IThemeContext = {
      dark: jest.fn(),
      isDark: "light",
    };
    (useSession as jest.Mock).mockReturnValue(mockSessionAuth);
    render(
      <ThemeContext.Provider value={context}>
        <UserMenu />
      </ThemeContext.Provider>,
    );

    const accountButton = screen.getByTestId("testid.accountButton");
    expect(accountButton).toBeInTheDocument();
    await userEvent.click(accountButton);

    expect(screen.getByTestId("testid.userMenu")).toBeInTheDocument();

    expect(screen.getByTestId("testid.account")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("testid.account"));

    expect(screen.getByTestId("testid.profile")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("testid.profile"));

    expect(screen.getByTestId("testid.logout")).toBeInTheDocument();

    // Close the menu
    await userEvent.type(screen.getByTestId("testid.accountButton"), "{escape}");
    expect(screen.queryByTestId("testid.account")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.profile")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testid.logout")).not.toBeInTheDocument();
  });
});
