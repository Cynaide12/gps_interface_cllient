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
import { useStore } from "../stores/TrackingStore";

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
  const store = useStore();

  // Преобразуем координаты в формат для leaflet
  const currentPosition = store.currentLocation
    ? {
        lat: store.currentLocation.latitude,
        lng: store.currentLocation.longitude,
      }
    : null;

  // История координат для линии пути
  const pathPositions = store.locationHistory.map((coord) => ({
    lat: coord.latitude,
    lng: coord.longitude,
  }));

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
              <strong>Устройство: {store.currentLocation?.deviceId}</strong>
              <p>Широта: {store.currentLocation?.latitude.toFixed(6)}</p>
              <p>Долгота: {store.currentLocation?.longitude.toFixed(6)}</p>
              <p>Скорость: {store.currentLocation?.speed} км/ч</p>
              <p>Высота: {store.currentLocation?.altitude} м</p>
              <p>Спутники: {store.currentLocation?.satellites}</p>
              <p>
                Время:{" "}
                {new Date(
                  store.currentLocation?.timestamp || new Date()
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
