import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ChangeThemeMode from "../ChangeThemeMode";
import { IThemeContext, ThemeContext } from "../context/ThemeProvider";

describe("ChangeThemeMode", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a ChangeThemeMode - LIGHT -> DARK", async () => {
    const context: IThemeContext = {
      dark: jest.fn(),
      isDark: "light",
    };
    render(
      <ThemeContext.Provider value={context}>
        <ChangeThemeMode />
      </ThemeContext.Provider>,
    );

    const changeThemeMode = screen.getByTestId("testid.changeThemeMode");
    expect(changeThemeMode).toBeInTheDocument();
    expect(changeThemeMode).toHaveAttribute("title", "common.changeThemeMode");
    expect(screen.getByTestId("Brightness7Icon")).toBeInTheDocument();
    await userEvent.click(changeThemeMode);

    expect(context.dark).toHaveBeenCalledTimes(1);
    expect(context.dark).toHaveBeenCalledWith("dark");
  });

  it("renders a ChangeThemeMode - DARK -> LIGHT", async () => {
    const context: IThemeContext = {
      dark: jest.fn(),
      isDark: "dark",
    };
    render(
      <ThemeContext.Provider value={context}>
        <ChangeThemeMode />
      </ThemeContext.Provider>,
    );

    const changeThemeMode = screen.getByTestId("testid.changeThemeMode");
    expect(screen.getByTestId("Brightness4Icon")).toBeInTheDocument();
    await userEvent.click(changeThemeMode);

    expect(context.dark).toHaveBeenCalledTimes(1);
    expect(context.dark).toHaveBeenCalledWith("light");
  });
});
