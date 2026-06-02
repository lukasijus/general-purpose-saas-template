import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { BrandLogo } from "./BrandLogo";
import { dashboardUrl, registerUrl } from "./config";

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 4, md: 5 },
        bgcolor: "#ffffff",
        borderTop: "1px solid #e3e8ee",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          justifyContent="space-between"
        >
          <Stack spacing={1}>
            <BrandLogo />
            <Typography color="text.secondary" variant="body2">
              A starter SaaS foundation for accounts, billing, and operations.
            </Typography>
          </Stack>
          <Stack direction="row" spacing={3} alignItems="center">
            <Typography component="a" href="#pricing" color="text.secondary">
              Pricing
            </Typography>
            <Typography component="a" href={registerUrl} color="text.secondary">
              Register
            </Typography>
            <Typography
              component="a"
              href={dashboardUrl}
              color="text.secondary"
            >
              Dashboard
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
