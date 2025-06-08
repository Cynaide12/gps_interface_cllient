import { Box, Typography, LinearProgress, Chip } from "@mui/material";
import { observer } from "mobx-react-lite";
import trackingStore from "../stores/TrackingStore";

const DeviceStatus = observer(() => {
  const store = trackingStore;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Статус устройства
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">Соединение</Typography>
        <Chip
          label={store.getIsConnected ? "Ошейник на связи" : "Нет связи"}
          color={store.getIsConnected ? "success" : "error"}
          size="small"
        />
      </Box>
      {store.getIsConnected && store.getActiveGeofence && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">Статус местоположения</Typography>
          <Chip
            label={
              store.getIsInsideGeofence
                ? "Ошейник находится в пределах разрешенного радиуса"
                : "Ошейник находится за пределами разрешенного радиуса"
            }
            color={store.getIsInsideGeofence ? "success" : "error"}
            size="small"
          />
        </Box>
      )}

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">Последнее обновление</Typography>
        <Typography variant="body1">
          {store.lastUpdate || "Неизестно"}
        </Typography>
      </Box>
    </Box>
  );
});

export default DeviceStatus;
