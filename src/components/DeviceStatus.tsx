import { Box, Typography, LinearProgress, Chip } from '@mui/material';
import { observer } from 'mobx-react-lite';
import trackingStore from '../stores/TrackingStore';

const DeviceStatus = observer(() => {
  const store = trackingStore;
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Статус устройства</Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">Соединение</Typography>
        <Chip 
          label={store.isConnected ? 'Устройство на связи' : 'Нет связи'} 
          color={store.isConnected ? 'success' : 'error'} 
          size="small" 
        />
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">Последнее обновление</Typography>
        <Typography variant="body1">
          {store.lastUpdate || 'Неизестно'}
        </Typography>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">Уровень заряд батареи</Typography>
        <LinearProgress variant="determinate" value={store.batteryLevel} />
        <Typography variant="caption">{store.batteryLevel}%</Typography>
      </Box>
    </Box>
  );
});

export default DeviceStatus;