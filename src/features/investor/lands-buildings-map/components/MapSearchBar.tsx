import { useMemo, useState } from "react";
import { Search, Building2, MapPinned } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import type { MapMarker, MapSearchResult } from "../types";

type Props = {
  markers: MapMarker[];
  onSelect: (result: MapSearchResult) => void;
  className?: string;
};

/**
 * A debounced search bar over the loaded land/building markers.
 * Selecting a result calls back so the parent can flyTo the point.
 *
 * Search matches property name, plot/land id, or building id.
 */
export default function MapSearchBar({ markers, onSelect, className }: Props) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const debounced = useDebounce(query, 300);

  const results = useMemo<MapSearchResult[]>(() => {
    const term = debounced.trim().toLowerCase();
    if (!term) return [];

    return markers
      .filter((m) => {
        const haystack = m.label.toLowerCase();
        const id =
          m.kind === "land"
            ? String(m.data.landId)
            : String(m.data.buildingId);
        return haystack.includes(term) || id.includes(term);
      })
      .slice(0, 20)
      .map((m) =>
        m.kind === "land"
          ? {
              key: m.key,
              kind: "land" as const,
              label: m.label,
              id: m.data.landId,
              position: m.position,
            }
          : {
              key: m.key,
              kind: "building" as const,
              label: m.label,
              id: m.data.buildingId,
              position: m.position,
            },
      );
  }, [debounced, markers]);

  const handlePick = (result: MapSearchResult) => {
    onSelect(result);
    setOpen(false);
  };

  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={t("map.searchPlaceholder")}
        className="h-10 ps-9 pe-3 rounded-md"
        aria-label={t("map.searchPlaceholder")}
      />

      {open && debounced.trim() && (
        <div className="absolute z-[1000] mt-1 w-full overflow-hidden rounded-md border border-border bg-white shadow-lg">
          {results.length === 0 ? (
            <p className="px-3 py-2.5 text-xs text-muted-foreground">
              {t("map.searchNoResults")}
            </p>
          ) : (
            results.map((r) => (
              <button
                key={r.key}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handlePick(r);
                }}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
              >
                {r.kind === "land" ? (
                  <MapPinned className="h-4 w-4 text-emerald" />
                ) : (
                  <Building2 className="h-4 w-4 text-primary" />
                )}
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">
                    {r.label}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {t(r.kind === "land" ? "map.land" : "map.building")} · #
                    {r.id}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
