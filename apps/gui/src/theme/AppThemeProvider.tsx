import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, alpha, createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type ThemeMode = "light" | "dark" | "system";

const THEME_MODE_KEY = "general-purpose-saas.theme";

type ThemeContextValue = {
  mode: ThemeMode;
  resolvedMode: "light" | "dark";
  setMode: (mode: ThemeMode) => void;
};

const ThemeModeContext = createContext<ThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem(THEME_MODE_KEY);
    return stored === "light" || stored === "dark" || stored === "system"
      ? stored
      : "system";
  });
  const resolvedMode =
    mode === "system" ? (prefersDark ? "dark" : "light") : mode;

  const setMode = useCallback((nextMode: ThemeMode) => {
    localStorage.setItem(THEME_MODE_KEY, nextMode);
    setModeState(nextMode);
  }, []);

  const theme = useMemo(() => createAppTheme(resolvedMode), [resolvedMode]);
  const value = useMemo(
    () => ({ mode, resolvedMode, setMode }),
    [mode, resolvedMode, setMode],
  );

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useAppThemeMode() {
  const value = useContext(ThemeModeContext);
  if (!value) {
    throw new Error("useAppThemeMode must be used inside AppThemeProvider");
  }
  return value;
}

function createAppTheme(mode: "light" | "dark") {
  const isDark = mode === "dark";
  return createTheme({
    palette: {
      mode,
      primary: { main: "#533afd", dark: "#4434d4", light: "#665efd" },
      secondary: { main: "#1c1e54" },
      error: { main: "#ea2261" },
      background: {
        default: isDark ? "#10142c" : "#f6f9fc",
        paper: isDark ? "#171b35" : "#ffffff",
      },
      text: {
        primary: isDark ? "#f6f9fc" : "#0d253d",
        secondary: isDark ? "#b8c3d4" : "#64748d",
      },
      divider: isDark ? "rgba(255,255,255,0.12)" : "#e3e8ee",
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
        "Segoe UI",
        "sans-serif",
      ].join(","),
      h1: { fontWeight: 400 },
      h2: { fontWeight: 400 },
      h3: { fontWeight: 400 },
      h4: { fontWeight: 400 },
      h5: { fontWeight: 400 },
      h6: { fontWeight: 400 },
      button: { textTransform: "none", fontWeight: 500 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            boxShadow: "none",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? alpha("#ffffff", 0.03) : "#ffffff",
          },
        },
      },
    },
  });
}
