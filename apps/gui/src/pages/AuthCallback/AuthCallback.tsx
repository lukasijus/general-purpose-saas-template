import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { Navigate } from "react-router-dom";

import { storeAuthToken } from "../../api/client";

export function AuthCallback() {
  const params = new URLSearchParams(window.location.hash.slice(1));
  const token = params.get("access_token");
  const error = params.get("error") || params.get("message");

  if (token) {
    storeAuthToken(token);
    return <Navigate to="/workspace" replace />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        bgcolor: "#eef4f7",
        p: 2,
      }}
    >
      <Paper sx={{ width: "100%", maxWidth: 420, p: 4, borderRadius: 1 }}>
        <Stack spacing={2} alignItems="center">
          {error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Alert severity="error">
              Single sign-on did not return a session.
            </Alert>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
