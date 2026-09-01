import { useEffect } from "react";
import { Map, MapPin } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslation } from "react-i18next";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import FitBoundsOnMount from "@/components/shared/LandMap/FitBoundsOnMount";
import {
  DEFAULT_CENTER,
  injectLeafletOverrides,
} from "@/components/shared/LandMap/LandMapStyles";
import LandMapViewer from "@/components/shared/LandMap/LandMapViewer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { LatLng } from "@/lib/helpers";
import type { ProjectLocation } from "../../api/types";

const markerIcon = L.divIcon({
  className: "bg-transparent border-none",
  html: '<div style="width:16px;height:16px;border-radius:50%;background:hsl(170.46 100% 19.54%);border:2.5px solid #ffffff;box-shadow:0 0 0 2px rgba(0,0,0,0.15)"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const ProjectMapCard = ({
  location,
  polygon,
}: {
  location?: ProjectLocation;
  polygon?: LatLng[];
}) => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    injectLeafletOverrides();
  }, []);

  const hasValidLocation =
    location &&
    Number.isFinite(location.latitude) &&
    Number.isFinite(location.longitude);

  const hasValidPolygon = polygon && polygon.length >= 3;

  if (!hasValidLocation && !hasValidPolygon) return null;

  const center: [number, number] = hasValidLocation
    ? [location.latitude, location.longitude]
    : hasValidPolygon
      ? [
          polygon.reduce((sum, pt) => sum + pt.lat, 0) / polygon.length,
          polygon.reduce((sum, pt) => sum + pt.lng, 0) / polygon.length,
        ]
      : [DEFAULT_CENTER[0], DEFAULT_CENTER[1]];

  return (
    <Card className="overflow-hidden" dir={i18n.dir()}>
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Map className="h-4 w-4" />
          </span>
          {t("project.details.reference.map.title")}
        </CardTitle>
        <CardDescription>
          {t("project.details.reference.map.subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        <div className="relative h-80 w-full overflow-hidden rounded-lg border border-border">
          <MapContainer
            center={center}
            zoom={14}
            className="h-full w-full"
            scrollWheelZoom={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {hasValidPolygon && (
              <>
                <LandMapViewer polygon={polygon} />
                <FitBoundsOnMount polygon={polygon} />
              </>
            )}
            {hasValidLocation && (
              <Marker
                position={[location.latitude, location.longitude]}
                icon={markerIcon}
              />
            )}
          </MapContainer>
        </div>

        {hasValidLocation && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() =>
              window.open(
                `https://www.google.com/maps?q=${location.latitude},${location.longitude}`,
                "_blank",
                "noopener,noreferrer",
              )
            }
          >
            <MapPin className="h-4 w-4" />
            {t("project.details.reference.map.openInGoogleMaps")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectMapCard;
