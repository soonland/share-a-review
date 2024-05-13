import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";

import { IThemeContext, ThemeContext } from "../context/ThemeProvider";
import { mockSessionAuth, mockSessionUnAuth } from "../mockData";
import TopMenuBar from "../TopMenuBar";

jest.mock("next-auth/react");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("TopMenuBar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a TopMenuBar - Authenticated", async () => {
    const context: IThemeContext = {
      dark: jest.fn(),
      isDark: "light",
    };
    (useSession as jest.Mock).mockReturnValue(mockSessionAuth);
    render(
      <ThemeContext.Provider value={context}>
        <TopMenuBar />
      </ThemeContext.Provider>,
    );

    expect(screen.getByTestId("testid.appBar")).toBeInTheDocument();
    expect(screen.getByTestId("testid.menuButton")).toBeInTheDocument();
    expect(screen.getByTestId("Brightness7Icon")).toBeInTheDocument();
    expect(screen.getByTestId("testid.accountButton")).toBeInTheDocument();
  });
  it("renders a TopMenuBar - LIGHT -> DARK", async () => {
    const context: IThemeContext = {
      dark: jest.fn(),
      isDark: "light",
    };
    (useSession as jest.Mock).mockReturnValue(mockSessionUnAuth);
    render(
      <ThemeContext.Provider value={context}>
        <TopMenuBar />
      </ThemeContext.Provider>,
    );

    expect(screen.getByTestId("testid.appBar")).toBeInTheDocument();
    expect(screen.getByTestId("testid.menuButton")).toBeInTheDocument();
    expect(screen.getByTestId("Brightness7Icon")).toBeInTheDocument();
    expect(screen.queryByTestId("testid.accountButton")).toBeNull();
  });
});
