import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslation } from "react-i18next";
import { AlertCircle, Loader2 } from "lucide-react";
import { injectLeafletOverrides } from "@/components/shared/LandMap/LandMapStyles";
import { useLandsInfinite } from "@/features/investor/lands-buildings/api/query";
import { useBuildingsInfinite } from "@/features/investor/buildings/api/query";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  SEARCH_ZOOM,
  landToMarker,
  buildingToMarker,
  type LandDetail,
  type BuildingDetails,
} from "../constants";
import { useMapCache } from "../hooks/useMapCache";
import MapMarkerLayer from "./MapMarkerLayer";
import MapSearchBar from "./MapSearchBar";
import type { MapMarker, MapSearchResult } from "../types";

/** Fits the map bounds to all markers once they are first loaded. */
function FitAllMarkers({ markers }: { markers: MapMarker[] }) {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (markers.length === 0 || fitted.current) return;
    fitted.current = true;
    const bounds = markers.map((m) => m.position);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
  }, [markers, map]);

  return null;
}

/** Smoothly flies the camera to the selected search result. */
function FlyToResult({ result }: { result: MapSearchResult | null }) {
  const map = useMap();
  useEffect(() => {
    if (!result) return;
    map.flyTo(result.position, SEARCH_ZOOM, { duration: 1 });
  }, [result, map]);
  return null;
}

function LandsBuildingsMapView() {
  const { t } = useTranslation();
  const [target, setTarget] = useState<MapSearchResult | null>(null);
  const cache = useMapCache<LandDetail | BuildingDetails>();

  // Load a single page of lands and buildings to populate the markers.
  const {
    data: landsData,
    isLoading: landsLoading,
    isError: landsError,
  } = useLandsInfinite({ PageSize: 100 });

  const {
    data: buildingsData,
    isLoading: buildingsLoading,
    isError: buildingsError,
  } = useBuildingsInfinite({ PageSize: 100 });

  useEffect(() => {
    injectLeafletOverrides();
  }, []);

  const markers = useMemo<MapMarker[]>(() => {
    const lands = (landsData?.pages.flatMap((p) => p.data) ?? []).map(
      landToMarker,
    );
    const buildings = (buildingsData?.pages.flatMap((p) => p.data) ?? []).map(
      buildingToMarker,
    );
    return [...lands, ...buildings];
  }, [landsData, buildingsData]);

  const isLoading = landsLoading || buildingsLoading;
  const isError = landsError || buildingsError;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {t("map.title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("map.subtitle")}</p>
        </div>
      </div>

      <div className="relative z-10">
        <MapSearchBar markers={markers} onSelect={setTarget} />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full border-2 border-white bg-emerald shadow" />
          {t("map.land")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full border-2 border-white bg-primary shadow" />
          {t("map.building")}
        </span>
      </div>

      <div className="relative h-[520px] w-full overflow-hidden rounded-lg border border-border shadow-card">
        {isLoading && (
          <div className="absolute left-1/2 top-1/2 z-[1000] -translate-x-1/2 -translate-y-1/2">
            <span className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm text-muted-foreground shadow-lg">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              {t("map.loading")}
            </span>
          </div>
        )}

        {isError && (
          <div className="absolute left-1/2 top-1/2 z-[1000] flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-md border border-destructive/30 bg-white px-3 py-2 text-sm text-destructive shadow-lg">
            <AlertCircle className="h-4 w-4" />
            {t("map.loadingError")}
          </div>
        )}

        <MapContainer
          center={DEFAULT_MAP_CENTER}
          zoom={DEFAULT_MAP_ZOOM}
          className="h-full w-full landmap-container"
          scrollWheelZoom
          attributionControl
        >
          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, USGS, FAO, NPS, NRCAN, and contributors'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
          />

          <FitAllMarkers markers={markers} />
          <FlyToResult result={target} />

          <MapMarkerLayer
            markers={markers}
            cache={cache}
            onSelect={(marker) =>
              setTarget({
                key: marker.key,
                kind: marker.kind,
                label: marker.label,
                id:
                  marker.kind === "land"
                    ? marker.data.landId
                    : marker.data.buildingId,
                position: marker.position,
              })
            }
          />
        </MapContainer>
      </div>
    </div>
  );
}

export default LandsBuildingsMapView;
