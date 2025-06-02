import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { DashboardLayout, Navigation } from "@toolpad/core";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { DashboardCustomize, Settings } from "@mui/icons-material";
import { Outlet } from "react-router-dom";
import { AppLayout } from "./pages/AppLayout";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
  },
});

const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Вкладки",
  },
  {
    segment: "dashboard",
    title: "Карта",
    icon: <DashboardCustomize />,
  },
  {
    segment: "geofence",
    title: "Управление геозонами",
    icon: <Settings />,
  },
];

export default function App() {
  return (
    <ReactRouterAppProvider navigation={NAVIGATION}>
      <DashboardLayout>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppLayout>
            <Box sx={{ display: "flex" }}>
              <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {/* <Dashboard /> */}
                {/* <GeofenceSettings /> */}
                <Outlet />
              </Box>
            </Box>
          </AppLayout>
        </ThemeProvider>
      </DashboardLayout>
    </ReactRouterAppProvider>
  );
}
