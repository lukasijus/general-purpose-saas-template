import { Navigate, Route, Routes } from "react-router-dom";

import type { Api } from "../api/client";
import { Layout } from "../components/Layout";
import { Account } from "../pages/Account/Account";
import { AuthCallback } from "../pages/AuthCallback/AuthCallback";
import { Home } from "../pages/Home/Home";
import { Login } from "../pages/Login/Login";
import { Register } from "../pages/Register/Register";
import { Settings } from "../pages/Settings/Settings";

export function AppRoutes({ api }: { api: Api }) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login api={api} />} />
      <Route path="/register" element={<Register api={api} />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route element={<Layout />}>
        <Route path="/workspace" element={<Home api={api} />} />
        <Route path="/workspace/account" element={<Account />} />
        <Route path="/workspace/settings" element={<Settings api={api} />} />
      </Route>
    </Routes>
  );
}
