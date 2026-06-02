import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import type { Api } from "../../api/client";
import type { SessionUser } from "../../api/types";

export function Home({ api }: { api: Api }) {
  const [session, setSession] = useState<SessionUser | null>(null);

  useEffect(() => {
    void api.getSession().then(setSession);
  }, [api]);

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        spacing={2}
      >
        <Box>
          <Typography variant="h4" component="h1">
            Dashboard
          </Typography>
          <Typography color="text.secondary">
            {session ? session.email : "Loading account"}
          </Typography>
        </Box>
      </Stack>
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2.5, md: 4 },
          borderRadius: 1,
          bgcolor: "background.paper",
          boxShadow: "0 24px 70px rgba(0,55,112,0.08)",
        }}
      >
        <Stack spacing={2.5}>
          <Chip
            label="Workspace"
            sx={{
              alignSelf: "flex-start",
              bgcolor: "#b9b9f9",
              color: "#4434d4",
              fontSize: 10,
              height: 24,
              letterSpacing: 0,
              textTransform: "uppercase",
            }}
          />
        </Stack>
      </Paper>
    </Stack>
  );
}
