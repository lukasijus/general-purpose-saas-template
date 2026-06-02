import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { FormEvent, useState } from "react";

import { apiBaseUrl } from "./config";

export function Contact() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus("idle");
    const response = await fetch(`${apiBaseUrl}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        subject: "SaaS Template demo request",
        message,
      }),
    });
    setStatus(response.ok ? "sent" : "error");
  }

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 8 }, bgcolor: "#ffffff" }}>
      <Container maxWidth="md">
        <Stack component="form" spacing={2.5} onSubmit={submit}>
          <Typography variant="h2" sx={{ fontSize: { xs: 32, md: 42 } }}>
            Contact
          </Typography>
          <TextField
            label="Work email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            label="Message"
            required
            multiline
            minRows={4}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ width: "fit-content" }}
          >
            Send
          </Button>
          {status === "sent" ? (
            <Alert severity="success">Message sent.</Alert>
          ) : null}
          {status === "error" ? (
            <Alert severity="error">Message failed.</Alert>
          ) : null}
        </Stack>
      </Container>
    </Box>
  );
}
