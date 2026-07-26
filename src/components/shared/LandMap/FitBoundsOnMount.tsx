import L from "leaflet";
import { type LatLng as LatLngType } from "@/lib/helpers";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function FitBoundsOnMount({
  polygon = [],
}: {
  polygon: LatLngType[];
}) {
  const map = useMap();

  useEffect(() => {
    if (polygon?.length < 3) return;
    const bounds = L.latLngBounds(
      polygon.map((pt) => L.latLng(pt.lat, pt.lng)),
    );
    map.fitBounds(bounds, { padding: [20, 20], maxZoom: 19 });
  }, [polygon, map]);

  return null;
}
