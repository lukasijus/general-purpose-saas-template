export type Plan = {
  name: string;
  price: string;
  href: string;
  cta: string;
  highlighted?: boolean;
};

export const dashboardUrl =
  import.meta.env.VITE_DASHBOARD_URL || "http://localhost:5173";
export const registerUrl =
  import.meta.env.VITE_REGISTER_URL || `${dashboardUrl}/register`;
export const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const plans: Plan[] = [
  { name: "Free", price: "$0", href: registerUrl, cta: "Start free" },
  {
    name: "Basic",
    price: "$49",
    href: import.meta.env.VITE_STRIPE_BASIC_URL || registerUrl,
    cta: "Choose Basic",
    highlighted: true,
  },
  {
    name: "Pro",
    price: "$199",
    href: import.meta.env.VITE_STRIPE_PRO_URL || registerUrl,
    cta: "Choose Pro",
  },
];
