import "leaflet/dist/leaflet.css";

import { useEffect, useRef, useState } from "react";

import type { LeafletMouseEvent } from "leaflet";
import { Crosshair, Locate, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";

import {
  createMarkerIcon,
  DEFAULT_CENTER,
  injectLeafletOverrides,
} from "@/components/shared/LandMap/LandMapStyles";
import type { LatLng } from "@/lib/helpers";

import Model from "./Model";

interface IPickCoordsFromMap {
  value: string;
  setValue: (name: string, value: string) => void;
}

const parseCoordinates = (value: string): LatLng | null => {
  if (!value) return null;
  const parts = value.split(",").map((part) => part.trim());
  if (parts.length !== 2) return null;
  const lat = Number(parts[1]);
  const lng = Number(parts[0]);
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return { lat, lng };
  }
  return null;
};

function MapEvents({ onClick }: { onClick: (e: LeafletMouseEvent) => void }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const handler = (e: LeafletMouseEvent) => onClick(e);
    map.on("click", handler);
    return () => {
      map.off("click", handler);
    };
  }, [map, onClick]);
  return null;
}

function FlyToButton({ onLocated }: { onLocated: (pos: LatLng) => void }) {
  const map = useMap();
  const { t } = useTranslation();
  const [locating, setLocating] = useState(false);

  const handleGoToCurrent = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: LatLng = {
          lat: parseFloat(pos.coords.latitude.toFixed(6)),
          lng: parseFloat(pos.coords.longitude.toFixed(6)),
        };
        map.flyTo([coords.lat, coords.lng], 15, { duration: 1.2 });
        setLocating(false);
      },
      () => {
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const handleSelectCurrent = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: LatLng = {
          lat: parseFloat(pos.coords.latitude.toFixed(6)),
          lng: parseFloat(pos.coords.longitude.toFixed(6)),
        };
        map.flyTo([coords.lat, coords.lng], 15, { duration: 1.2 });
        onLocated(coords);
        setLocating(false);
      },
      () => {
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  return (
    <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
      <button
        type="button"
        onClick={handleGoToCurrent}
        disabled={locating}
        title={t("auth.register.providor.goToLocation")}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-md border border-border text-foreground transition hover:bg-muted disabled:opacity-50"
      >
        <Crosshair className={`h-4 w-4 ${locating ? "animate-spin" : ""}`} />
      </button>
      <button
        type="button"
        onClick={handleSelectCurrent}
        disabled={locating}
        title={t("auth.register.providor.selectCurrentLocation")}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-md text-white transition hover:bg-primary/90 disabled:opacity-50"
      >
        <Locate className={`h-4 w-4 ${locating ? "animate-spin" : ""}`} />
      </button>
    </div>
  );
}

export const PickCoordsFromMap = ({ value, setValue }: IPickCoordsFromMap) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const closeRef = useRef<HTMLButtonElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(
    parseCoordinates(value),
  );

  useEffect(() => {
    injectLeafletOverrides();
  }, []);

  useEffect(() => {
    setSelectedLocation(parseCoordinates(value));
  }, [value]);

  const handleMapClick = (e: LeafletMouseEvent) => {
    const coords: LatLng = {
      lat: parseFloat(e.latlng.lat.toFixed(6)),
      lng: parseFloat(e.latlng.lng.toFixed(6)),
    };
    setSelectedLocation(coords);
  };

  const handleLocated = (coords: LatLng) => {
    setSelectedLocation(coords);
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      setValue(
        "location",
        `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`,
      );
      closeRef.current?.click();
    }
  };

  const mapCenter: [number, number] = selectedLocation
    ? [selectedLocation.lat, selectedLocation.lng]
    : DEFAULT_CENTER;

  return (
    <Model>
      <Model.Open opens="company-location-modal">
        <button
          type="button"
          title={t("auth.register.providor.openMapLocationButton")}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-primary transition hover:bg-primary/10"
        >
          <MapPin className="h-5 w-5" />
        </button>
      </Model.Open>

      <Model.Window
        name="company-location-modal"
        model_width="md:min-w-[60vw] md:max-w-[80vw]"
      >
        <div className="space-y-4" dir={isArabic ? "rtl" : "ltr"}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">
                {t("auth.register.providor.companyLocationLabel")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("auth.register.providor.companyLocationModalDescription")}
              </p>
            </div>
          </div>

          <div className="relative h-[60vh] w-full overflow-hidden rounded-xl border border-border">
            <MapContainer
              center={mapCenter}
              zoom={selectedLocation ? 14 : 10}
              className="h-full w-full landmap-container"
              zoomControl
              dragging
              doubleClickZoom
              scrollWheelZoom
              attributionControl
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {selectedLocation && (
                <Marker
                  position={[selectedLocation.lat, selectedLocation.lng]}
                  icon={createMarkerIcon()}
                  interactive={false}
                />
              )}
              <MapEvents onClick={handleMapClick} />
              <FlyToButton onLocated={handleLocated} />
            </MapContainer>
          </div>

          {selectedLocation && (
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0 text-primary" />
              <span className="font-mono text-xs">
                {selectedLocation.lat.toFixed(6)},{" "}
                {selectedLocation.lng.toFixed(6)}
              </span>
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedLocation}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("auth.register.providor.selectLocationButton")}
            </button>
            <Model.Close>
              <button ref={closeRef} type="button" className="hidden" />
            </Model.Close>
            <Model.Close>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-red-400 hover:text-white"
              >
                {t("auth.register.cancel")}
              </button>
            </Model.Close>
          </div>
        </div>
      </Model.Window>
    </Model>
  );
};

export default PickCoordsFromMap;
