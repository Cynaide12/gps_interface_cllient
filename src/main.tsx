import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { GeofenceSettings } from "./pages/GeofanceSettings";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "*", element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "geofence", element: <GeofenceSettings /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
