import type { LandListItem } from "@/features/investor/lands-buildings/api/types";
import type { BuildingListItem } from "@/features/investor/buildings/api/types";

/**
 * Discriminated union describing a single marker on the interactive map.
 *
 * A marker is either a land plot or a building. Both carry a stable `key`
 * (used by Leaflet + for client-side caching), a display `label`, a `position`
 * and the source list item used to render its tooltip/popup details.
 */
export type MapMarker =
  | {
      kind: "land";
      key: string;
      label: string;
      position: [number, number];
      data: LandListItem;
    }
  | {
      kind: "building";
      key: string;
      label: string;
      position: [number, number];
      data: BuildingListItem;
    };

/**
 * Unified result item produced by the search bar. Selecting one flies the map
 * camera to its position with an appropriate zoom.
 */
export type MapSearchResult = {
  key: string;
  kind: "land" | "building";
  label: string;
  id: string | number;
  position: [number, number];
};
