import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export function Account() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4" component="h1">
        Account
      </Typography>
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2.5, md: 4 },
          borderRadius: 1,
          boxShadow: "0 24px 70px rgba(0,55,112,0.08)",
        }}
      >
        <Typography color="text.secondary">
          Profile, account settings{" "}
        </Typography>
      </Paper>
    </Stack>
  );
}
