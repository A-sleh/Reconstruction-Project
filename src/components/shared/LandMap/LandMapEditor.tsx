import { useCallback, useMemo, useRef, useState } from "react";
import { useMapEvents, useMap } from "react-leaflet";
import { useTranslation } from "react-i18next";
import L from "leaflet";
import { Polygon, Polyline, CircleMarker } from "react-leaflet";
import type { LatLng } from "@/lib/helpers";
import { isPointInPolygon } from "@/lib/helpers";
import { polygonStyle, createVertexIcon } from "./LandMapStyles";
import LandMapToolbar, { type EditorTool } from "./LandMapToolbar";

type Props = {
  value: LatLng[];
  onChange: (points: LatLng[]) => void;
  maxPoints?: number;
  fillColor?: string;
  borderColor?: string;
  constraintPolygon?: LatLng[];
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
  activeTool,
  constraintPolygon,
}: {
  points: LatLng[];
  onChange: (p: LatLng[]) => void;
  maxPoints?: number;
  closing: boolean;
  setClosing: (v: boolean) => void;
  mousePos: LatLng | null;
  setMousePos: (p: LatLng | null) => void;
  activeTool: EditorTool;
  constraintPolygon?: LatLng[];
}) {
  const map = useMapEvents({
    click(e) {
      if (activeTool === "add") {
        if (closing) return;
        if (maxPoints && points.length >= maxPoints) return;

        if (constraintPolygon && constraintPolygon.length >= 3) {
          if (!isPointInPolygon({ lat: e.latlng.lat, lng: e.latlng.lng }, constraintPolygon)) {
            return;
          }
        }

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
      }
    },
    mousemove(e) {
      if (activeTool !== "add" || closing || points.length === 0) {
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

function MoveAllHandler({
  points,
  onChange,
  enabled,
}: {
  points: LatLng[];
  onChange: (p: LatLng[]) => void;
  enabled: boolean;
}) {
  const map = useMap();
  const dragRef = useRef<{
    startLat: number;
    startLng: number;
    originalPoints: LatLng[];
  } | null>(null);

  useMapEvents({
    mousedown(e) {
      if (!enabled || points.length === 0) return;
      map.dragging.disable();
      dragRef.current = {
        startLat: e.latlng.lat,
        startLng: e.latlng.lng,
        originalPoints: [...points],
      };
    },
    mousemove(e) {
      if (!dragRef.current || !enabled) return;
      const dLat = e.latlng.lat - dragRef.current.startLat;
      const dLng = e.latlng.lng - dragRef.current.startLng;
      onChange(
        dragRef.current.originalPoints.map((p) => ({
          lat: Math.round((p.lat + dLat) * 1e7) / 1e7,
          lng: Math.round((p.lng + dLng) * 1e7) / 1e7,
        })),
      );
    },
    mouseup() {
      if (!dragRef.current) return;
      dragRef.current = null;
      map.dragging.enable();
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
  constraintPolygon,
}: Props) {
  const [closing, setClosing] = useState(false);
  const [mousePos, setMousePos] = useState<LatLng | null>(null);
  const [activeTool, setActiveTool] = useState<EditorTool>("add");
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
      const next = value.filter((_, i) => i !== index);
      onChange(next);
      if (next.length < 3) setClosing(false);
    },
    [value, onChange],
  );

  const handleClearAll = useCallback(() => {
    onChange([]);
    setClosing(false);
    setMousePos(null);
    setActiveTool("add");
  }, [onChange]);

  const isClosed = value.length >= 3 && closing;
  const isOpen = value.length > 0 && !closing;

  const rubberBand =
    isOpen && mousePos && value.length > 0 && activeTool === "add"
      ? [value[value.length - 1], mousePos]
      : null;

  const showCloseHint = value.length >= 3 && !closing && activeTool === "add";

  const markerIcons = useMemo(
    () => value.map(() => createVertexIcon()),
    [value.length],
  );

  const vertexCursor =
    activeTool === "remove-vertex"
      ? "pointer"
      : activeTool === "move-single"
        ? "grab"
        : "crosshair";

  return (
    <>
      <LandMapToolbar
        activeTool={activeTool}
        onToolChange={(tool) => {
          setActiveTool(tool);
          if (tool !== "add") {
            setMousePos(null);
          }
        }}
        onClearAll={handleClearAll}
      />

      <EditorEvents
        points={value}
        onChange={onChange}
        maxPoints={maxPoints}
        closing={closing}
        setClosing={setClosing}
        mousePos={mousePos}
        setMousePos={setMousePos}
        activeTool={activeTool}
        constraintPolygon={constraintPolygon}
      />

      {activeTool === "move-all" && (
        <MoveAllHandler
          points={isClosed ? value : value}
          onChange={onChange}
          enabled={true}
        />
      )}

      {isClosed && (
        <Polygon
          positions={value.map((p) => [p.lat, p.lng])}
          pathOptions={{
            ...polygonStyle(fillColor, borderColor),
            cursor: activeTool === "move-all" ? "move" : "inherit",
          }}
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
          radius={activeTool === "remove-vertex" ? 8 : 6}
          pathOptions={{
            color: activeTool === "remove-vertex" ? "#EF4444" : "#1a1a1a",
            weight: 2,
            fillColor:
              activeTool === "remove-vertex"
                ? "#FEE2E2"
                : i === 0 && showCloseHint
                  ? "#D7FF3D"
                  : "#ffffff",
            fillOpacity: 1,
            cursor: vertexCursor,
          }}
          icon={markerIcons[i]}
          draggable={activeTool === "move-single" || activeTool === "add"}
          eventHandlers={{
            dragend(e) {
              const pos = e.target.getLatLng();
              handleVertexDrag(i, {
                lat: Math.round(pos.lat * 1e7) / 1e7,
                lng: Math.round(pos.lng * 1e7) / 1e7,
              });
            },
            click(e) {
              if (activeTool === "remove-vertex") {
                L.DomEvent.stopPropagation(e.originalEvent);
                handleVertexRemove(i);
              }
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
          <div className="bg-[#131316]/90 border border-[#2A2A2E] rounded-lg px-5 py-3 text-sm text-[#A1A1AA] shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
            {t("landmap.emptyHint")}
          </div>
        </div>
      )}

      {showCloseHint && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-[1000]">
          <div className="bg-[#131316]/90 border border-[#2A2A2E] rounded-lg px-4 py-2 text-xs text-[#A1A1AA] shadow-[0_4px_12px_rgba(0,0,0,0.4)] whitespace-nowrap">
            {t("landmap.closeHintPrefix")}{" "}
            <span className="text-[#D7FF3D] font-medium">
              {t("landmap.closeHintGreen")}
            </span>{" "}
            {t("landmap.closeHintSuffix")}
          </div>
        </div>
      )}

      {activeTool && activeTool !== "add" && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-[1000]">
          <div className="bg-[#131316]/90 border border-[#2A2A2E] rounded-lg px-4 py-2 text-xs text-[#A1A1AA] shadow-[0_4px_12px_rgba(0,0,0,0.4)] whitespace-nowrap">
            {t(`landmap.modeHint.${activeTool}`)}
          </div>
        </div>
      )}
    </>
  );
}
