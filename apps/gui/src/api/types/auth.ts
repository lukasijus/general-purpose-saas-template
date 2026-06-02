export type AuthUser = {
  uuid: string;
  email: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
};

export type TokenResponse = {
  access_token: string;
  token_type: "bearer";
  user: AuthUser;
};

export type ThemeMode = "light" | "dark" | "system";

export type UserSettings = {
  user_uuid: string;
  theme: ThemeMode;
  language: string;
};
