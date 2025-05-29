import { Box, Typography, Paper } from '@mui/material';
import DeviceStatus from '../components/DeviceStatus';
import { PageContainer } from '@toolpad/core';
import MapView from '../components/Map';
import { useEffect } from 'react';
import trackingStore from '../stores/TrackingStore';

export default function Dashboard() {
  useEffect(() => {
    trackingStore.initConnection()
  })
  return (
    <PageContainer>
    <Box>
      <Typography variant="h4" gutterBottom>
        Ошейник для собак панель управления
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
        <Paper sx={{ p: 2, flex: 2 }}>
          <MapView />
        </Paper>
        
        <Paper sx={{ p: 2, flex: 1 }}>
          <DeviceStatus />
        </Paper>
      </Box>
    </Box>
    </PageContainer>
  );
}