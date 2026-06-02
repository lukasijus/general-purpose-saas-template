import { api as realApi } from "./api/client";
import type { Api } from "./api/client";
import { AppRoutes } from "./router";

export function App({ api = realApi }: { api?: Api }) {
  return <AppRoutes api={api} />;
}
