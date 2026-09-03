import "leaflet/dist/leaflet.css";

import { useCallback, useEffect, useState } from "react";

import { AlertTriangle, MapPin, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  MapContainer,
  Marker,
  Polygon,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

import FitBoundsOnMount from "@/components/shared/LandMap/FitBoundsOnMount";
import {
  createMarkerIcon,
  DEFAULT_CENTER,
  injectLeafletOverrides,
  polygonStyle,
} from "@/components/shared/LandMap/LandMapStyles";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ILoncation } from "@/features/investor/lands-buildings/api/types";
import { isPointInPolygon, type LatLng } from "@/lib/helpers";

interface LocationPickerFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  landBorder?: ILoncation[];
}

function parseLocation(value: string): LatLng | null {
  if (!value) return null;
  const parts = value.split(",").map((p) => p.trim());
  if (parts.length !== 2) return null;
  const lat = Number(parts[0]);
  const lng = Number(parts[1]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

function LocationMarker({
  position,
  onPick,
  landBorder,
  onOutsideClick,
}: {
  position: LatLng | null;
  onPick: (pos: LatLng) => void;
  landBorder?: LatLng[];
  onOutsideClick?: () => void;
}) {
  useMapEvents({
    click(e) {
      if (landBorder && landBorder.length >= 3) {
        if (
          !isPointInPolygon(
            { lat: e.latlng.lat, lng: e.latlng.lng },
            landBorder,
          )
        ) {
          onOutsideClick?.();
          return;
        }
      }
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return position ? (
    <Marker position={[position.lat, position.lng]} icon={createMarkerIcon()} />
  ) : null;
}

export default function LocationPickerField({
  value,
  onChange,
  error,
  disabled = false,
  landBorder,
}: LocationPickerFieldProps) {
  const { t } = useTranslation();
  const [pos, setPos] = useState<LatLng | null>(() => parseLocation(value));
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<LatLng | null>(null);
  const [outsideError, setOutsideError] = useState(false);

  const borderLatLng: LatLng[] | undefined = landBorder?.map((p) => ({
    lat: p.latitude,
    lng: p.longitude,
  }));

  useEffect(() => {
    injectLeafletOverrides();
  }, []);

  useEffect(() => {
    setPos(parseLocation(value));
  }, [value]);

  const handleOpen = () => {
    setDraft(pos);
    setOutsideError(false);
    setOpen(true);
  };

  const handlePick = useCallback((p: LatLng) => {
    setDraft(p);
    setOutsideError(false);
  }, []);

  const handleOutsideClick = useCallback(() => {
    setOutsideError(true);
  }, []);

  const handleConfirm = () => {
    if (draft) {
      setPos(draft);
      onChange(`${draft.lat},${draft.lng}`);
    }
    setOpen(false);
  };

  const handleClear = () => {
    setDraft(null);
    setOutsideError(false);
  };

  const hasBorder = Boolean(borderLatLng && borderLatLng.length >= 3);

  return (
    <div className="w-full space-y-2">
      <label className="text-sm font-medium text-foreground block">
        {t("investor.label-location")}
      </label>

      <button
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        className="w-full flex items-center gap-3 rounded-lg border border-border px-4 py-2.5 text-sm text-left bg-gray-200/40 border-gray-300 hover:border-primary transition-colors"
      >
        <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
        {pos ? (
          <span className="text-foreground truncate">
            {pos.lat.toFixed(6)}, {pos.lng.toFixed(6)}
          </span>
        ) : (
          <span className="text-muted-foreground">
            {t(
              "investor.clickToPickLocation",
              "Click to select location on map",
            )}
          </span>
        )}
      </button>

      {error && <p className="text-xs text-destructive">{error}</p>}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden z-[3000]">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle>{t("investor.label-location")}</DialogTitle>
          </DialogHeader>

          <div className="relative w-full h-96">
            <MapContainer
              center={
                draft
                  ? [draft.lat, draft.lng]
                  : pos
                    ? [pos.lat, pos.lng]
                    : DEFAULT_CENTER
              }
              zoom={draft || pos ? 15 : 12}
              className="w-full h-full landmap-container"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {hasBorder && borderLatLng && (
                <>
                  <FitBoundsOnMount polygon={borderLatLng} />
                  <Polygon
                    positions={borderLatLng.map((p) => [p.lat, p.lng])}
                    pathOptions={polygonStyle()}
                  />
                </>
              )}
              <LocationMarker
                position={draft}
                onPick={handlePick}
                landBorder={borderLatLng}
                onOutsideClick={handleOutsideClick}
              />
            </MapContainer>
          </div>

          <div className="flex items-center justify-between p-4 pt-2 border-t">
            <div className="flex items-center gap-2 min-w-0">
              {outsideError && (
                <div className="flex items-center gap-1.5 text-xs text-destructive">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    {t(
                      "investor.clickOutsideLand",
                      "Point must be inside the land boundary",
                    )}
                  </span>
                </div>
              )}
              {!outsideError && draft && (
                <p className="text-xs text-muted-foreground">
                  {t("investor.selectedLocation", "Selected")}:{" "}
                  {draft.lat.toFixed(6)}, {draft.lng.toFixed(6)}
                </p>
              )}
              {!outsideError && !draft && (
                <p className="text-xs text-muted-foreground">
                  {hasBorder
                    ? t(
                        "investor.clickInsideLand",
                        "Click inside the land boundary to select a location",
                      )
                    : t(
                        "investor.clickToPickLocation",
                        "Click on the map to select a location",
                      )}
                </p>
              )}
            </div>

            <DialogFooter className="sm:justify-end gap-2 p-0 border-0">
              {draft && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                >
                  <X className="h-4 w-4 mr-1" />
                  {t("investor.clear", "Clear")}
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                onClick={handleConfirm}
                disabled={!draft}
              >
                {t("investor.confirm", "Confirm")}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
