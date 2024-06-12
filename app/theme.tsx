"use client";
import { PaletteMode, darken, lighten } from "@mui/material";
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
            primary: { main: "#ffffff" },
            secondary: { main: "#000000" },
            background: {
              default: "#f8f7f5",
              paper: "#e4e4e4",
            },
            text: {
              primary: "#202126",
              secondary: "#909090",
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
    MuiButtonBase: {
      styleOverrides: {
        root: {
          "&.MuiButton-outlined": {
            color: "inherit",
            border: "1px solid #e4e4e4",
            padding: "6px 18px",
            fontWeight: 900,
          },
          "&.MuiButton-outlined:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
      },
    },
    // MuiInputBase-root-MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: "#000000",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#000000",
            color: "#000000",
          },
        },
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
