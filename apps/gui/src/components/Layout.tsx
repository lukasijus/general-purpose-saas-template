import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { clearAuthToken } from "../api/client";
import { BrandLogo } from "./BrandLogo";

const navItems = [
  { label: "Home", href: "/workspace", icon: <HomeIcon /> },
  { label: "Account", href: "/workspace/account", icon: <AccountCircleIcon /> },
  { label: "Settings", href: "/workspace/settings", icon: <SettingsIcon /> },
];

export function Layout() {
  const navigate = useNavigate();

  function logout() {
    clearAuthToken();
    navigate("/login", { replace: true });
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
      }}
    >
      <Paper
        component="aside"
        square
        elevation={0}
        sx={{
          width: 248,
          bgcolor: "background.paper",
          color: "text.primary",
          borderRight: "1px solid",
          borderColor: "divider",
          display: { xs: "none", md: "block" },
        }}
      >
        <Toolbar sx={{ minHeight: 72 }}>
          <BrandLogo />
        </Toolbar>
        <Divider />
        <List sx={{ px: 1.5 }}>
          {navItems.map((item) => (
            <ListItemButton
              key={item.href}
              component={NavLink}
              to={item.href}
              end={item.href === "/workspace"}
              sx={{
                borderRadius: 1,
                my: 0.5,
                color: "text.secondary",
                "& .MuiListItemIcon-root": {
                  color: "text.secondary",
                  minWidth: 40,
                },
                "&:hover": {
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(83,58,253,0.05)",
                  color: "text.primary",
                },
                "&.active": {
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(83,58,253,0.22)"
                      : "rgba(83,58,253,0.08)",
                  color: "text.primary",
                },
                "&.active .MuiListItemIcon-root": {
                  color: "#533afd",
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
        <Divider />
        <List sx={{ px: 1.5 }}>
          <ListItemButton
            onClick={logout}
            sx={{
              borderRadius: 1,
              my: 0.5,
              color: "text.secondary",
              "& .MuiListItemIcon-root": {
                color: "text.secondary",
                minWidth: 40,
              },
              "&:hover": {
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(83,58,253,0.05)",
                color: "text.primary",
              },
            }}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Paper>
      <Stack
        component="main"
        spacing={3}
        sx={{
          flex: 1,
          minWidth: 0,
          p: { xs: 2, md: 4 },
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(180deg, rgba(83,58,253,0.14) 0, rgba(16,20,44,0) 260px)"
              : "linear-gradient(180deg, rgba(185,185,249,0.36) 0, rgba(246,249,252,0) 260px)",
        }}
      >
        <Outlet />
      </Stack>
    </Box>
  );
}
