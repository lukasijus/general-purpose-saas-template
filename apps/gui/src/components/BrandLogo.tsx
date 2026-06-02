import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export function BrandLogo() {
  return (
    <Stack direction="row" spacing={1.25} alignItems="center">
      <Box
        component="img"
        src="/brand/app-logo.svg"
        alt=""
        sx={{ width: 30, height: 30, borderRadius: 1 }}
      />
      <Typography variant="h6" fontWeight={400}>
        SaaS Template
      </Typography>
    </Stack>
  );
}
