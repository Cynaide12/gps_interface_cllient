import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { AppProvider, DashboardLayout, type Navigation } from "@toolpad/core";
import { Dashboard, Settings } from "@mui/icons-material";

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Карта',
    icon: <Dashboard />,
  },
    {
    segment: 'dashboard',
    title: 'Настройки',
    icon: <Settings />,
  }
];

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider navigation={NAVIGATION}>
      <DashboardLayout>
      <App />
      </DashboardLayout>
    </AppProvider>
  </StrictMode>
);
