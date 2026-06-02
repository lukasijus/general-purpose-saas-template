import Box from "@mui/material/Box";

import { Contact } from "./sections/Contact";
import { DashboardCta } from "./sections/DashboardCta";
import { Footer } from "./sections/Footer";
import { Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import { Pricing } from "./sections/Pricing";

export function App() {
  return (
    <Box>
      <Header />
      <Hero />
      <Pricing />
      <Contact />
      <DashboardCta />
      <Footer />
    </Box>
  );
}
