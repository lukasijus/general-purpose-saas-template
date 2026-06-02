import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { plans } from "./config";

export function Pricing() {
  return (
    <Box
      id="pricing"
      component="section"
      sx={{ bgcolor: "#f6f9fc", py: { xs: 6, md: 8 } }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Typography variant="h2" sx={{ fontSize: { xs: 32, md: 42 } }}>
            Pricing
          </Typography>
          <Grid container spacing={3}>
            {plans.map((plan) => (
              <Grid key={plan.name} size={{ xs: 12, md: 4 }}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    boxShadow: "none",
                    bgcolor: "#ffffff",
                    color: "text.primary",
                    borderColor: plan.highlighted ? "primary.main" : "#e3e8ee",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2.2}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="h5">{plan.name}</Typography>
                        {plan.highlighted ? (
                          <Chip
                            label="Default"
                            sx={{ bgcolor: "#b9b9f9", color: "#4434d4" }}
                          />
                        ) : null}
                      </Stack>
                      <Typography variant="h3">{plan.price}</Typography>
                      <Button
                        href={plan.href}
                        variant={plan.highlighted ? "contained" : "outlined"}
                        size="large"
                      >
                        {plan.cta}
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
