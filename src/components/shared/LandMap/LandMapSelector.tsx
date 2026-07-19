import { Polygon, Marker } from "react-leaflet";
import type { LatLng } from "@/lib/helpers";
import { polygonStyle, selectedPolygonStyle, createMarkerIcon } from "./LandMapStyles";
import type { LandMapOption } from "./types";

type Props = {
  options: LandMapOption[];
  selectedId?: string;
  onSelect: (id: string) => void;
};

function getCentroid(points: LatLng[]): LatLng {
  const lat = points.reduce((s, p) => s + p.lat, 0) / points.length;
  const lng = points.reduce((s, p) => s + p.lng, 0) / points.length;
  return { lat, lng };
}

export default function LandMapSelector({
  options,
  selectedId,
  onSelect,
}: Props) {
  return (
    <>
      {options.map((opt) => {
        const isSelected = opt.id === selectedId;
        const style = isSelected
          ? selectedPolygonStyle()
          : polygonStyle("#A1A1AA", "#6B6B70");

        return (
          <Polygon
            key={opt.id}
            positions={opt.polygon.map((p) => [p.lat, p.lng])}
            pathOptions={{
              ...style,
              className: "landmap-selectable",
            }}
            eventHandlers={{
              click() {
                onSelect(opt.id);
              },
            }}
          />
        );
      })}

      {selectedId &&
        (() => {
          const selected = options.find((o) => o.id === selectedId);
          if (!selected) return null;
          const centroid = getCentroid(selected.polygon);
          return (
            <Marker
              position={[centroid.lat, centroid.lng]}
              icon={createMarkerIcon(selected.label)}
              interactive={false}
            />
          );
        })()}
    </>
  );
}
