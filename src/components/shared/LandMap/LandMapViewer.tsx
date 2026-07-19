import { Polygon } from "react-leaflet";
import type { LatLng } from "@/lib/helpers";
import { polygonStyle } from "./LandMapStyles";

type Props = {
  polygon: LatLng[];
  fillColor?: string;
  borderColor?: string;
};

export default function LandMapViewer({
  polygon,
  fillColor,
  borderColor,
}: Props) {
  if (!polygon || polygon.length < 3) return null;

  return (
    <Polygon
      positions={polygon.map((p) => [p.lat, p.lng])}
      pathOptions={polygonStyle(fillColor, borderColor)}
      interactive={false}
    />
  );
}
