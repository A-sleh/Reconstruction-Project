import { useCallback, useMemo, useRef, useState } from "react";
import { useMapEvents, useMap } from "react-leaflet";
import { useTranslation } from "react-i18next";
import L from "leaflet";
import { Polygon, Polyline, CircleMarker } from "react-leaflet";
import type { LatLng } from "@/lib/helpers";
import { polygonStyle, createVertexIcon } from "./LandMapStyles";

type Props = {
  value: LatLng[];
  onChange: (points: LatLng[]) => void;
  maxPoints?: number;
  fillColor?: string;
  borderColor?: string;
};

const CLOSE_THRESHOLD = 15;

function EditorEvents({
  points,
  onChange,
  maxPoints,
  closing,
  setClosing,
  mousePos,
  setMousePos,
}: {
  points: LatLng[];
  onChange: (p: LatLng[]) => void;
  maxPoints?: number;
  closing: boolean;
  setClosing: (v: boolean) => void;
  mousePos: LatLng | null;
  setMousePos: (p: LatLng | null) => void;
}) {
  const map = useMapEvents({
    click(e) {
      if (closing) return;
      if (maxPoints && points.length >= maxPoints) return;

      const newPoint: LatLng = {
        lat: Math.round(e.latlng.lat * 1e7) / 1e7,
        lng: Math.round(e.latlng.lng * 1e7) / 1e7,
      };

      if (points.length >= 3) {
        const first = map.latLngToContainerPoint(
          L.latLng(points[0].lat, points[0].lng),
        );
        const clicked = map.latLngToContainerPoint(e.latlng);
        if (first.distanceTo(clicked) < CLOSE_THRESHOLD) {
          setClosing(true);
          setMousePos(null);
          onChange(points);
          return;
        }
      }

      onChange([...points, newPoint]);
    },
    mousemove(e) {
      if (closing || points.length === 0) {
        setMousePos(null);
        return;
      }
      setMousePos({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
    mouseout() {
      setMousePos(null);
    },
  });

  return null;
}

export default function LandMapEditor({
  value,
  onChange,
  maxPoints,
  fillColor,
  borderColor,
}: Props) {
  const [closing, setClosing] = useState(false);
  const [mousePos, setMousePos] = useState<LatLng | null>(null);
  const { t } = useTranslation();

  const handleVertexDrag = useCallback(
    (index: number, latLng: LatLng) => {
      const next = [...value];
      next[index] = latLng;
      onChange(next);
    },
    [value, onChange],
  );

  const handleVertexRemove = useCallback(
    (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    },
    [value, onChange],
  );

  const isClosed = value.length >= 3 && closing;
  const isOpen = value.length > 0 && !closing;

  const rubberBand =
    isOpen && mousePos && value.length > 0
      ? [value[value.length - 1], mousePos]
      : null;

  const showCloseHint = value.length >= 3 && !closing;

  const markerIcons = useMemo(
    () => value.map(() => createVertexIcon()),
    [value.length],
  );

  return (
    <>
      <EditorEvents
        points={value}
        onChange={onChange}
        maxPoints={maxPoints}
        closing={closing}
        setClosing={setClosing}
        mousePos={mousePos}
        setMousePos={setMousePos}
      />

      {isClosed && (
        <Polygon
          positions={value.map((p) => [p.lat, p.lng])}
          pathOptions={polygonStyle(fillColor, borderColor)}
        />
      )}

      {isOpen && value.length >= 2 && (
        <Polyline
          positions={value.map((p) => [p.lat, p.lng])}
          pathOptions={{
            color: "#1a1a1a",
            weight: 2,
            opacity: 0.8,
            dashArray: "6 4",
          }}
        />
      )}

      {rubberBand && (
        <Polyline
          positions={rubberBand.map((p) => [p.lat, p.lng])}
          pathOptions={{
            color: "#1a1a1a",
            weight: 2,
            opacity: 0.5,
            dashArray: "4 4",
          }}
        />
      )}

      {value.map((point, i) => (
        <CircleMarker
          key={i}
          center={[point.lat, point.lng]}
          radius={6}
          pathOptions={{
            color: "#1a1a1a",
            weight: 2,
            fillColor: i === 0 && showCloseHint ? "#D7FF3D" : "#ffffff",
            fillOpacity: 1,
          }}
          icon={markerIcons[i]}
          draggable
          eventHandlers={{
            dragend(e) {
              const pos = e.target.getLatLng();
              handleVertexDrag(i, {
                lat: Math.round(pos.lat * 1e7) / 1e7,
                lng: Math.round(pos.lng * 1e7) / 1e7,
              });
            },
            contextmenu(e) {
              L.DomEvent.stopPropagation(e.originalEvent);
              handleVertexRemove(i);
            },
          }}
        />
      ))}

      {value.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1000]">
          <div className="bg-canvas-elevated/90 border border-border rounded-md px-4 py-2 text-sm text-muted-foreground shadow-raised">
            {t("landmap.emptyHint")}
          </div>
        </div>
      )}

      {showCloseHint && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-[1000]">
          <div className="bg-canvas-elevated/90 border border-border rounded-md px-4 py-2 text-xs text-muted-foreground shadow-raised whitespace-nowrap">
            {t("landmap.closeHintPrefix")}{" "}
            <span className="text-emerald font-medium">{t("landmap.closeHintGreen")}</span>{" "}
            {t("landmap.closeHintSuffix")}
          </div>
        </div>
      )}
    </>
  );
}
