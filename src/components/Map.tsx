import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { observer } from "mobx-react-lite";
import type { Coordinates } from "../services/types";
import trackingStore from "../stores/TrackingStore";
import useAreaSelect from "..//hooks/useMapAreaSelect";
import { useEffect } from "react";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapViewProps {
  style?: React.CSSProperties;
}

const MapWithAreaSelect = observer(({
  onAreaSelect,
  selection,
}: {
  onAreaSelect: (bounds: L.LatLngBounds) => void;
  selection: { center: [number, number]; radius: number } | null;
}) => {
  const map = useMap();
  useAreaSelect(map, onAreaSelect, selection);
  return null;
});

const MapView = observer(({ style }: MapViewProps) => {

    useEffect(() => {
    // Ждём, пока элемент появится в DOM
    const interval = setInterval(() => {
      const el = document.querySelector('div.leaflet-bottom.leaflet-right div a svg');
      if (el) {
        // Удаляем элемент из DOM
        el.remove();
        clearInterval(interval);
      }
    }, 500);

    // Очистка интервала при размонтировании компонента
    return () => clearInterval(interval);
  }, []);
  const store = trackingStore;

  const currentPosition = store.currentLocation
    ? {
        lat: store.currentLocation?.Latitude,
        lng: store.currentLocation?.Longitude,
      }
    : null;

  const pathPositions = store.locationHistory.map((coord: Coordinates) => ({
    lat: coord?.Latitude,
    lng: coord?.Longitude,
  }));

  const activeGeofence = store.getGeofences.find((geo) => geo.IsActive);

  if (!currentPosition) return;

  return (
    <MapContainer
      center={currentPosition}
      zoom={15}
      style={{ height: "100%", width: "100%", ...style }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {currentPosition && (
        <Marker position={currentPosition}>
          <Popup>
            <div>
              <strong>Устройство: {store.currentLocation?.DeviceID}</strong>
              <p>Широта: {store.currentLocation?.Latitude?.toFixed(6)}</p>
              <p>Долгота: {store.currentLocation?.Longitude?.toFixed(6)}</p>
              <p>Скорость: {store.currentLocation?.Speed} км/ч</p>
              <p>Высота: {store.currentLocation?.Altitude} м</p>
              <p>Спутники: {store.currentLocation?.Satellites}</p>
              <p>
                Время:{" "}
                {new Date(
                  store.currentLocation?.Timestamp || new Date()
                ).toLocaleString()}
              </p>
            </div>
          </Popup>
        </Marker>
      )}

      {activeGeofence && (
        <MapWithAreaSelect
          onAreaSelect={() => null}
          selection={{ center: [activeGeofence.Latitude, activeGeofence.Longitude], radius: activeGeofence.Radius }}
        />
      )}

      {pathPositions.length > 1 && (
        <Polyline positions={pathPositions} color="blue" weight={3} />
      )}
    </MapContainer>
  );
});

export default MapView;
