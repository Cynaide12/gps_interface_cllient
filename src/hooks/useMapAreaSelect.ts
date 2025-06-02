// hooks/useMapAreaSelect.ts
import { useEffect } from "react";
import L from "leaflet";
import "leaflet-area-select";

const useAreaSelect = (
  map: L.Map | null,
  onSelect: (bounds: L.LatLngBounds) => void,
  selection: { center: [number, number]; radius: number } | null
) => {
  useEffect(() => {
    if (!map) return;

    // Очищаем предыдущие слои
    map.eachLayer((layer) => {
      if (layer instanceof L.Rectangle || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    // Если есть выделение - рисуем его
    if (selection) {
      L.circle(selection.center, {
        radius: selection.radius,
        color: "blue",
        fillOpacity: 0.2,
      }).addTo(map);
    }

    // Инициализация выделения области
    // @ts-ignore
    if (map.selectArea) {
      // @ts-ignore
      map.selectArea.enable();

      // @ts-ignore
      map.on("selectarea:selected", (e) => {
        // @ts-ignore
        const center = e.bounds.getCenter();
        // @ts-ignore
        const radius = center.distanceTo(e.bounds.getNorthWest());
        // @ts-ignore
        onSelect(e.bounds);
      });
    }

    return () => {
      // @ts-ignore
      if (map.selectArea) {
        // @ts-ignore
        map.selectArea.disable();
      }
    };
  }, [map, onSelect, selection]);
};

export default useAreaSelect;
