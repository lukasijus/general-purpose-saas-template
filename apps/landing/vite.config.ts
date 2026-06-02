import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "../../", "");

  return {
    envDir: "../../",
    plugins: [react()],
    server: {
      port: Number(process.env.LANDING_PORT ?? env.LANDING_PORT ?? 5174),
    },
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
    },
  };
});
