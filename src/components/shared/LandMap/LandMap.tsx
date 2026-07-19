import { useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLng } from "@/lib/helpers";
import { DEFAULT_CENTER, injectLeafletOverrides } from "./LandMapStyles";
import LandMapEditor from "./LandMapEditor";
import LandMapViewer from "./LandMapViewer";
import LandMapSelector from "./LandMapSelector";
import type { LandMapProps } from "./types";

export default function LandMap({
  mode,
  center,
  zoom = 12,
  height = "400px",
  value = [],
  onChange,
  maxPoints,
  polygon,
  fillColor,
  borderColor,
  options = [],
  selectedId,
  onSelect,
  disabled = false,
  className = "",
}: LandMapProps) {
  useEffect(() => {
    injectLeafletOverrides();
  }, []);

  const mapCenter: [number, number] = center
    ? [center.lat, center.lng]
    : DEFAULT_CENTER;

  const polygonToShow =
    mode === "show"
      ? polygon ?? []
      : mode === "edit"
        ? value
        : [];

  const noCursorClass = disabled || mode === "show" ? "landmap-no-editor-cursor" : "";

  return (
    <div
      className={`relative w-full overflow-hidden rounded-md border border-border ${className}`}
      style={{ height }}
    >
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        className="w-full h-full landmap-container"
        zoomControl={!disabled}
        dragging={!disabled}
        doubleClickZoom={!disabled}
        scrollWheelZoom={!disabled}
        attributionControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <div className={noCursorClass}>
          {mode === "edit" && onChange && (
            <LandMapEditor
              value={value}
              onChange={onChange}
              maxPoints={maxPoints}
              fillColor={fillColor}
              borderColor={borderColor}
            />
          )}

          {mode === "show" && (
            <LandMapViewer
              polygon={polygonToShow}
              fillColor={fillColor}
              borderColor={borderColor}
            />
          )}

          {mode === "select" && onSelect && (
            <LandMapSelector
              options={options}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          )}
        </div>
      </MapContainer>
    </div>
  );
}
