import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ButtonGroup,
} from "@mui/material";
import { PageContainer } from "@toolpad/core";
import { useCallback, useEffect, useRef, useState } from "react";
import trackingStore from "../stores/TrackingStore";
import { observer } from "mobx-react-lite";
import {
  useForm,
  SubmitHandler,
  FormProvider,
  useWatch,
} from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import { Circle, MapContainer, TileLayer, useMap } from "react-leaflet";
import useAreaSelect from "../hooks/useMapAreaSelect";
// import "leaflet-area-select";
import L from "leaflet";
import { Geofence } from "src/services/types";
import { Edit } from "@mui/icons-material";

interface GeofenceFormData {
  ID: string;
  Latitude: number;
  Longitude: number;
  Radius: number;
  Name: string;
}

const MapWithAreaSelect = ({
  onAreaSelect,
  selection,
}: {
  onAreaSelect: (bounds: L.LatLngBounds) => void;
  selection: { center: [number, number]; radius: number } | null;
}) => {
  const map = useMap();
  useAreaSelect(map, onAreaSelect, selection);
  return null;
};

export const GeofenceSettings = observer(() => {
  const currentLocation = trackingStore.getCurrentCoordinate;
  const methods = useForm<GeofenceFormData>({
    defaultValues: {
      Latitude: currentLocation?.Latitude || 55.751244,
      Longitude: currentLocation?.Longitude || 37.618423,
      Radius: 100,
      Name: "Домашняя зона",
    },
  });

  const [editableGeofence, setEditableGeofence] = useState<Geofence | null>(
    null
  );

  const [mapCenter] = useState<[number, number]>([
    currentLocation?.Latitude || 55.751244,
    currentLocation?.Longitude || 37.618423,
  ]);
  const [selection, setSelection] = useState<{
    center: [number, number];
    radius: number;
  } | null>(null);
  const mapRef = useRef<L.Map>(null);

  const handleAreaSelect = useCallback(
    (bounds: L.LatLngBounds) => {
      const center = bounds.getCenter();
      const radius = center.distanceTo(bounds.getNorthWest());

      setSelection({
        center: [center.lat, center.lng],
        radius,
      });

      methods.setValue("Latitude", center.lat);
      methods.setValue("Longitude", center.lng);
      methods.setValue("Radius", Math.round(radius));
    },
    [methods]
  );

  const [activeGeofenceId, setActiveGeofenceId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  useEffect(() => {
    async function loadGeofences() {
      trackingStore.initConnection();
      await trackingStore.loadGeofences();
    }
    loadGeofences;
  }, []);

  const onSubmit: SubmitHandler<GeofenceFormData> = async (data) => {
    const newGeofence = {
      ...data,
      ID: data?.ID?.toString(),
      Radius: +data.Radius,
      isActive: false,
    };
    if (editableGeofence && data.ID) {
      //@ts-ignore
      data.ID = Number(data.ID)
      await trackingStore.updateGeofence(newGeofence);
    } else {
      await trackingStore.addGeofence(newGeofence);
    }
    await trackingStore.loadGeofences();
    reset();
  };

  const handleSetActive = (geofence: Geofence) => {
    setActiveGeofenceId(geofence.ID);
    trackingStore.setActiveGeofence(geofence);
  };

  const handleDelete = (geofence: Geofence) => {
    trackingStore.deleteGeofence(geofence);
    if (activeGeofenceId === geofence.ID) {
      setActiveGeofenceId(null);
    }
  };

  const handleEditGeofence = (geofence: Geofence) => {
    setEditableGeofence(geofence);
    methods.setValue("ID", geofence.ID);
    methods.setValue("Name", geofence.Name);
    methods.setValue("Latitude", geofence.Latitude);
    methods.setValue("Longitude", geofence.Longitude);
    methods.setValue("Radius", geofence.Radius);
  };

  const lalitudeWatched = useWatch({
    control: methods.control,
    name: "Latitude",
  });
  const longitudeWatched = useWatch({
    control: methods.control,
    name: "Longitude",
  });

  const radiusWatched = useWatch({ control: methods.control, name: "Radius" });

  useEffect(() => {
    if (lalitudeWatched && longitudeWatched && radiusWatched) {
      setSelection({
        center: [lalitudeWatched, longitudeWatched],
        radius: radiusWatched,
      });

      const map = mapRef.current;
      if (map) {
        map.setView([lalitudeWatched, longitudeWatched], 13);
      }
    }
  }, [lalitudeWatched, longitudeWatched, radiusWatched]);

  useEffect(() => {
    if (mapRef.current && selection) {
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Circle) {
          mapRef.current?.removeLayer(layer);
        }
      });

      L.circle(selection.center, {
        radius: selection.radius,
        color: "blue",
        fillOpacity: 0.2,
      }).addTo(mapRef.current);
    }
  }, [selection]);

  return (
    <PageContainer>
      <Box>
        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Paper sx={{ p: 3, flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              {editableGeofence ? "Редактирование геозоны" : "Добавить новую геозону"}
            </Typography>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                  <TextField
                    label="Название зоны"
                    {...register("Name", { required: "Обязательное поле" })}
                    error={!!errors.Name}
                    helperText={errors.Name?.message}
                  />

                  <Box sx={{ height: 400, width: "100%", mt: 2, mb: 2 }}>
                    <MapContainer
                      center={mapCenter}
                      zoom={13}
                      style={{ height: "100%", width: "100%" }}
                      ref={mapRef}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <MapWithAreaSelect
                        onAreaSelect={handleAreaSelect}
                        selection={selection}
                      />

                      {selection && (
                        <Circle
                          center={selection.center}
                          radius={selection.radius}
                          pathOptions={{ color: "blue", fillOpacity: 0.2 }}
                        />
                      )}
                    </MapContainer>
                  </Box>

                  <TextField
                    label="Широта центра"
                    {...register("Latitude")}
                    // InputProps={{ readOnly: true }}
                  />

                  <TextField
                    label="Долгота центра"
                    {...register("Longitude")}
                    // InputProps={{ readOnly: true }}
                  />

                  <TextField
                    label="Радиус (метры)"
                    type="number"
                    {...register("Radius", {
                      required: "Обязательное поле",
                      min: { value: 10, message: "Минимум 10 метров" },
                      onChange: (e) => {
                        const newRadius = parseInt(e.target.value);
                        if (
                          lalitudeWatched &&
                          longitudeWatched &&
                          newRadius > 0
                        ) {
                          setSelection({
                            center: [lalitudeWatched, longitudeWatched],
                            radius: newRadius,
                          });
                        }
                      },
                    })}
                    error={!!errors.Radius}
                    helperText={errors.Radius?.message}
                  />

                  <Button type="submit" variant="contained" size="large">
                    Сохранить геозону
                  </Button>
                </Stack>
              </form>
            </FormProvider>
          </Paper>

          <Paper sx={{ p: 3, flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Список геозон
            </Typography>
            {trackingStore.geofences.length === 0 ? (
              <Typography>Нет сохранённых геозон</Typography>
            ) : (
              <List>
                {trackingStore.geofences.map((geofence) => (
                  <ListItem
                    key={geofence.ID}
                    secondaryAction={
                      <Box >
                        <IconButton
                          edge="end"
                          onClick={() => handleDelete(geofence)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => handleEditGeofence(geofence)}
                        >
                          <Edit />
                        </IconButton>
                      </Box>
                    }

                  >
                    <ListItemText
                      primary={geofence.Name}
                      sx={{maxWidth: "250px"}}
                      secondary={`${geofence.Latitude}, ${geofence.Longitude}  (${geofence.Radius}м)`}
                    />
                    <ButtonGroup>
                      <Button
                        variant={geofence.IsActive ? "contained" : "outlined"}
                        onClick={() => handleSetActive(geofence)}
                        // sx={{ ml: 2 }}
                      >
                        {geofence.IsActive ? "Активна" : "Сделать активной"}
                      </Button>
                    </ButtonGroup>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Box>
      </Box>
    </PageContainer>
  );
});
