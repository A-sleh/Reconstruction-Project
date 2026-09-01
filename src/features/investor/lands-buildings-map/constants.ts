import L from "leaflet";
import { EZoningType } from "@/features/investor/lands-buildings/api/types";
import type { LandListItem, LandDetail } from "@/features/investor/lands-buildings/api/types";
import type { BuildingListItem, BuildingDetails } from "@/features/investor/buildings/api/types";
import type { MapMarker } from "./types";

/**
 * ============================================================================
 * Expected Backend JSON API responses (reference)
 * ============================================================================
 *
 * These shapes mirror the existing get-by-id endpoints that the hover feature
 * relies on. Hovering a marker fires a request to one of these endpoints (via
 * React Query) and caches the result client side.
 *
 * ----------------------------------------------------------------------------
 * 1) Land detail  ->  GET {API_URL}land/get-by-id?landId=7
 * ----------------------------------------------------------------------------
 * {
 *   "landId": 7,
 *   "name": "قطعة أرض سكنية - حي الأربعين",
 *   "isValidated": true,
 *   "zoningType": "Residential",
 *   "accessability": true,
 *   "area": 420,
 *   "address": "حي الأربعين، حلب",
 *   "longitude": 37.1245,
 *   "latitude": 36.2012,
 *   "location": { "longitude": 37.1245, "latitude": 36.2012 },
 *   "coverImageUrl": "/media/land-cover/7.jpg",
 *   "border": [
 *     { "longitude": 37.1240, "latitude": 36.2005 },
 *     { "longitude": 37.1250, "latitude": 36.2005 }
 *   ],
 *   "attachments": [],
 *   "buildings": []
 * }
 *
 * ----------------------------------------------------------------------------
 * 2) Building detail ->  GET {API_URL}building/get-by-id?buildingId=12
 * ----------------------------------------------------------------------------
 * {
 *   "landId": 7,
 *   "buildingId": 12,
 *   "name": "مبنى سكني - الطابق الثالث",
 *   "city": "حلب",
 *   "streetName": "شارع النيل",
 *   "zoneType": "Residential",
 *   "readinessLevel": "UnderConstruction",
 *   "orientation": "North",
 *   "buildingType": "Residential",
 *   "area": 780,
 *   "address": "حي الأربعين، حلب",
 *   "location": { "longitude": 37.1262, "latitude": 36.2018 },
 *   "coverImageUrl": "/media/building-cover/12.jpg",
 *   "updateAt": "2026-08-01T10:30:00Z",
 *   "buildingParts": [
 *     { "id": 1, "area": 260, "buildingPartType": "Floor" }
 *   ],
 *   "attachments": []
 * }
 *
 * The marker list endpoints (land/get-all, building/get-all) return a
 * Paginated<T> wrapper: { data: [...], pageNum, pageSize, hasNextPage,
 * totalRows, isSucceeded, message }.
 * ============================================================================
 */

export const DEFAULT_MAP_CENTER: [number, number] = [34.8021, 38.9968];
export const DEFAULT_MAP_ZOOM = 13;
export const SEARCH_ZOOM = 16;
export const MARKER_HOVER_ZOOM = 17;

/** Marker color per kind, mapped to DESIGN.md palette tokens. */
export const MARKER_COLORS = {
  land: "#059669", // emerald (lands)
  building: "#0F766E", // dark teal (buildings)
} as const;

const ZONING_LABELS: Record<EZoningType, string> = {
  [EZoningType.Residential]: "Residential",
  [EZoningType.Commercial]: "Commercial",
  [EZoningType.Agricultural]: "Agricultural",
  [EZoningType.Industrial]: "Industrial",
  [EZoningType.MixedUse]: "Mixed Use",
  [EZoningType.Hospitality]: "Hospitality",
  [EZoningType.Office]: "Office",
  [EZoningType.TechPark]: "Tech Park",
};

/**
 * Builds a labeled, kind-coloured Leaflet divIcon for a map marker.
 * The dot is colored per kind while the label chip uses the app's light theme.
 */
export function createMapMarkerIcon(kind: MapMarker["kind"], label: string) {
  const color = MARKER_COLORS[kind];
  return L.divIcon({
    className: "lbm-marker",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;transform:translateY(-100%);">
        <span style="
          background:#ffffff;border:1px solid #d4d6db;border-radius:8px;
          padding:2px 8px;color:#2b2d35;font-size:12px;font-weight:600;
          white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.15);margin-bottom:4px;
        ">${label}</span>
        <span style="
          display:block;width:14px;height:14px;border-radius:50%;
          background:${color};border:2px solid #ffffff;
          box-shadow:0 2px 6px rgba(0,0,0,0.35);
        "></span>
      </div>`,
  });
}

/** Centroid of a land's border polygon (used when no explicit location is set). */
export function getPolygonCentroid(border: LandListItem["border"]): [number, number] {
  if (!border || border.length === 0) {
    return DEFAULT_MAP_CENTER;
  }
  const lat =
    border.reduce((s, p) => s + p.latitude, 0) / border.length;
  const lng =
    border.reduce((s, p) => s + p.longitude, 0) / border.length;
  return [lat, lng];
}

/** Maps a LandListItem to a map marker. */
export function landToMarker(land: LandListItem): MapMarker {
  const position = land.location
    ? [land.location.latitude, land.location.longitude]
    : getPolygonCentroid(land.border);
  return {
    kind: "land",
    key: `land-${land.landId}`,
    label: land.name || `Land ${land.landId}`,
    position: position as [number, number],
    data: land,
  };
}

/** Maps a BuildingListItem to a map marker. */
export function buildingToMarker(building: BuildingListItem): MapMarker {
  const position = building.location
    ? [building.location.latitude, building.location.longitude]
    : DEFAULT_MAP_CENTER;
  return {
    kind: "building",
    key: `building-${building.buildingId}`,
    label: building.name || `Building ${building.buildingId}`,
    position: position as [number, number],
    data: building,
  };
}

export { ZONING_LABELS };
export type { LandListItem, LandDetail, BuildingListItem, BuildingDetails };
