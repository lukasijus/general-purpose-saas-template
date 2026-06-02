import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { FormEvent, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { storeAuthToken } from "../../api/client";
import type { Api } from "../../api/client";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Register({ api }: { api: Api }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const emailError = touched && !emailPattern.test(email);
  const passwordError = touched && password.length > 0 && password.length < 8;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setTouched(true);
    setError("");
    if (!emailPattern.test(email) || password.length < 8) return;
    setLoading(true);
    try {
      const response = await api.register({ email, password });
      storeAuthToken(response.access_token);
      navigate("/workspace");
    } catch {
      setError("Registration failed. Try a different email.");
    } finally {
      setLoading(false);
    }
  }

  async function startSso(provider: "google" | "github") {
    setError("");
    setLoading(true);
    try {
      await api.startSso(provider);
    } catch {
      setError(`${provider} sign up is not available yet.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Paper
        component="form"
        onSubmit={submit}
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 460,
          height: 560,
          p: { xs: 3, sm: 4 },
          borderRadius: 1,
          position: "relative",
          border: "1px solid #e3e8ee",
          boxShadow: "0 24px 70px rgba(0,55,112,0.16)",
        }}
      >
        <Stack spacing={2.5}>
          <Typography variant="h4" component="h1">
            Register
          </Typography>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <TextField
            label="Email"
            type="email"
            value={email}
            autoComplete="email"
            error={emailError}
            helperText={emailError ? "Enter a valid email address." : " "}
            onBlur={() => setTouched(true)}
            onChange={(event) => setEmail(event.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            autoComplete="new-password"
            error={passwordError}
            helperText={passwordError ? "Use at least 8 characters." : " "}
            onBlur={() => setTouched(true)}
            onChange={(event) => setPassword(event.target.value)}
            fullWidth
            required
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} /> : null}
            sx={{ alignSelf: "stretch" }}
          >
            {loading ? "Creating account" : "Create account"}
          </Button>
          <Divider>SSO</Divider>
          <Stack direction="row" spacing={1.5}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              disabled={loading}
              onClick={() => void startSso("google")}
            >
              Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GitHubIcon />}
              disabled={loading}
              onClick={() => void startSso("github")}
            >
              GitHub
            </Button>
          </Stack>
          <Button component={RouterLink} to="/login">
            Back to login
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
