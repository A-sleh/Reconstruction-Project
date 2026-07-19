import L from "leaflet";

const BRAND_LIME = "#D7FF3D";
const CANVAS_BORDER = "#2A2A2E";
const CANVAS_ELEVATED = "#131316";
const INK_PRIMARY = "#F5F5F7";
const INK_SECONDARY = "#A1A1AA";

export const DEFAULT_CENTER: L.LatLngExpression = [34.8021, 38.9968];

export const polygonStyle = (
  fillColor: string = BRAND_LIME,
  color: string = BRAND_LIME,
): L.PathOptions => ({
  color,
  weight: 2,
  opacity: 0.9,
  fillColor,
  fillOpacity: 0.18,
  dashArray: undefined,
});

export const selectedPolygonStyle = (
  fillColor: string = BRAND_LIME,
  color: string = BRAND_LIME,
): L.PathOptions => ({
  color,
  weight: 3,
  opacity: 1,
  fillColor,
  fillOpacity: 0.3,
});

export const createVertexIcon = () =>
  L.divIcon({
    className: "landmap-vertex",
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    html: `<div style="
      width:14px;height:14px;border-radius:50%;
      background:#ffffff;border:2px solid #1a1a1a;
      box-shadow:0 0 0 2px rgba(26,26,26,0.15), 0 2px 6px rgba(0,0,0,0.3);
      cursor:grab;
    "/>`,
  });

export const createMarkerIcon = (label?: string) =>
  L.divIcon({
    className: "landmap-marker",
    iconSize: label ? [0, 0] : [12, 12],
    iconAnchor: label ? undefined : [6, 6],
    html: label
      ? `<div style="
          background:${CANVAS_ELEVATED};border:1px solid ${CANVAS_BORDER};
          border-radius:8px;padding:4px 10px;
          color:${INK_PRIMARY};font-size:12px;font-weight:500;
          white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,0.4);
          transform:translateY(-100%);margin-top:-8px;
        ">${label}</div>`
      : `<div style="
          width:12px;height:12px;border-radius:50%;
          background:${INK_PRIMARY};border:2px solid ${CANVAS_ELEVATED};
          box-shadow:0 2px 6px rgba(0,0,0,0.4);
        "/>`,
  });

export const injectLeafletOverrides = () => {
  const id = "landmap-style-overrides";
  if (document.getElementById(id)) return;

  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    .landmap-vertex, .landmap-marker { background: none !important; border: none !important; }

    .landmap-container .leaflet-control-zoom a {
      background: ${CANVAS_ELEVATED} !important;
      color: ${INK_PRIMARY} !important;
      border-color: ${CANVAS_BORDER} !important;
      width: 32px !important;
      height: 32px !important;
      line-height: 32px !important;
      font-size: 16px !important;
    }
    .landmap-container .leaflet-control-zoom a:hover {
      background: #1C1C20 !important;
    }
    .landmap-container .leaflet-control-zoom {
      border: 1px solid ${CANVAS_BORDER} !important;
      border-radius: 10px !important;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    }

    .landmap-container .leaflet-control-attribution {
      background: ${CANVAS_ELEVATED}cc !important;
      color: ${INK_SECONDARY} !important;
      font-size: 10px !important;
      border-radius: 6px 0 0 0 !important;
    }
    .landmap-container .leaflet-control-attribution a {
      color: ${INK_SECONDARY} !important;
    }

    .landmap-container .leaflet-interactive {
      cursor: inherit !important;
    }
    .landmap-container .landmap-selectable {
      cursor: pointer !important;
    }
    .landmap-container .landmap-selectable:hover {
      filter: brightness(1.2);
    }

    .landmap-container .leaflet-pane {
      cursor: crosshair;
    }
    .landmap-container .landmap-no-editor-cursor .leaflet-pane {
      cursor: default;
    }

    .landmap-container .leaflet-control-contextmenu {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
};
