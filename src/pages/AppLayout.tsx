import { Skeleton } from "@mui/material";
import { FC, PropsWithChildren, useEffect } from "react";
import trackingStore from "../stores/TrackingStore";
import { observer } from "mobx-react-lite";

export const AppLayout: FC<PropsWithChildren> = observer(({ children }) => {
  useEffect(() => {
    trackingStore.initConnection();
    trackingStore.loadGeofences()
  }, []);

  if (!trackingStore.getCurrentCoordinate) {
    
    return (
      <Skeleton
        sx={{ bgcolor: "grey.900" }}
        variant="rectangular"
        height="100%"
      />
    );
  }
  return <>{children}</>;
});
