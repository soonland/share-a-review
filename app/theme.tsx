"use client";
import { PaletteMode, colors, darken, lighten } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const getDesignTokens = (mode: PaletteMode) => {
  return {
    palette: {
      mode,
      ...(mode === "light"
        ? {
            primary: colors.blueGrey,
            text: {
              primary: colors.blueGrey[800],
              secondary: colors.blueGrey[50],
            },
            // palette values for light mode
            // primary: { main: "#0089b3", contrastText: "#000000", light: "#A3BAC3", dark: "#000000" },
            // background: {
            //   default: darken("#b3e0ff", 0.1),
            //   paper: "#b3e0ff",
            // },
            // text: {
            //   primary: darken("#b3e0ff", 0.9),
            //   secondary: lighten("#b3e0ff", 0.1),
            // },
          }
        : {
            // palette values for dark mode
            primary: { main: "#002733", contrastText: "#ffffff", light: "#006989", dark: "#000000" },
            background: {
              default: darken("#006989", 0.1),
              paper: "#006989",
            },
            text: {
              primary: darken("#A3BAC3", 0.1),
              secondary: lighten("#A3BAC3", 0.1),
            },
          }),
    },
  };
};

const theme = createTheme({
  components: {
    MuiAppBar: {
      defaultProps: {
        color: "inherit",
      },
    },
    MuiIconButton: {
      defaultProps: {
        color: "inherit",
      },
    },
    MuiButtonBase: {
      defaultProps: {
        // The props to change the default for.
        disableRipple: true, // No more ripple, on the whole application 💣!
      },
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});

export const getCustomTheme = (mode: PaletteMode) => {
  const designTokens = getDesignTokens(mode);
  return createTheme({ ...theme, ...designTokens });
};

export default theme;
