import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import { BrandLogo } from "./BrandLogo";
import { dashboardUrl } from "./config";

export function Header() {
  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 5,
        bgcolor: "rgba(255, 255, 255, 0.88)",
        borderBottom: "1px solid #e3e8ee",
        backdropFilter: "blur(10px)",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{
            py: 2,
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
          }}
        >
          <BrandLogo />
          <Stack
            direction="row"
            spacing={{ xs: 1.5, sm: 3 }}
            sx={{ flexWrap: "wrap", rowGap: 1 }}
          >
            <Box component="a" href="#pricing" color="text.secondary">
              Pricing
            </Box>
            <Box component="a" href={dashboardUrl} color="text.secondary">
              Dashboard
            </Box>
          </Stack>
          <Button href={dashboardUrl} variant="outlined">
            Login
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
