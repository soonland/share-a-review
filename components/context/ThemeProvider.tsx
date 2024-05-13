import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import { createContext, useEffect, useMemo, useState } from "react";

import { getCustomTheme } from "@/app/theme";

export interface IThemeContext {
  isDark: string;
  dark: (isDark: string) => void;
}

export const ThemeContext = createContext<IThemeContext>({
  isDark: "false",
  dark: () => {},
});

export const ThemeProvider = ({ children }) => {
  // Load isDark from localStorage on hook initialization
  const [isDark, setIsDark] = useState<string>("light");

  const theme = getCustomTheme(isDark === "dark" ? "dark" : "light");

  useEffect(() => {
    if (sessionStorage.getItem("isDark")) {
      setIsDark(sessionStorage.getItem("isDark") ?? "false");
    }
  }, []);

  // Save queue to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("isDark", isDark);
  }, [isDark]);

  const context = useMemo(() => {
    // Function to add an item to the queue
    const dark = (isDark: string) => {
      setIsDark(isDark);
    };
    return { dark, isDark };
  }, [isDark]);
  return (
    <ThemeContext.Provider value={context}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
