import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { registerUrl } from "./config";

export function Hero() {
  return (
    <Box
      component="section"
      sx={{
        color: "#0d253d",
        py: { xs: 8, md: 11 },
        bgcolor: "#ffffff",
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={5} alignItems="center" textAlign="center">
          <Stack spacing={2.5} alignItems="center" sx={{ maxWidth: 760 }}>
            <Typography variant="h1" sx={{ fontSize: { xs: 42, md: 58 } }}>
              SaaS workflows.
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ lineHeight: 1.5, maxWidth: 620 }}
            >
              Accounts, billing, settings, and operations in one place.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button
                href={registerUrl}
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
              >
                Get started
              </Button>
              <Button href="#pricing" variant="outlined" size="large">
                Pricing
              </Button>
            </Stack>
          </Stack>
          <Paper
            aria-label="Hero image placeholder"
            variant="outlined"
            sx={{
              width: "100%",
              maxWidth: 900,
              p: { xs: 2, md: 3 },
              borderRadius: 1,
              bgcolor: "#f6f9fc",
              boxShadow: "none",
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              sx={{ textAlign: "left" }}
            >
              {["Accounts", "Billing", "Operations"].map((label, index) => (
                <Box
                  key={label}
                  sx={{
                    flex: 1,
                    p: 2,
                    borderRadius: 1,
                    bgcolor: "#ffffff",
                    border: "1px solid #e3e8ee",
                  }}
                >
                  <Typography variant="h6">{label}</Typography>
                  <Typography color="text.secondary">
                    {index === 0
                      ? "Manage users."
                      : index === 1
                        ? "Configure plans."
                        : "Track activity."}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
