import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Pencil, Trash2 } from "lucide-react";
import L from "leaflet";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { injectLeafletOverrides } from "@/components/shared/LandMap/LandMapStyles";
import LandMapViewer from "@/components/shared/LandMap/LandMapViewer";
import ConfirmDelete from "@/components/model/ConfirmDelete";
import { useDeleteLand } from "../api/actions";
import type { LandListItem } from "../api/types";
import { locationToString, type LatLng as LatLngType } from "@/lib/helpers";

function FitBoundsOnMount({ polygon }: { polygon: LatLngType[] }) {
  const map = useMap();

  useEffect(() => {
    if (polygon.length < 3) return;
    const bounds = L.latLngBounds(
      polygon.map((pt) => L.latLng(pt.lat, pt.lng)),
    );
    map.fitBounds(bounds, { padding: [20, 20], maxZoom: 19 });
  }, [polygon, map]);

  return null;
}

function PropertyCard({ p }: { p: LandListItem }) {
  const { t } = useTranslation();
  const goto = useNavigate();
  const deleteMutation = useDeleteLand();

  useEffect(() => {
    injectLeafletOverrides();
  }, []);

  const onUpdateClicked = () => {
    const landWithMappedBorders = {
      ...p,
      border: p.border
        .map((b) => locationToString(b))
        .filter((_, Idx) => Idx + 1 < p.border.length),
      location: locationToString(p.location),
    };
    goto(paths.app.investor.basicLandInfo.getHref(), {
      state: { land: landWithMappedBorders },
    });
  };

  const onDelete = () => {
    deleteMutation.mutate(p.id);
  };

  const polygon: LatLngType[] =
    p.border?.map((pt) => ({ lat: pt.latitude, lng: pt.longitude })) ?? [];

  const center: [number, number] =
    polygon.length > 0
      ? [
          polygon.reduce((sum, pt) => sum + pt.lat, 0) / polygon.length,
          polygon.reduce((sum, pt) => sum + pt.lng, 0) / polygon.length,
        ]
      : [34.8021, 38.9968];

  const zoom = (() => {
    if (polygon.length < 3) return 16;
    const lats = polygon.map((pt) => pt.lat);
    const lngs = polygon.map((pt) => pt.lng);
    const latSpan = Math.max(...lats) - Math.min(...lats);
    const lngSpan = Math.max(...lngs) - Math.min(...lngs);
    const metersPerDegLat = 111_320;
    const metersPerDegLng = 111_320 * Math.cos((center[0] * Math.PI) / 180);
    const metersAcross = Math.max(
      latSpan * metersPerDegLat,
      lngSpan * metersPerDegLng,
    );
    if (metersAcross <= 0) return 18;
    const cardWidthPx = 400;
    const metersPerPx =
      (156_543.03392 * Math.cos((center[0] * Math.PI) / 180)) / 2 ** 16;
    const z = Math.log2((cardWidthPx * metersPerPx) / metersAcross) + 16;
    return Math.min(19, Math.max(10, Math.round(z)));
  })();

  return (
    <Card className="group overflow-hidden shadow-card border-border/60 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-44 overflow-hidden">
        <MapContainer
          center={center}
          zoom={zoom}
          className="h-full w-full z-10"
          zoomControl={false}
          dragging={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          touchZoom={false}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LandMapViewer polygon={polygon} />
          <FitBoundsOnMount polygon={polygon} />
        </MapContainer>
        {p.coverImageUrl && (
          <img
            src={p.coverImageUrl}
            alt={p.name}
            className="absolute inset-0 h-full w-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-navy-deep/80 via-navy-deep/10 to-transparent" />
        <Badge
          className={`absolute top-3 left-3 border ${p.isValidated ? "bg-emerald/10 text-emerald border-emerald/20" : "bg-muted text-muted-foreground border-border"}`}
          variant="outline"
        >
          {p.isValidated ? t("investor.validated") : t("investor.notValidated")}
        </Badge>
        <div className="absolute top-3 right-3 z-20">
          <ConfirmDelete
            onConfirm={onDelete}
            isLoading={deleteMutation.isPending}
            openButton={
              <Button
                size="icon"
                className="h-8 w-8 rounded-full shadow-md bg-white text-red-300 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
                onClick={(e) => e.preventDefault()}
                aria-label={t("investor.delete")}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            }
          />
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-semibold text-lg leading-tight">{p.name}</h3>
          <div className="flex items-center gap-1 text-xs text-white/80 mt-1">
            <MapPin className="h-3 w-3" /> {p.address}
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {t("investor.area")}
            </p>
            <p className="font-semibold text-foreground">
              {p.area.toLocaleString()} {t("investor.squareMeters")}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              {t("investor.label-zoning")}
            </p>
            <p className="font-semibold text-foreground">{p.zoningType}</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button
            asChild
            size="sm"
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            <Link to={paths.app.investor.landBuildingDetails.getHref(p.id)}>
              {t("investor.view")}
            </Link>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1"
            onClick={onUpdateClicked}
          >
            <Pencil className="h-3.5 w-3.5" /> {t("investor.edit")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default PropertyCard;
