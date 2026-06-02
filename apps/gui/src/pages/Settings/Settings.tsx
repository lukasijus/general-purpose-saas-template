import ComputerIcon from "@mui/icons-material/Computer";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import type { Api } from "../../api/client";
import type { ThemeMode } from "../../api/types/auth";
import { useAppThemeMode } from "../../theme/AppThemeProvider";

export function Settings({ api }: { api: Api }) {
  const { mode, setMode } = useAppThemeMode();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void api
      .getUserSettings()
      .then((settings) => {
        if (active) setMode(settings.theme);
      })
      .catch(() => {
        if (active) setError("Could not load settings.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [api, setMode]);

  async function changeTheme(nextMode: ThemeMode) {
    setError("");
    setMode(nextMode);
    setSaving(true);
    try {
      await api.updateUserSettings({ theme: nextMode });
    } catch {
      setError("Could not save theme preference.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h4" component="h1">
        Settings
      </Typography>
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2.5, md: 4 },
          borderRadius: 1,
          boxShadow: "0 24px 70px rgba(0,55,112,0.08)",
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h6">Appearance</Typography>
          {error ? <Alert severity="error">{error}</Alert> : null}
          {loading ? (
            <CircularProgress size={22} />
          ) : (
            <ToggleButtonGroup
              exclusive
              value={mode}
              onChange={(_event, value: ThemeMode | null) => {
                if (value) void changeTheme(value);
              }}
              disabled={saving}
              aria-label="Theme mode"
              sx={{
                "& .MuiToggleButton-root": {
                  px: 2,
                  borderRadius: 0,
                  textTransform: "none",
                },
              }}
            >
              <ToggleButton value="light" aria-label="Light theme">
                <LightModeIcon fontSize="small" sx={{ mr: 1 }} />
                Light
              </ToggleButton>
              <ToggleButton value="dark" aria-label="Dark theme">
                <DarkModeIcon fontSize="small" sx={{ mr: 1 }} />
                Dark
              </ToggleButton>
              <ToggleButton value="system" aria-label="System theme">
                <ComputerIcon fontSize="small" sx={{ mr: 1 }} />
                System
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}
