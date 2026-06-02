import PaymentsIcon from "@mui/icons-material/Payments";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { dashboardUrl, registerUrl } from "./config";

export function DashboardCta() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: "#ffffff",
        borderTop: "1px solid #e3e8ee",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          sx={{
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h2" sx={{ fontSize: { xs: 30, md: 40 } }}>
            Build with the dashboard.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              href={registerUrl}
              variant="contained"
              startIcon={<PaymentsIcon />}
            >
              Register
            </Button>
            <Button href={dashboardUrl} variant="outlined">
              Open dashboard
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
