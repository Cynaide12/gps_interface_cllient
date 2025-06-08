import { Box, Typography, Paper } from "@mui/material";
import DeviceStatus from "../components/DeviceStatus";
import { PageContainer } from "@toolpad/core";
import MapView from "../components/Map";
import { useEffect } from "react";
import trackingStore from "../stores/TrackingStore";
import { observer } from "mobx-react-lite";

export const Dashboard = observer(() => {
  useEffect(() => {
    trackingStore.initConnection();
  });
  return (
    <PageContainer>
      <Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap"
          }}
        >
          <Paper sx={{ p: 2, flex: 2, minHeight: "300px", minWidth: "300px" }}>
            <MapView />
          </Paper>

          <Paper sx={{ p: 2, flex: 1 }}>
            <DeviceStatus />
          </Paper>
        </Box>
      </Box>
    </PageContainer>
  );
});
