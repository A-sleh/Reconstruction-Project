import { useState } from "react";
import { Marker, Popup, Tooltip as LeafletTooltip } from "react-leaflet";
import { MapPin, Loader2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import ApiInstance from "@/config/api-instance";
import { paths } from "@/config/paths";
import { createMapMarkerIcon, type LandDetail, type BuildingDetails } from "../constants";
import type { MapCache } from "../hooks/useMapCache";
import type { MapMarker } from "../types";

/**
 * Fetches the detail payload for a marker from the matching get-by-id
 * endpoint. This is the "hover fetch" — fired on the first hover over a marker
 * and cached client-side so repeated hovers don't repeat the request.
 */
async function fetchMarkerDetail(marker: MapMarker) {
  if (marker.kind === "land") {
    const { data } = await ApiInstance.get<LandDetail>("/land/get-by-id", {
      params: { landId: marker.data.landId },
    });
    return data;
  }
  const { data } = await ApiInstance.get<BuildingDetails>("/building/get-by-id", {
    params: { buildingId: marker.data.buildingId },
  });
  return data;
}

/**
 * The hover tooltip body: shows a subtle spinner while the server responds,
 * then the loaded details. Handles failed requests gracefully.
 */
function TooltipBody({
  marker,
  detail,
  loading,
}: {
  marker: MapMarker;
  detail: LandDetail | BuildingDetails | undefined;
  loading: boolean;
}) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
        {t("map.loading")}
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex items-center gap-2 text-xs text-destructive">
        <AlertCircle className="h-3.5 w-3.5" />
        {t("map.loadingError")}
      </div>
    );
  }

  const area = detail.area ?? marker.data.area;
  const isValidated =
    marker.kind === "land"
      ? (detail as LandDetail).isValidated
      : undefined;

  return (
    <div className="space-y-1.5 text-xs min-w-[180px]">
      <p className="font-semibold text-foreground">{marker.label}</p>
      <div className="flex items-center gap-1 text-muted-foreground">
        <MapPin className="h-3 w-3 shrink-0" />
        <span className="truncate">
          {"address" in detail ? detail.address : marker.data.address}
        </span>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
        <span>
          {t("map.area")}:{" "}
          <b className="text-foreground tabular-nums">
            {area.toLocaleString()} {t("map.squareMeters")}
          </b>
        </span>
        {isValidated !== undefined && (
          <span>
            {t("map.status")}:{" "}
            <b className={isValidated ? "text-emerald" : "text-warning"}>
              {isValidated ? t("map.validated") : t("map.notValidated")}
            </b>
          </span>
        )}
      </div>
      {marker.kind === "land" && (
        <span className="text-muted-foreground">{t("map.clickForMore")}</span>
      )}
    </div>
  );
}

/**
 * The click popup body — a richer summary plus a link to the full details page.
 */
function PopupBody({ marker }: { marker: MapMarker }) {
  const { t } = useTranslation();
  const detailHref =
    marker.kind === "land"
      ? paths.app.investor.landBuildingDetails.getHref(
          String(marker.data.landId),
        )
      : null;

  return (
    <div className="space-y-1.5 text-xs min-w-[200px]">
      <p className="text-sm font-bold text-foreground">{marker.label}</p>
      <p className="text-muted-foreground flex items-center gap-1">
        <MapPin className="h-3 w-3 shrink-0" />
        {marker.data.address || "—"}
      </p>
      <p className="font-medium text-foreground">
        {t("map.area")}:{" "}
        <b className="tabular-nums">
          {marker.data.area.toLocaleString()} {t("map.squareMeters")}
        </b>
      </p>
      {detailHref && (
        <Link
          to={detailHref}
          className="mt-1 inline-block text-primary font-semibold hover:underline"
        >
          {t("map.clickForMore")}
        </Link>
      )}
    </div>
  );
}

type Props = {
  markers: MapMarker[];
  cache: MapCache<LandDetail | BuildingDetails>;
  onSelect: (marker: MapMarker) => void;
};

/**
 * Renders every land/building marker with its custom icon, hover tooltip and
 * click popup. Hovered markers lazy-fetch details via the client cache.
 */
export default function MapMarkerLayer({ markers, cache, onSelect }: Props) {
  // Detail currently shown in the hover tooltip.
  const [hover, setHover] = useState<{
    key: string;
    detail?: LandDetail | BuildingDetails;
    loading: boolean;
  } | null>(null);

  const handleMouseOver = (marker: MapMarker) => {
    onSelect(marker);

    const cached = cache.get(marker.key);
    if (cached && cached.status === "resolved") {
      setHover({ key: marker.key, detail: cached.value, loading: false });
      return;
    }

    setHover({ key: marker.key, loading: true, detail: undefined });
    cache.begin(marker.key);
    fetchMarkerDetail(marker)
      .then((value) => {
        cache.resolve(marker.key, value);
        setHover((prev) =>
          prev?.key === marker.key
            ? { key: marker.key, detail: value, loading: false }
            : prev,
        );
      })
      .catch(() => {
        cache.fail(marker.key);
        setHover((prev) =>
          prev?.key === marker.key
            ? { key: marker.key, loading: false, detail: undefined }
            : prev,
        );
      });
  };

  return (
    <>
      {markers.map((marker) => (
        <Marker
          key={marker.key}
          position={marker.position}
          icon={createMapMarkerIcon(marker.kind, marker.label)}
          eventHandlers={{
            mouseover: () => handleMouseOver(marker),
            mouseout: () => setHover(null),
            click: () => onSelect(marker),
          }}
        >
          {hover?.key === marker.key && (
            <LeafletTooltip direction="top" offset={[0, -18]} opacity={1} permanent={false}>
              <TooltipBody
                marker={marker}
                detail={hover.detail}
                loading={hover.loading}
              />
            </LeafletTooltip>
          )}
          <Popup>
            <PopupBody marker={marker} />
          </Popup>
        </Marker>
      ))}
    </>
  );
}
