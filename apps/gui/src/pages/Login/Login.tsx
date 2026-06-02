import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { FormEvent, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { storeAuthToken } from "../../api/client";
import type { Api } from "../../api/client";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Login({ api }: { api: Api }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const emailError = touched && !emailPattern.test(email);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setTouched(true);
    setError("");
    setNotice("");
    if (!emailPattern.test(email) || !password) return;
    setLoading(true);
    try {
      const response = await api.login({ email, password });
      storeAuthToken(response.access_token);
      navigate("/workspace");
    } catch {
      setError("Login failed. Check your email and password.");
    } finally {
      setLoading(false);
    }
  }

  async function startSso(provider: "google" | "github") {
    setError("");
    setNotice("");
    setLoading(true);
    try {
      await api.startSso(provider);
    } catch {
      setError(`${provider} sign in is not available yet.`);
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword() {
    setTouched(true);
    setError("");
    setNotice("");
    if (!emailPattern.test(email)) return;
    setLoading(true);
    try {
      await api.requestPasswordReset(email);
      setNotice("Password reset email requested.");
    } catch {
      setError("Could not request a password reset.");
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
            Login
          </Typography>
          {error ? <Alert severity="error">{error}</Alert> : null}
          {notice ? <Alert severity="success">{notice}</Alert> : null}
          <TextField
            label="Email"
            type="email"
            value={email}
            autoComplete="username"
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
            autoComplete="current-password"
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
            {loading ? "Signing in" : "Continue to dashboard"}
          </Button>
          <Link
            component="button"
            type="button"
            alignSelf="flex-start"
            onClick={resetPassword}
            disabled={loading}
          >
            Forgot password?
          </Link>
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
          <Button component={RouterLink} to="/register">
            Create account
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
