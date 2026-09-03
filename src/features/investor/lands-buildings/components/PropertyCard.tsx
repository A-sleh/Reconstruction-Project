import { useEffect } from "react";

import type { LucideIcon } from "lucide-react";
import {
  Building,
  CheckCircle2,
  Factory,
  Fan,
  Hotel,
  Landmark,
  MapPin,
  Pencil,
  Trash2,
  Warehouse,
  XCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer } from "react-leaflet";
import { Link, useNavigate } from "react-router-dom";

import ConfirmDelete from "@/components/model/ConfirmDelete";
import FitBoundsOnMount from "@/components/shared/LandMap/FitBoundsOnMount";
import { injectLeafletOverrides } from "@/components/shared/LandMap/LandMapStyles";
import LandMapViewer from "@/components/shared/LandMap/LandMapViewer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { paths } from "@/config/paths";
import { type LatLng as LatLngType, locationToString } from "@/lib/helpers";
import { cn } from "@/lib/utils";

import { useDeleteLand } from "../api/actions";
import type { LandListItem } from "../api/types";

const zoningIcons: Record<number, LucideIcon> = {
  [0]: Building,
  [1]: Landmark,
  [2]: Fan,
  [3]: Factory,
  [4]: Warehouse,
  [5]: Hotel,
  [6]: Building,
  [7]: Building,
};

const zoningColors: Record<number, string> = {
  0: "bg-sky-500/10 text-sky-600 border-sky-500/20",
  1: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  2: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  3: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  4: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  5: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  6: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  7: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
};

const ZONING_LABELS: Record<number, string> = {
  0: "Residential",
  1: "Commercial",
  2: "Agricultural",
  3: "Industrial",
  4: "Mixed Use",
  5: "Hospitality",
  6: "Office",
  7: "Tech Park",
};

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
    deleteMutation.mutate(p.landId);
  };

  const polygon: LatLngType[] =
    p.border?.map((pt) => ({ lat: pt.longitude, lng: pt.latitude })) ?? [];

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

  const ZoningIcon = zoningIcons[p.zoningType] ?? Building;

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20">
      <div className="relative h-48 overflow-hidden">
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

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <div className="absolute top-3 right-3 z-20">
          <ConfirmDelete
            onConfirm={onDelete}
            isLoading={deleteMutation.isPending}
            openButton={
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-destructive hover:text-white"
                onClick={(e) => e.preventDefault()}
                aria-label={t("investor.delete")}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            }
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold leading-tight text-white drop-shadow-md">
                {p.name}
              </h3>
              <div className="mt-1 flex items-center gap-1 text-xs text-white/80">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{p.address}</span>
              </div>
            </div>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm",
                p.isValidated
                  ? "bg-emerald/15 text-emerald border-emerald/30"
                  : "bg-white/15 text-white border-white/20",
              )}
            >
              {p.isValidated ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <XCircle className="h-3 w-3" />
              )}
              {p.isValidated
                ? t("investor.validated")
                : t("investor.notValidated")}
            </span>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold",
              zoningColors[p.zoningType] ??
                "bg-muted text-muted-foreground border-border",
            )}
          >
            <ZoningIcon className="h-3 w-3" />
            {ZONING_LABELS[p.zoningType] ?? p.zoningType}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[11px] font-medium",
              p.accessability
                ? "bg-emerald/5 text-emerald border-emerald/20"
                : "bg-muted text-muted-foreground border-border",
            )}
          >
            {p.accessability ? (
              <CheckCircle2 className="h-3 w-3" />
            ) : (
              <XCircle className="h-3 w-3" />
            )}
            {p.accessability ? t("investor.yes") : t("investor.no")}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted/50 px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {t("investor.area")}
            </p>
            <p className="mt-0.5 text-sm font-bold text-foreground tabular-nums">
              {p.area.toLocaleString()}
              <span className="ml-0.5 text-[11px] font-medium text-muted-foreground">
                {t("investor.squareMeters")}
              </span>
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {t("investor.borderPoints")}
            </p>
            <p className="mt-0.5 text-sm font-bold text-foreground tabular-nums">
              {p.border.length}
              <span className="ml-0.5 text-[11px] font-medium text-muted-foreground">
                {t("investor.border-points", { count: p.border.length })}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            asChild
            size="sm"
            className="flex-1 bg-gradient-emerald text-white shadow-sm hover:opacity-95"
          >
            <Link to={paths.app.investor.landBuildingDetails.getHref(p.landId)}>
              {t("investor.view")}
            </Link>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 border-border/60"
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
