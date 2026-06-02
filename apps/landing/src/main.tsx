import CssBaseline from "@mui/material/CssBaseline";
import { alpha, ThemeProvider, createTheme } from "@mui/material/styles";
import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App";
import "./styles.css";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#533afd", dark: "#4434d4", light: "#665efd" },
    secondary: { main: "#1c1e54" },
    error: { main: "#ea2261" },
    background: { default: "#ffffff", paper: "#ffffff" },
    text: { primary: "#0d253d", secondary: "#64748d" },
    divider: "#e3e8ee",
  },
  shape: { borderRadius: 6 },
  typography: {
    fontFamily: [
      "sohne-var",
      "SF Pro Display",
      "Inter",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "sans-serif",
    ].join(","),
    h1: { fontWeight: 300, lineHeight: 1.03, letterSpacing: 0 },
    h2: { fontWeight: 300, lineHeight: 1.1, letterSpacing: 0 },
    h3: { fontWeight: 300, lineHeight: 1.12, letterSpacing: 0 },
    h4: { fontWeight: 300, lineHeight: 1.18, letterSpacing: 0 },
    h5: { fontWeight: 300, lineHeight: 1.25, letterSpacing: 0 },
    body1: { fontWeight: 300, lineHeight: 1.4 },
    body2: { fontWeight: 300, lineHeight: 1.4 },
    button: { textTransform: "none", fontWeight: 400, letterSpacing: 0 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          minHeight: 38,
          paddingInline: 16,
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
        containedPrimary: {
          backgroundColor: "#533afd",
          "&:hover": { backgroundColor: "#4434d4" },
          "&:active": { backgroundColor: "#2e2b8c" },
        },
        outlined: {
          borderColor: "#e3e8ee",
          color: "#533afd",
          backgroundColor: "#ffffff",
          "&:hover": {
            borderColor: "#b9b9f9",
            backgroundColor: alpha("#533afd", 0.04),
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          boxShadow: "0 24px 70px rgba(0,55,112,0.08)",
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined" },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: "#ffffff",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#a8c3de" },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#665efd",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#533afd",
            borderWidth: 1,
          },
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
