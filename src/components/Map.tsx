import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { observer } from "mobx-react-lite";
import type { Coordinates } from "../services/types";
import trackingStore from "../stores/TrackingStore";

// Фикс для иконок маркеров
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

const MapView = observer(({ style }: MapViewProps) => {
  const store = trackingStore
  


  // Преобразуем координаты в формат для leaflet
  const currentPosition = store.currentLocation
    ? {
        lat: store.currentLocation?.Latitude,
        lng: store.currentLocation?.Longitude,
      }
    : null;

  // История координат для линии пути
  const pathPositions = store.locationHistory.map((coord: Coordinates) => ({
    lat: coord?.Latitude || 54.814666,
    lng: coord?.Longitude || 56.132894,
  }));

  console.log(currentPosition)

  return (
    <MapContainer
      center={currentPosition || { lat: 54.814666, lng: 56.132894 }} // Москва по умолчанию
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

      {pathPositions.length > 1 && (
        <Polyline positions={pathPositions} color="blue" weight={3} />
      )}
    </MapContainer>
  );
});

export default MapView;
