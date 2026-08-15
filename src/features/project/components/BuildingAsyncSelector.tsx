import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/Label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useBuildingsInfinite } from "@/features/investor/buildings/api/query";
import type { BuildingListItem } from "@/features/investor/buildings/api/types";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface BuildingAsyncSelectorProps {
  value?: BuildingListItem | null;
  onSelect: (building: BuildingListItem | null) => void;
  label?: string;
  placeholder?: string;
}

export function BuildingAsyncSelector({
  value,
  onSelect,
  label,
  placeholder,
}: BuildingAsyncSelectorProps) {
  const { t } = useTranslation();
  const placeholderText =
    placeholder || t("project.newProject.buildingId.placeholder");

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const observerRef = useRef<IntersectionObserver | null>(null);

  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useBuildingsInfinite({
      Search: debouncedSearch || undefined,
      PageSize: 20,
    });

  const buildings = data?.pages.flatMap((page) => page.data) ?? [];

  useEffect(() => {
    if (open) setSearch("");
  }, [open]);

  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetching || isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetching, isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  return (
    <div>
      {label && <Label>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white border-gray-300 mt-1"
          >
            {value ? (
              <span className="truncate">{value.name}</span>
            ) : (
              <span className="text-muted-foreground">{placeholderText}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-96 p-0 bg-white border-gray-300 overflow-hidden z-100"
          align="start"
        >
          <div className="flex items-center px-3 border-b border-gray-300 relative shrink-0">
            <Search className="h-4 w-4 shrink-0 opacity-50 ml-2" />
            <input
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
              placeholder={t("project.newProject.buildingId.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {isFetching && !isFetchingNextPage && (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            )}
          </div>

          <div className="max-h-80 overflow-y-auto p-1 custom-scrollbar">
            {buildings.length === 0 && !isFetching && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {t("project.newProject.buildingId.noResults")}
              </div>
            )}

            {buildings.map((building, index) => {
              const isLastElement = index === buildings.length - 1;
              const isSelected = value?.buildingId === building.buildingId;

              return (
                <div
                  key={building.buildingId}
                  ref={isLastElement ? lastItemRef : null}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground transition-colors",
                    isSelected && "bg-accent/60 font-medium",
                  )}
                  onClick={() => {
                    onSelect(building);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4 text-primary shrink-0",
                      isSelected ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div className="flex flex-col w-full">
                    <span className="truncate">{building.name}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {building.city}
                      {building.streetName ? ` - ${building.streetName}` : ""}
                    </span>
                  </div>
                </div>
              );
            })}

            {isFetchingNextPage && (
              <div className="flex items-center justify-center py-2 text-xs text-muted-foreground gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                {t("project.newProject.buildingId.loadingMore")}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
